import { BooksAttributes, Database, QueryOptions, Tables } from "@/models";
import { SupabaseClient } from "@supabase/supabase-js";
import { AttributesRepository } from "./attributes";

type Books = Tables<"books">;
type BooksContentsCount = Books & { contents: number };
type BookWithAttributes = Books & { attributes?: BooksAttributes[] };

interface Book {
  db: any;
  getBooks(queryOptions?: QueryOptions): Promise<BooksContentsCount[]>;
  getBook(id: string): Promise<BooksContentsCount>;
  upsertBook(book: BookWithAttributes): Promise<BookWithAttributes>;
  deleteBook(id: string): Promise<void>;
}

export class BookRepository implements Book {
  db: SupabaseClient<Database>;
  private attributesRepo: AttributesRepository;

  constructor(_db: any) {
    this.db = _db;
    this.attributesRepo = new AttributesRepository(_db);
  }

  async getBooks(queryOptions?: QueryOptions) {
    const { filter } = queryOptions ?? {};
    let filteredBookIds: string[] = [];
    const isNoAttribute = filter?.includes("none");
    const isFilterActive = (filter && filter.length > 0) || isNoAttribute;

    if (isNoAttribute) {
      const { data, error } = await this.db
        .from("books")
        .select("*, attributes:books_attributes(id)");

      if (error) throw error;
      filteredBookIds = data
        .filter((d: any) => d.attributes.length === 0)
        .map((d: any) => d.uuid);
    } else if (filter && filter.length > 0 && !isNoAttribute) {
      const regex =
        /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
      const filtered = filter.filter((id: string) => regex.test(id));

      const { data, error } = await this.db
        .from("books_attributes")
        .select("book_id")
        .in("attribute_id", filtered);

      if (error) throw error;

      filteredBookIds = data.map((d: any) => d.book_id);
    }

    // If no book is found with the applied filter, return an empty book list
    if (isFilterActive && filteredBookIds.length === 0) {
      return [];
    }

    // Start building the query for Search and Sort
    const query = this.db.from("books").select("*, contents (id)");

    if (queryOptions) {
      const { search, sortBy, orderBy } = queryOptions;
      if (search) {
        query.ilike("title", `%${search}%`);
      }
      if (isFilterActive) {
        query.in("uuid", filteredBookIds);
      }
      if (sortBy && orderBy) {
        query.order(sortBy, { ascending: orderBy === "asc" });
      }
    }

    const response = await query;

    if (response.error) {
      throw response.error;
    }

    const books = response.data;

    return books.map((book) => {
      const { contents, ...rest } = book;
      return {
        ...rest,
        contents: contents.length,
      };
    });
  }

  async getBook(id: string) {
    const response = await this.db
      .from("books")
      .select("*, contents (id)")
      .eq("uuid", id)
      .single();

    if (response.error) throw response.error;

    const book = {
      ...response.data,
      contents: response.data.contents.length,
    };

    return book;
  }

  async upsertBook(book: Books): Promise<Books> {
    const response = await this.db.from("books").upsert(book).select().single();
    if (response.error) {
      throw response.error;
    }

    const savedBook = response.data;
    return savedBook;
  }

  async deleteBook(id: string): Promise<void> {
    await this.db.from("books").delete().eq("uuid", id);
  }
}
