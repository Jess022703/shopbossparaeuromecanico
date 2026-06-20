import { NextResponse } from "next/server";
import { startSendAll } from "@/lib/reminder-jobs";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await startSendAll(id);

  if (!result.started && result.error) {
    return NextResponse.redirect(new URL(`/reminders/${id}?error=${encodeURIComponent(result.error)}`, request.url), 303);
  }
  return NextResponse.redirect(new URL(`/reminders/${id}?sending=1`, request.url), 303);
}
