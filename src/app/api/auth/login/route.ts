import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const form = await request.formData();
  const email = String(form.get("email") ?? "admin@euromecanico.com");
  const cookieStore = await cookies();
  cookieStore.set("euroshop_session", JSON.stringify({ email, role: "OWNER" }), {
    httpOnly: true,
    sameSite: "lax",
    path: "/"
  });

  return NextResponse.redirect(new URL("/dashboard", request.url), 303);
}
