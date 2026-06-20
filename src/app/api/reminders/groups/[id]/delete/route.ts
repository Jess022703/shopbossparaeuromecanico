import { NextResponse } from "next/server";
import { deleteContactGroup } from "@/lib/store";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await deleteContactGroup(id);
  return NextResponse.redirect(new URL("/reminders?deleted=1", request.url), 303);
}
