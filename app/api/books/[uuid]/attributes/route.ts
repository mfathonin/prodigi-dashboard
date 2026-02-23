import { NextResponse } from "next/server";
import { currentUserWithRoles } from "@/lib/auth/service";
import { AttributesRepository } from "@/repositories/attributes";

export async function GET(
  _request: Request,
  { params }: { params: { uuid: string } }
) {
  const user = await currentUserWithRoles();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const repo = new AttributesRepository(null);
    const data = await repo.getBookAttributes(params.uuid);
    return NextResponse.json(data);
  } catch (error) {
    console.error("[api/books/[uuid]/attributes.GET] failed:", error);
    return NextResponse.json({ error: "Failed to fetch book attributes" }, { status: 500 });
  }
}
