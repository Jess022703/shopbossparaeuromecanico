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

// PATCH: update a guide.
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const data = await req.json().catch(() => ({}));
  const update: Record<string, unknown> = {};
  if (data.title) update.title = String(data.title);
  if (data.model) update.model = String(data.model);
  if (data.category) update.category = String(data.category);
  if ("year" in data) update.year = data.year ? String(data.year) : null;
  if ("notes" in data) update.notes = data.notes ? String(data.notes) : null;
  if ("steps" in data) update.steps = JSON.stringify(sanitizeSteps(data.steps));

  const guide = await prisma.repairGuide
    .update({ where: { id: params.id }, data: update })
    .catch(() => null);
  if (!guide) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }
  return NextResponse.json({ ok: true, id: guide.id });
}

// DELETE: remove a guide.
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  await prisma.repairGuide.delete({ where: { id: params.id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
