import { NextResponse } from "next/server";
import { approveRepairOrder } from "@/lib/store";

export async function POST(request: Request) {
  const form = await request.formData();
  const token = String(form.get("token") ?? "").trim();

  if (!token || !(await approveRepairOrder(token))) {
    return NextResponse.redirect(new URL("/portal/demo-token?error=Orden+no+encontrada", request.url), 303);
  }

  return NextResponse.redirect(new URL("/portal/demo-token?approved=1", request.url), 303);
}
