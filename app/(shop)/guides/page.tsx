import { prisma } from "@/lib/prisma";
import { parseSteps } from "@/lib/guides";
import PageHeader from "@/components/PageHeader";
import GuidesManager from "./GuidesManager";

export const dynamic = "force-dynamic";

export default async function GuidesPage() {
  const rows = await prisma.repairGuide.findMany({
    orderBy: { createdAt: "desc" },
  });
  const guides = rows.map((g) => ({
    id: g.id,
    title: g.title,
    model: g.model,
    year: g.year,
    category: g.category,
    notes: g.notes,
    steps: parseSteps(g.steps),
  }));

  return (
    <div>
      <PageHeader
        title="Guías de Reparación"
        subtitle={`${guides.length} guías · administración`}
      />
      <div className="p-6">
        <GuidesManager initialGuides={guides} />
      </div>
    </div>
  );
}
