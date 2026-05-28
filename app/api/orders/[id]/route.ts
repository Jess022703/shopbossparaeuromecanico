import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

// PATCH: update editable order fields (notes, approval flag).
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const data = await req.json().catch(() => ({}));
  const update: { notes?: string; approved?: boolean } = {};
  if (typeof data.notes === "string") update.notes = data.notes;
  if (typeof data.approved === "boolean") update.approved = data.approved;

  const order = await prisma.repairOrder
    .update({ where: { id: params.id }, data: update })
    .catch(() => null);

  if (!order) {
    return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
  }
  return NextResponse.json({ ok: true, order });
}
