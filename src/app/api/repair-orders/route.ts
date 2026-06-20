import { NextResponse } from "next/server";
import { createRepairOrder, readData, updateRepairOrderStatus } from "@/lib/store";
import type { RepairOrder } from "@/lib/types";

export async function GET() {
  const data = await readData();
  return NextResponse.json(data.repairOrders);
}

export async function POST(request: Request) {
  const form = await request.formData();
  const method = String(form.get("_method") ?? "");

  if (method === "status") {
    await updateRepairOrderStatus(String(form.get("id") ?? ""), String(form.get("status") ?? "PENDING") as RepairOrder["status"]);
    return NextResponse.redirect(new URL("/repair-orders", request.url), 303);
  }

  await createRepairOrder({
    customerId: String(form.get("customerId") ?? ""),
    vehicleId: String(form.get("vehicleId") ?? ""),
    complaint: String(form.get("complaint") ?? ""),
    priority: String(form.get("priority") ?? "MEDIUM") as RepairOrder["priority"],
    labor: Number(form.get("labor") ?? 0),
    parts: Number(form.get("parts") ?? 0)
  });

  return NextResponse.redirect(new URL("/repair-orders", request.url), 303);
}
