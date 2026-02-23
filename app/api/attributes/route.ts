import { NextResponse } from "next/server";
import { currentUserWithRoles } from "@/lib/auth/service";
import { AttributesRepository } from "@/repositories/attributes";

export async function GET() {
  const user = await currentUserWithRoles();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const repo = new AttributesRepository(null);
    const data = await repo.getAttributes();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[api/attributes.GET] failed:", error);
    return NextResponse.json({ error: "Failed to fetch attributes" }, { status: 500 });
  }
}
