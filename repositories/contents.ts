import { Database, Tables } from "@/models";
import { SupabaseClient } from "@supabase/supabase-js";

type BookContentsLink = Tables<"contents"> & {
  link: {
    id: number;
    path: string;
    targetUrl: string;
  } | null;
};

interface Contents {
  getBookContents(bookId: string): Promise<BookContentsLink[]>;
  upsertContentLink(contents: BookContentsLink): Promise<BookContentsLink>;
  deleteContentsLink(contentId: string): Promise<void>;
}

export class ContentsRepository implements Contents {
  private _db: SupabaseClient<Database>;

  constructor(db: any) {
    this._db = db;
  }

  async getBookContents(bookId: string) {
    const response = await this._db
      .from("contents")
      .select(
        `
      *,
      link (id, path, targetUrl: target_url)
    `
      )
      .eq("book_id", bookId);
    if (response.error) throw response.error;

    const contents = response.data;
    return contents;
  }

  async upsertContentLink(
    _content: BookContentsLink
  ): Promise<BookContentsLink> {
    const { link, ...content } = _content;
    let updatedLink: BookContentsLink["link"];
    if (link) {
      const updateLinkResponse = await this._db
        .from("link")
        .upsert({ target_url: link.targetUrl, ...link })
        .select(`id, path, targetUrl: target_url`)
        .single();
      if (updateLinkResponse.error) throw updateLinkResponse;
      updatedLink = updateLinkResponse.data;
    }

    const response = await this._db
      .from("contents")
      .upsert(content)
      .select(
        `
      *,
      link (id, path, targetUrl: target_url)
    `
      )
      .single();
    if (response.error) throw response.error;

    const savedContents = response.data;
    return savedContents;
  }

  async deleteContentsLink(contentId: string): Promise<void> {
    await this._db.from("contents").delete().eq("uuid", contentId);
  }
}
