import { NextResponse } from "next/server";
import { parseContactsFromBuffer } from "@/lib/excel";
import { createContactGroup } from "@/lib/store";

export async function POST(request: Request) {
  const form = await request.formData();
  const file = form.get("file");
  const name = String(form.get("name") ?? "").trim();

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.redirect(new URL("/reminders?error=Selecciona+un+archivo+Excel", request.url), 303);
  }

  try {
    const buffer = await file.arrayBuffer();
    const contacts = await parseContactsFromBuffer(buffer);

    if (contacts.length === 0) {
      return NextResponse.redirect(
        new URL("/reminders?error=No+se+encontraron+contactos+con+email+valido", request.url),
        303
      );
    }

    const groupName = name || file.name.replace(/\.xlsx?$/i, "");
    const group = await createContactGroup(groupName, contacts);
    return NextResponse.redirect(new URL(`/reminders/${group.id}?created=${contacts.length}`, request.url), 303);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error leyendo el Excel";
    return NextResponse.redirect(new URL(`/reminders?error=${encodeURIComponent(message)}`, request.url), 303);
  }
}
