import { NextResponse } from "next/server";
import { createVehicle, readData } from "@/lib/store";

export async function GET() {
  const data = await readData();
  return NextResponse.json(data.vehicles);
}

export async function POST(request: Request) {
  const form = await request.formData();
  await createVehicle({
    customerId: String(form.get("customerId") ?? ""),
    vin: String(form.get("vin") ?? ""),
    year: Number(form.get("year") ?? 0),
    make: String(form.get("make") ?? ""),
    model: String(form.get("model") ?? ""),
    generation: String(form.get("generation") ?? ""),
    mileage: Number(form.get("mileage") ?? 0)
  });

  return NextResponse.redirect(new URL("/vehicles", request.url), 303);
}
