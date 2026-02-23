import { constants } from "@/lib/constants";
import { BooksAttributes, QueryOptions, Tables } from "@/models";
import { execute, query, queryOne, withTransaction } from "@/lib/db/utils";
import { AttributesRepository } from "./attributes";

const {
  validation: { uuid },
} = constants;

type Books = Tables<"books">;
type BooksContentsCount = Books & { contents: number };
type BookWithAttributes = Books & { attributes?: BooksAttributes[] };

interface Book {
  db: any;
  getBooks(queryOptions?: QueryOptions): Promise<BooksContentsCount[]>;
  getBook(id: string): Promise<BooksContentsCount | undefined>;
  upsertBook(book: BookWithAttributes): Promise<BookWithAttributes>;
  deleteBook(id: string): Promise<void>;
}

const SORTABLE_COLUMNS = new Set(["title", "created_at", "updated_at"]);

export class BookRepository implements Book {
  db: any;
  private attributesRepo: AttributesRepository;

  constructor(_db: any) {
    this.db = _db;
    this.attributesRepo = new AttributesRepository(_db);
  }

  async getBooks(queryOptions?: Partial<QueryOptions>) {
    const { filter } = queryOptions ?? {};
    let filteredBookIds: string[] = [];
    const isNoAttribute = filter?.includes("none");
    const hasUuidFilters = Boolean(filter?.some((id) => uuid.pattern.test(id)));
    const isFilterActive = (filter && filter.length > 0) || isNoAttribute;

    if (isNoAttribute) {
      // Product decision: when "none" is present, ignore UUID filters and keep
      // "books without attributes" semantics deterministic.
      if (hasUuidFilters) {
        console.debug("[books.getBooks] mixed filter received; preferring 'none' semantics");
      }
      const rows = await query<{ uuid: string; attr_count: number }>(
        `select b.uuid, count(ba.id) as attr_count
         from books b
         left join books_attributes ba on ba.book_id = b.uuid
         group by b.uuid`
      );
      filteredBookIds = rows.filter((d) => Number(d.attr_count) === 0).map((d) => d.uuid);
    } else if (filter && filter.length > 0) {
      const filtered = filter.filter((id: string) => uuid.pattern.test(id));
      if (filtered.length > 0) {
        const rows = await query<{ book_id: string }>(
          `select distinct book_id from books_attributes where attribute_id in (${filtered
            .map(() => "?")
            .join(",")})`,
          filtered
        );
        filteredBookIds = rows.map((d) => d.book_id);
      }
    }

    if (isFilterActive && filteredBookIds.length === 0) return [];

    const args: unknown[] = [];
    const where: string[] = ["b.deleted_at is null"];

    if (queryOptions?.search) {
      where.push("lower(b.title) like lower(?)");
      args.push(`%${queryOptions.search}%`);
    }

    if (isFilterActive) {
      where.push(`b.uuid in (${filteredBookIds.map(() => "?").join(",")})`);
      args.push(...filteredBookIds);
    }

    const sortBy = SORTABLE_COLUMNS.has(queryOptions?.sortBy || "")
      ? queryOptions?.sortBy
      : "title";
    const orderBy = queryOptions?.orderBy === "desc" ? "desc" : "asc";

    const rows = await query<any>(
      `select b.id, b.uuid, b.title, b.firestore_id, b.created_at, b.updated_at, b.deleted_at,
              count(c.id) as contents
       from books b
       left join contents c on c.book_id = b.uuid and c.deleted_at is null
       where ${where.join(" and ")}
       group by b.id, b.uuid, b.title, b.firestore_id, b.created_at, b.updated_at, b.deleted_at
       order by b.${sortBy} ${orderBy}`,
      args
    );

    return rows.map((book) => ({ ...book, contents: Number(book.contents || 0) }));
  }

  async getBook(id: string) {
    if (!uuid.pattern.test(id)) return undefined;

    const row = await queryOne<any>(
      `select b.id, b.uuid, b.title, b.firestore_id, b.created_at, b.updated_at, b.deleted_at,
              count(c.id) as contents
       from books b
       left join contents c on c.book_id = b.uuid and c.deleted_at is null
       where b.uuid = ? and b.deleted_at is null
       group by b.id, b.uuid, b.title, b.firestore_id, b.created_at, b.updated_at, b.deleted_at`,
      [id]
    );

    if (!row) return undefined;
    return { ...row, contents: Number(row.contents || 0) };
  }

  async upsertBook(book: Books): Promise<Books> {
    const now = new Date().toISOString();
    const bookUuid = book.uuid || crypto.randomUUID();

    await execute(
      `insert into books (uuid, title, firestore_id, created_at, updated_at)
       values (?, ?, ?, ?, ?)
       on conflict(uuid) do update set
         title = excluded.title,
         firestore_id = excluded.firestore_id,
         updated_at = excluded.updated_at`,
      [bookUuid, book.title, book.firestore_id ?? null, now, now]
    );

    const savedBook = await queryOne<Books>(
      `select id, uuid, title, firestore_id, created_at, updated_at, deleted_at from books where uuid = ?`,
      [bookUuid]
    );

    if (!savedBook) {
      throw new Error(`Book ${bookUuid} not found after upsert`);
    }
    return savedBook;
  }

  async deleteBook(id: string): Promise<void> {
    if (!uuid.pattern.test(id)) return;

    await withTransaction(async (db) => {
      const linkedRows = await db.query<{ link_id: string | null }>(
        `select link_id from contents where book_id = ?`,
        [id]
      );
      const linkIds = [...new Set(
        linkedRows
          .map((row) => row.link_id)
          .filter((linkId): linkId is string => typeof linkId === "string" && linkId.length > 0)
      )];

      const exerciseRows = await db.query<{ uuid: string }>(
        `select uuid from exercises where book_id = ?`,
        [id]
      );
      const exerciseIds = exerciseRows.map((row) => row.uuid);

      if (exerciseIds.length > 0) {
        await db.execute(
          `delete from exercise_questions where exercise_id in (${exerciseIds
            .map(() => "?")
            .join(",")})`,
          exerciseIds
        );
      }

      await db.execute(`delete from exercises where book_id = ?`, [id]);
      await db.execute(`delete from answer_sheets where book_id = ?`, [id]);
      await db.execute(`delete from books_attributes where book_id = ?`, [id]);
      await db.execute(`delete from contents where book_id = ?`, [id]);

      if (linkIds.length > 0) {
        await db.execute(
          `delete from link where uuid in (${linkIds.map(() => "?").join(",")})
           and not exists (select 1 from contents c where c.link_id = link.uuid)`,
          linkIds
        );
      }

      await db.execute(`delete from books where uuid = ?`, [id]);
    });
  }
}
