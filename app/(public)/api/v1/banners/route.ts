import { query } from "@/lib/db/utils";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await query<{ uuid: string; image: string; url: string }>(
    `select uuid,image,url from banner`
  );

  return NextResponse.json(data);
}
