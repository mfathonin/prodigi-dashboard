import { NextResponse } from "next/server";
import { ContentsRepository } from "@/repositories/contents";

export async function PUT(
  request: Request,
  { params }: { params: { uuid: string } }
) {
  const body = await request.json();
  const repo = new ContentsRepository(null);
  const data = await repo.upsertContentLink({ ...body, uuid: params.uuid });
  return NextResponse.json(data);
}

export async function DELETE(
  _request: Request,
  { params }: { params: { uuid: string } }
) {
  const repo = new ContentsRepository(null);
  await repo.deleteContentsLink(params.uuid);
  return NextResponse.json({ ok: true });
}
