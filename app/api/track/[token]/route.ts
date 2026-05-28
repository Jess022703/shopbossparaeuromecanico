import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { STATUS_META, isOrderStatus } from "@/lib/constants";

// GET: public order status by QR token (no auth). Returns only
// client-safe fields — no pricing or internal data.
export async function GET(
  _req: NextRequest,
  { params }: { params: { token: string } }
) {
  const order = await prisma.repairOrder.findUnique({
    where: { qrToken: params.token },
    include: { vehicle: true },
  });
  if (!order) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  return NextResponse.json({
    status: order.status,
    statusLabel: isOrderStatus(order.status)
      ? STATUS_META[order.status].label
      : order.status,
    notes: order.notes,
    updatedAt: order.updatedAt,
    vehicle: {
      make: order.vehicle.make,
      model: order.vehicle.model,
      year: order.vehicle.year,
      color: order.vehicle.color,
    },
  });
}
