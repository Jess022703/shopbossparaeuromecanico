import { NextResponse } from "next/server";
import { createInventoryItem, readData } from "@/lib/store";

export async function GET() {
  const data = await readData();
  return NextResponse.json(data.inventory);
}

export async function POST(request: Request) {
  const form = await request.formData();
  await createInventoryItem({
    partNumber: String(form.get("partNumber") ?? ""),
    description: String(form.get("description") ?? ""),
    brand: String(form.get("brand") ?? ""),
    quantity: Number(form.get("quantity") ?? 0),
    minQuantity: Number(form.get("minQuantity") ?? 0),
    unitCost: Number(form.get("unitCost") ?? 0),
    unitPrice: Number(form.get("unitPrice") ?? 0),
    location: String(form.get("location") ?? "")
  });

  return NextResponse.redirect(new URL("/inventory", request.url), 303);
}
