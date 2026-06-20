import { NextResponse } from "next/server";
import { decodeVin } from "@/lib/vin";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const vin = searchParams.get("vin");
  if (!vin) {
    return NextResponse.json({ error: "VIN requerido" }, { status: 400 });
  }

  try {
    const decoded = await decodeVin(vin);
    return NextResponse.json(decoded);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "VIN decoder fallo" }, { status: 500 });
  }
}
