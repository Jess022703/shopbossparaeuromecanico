import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

// PATCH: update per-vehicle notes.
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const data = await req.json().catch(() => ({}));
  const vehicle = await prisma.vehicle
    .update({
      where: { id: params.id },
      data: { notes: typeof data.notes === "string" ? data.notes : undefined },
    })
    .catch(() => null);
  if (!vehicle) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
