import { ApiResponseHandler } from "@/lib/api-response";
import { query } from "@/lib/db/utils";

export async function GET() {
  try {
    const data = await query<{ uuid: string; image: string; url: string }>(
      `select uuid,image,url from banner`
    );
    return ApiResponseHandler.success(data);
  } catch (error) {
    return ApiResponseHandler.error({
      code: "UNKNOWN",
      message: error instanceof Error ? error.message : "Unknown error",
      status: 500,
    });
  }
}
