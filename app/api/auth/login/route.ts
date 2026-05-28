import { NextRequest, NextResponse } from "next/server";
import { authCookie, isPinValid } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { pin } = await req.json().catch(() => ({ pin: "" }));
  if (!isPinValid(String(pin ?? ""))) {
    return NextResponse.json({ error: "PIN incorrecto" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  const c = authCookie();
  res.cookies.set(c.name, c.value, c.options);
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("shop_auth", "", { path: "/", maxAge: 0 });
  return res;
}
