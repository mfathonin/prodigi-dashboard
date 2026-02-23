import { NextResponse } from "next/server";
import { currentUserWithRoles } from "@/lib/auth/service";
import { contentSchema } from "@/models/contents";
import { ContentsRepository } from "@/repositories/contents";

export async function POST(request: Request) {
  const user = await currentUserWithRoles();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = contentSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid content payload" }, { status: 400 });
  }

  const body = parsed.data;
  const repo = new ContentsRepository(null);
  try {
    if (body.type === "answer_sheet") {
      const data = await repo.upsertAnswerSheet(body as any);
      return NextResponse.json(data);
    }
    if (body.type === "exercise") {
      const data = await repo.upsertExercise(body);
      return NextResponse.json(data);
    }

    const data = await repo.upsertContentLink(body as any);
    return NextResponse.json(data);
  } catch (error) {
    console.error("[api/contents.POST] failed:", error);
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 });
  }
}
