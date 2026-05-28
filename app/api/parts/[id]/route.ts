import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

// PATCH: adjust stock (delta) or set fields for a part.
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const data = await req.json().catch(() => ({}));

  if (typeof data.delta === "number") {
    const part = await prisma.part.findUnique({ where: { id: params.id } });
    if (!part) {
      return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    }
    const stock = Math.max(0, part.stock + data.delta);
    const updated = await prisma.part.update({
      where: { id: params.id },
      data: { stock },
    });
    return NextResponse.json({ ok: true, stock: updated.stock });
  }

  return NextResponse.json({ error: "Sin cambios" }, { status: 400 });
}
