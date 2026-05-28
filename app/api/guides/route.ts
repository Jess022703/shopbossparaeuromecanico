import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";
import { GuideStep } from "@/lib/constants";

function sanitizeSteps(raw: unknown): GuideStep[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((s) => s && typeof s.title === "string")
    .map((s) => ({
      title: String(s.title),
      description: String(s.description ?? ""),
      ...(s.warning ? { warning: String(s.warning) } : {}),
    }));
}

// POST: create a repair guide.
export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const data = await req.json().catch(() => null);
  if (!data || !data.title || !data.model || !data.category) {
    return NextResponse.json(
      { error: "Título, modelo y categoría son requeridos" },
      { status: 400 }
    );
  }
  const guide = await prisma.repairGuide.create({
    data: {
      title: String(data.title),
      model: String(data.model),
      year: data.year ? String(data.year) : null,
      category: String(data.category),
      notes: data.notes ? String(data.notes) : null,
      steps: JSON.stringify(sanitizeSteps(data.steps)),
    },
  });
  return NextResponse.json({ ok: true, id: guide.id });
}
