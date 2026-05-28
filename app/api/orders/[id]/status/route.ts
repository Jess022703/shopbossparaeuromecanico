import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";
import { isOrderStatus } from "@/lib/constants";
import { buildStatusMessage, sendClientEmail } from "@/lib/messages";
import { SHOP } from "@/lib/shop";

// PATCH: update order status, trigger the Spanish client message and log it.
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { status } = await req.json().catch(() => ({ status: "" }));
  if (!isOrderStatus(String(status))) {
    return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
  }

  const order = await prisma.repairOrder.findUnique({
    where: { id: params.id },
    include: { vehicle: { include: { client: true } } },
  });
  if (!order) {
    return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
  }

  const updated = await prisma.repairOrder.update({
    where: { id: params.id },
    data: { status },
  });

  // Build + send the automatic client message for the new status.
  const body = buildStatusMessage(status, {
    make: order.vehicle.make,
    model: order.vehicle.model,
  });

  const result = await sendClientEmail(
    order.vehicle.client.email,
    `${SHOP.name} — Actualización de su vehículo`,
    body
  );

  const log = await prisma.messageLog.create({
    data: {
      orderId: order.id,
      channel: result.channel,
      body: result.body,
    },
  });

  return NextResponse.json({
    ok: true,
    status: updated.status,
    message: { ...log, delivered: result.delivered },
  });
}
