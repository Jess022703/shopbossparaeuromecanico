import { NextResponse } from "next/server";
import { updateContactGroupMessage } from "@/lib/store";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const form = await request.formData();
  const subject = String(form.get("subject") ?? "").trim();
  const body = String(form.get("body") ?? "").trim();

  await updateContactGroupMessage(id, subject, body);
  return NextResponse.redirect(new URL(`/reminders/${id}?saved=1`, request.url), 303);
}
