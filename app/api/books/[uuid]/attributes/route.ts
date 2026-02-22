import { NextResponse } from "next/server";
import { AttributesRepository } from "@/repositories/attributes";

export async function GET(
  _request: Request,
  { params }: { params: { uuid: string } }
) {
  const repo = new AttributesRepository(null);
  const data = await repo.getBookAttributes(params.uuid);
  return NextResponse.json(data);
}
