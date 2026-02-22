import { NextResponse } from "next/server";
import { AttributesRepository } from "@/repositories/attributes";

export async function GET() {
  const repo = new AttributesRepository(null);
  const data = await repo.getAttributes();
  return NextResponse.json(data);
}
