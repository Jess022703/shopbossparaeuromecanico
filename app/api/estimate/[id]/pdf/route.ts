import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";
import { renderEstimatePdf } from "@/lib/pdf";

export const dynamic = "force-dynamic";

// GET: generate the estimate as a downloadable PDF.
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const order = await prisma.repairOrder.findUnique({
    where: { id: params.id },
    include: { vehicle: { include: { client: true } }, lineItems: true },
  });
  if (!order) {
    return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
  }

  const buffer = await renderEstimatePdf(order);

  return new NextResponse(buffer as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="estimado-${order.vehicle.plate ?? order.vehicle.vin}.pdf"`,
    },
  });
}
