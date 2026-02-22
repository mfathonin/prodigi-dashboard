import { Tables } from "@/models";
import { execute, query, queryOne } from "@/lib/db/utils";

type BooksAttritbutes = Tables<"attributes">;
type AttributesList = { [key: string]: { uuid: string; value: string }[] };

interface Attributes {
  _db: any;
  getBookAttributes(bookId: string): Promise<BooksAttritbutes[]>;
  getAttributes(): Promise<AttributesList>;

  addBookAttributes(bookId: string, attributes: string[]): Promise<void>;
  removeBookAttributes(bookId: string, attributes: string[]): Promise<void>;
}

export class AttributesRepository implements Attributes {
  _db: any;

  constructor(db: any) {
    this._db = db;
  }

  async getBookAttributes(bookId: string) {
    const rows = await query<BooksAttritbutes>(
      `select a.id, a.uuid, a.key, a.value
       from books_attributes ba
       join attributes a on a.uuid = ba.attribute_id
       where ba.book_id = ?`,
      [bookId]
    );

    return rows
      .sort((a, b) => a.key.localeCompare(b.key))
      .sort((a, b) => a.value.localeCompare(b.value));
  }

  async getAttributes(): Promise<AttributesList> {
    const rows = await query<{ key: string; value: string; uuid: string }>(
      `select key, value, uuid from attributes`
    );

    const attributes = rows.reduce((acc: AttributesList, curr) => {
      if (curr.key != null && curr.value != null) {
        if (acc[curr.key] == null)
          acc[curr.key] = [] as { uuid: string; value: string }[];
        acc[curr.key].push({ uuid: curr.uuid, value: curr.value });
      }
      return acc;
    }, {});

    return attributes;
  }

  async addBookAttributes(bookId: string, attributes: string[]) {
    for (const attributeId of attributes) {
      await execute(
        `insert into books_attributes (book_id, attribute_id) values (?, ?)`,
        [bookId, attributeId]
      );
    }
  }

  async removeBookAttributes(bookId: string, attributes: string[]) {
    if (attributes.length === 0) return;
    await execute(
      `delete from books_attributes
       where book_id = ? and attribute_id in (${attributes
         .map(() => "?")
         .join(",")})`,
      [bookId, ...attributes]
    );
  }

  async addAttribute(key: string, value: string) {
    const uuid = crypto.randomUUID();
    await execute(`insert into attributes (uuid, key, value) values (?, ?, ?)`, [
      uuid,
      key,
      value,
    ]);
    return queryOne<BooksAttritbutes>(
      `select id, uuid, key, value from attributes where uuid = ?`,
      [uuid]
    );
  }

  async deleteAttribute(uuid: string) {
    await execute(`delete from attributes where uuid = ?`, [uuid]);
  }

  async updateAttribute(uuid: string, key: string, value: string) {
    await execute(`update attributes set key = ?, value = ? where uuid = ?`, [
      key,
      value,
      uuid,
    ]);
  }
}
