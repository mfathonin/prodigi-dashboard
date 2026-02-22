import { NextResponse } from "next/server";
import { ContentsRepository } from "@/repositories/contents";

export async function POST(request: Request) {
  const body = await request.json();
  const repo = new ContentsRepository(null);

  if (body?.type === "answer_sheet") {
    const data = await repo.upsertAnswerSheet(body);
    return NextResponse.json(data);
  }
  if (body?.type === "exercise") {
    const data = await repo.upsertExercise(body);
    return NextResponse.json(data);
  }

  const data = await repo.upsertContentLink(body);
  return NextResponse.json(data);
}
