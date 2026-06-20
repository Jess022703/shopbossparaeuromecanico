import { NextResponse } from "next/server";
import { getContactGroup, markContactsSent } from "@/lib/store";
import { sendGroup } from "@/lib/mailer";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const form = await request.formData();
  const testMode = form.get("testMode") === "on";
  const testEmail = String(form.get("testEmail") ?? "").trim();

  // Cuantas veces enviar el correo de prueba (1 a 10, por defecto 3).
  const rawCount = Number(form.get("testCount"));
  const testCount = Number.isFinite(rawCount) ? Math.min(Math.max(Math.trunc(rawCount), 1), 10) : 3;

  const group = await getContactGroup(id);
  if (!group) {
    return NextResponse.redirect(new URL("/reminders?error=Grupo+no+encontrado", request.url), 303);
  }

  try {
    const result = await sendGroup(group, { testMode, testEmail, limit: testCount });
    if (result.sentEmails.length > 0) {
      await markContactsSent(id, result.sentEmails);
    }
    const flash = new URLSearchParams({
      sent: String(result.sent),
      failed: String(result.failed),
      remaining: String(result.remaining),
      mode: result.testMode ? "test" : "real"
    });
    return NextResponse.redirect(new URL(`/reminders/${id}?${flash.toString()}`, request.url), 303);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al enviar";
    return NextResponse.redirect(new URL(`/reminders/${id}?error=${encodeURIComponent(message)}`, request.url), 303);
  }
}
