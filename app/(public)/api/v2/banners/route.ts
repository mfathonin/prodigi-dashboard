import { ApiResponseHandler } from "@/lib/api-response";
import { constants } from "@/lib/constants";
import { createClient } from "@/lib/supaclient/server";
import { NextRequest, NextResponse } from "next/server";

const {
  errors: {
    general: { UNKNOWN },
  },
} = constants;
export async function GET(request: NextRequest) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("banner")
    .select("uuid,image,url");

  if (error) {
    return ApiResponseHandler.error({ ...UNKNOWN, message: error.message });
  }

  return ApiResponseHandler.success(data);
}
