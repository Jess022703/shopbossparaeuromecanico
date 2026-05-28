import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";
import { LINE_TYPES } from "@/lib/constants";

// POST: add a line item (LABOR or PART) to an order.
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const data = await req.json().catch(() => null);
  if (!data) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const type = String(data.type);
  if (!(LINE_TYPES as readonly string[]).includes(type)) {
    return NextResponse.json({ error: "Tipo inválido" }, { status: 400 });
  }
  const quantity = Number(data.quantity);
  const unitPrice = Number(data.unitPrice);
  if (
    !data.description ||
    !Number.isFinite(quantity) ||
    quantity <= 0 ||
    !Number.isFinite(unitPrice) ||
    unitPrice < 0
  ) {
    return NextResponse.json(
      { error: "Cantidad o precio inválido" },
      { status: 400 }
    );
  }

  const order = await prisma.repairOrder.findUnique({
    where: { id: params.id },
  });
  if (!order) {
    return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
  }

  const item = await prisma.lineItem.create({
    data: {
      orderId: params.id,
      type,
      description: String(data.description),
      quantity,
      unitPrice,
      partNumber: data.partNumber ? String(data.partNumber) : null,
    },
  });

  return NextResponse.json({ ok: true, item });
}
