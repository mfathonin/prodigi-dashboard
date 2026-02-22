import { CollectionLinkResponse } from "@/models";
import { ContentsRepository } from "@/repositories/contents";
import { BookRepository } from "@/repositories/books";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { paths: string[] } }
) {
  const searchParams = request.nextUrl.searchParams;
  const linkPath = params.paths?.[0];
  const appSignature = searchParams.get("app");

  if (!appSignature)
    return new Response("App signature is required", { status: 400 });
  if (!linkPath) return new Response("Link path is required", { status: 400 });

  const contentRepo = new ContentsRepository(null);
  const bookRepo = new BookRepository(null);

  try {
    const { link, ...contentData } = await contentRepo.getContentByLink(linkPath);
    if (!link) return new Response("Link not found", { status: 404 });

    const collection = await bookRepo.getBook(contentData.book_id);
    if (!collection) return new Response("Books not found", { status: 404 });

    const formattedLink = {
      contents: [
        {
          id: contentData.id,
          title: contentData.title,
          type: contentData.type,
          collectionId: contentData.book_id,
          createdAt: contentData.created_at,
          link: {
            targetUrl: link.targetUrl,
            url: link.path,
          },
          updatedAt: contentData.updated_at,
          collection: {
            id: collection.id,
            name: collection.title,
            createdAt: collection.created_at,
            updatedAt: collection.updated_at,
          },
        } satisfies CollectionLinkResponse,
      ],
    };

    return new Response(JSON.stringify(formattedLink), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response("Link not found", { status: 404 });
  }
}
