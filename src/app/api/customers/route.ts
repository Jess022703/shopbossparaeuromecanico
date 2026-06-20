import { NextResponse } from "next/server";
import { createCustomer, readData } from "@/lib/store";

export async function GET() {
  const data = await readData();
  return NextResponse.json(data.customers);
}

export async function POST(request: Request) {
  const form = await request.formData();
  await createCustomer({
    name: String(form.get("name") ?? ""),
    phone: String(form.get("phone") ?? ""),
    email: String(form.get("email") ?? ""),
    address: String(form.get("address") ?? ""),
    notes: String(form.get("notes") ?? "")
  });

  return NextResponse.redirect(new URL("/customers", request.url), 303);
}
