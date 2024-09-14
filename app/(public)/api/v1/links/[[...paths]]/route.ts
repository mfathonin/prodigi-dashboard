import { createClient } from "@/lib/supaclient/server";
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
    .single();

  if (linkError) return new Response("Error fetching link", { status: 500 });

  if (!linkData) return new Response("Link not found", { status: 404 });

  const { data: contentData, error: contentError } = await supabase
    .from("contents")
    .select("*")
    .eq("link_id", linkData.uuid)
    .single();

  if (contentError)
    return new Response("Error fetching content", { status: 500 });
  if (!contentData) return new Response("Content not found", { status: 404 });

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
        collection: {
          id: contentData.book_id,
          createdAt: contentData.created_at,
          name: contentData.title,
          updatedAt: contentData.updated_at,
        },
      },
    ],
  };

  return new Response(JSON.stringify(formattedLink), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
