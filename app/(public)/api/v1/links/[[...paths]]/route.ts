import { createClient } from "@/lib/supaclient/server";
import { CollectionLinkResponse } from "@/models";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { paths: string[] } }
) {
  const searchParams = request.nextUrl.searchParams;
  const supabase = createClient();
  const linkPath = params.paths?.[0];
  const appSignature = searchParams.get("app");

  if (!appSignature)
    return new Response("App signature is required", { status: 400 });
  if (!linkPath) return new Response("Link path is required", { status: 400 });

  const { data: linkData, error: linkError } = await supabase
    .from("link")
    .select("*")
    .eq("path", linkPath)
    .limit(1)
    .maybeSingle();

  linkError && console.log(linkError);
  if (linkError) return new Response("Error fetching link", { status: 500 });

  if (!linkData) return new Response("Link not found", { status: 404 });

  const { data: contentData, error: contentError } = await supabase
    .from("contents")
    .select("*")
    .eq("link_id", linkData.uuid)
    .single();

  contentError && console.log(contentError);
  if (contentError)
    return new Response("Error fetching content", { status: 500 });
  if (!contentData) return new Response("Content not found", { status: 404 });

  const { data: collection, error: bookError } = await supabase
    .from("books")
    .select("id, name:title, createdAt:created_at, updatedAt:updated_at")
    .eq("uuid", contentData.book_id)
    .limit(1)
    .maybeSingle();

  if (bookError || !collection)
    return new Response("Books not found", { status: 404 });

  const formattedLink = {
    contents: [
      {
        id: contentData.id,
        title: contentData.title,
        collectionId: contentData.book_id,
        createdAt: contentData.created_at,
        link: {
          targetUrl: linkData.target_url,
          url: linkData.path,
        },
        updatedAt: contentData.updated_at,
        collection,
      } as CollectionLinkResponse,
    ],
  };

  return new Response(JSON.stringify(formattedLink), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
