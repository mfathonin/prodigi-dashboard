import {
  ContentUpdateForm,
  Database,
  ExternalContentUpdateForm,
  QuizUpdateForm,
  Tables,
} from "@/models";
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
  upsertContentLink(contents: ContentUpdateForm): Promise<BookContentsLink>;
  deleteContentsLink(contentId: string): Promise<void>;
  getContentByLink(path: string): Promise<BookContentsLink>;
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
      .eq("book_id", bookId)
      .order("title", { ascending: true });
    if (response.error) throw response.error;

    const contents = response.data;
    return contents;
  }

  async upsertContentLink(
    _content: ExternalContentUpdateForm
  ): Promise<BookContentsLink> {
    const { path, targetUrl, linkId, ...content } = _content;
    const link = {
      path,
      target_url: targetUrl,
      id: linkId !== -1 ? linkId : undefined,
    };
    let updatedLink: BookContentsLink["link"] & { uuid: string };
    const updateLinkResponse = await this._db
      .from("link")
      .upsert(link)
      .select(`id, path, targetUrl: target_url, uuid`)
      .single();
    if (updateLinkResponse.error) throw updateLinkResponse;
    updatedLink = updateLinkResponse.data;

    const contentWithLink = {
      title: content.title,
      id: content.id !== -1 ? content.id : undefined,
      uuid: content.uuid !== "" ? content.uuid : undefined,
      link_id: updatedLink?.uuid,
      book_id: content.bookId,
    };
    if (content.uuid === "")
      Object.assign(contentWithLink, { type: content.type });

    const response = await this._db
      .from("contents")
      .upsert(contentWithLink)
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

  async upsertQuiz(content: QuizUpdateForm): Promise<BookContentsLink> {
    // 1. create new answerSheet -> title, nQuestion, nOptions, answers, book_id
    const { nQuestion, nOptions, ...contentData } = content;

    const answerSheetData = {
      book_id: contentData.bookId,
      counts: nQuestion,
      answers: Array(nQuestion).fill(0),
      n_options: Array(nQuestion).fill(nOptions),
      points: Array(nQuestion).fill(1),
    };

    const answerSheetResponse = await this._db
      .from("answer_sheets")
      .upsert(answerSheetData)
      .select("id, uuid")
      .single();

    if (answerSheetResponse.error) throw answerSheetResponse.error;

    // 2. compose targetUrl for link -> /quiz/${answerSheet.id}
    const answerSheetId = answerSheetResponse.data.uuid;
    const targetUrl = `${process.env.NEXT_PUBLIC_LINKS_APP}/quiz/${answerSheetId}`;

    // 3. continue with existing flow like in upsertContentLink
    const contentWithLink = await this.upsertContentLink({
      ...contentData,
      targetUrl,
      type: "quiz",
    });

    return contentWithLink;
  }

  async ensureQuizContentType(answerSheetId: string): Promise<void> {
    const targetUrl = `${process.env.NEXT_PUBLIC_LINKS_APP}/quiz/${answerSheetId}`;

    // Get content via link
    try {
      const content = await this.getContentLinkByTargetUrl(targetUrl);
      if (!content) throw new Error("Content link not found");

      // Update content type if needed
      await this._db
        .from("contents")
        .update({ type: "quiz" })
        .eq("link_id", content.link_id);
    } catch (error) {
      throw error;
    }
  }

  async deleteContentsLink(contentId: string): Promise<void> {
    await this._db.from("contents").delete().eq("uuid", contentId);
  }

  async getContentByLink(path: string): Promise<BookContentsLink> {
    const response = await this._db
      .from("link")
      .select("*")
      .eq("path", path)
      .single();
    if (response.error) throw response.error;
    const links = response.data;

    const contentResponse = await this._db
      .from("contents")
      .select("*")
      .eq("link_id", links.uuid)
      .single();
    if (contentResponse.error) throw contentResponse.error;

    const data: BookContentsLink = {
      ...contentResponse.data,
      link: {
        ...links,
        targetUrl: links.target_url,
      },
    };

    return data;
  }

  async getContentLinkByTargetUrl(
    targetUrl: string
  ): Promise<BookContentsLink> {
    const response = await this._db
      .from("link")
      .select("*")
      .eq("target_url", targetUrl)
      .single();
    if (response.error) throw response.error;

    const contentResponse = await this._db
      .from("contents")
      .select("*")
      .eq("link_id", response.data.uuid)
      .single();
    if (contentResponse.error) throw contentResponse.error;

    const data: BookContentsLink = {
      ...contentResponse.data,
      link: {
        ...response.data,
        targetUrl: response.data.target_url,
      },
    };

    return data;
  }
}
