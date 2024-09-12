import { Database, Tables } from "@/models";
import { SupabaseClient } from "@supabase/supabase-js";

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
  _db: SupabaseClient<Database>;

  constructor(db: any) {
    this._db = db;
  }

  async getBookAttributes(bookId: string) {
    const response = await this._db
      .from("books_attributes")
      .select("attributes(id, uuid, key, value)")
      .eq("book_id", bookId);
    if (response.error) {
      throw response.error;
    }

    const attributes = response.data.reduce((acc: BooksAttritbutes[], curr) => {
      if (curr.attributes != null) acc.push(curr.attributes);
      return acc;
    }, []);

    return attributes
      .sort((a, b) => a.key.localeCompare(b.key))
      .sort((a, b) => a.value.localeCompare(b.value));
  }

  async getAttributes(): Promise<AttributesList> {
    const response = await this._db
      .from("attributes")
      .select("key, value, uuid");
    if (response.error) throw response.error;

    const attributes = response.data.reduce((acc: AttributesList, curr) => {
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
    const data = attributes.map((uuid) => ({
      book_id: bookId,
      attribute_id: uuid,
    }));
    const response = await this._db.from("books_attributes").insert(data);
    if (response.error) throw response.error;
  }

  async removeBookAttributes(bookId: string, attributes: string[]) {
    const response = await this._db
      .from("books_attributes")
      .delete()
      .eq("book_id", bookId)
      .in("attribute_id", attributes);
    if (response.error) throw response.error;
  }

  async addAttribute(key: string, value: string) {
    const response = await this._db
      .from("attributes")
      .insert({ key, value })
      .select();
    if (response.error) throw response.error;
    return response.data[0];
  }

  async deleteAttribute(uuid: string) {
    const response = await this._db
      .from("attributes")
      .delete()
      .eq("uuid", uuid);
    if (response.error) throw response.error;
  }

  async updateAttribute(uuid: string, key: string, value: string) {
    const response = await this._db
      .from("attributes")
      .update({ key, value })
      .eq("uuid", uuid);
    if (response.error) throw response.error;
  }
}
