import { Database, BooksAttributes, Tables } from "@/models";
import { SupabaseClient } from "@supabase/supabase-js";
import { AttributesRepository } from "./attributes";

type Books = Tables<"books">;
type BooksContentsCount = Books & { contents: number };
type BookWithAttributes = Books & { attributes?: BooksAttributes[] };

interface Book {
  db: any;
  getBooks(): Promise<BooksContentsCount[]>;
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

  async getBooks() {
    const response = await this.db
      .from("books")
      .select("*, contents (id)")
      .order("title", { ascending: true });

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
