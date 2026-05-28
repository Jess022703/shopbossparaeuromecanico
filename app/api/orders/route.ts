import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

// POST: create a repair order. Either reference an existing vehicle
// (vehicleId) or create a new client + vehicle inline.
export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const data = await req.json().catch(() => null);
  if (!data || !data.description) {
    return NextResponse.json(
      { error: "La descripción es requerida" },
      { status: 400 }
    );
  }

  let vehicleId: string | undefined = data.vehicleId || undefined;

  if (!vehicleId) {
    // Create new client + vehicle.
    const v = data.vehicle ?? {};
    if (!v.vin || !v.make || !v.model || !v.year) {
      return NextResponse.json(
        { error: "Faltan datos del vehículo (VIN, marca, modelo, año)" },
        { status: 400 }
      );
    }
    const c = data.client ?? {};
    if (!c.name || !c.phone) {
      return NextResponse.json(
        { error: "Faltan datos del cliente (nombre, teléfono)" },
        { status: 400 }
      );
    }

    try {
      const created = await prisma.vehicle.create({
        data: {
          vin: String(v.vin).toUpperCase(),
          plate: v.plate || null,
          make: String(v.make),
          model: String(v.model),
          year: Number(v.year),
          color: v.color || null,
          client: {
            create: {
              name: String(c.name),
              phone: String(c.phone),
              email: c.email || null,
            },
          },
        },
      });
      vehicleId = created.id;
    } catch (e: unknown) {
      return NextResponse.json(
        { error: "VIN duplicado o datos inválidos" },
        { status: 400 }
      );
    }
  }

  const order = await prisma.repairOrder.create({
    data: {
      vehicleId: vehicleId!,
      description: String(data.description),
      notes: data.notes || null,
      status: "RECEIVED",
    },
  });

  return NextResponse.json({ ok: true, id: order.id });
}
