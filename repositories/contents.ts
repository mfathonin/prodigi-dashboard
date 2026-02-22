import {
  ContentUpdateForm,
  ExternalContentUpdateForm,
  QuizUpdateForm,
  Tables,
} from "@/models";
import { execute, query, queryOne } from "@/lib/db/utils";

function getAppBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_LINKS_APP ??
    (process.env.NEXT_PUBLIC_VERCEL_URL
      ? `http://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : "http://localhost:3013")
  );
}


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
  upsertAnswerSheet(content: QuizUpdateForm): Promise<BookContentsLink>;
  upsertExercise(content: ContentUpdateForm): Promise<BookContentsLink>;
  ensureAnswerSheetContentType(answerSheetId: string): Promise<void>;
  deleteContentsLink(contentId: string): Promise<void>;
  getContentByLink(path: string): Promise<BookContentsLink>;
  getContentLinkByTargetPath(targetPath: string): Promise<BookContentsLink>;
}

export class ContentsRepository implements Contents {
  private _db: any;

  constructor(db: any) {
    this._db = db;
  }

  private async getLinkById(linkUuid: string) {
    return queryOne<{ id: number; uuid: string; path: string; target_url: string }>(
      `select id, uuid, path, target_url from link where uuid = ?`,
      [linkUuid]
    );
  }

  async getBookContents(bookId: string) {
    const rows = await query<any>(
      `select c.*, l.id as link_num_id, l.path as link_path, l.target_url as link_target_url
       from contents c
       left join link l on l.uuid = c.link_id
       where c.book_id = ?
       order by c.title asc`,
      [bookId]
    );

    return rows.map((r) => ({
      ...r,
      link: r.link_path
        ? {
            id: Number(r.link_num_id),
            path: r.link_path,
            targetUrl: r.link_target_url,
          }
        : null,
    }));
  }

  async upsertContentLink(
    _content: ExternalContentUpdateForm
  ): Promise<BookContentsLink> {
    const { path, targetUrl, linkId, ...content } = _content;

    let linkUuid: string;
    if (linkId && linkId !== -1) {
      const existingLink = await queryOne<{ uuid: string }>(
        `select uuid from link where id = ?`,
        [linkId]
      );
      if (!existingLink) throw new Error("Link not found");
      linkUuid = existingLink.uuid;
      await execute(`update link set path = ?, target_url = ? where uuid = ?`, [
        path,
        targetUrl,
        linkUuid,
      ]);
    } else {
      linkUuid = crypto.randomUUID();
      await execute(`insert into link (uuid, path, target_url) values (?, ?, ?)`, [
        linkUuid,
        path,
        targetUrl,
      ]);
    }

    const contentUuid = content.uuid && content.uuid !== "" ? content.uuid : crypto.randomUUID();
    const now = new Date().toISOString();
    const existingContent = await queryOne<{ uuid: string; type: string }>(
      `select uuid, type from contents where uuid = ?`,
      [contentUuid]
    );

    if (existingContent) {
      await execute(
        `update contents set title = ?, link_id = ?, book_id = ?, type = ?, updated_at = ? where uuid = ?`,
        [
          content.title,
          linkUuid,
          content.bookId,
          content.type ?? existingContent.type,
          now,
          contentUuid,
        ]
      );
    } else {
      await execute(
        `insert into contents (uuid, title, link_id, book_id, type, created_at, updated_at)
         values (?, ?, ?, ?, ?, ?, ?)`,
        [contentUuid, content.title, linkUuid, content.bookId, content.type, now, now]
      );
    }

    const saved = await queryOne<any>(
      `select * from contents where uuid = ?`,
      [contentUuid]
    );
    const linkRow = await this.getLinkById(linkUuid);

    return {
      ...saved,
      link: linkRow
        ? { id: Number(linkRow.id), path: linkRow.path, targetUrl: linkRow.target_url }
        : null,
    } as BookContentsLink;
  }

  async upsertAnswerSheet(content: QuizUpdateForm): Promise<BookContentsLink> {
    const { nQuestion, nOptions, ...contentData } = content;

    const answerSheetUuid = crypto.randomUUID();
    await execute(
      `insert into answer_sheets (uuid, book_id, counts, answers, n_options, points, created_at, updated_at)
       values (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        answerSheetUuid,
        contentData.bookId,
        nQuestion,
        JSON.stringify(Array(nQuestion).fill(0)),
        JSON.stringify(Array(nQuestion).fill(nOptions)),
        JSON.stringify(Array(nQuestion).fill(1)),
        new Date().toISOString(),
        new Date().toISOString(),
      ]
    );

    const targetUrl = `${getAppBaseUrl()}/quiz/${answerSheetUuid}`;

    return this.upsertContentLink({
      ...contentData,
      targetUrl,
      type: "answer_sheet",
    });
  }

  async upsertExercise(content: ContentUpdateForm): Promise<BookContentsLink> {
    const exerciseUuid = crypto.randomUUID();
    const now = new Date().toISOString();
    await execute(
      `insert into exercises (uuid, book_id, created_at, updated_at) values (?, ?, ?, ?)`,
      [exerciseUuid, content.bookId, now, now]
    );

    const targetUrl = `${getAppBaseUrl()}/exercise/${exerciseUuid}`;

    return this.upsertContentLink({
      ...content,
      targetUrl,
      type: "exercise",
    });
  }

  async ensureAnswerSheetContentType(answerSheetId: string): Promise<void> {
    const targetPath = `/quiz/${answerSheetId}`;
    const content = await this.getContentLinkByTargetPath(targetPath);
    if (!content) throw new Error("Content link not found");

    if (content.type !== "answer_sheet") {
      await execute(`update contents set type = 'answer_sheet' where link_id = ?`, [
        content.link_id,
      ]);
    }
  }

  async deleteContentsLink(contentId: string): Promise<void> {
    await execute(`delete from contents where uuid = ?`, [contentId]);
  }

  async getContentByLink(path: string): Promise<BookContentsLink> {
    const link = await queryOne<any>(
      `select * from link where path = ? limit 1`,
      [path]
    );
    if (!link) throw new Error("Link not found");

    const content = await queryOne<any>(
      `select * from contents where link_id = ? limit 1`,
      [link.uuid]
    );
    if (!content) throw new Error("Content not found");

    return {
      ...content,
      link: {
        ...link,
        targetUrl: link.target_url,
      },
    } as BookContentsLink;
  }

  async getContentLinkByTargetPath(
    targetPath: string
  ): Promise<BookContentsLink> {
    const link = await queryOne<any>(
      `select * from link where lower(target_url) like lower(?) limit 1`,
      [`%${targetPath}%`]
    );
    if (!link) throw new Error("Link not found");

    const content = await queryOne<any>(
      `select * from contents where link_id = ? limit 1`,
      [link.uuid]
    );
    if (!content) throw new Error("Content not found");

    return {
      ...content,
      link: {
        ...link,
        targetUrl: link.target_url,
      },
    } as BookContentsLink;
  }
}
