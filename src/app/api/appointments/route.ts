import { NextResponse } from "next/server";
import { createAppointment, readData } from "@/lib/store";

export async function GET() {
  const data = await readData();
  return NextResponse.json(data.appointments);
}

export async function POST(request: Request) {
  const form = await request.formData();
  await createAppointment({
    customerName: String(form.get("customerName") ?? ""),
    vehicleInfo: String(form.get("vehicleInfo") ?? ""),
    serviceType: String(form.get("serviceType") ?? ""),
    scheduledAt: new Date(String(form.get("scheduledAt") ?? "")).toISOString(),
    status: "CONFIRMED"
  });

  return NextResponse.redirect(new URL("/appointments", request.url), 303);
}
