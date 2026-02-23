import { ApiResponseHandler } from "@/lib/api-response";
import { constants } from "@/lib/constants";
import { CollectionLinkResponse } from "@/models";
import { BookRepository } from "@/repositories/books";
import { ContentsRepository } from "@/repositories/contents";
import { NextRequest } from "next/server";

const {
  errors: {
    link: { LINK_NOT_FOUND, LINK_MISSING_SIGNATURE, LINK_PATH_REQUIRED },
    content: { CONTENT_NOT_FOUND },
    general: { UNKNOWN },
  },
} = constants;

export async function GET(
  request: NextRequest,
  { params }: { params: { paths: string[] } }
) {
  const searchParams = request.nextUrl.searchParams;
  const linkPath = params.paths?.[0];
  const appSignature = searchParams.get("app");

  if (!appSignature) return ApiResponseHandler.error(LINK_MISSING_SIGNATURE);
  if (appSignature !== process.env.NEXT_PUBLIC_APP_ID)
    return ApiResponseHandler.error(LINK_MISSING_SIGNATURE);
  if (!linkPath) return ApiResponseHandler.error(LINK_PATH_REQUIRED);

  const bookRepo = new BookRepository(null);
  const contentRepo = new ContentsRepository(null);

  try {
    const { book_id, link, ...contentData } = await contentRepo.getContentByLink(linkPath);
    const collection = await bookRepo.getBook(book_id);

    if (!link) return ApiResponseHandler.error(LINK_NOT_FOUND);
    if (!collection) return ApiResponseHandler.error(CONTENT_NOT_FOUND);

    return ApiResponseHandler.success({
      id: contentData.uuid,
      collectionId: book_id,
      title: contentData.title,
      type: contentData.type,
      createdAt: contentData.created_at,
      updatedAt: contentData.updated_at,
      link: {
        url: link.path,
        targetUrl: link.targetUrl,
      },
      collection: {
        id: collection.uuid,
        name: collection.title,
        createdAt: collection.created_at,
        updatedAt: collection.updated_at,
      },
    } satisfies CollectionLinkResponse);
  } catch (error) {
    console.error(1349, "contentRepo.getContentByLink", { path: linkPath }, error);
    const message = error instanceof Error ? error.message : "";
    if (message.toLowerCase().includes("not found")) {
      return ApiResponseHandler.error(LINK_NOT_FOUND);
    }
    return ApiResponseHandler.error(UNKNOWN);
  }
}
