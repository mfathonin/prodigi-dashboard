import { ApiResponseHandler } from "@/lib/api-response";
import { constants } from "@/lib/constants";
import { createClient } from "@/lib/supaclient/server";
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
  const supabase = createClient();
  const linkPath = params.paths?.[0];
  const appSignature = searchParams.get("app");

  if (!appSignature) return ApiResponseHandler.error(LINK_MISSING_SIGNATURE);
  if (appSignature !== process.env.NEXT_PUBLIC_APP_ID)
    return ApiResponseHandler.error(LINK_MISSING_SIGNATURE);
  if (!linkPath) return ApiResponseHandler.error(LINK_PATH_REQUIRED);

  const { data: linkData, error: linkError } = await supabase
    .from("link")
    .select("*")
    .eq("path", linkPath)
    .single();

  if (linkError) {
    if (linkError.code === "PGRST116")
      return ApiResponseHandler.error(LINK_NOT_FOUND);
    return ApiResponseHandler.error(UNKNOWN);
  }

  const { data: contentData, error: contentError } = await supabase
    .from("contents")
    .select("*")
    .eq("link_id", linkData.uuid)
    .single();

  if (contentError) {
    if (contentError?.code === "PGRST116")
      return ApiResponseHandler.error(CONTENT_NOT_FOUND);
    return ApiResponseHandler.error(UNKNOWN);
  }

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

  return ApiResponseHandler.success(formattedLink);
}
