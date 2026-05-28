import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { parseSteps } from "@/lib/guides";
import GuideViewer from "./GuideViewer";

export const dynamic = "force-dynamic";

export default async function GuideDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const guide = await prisma.repairGuide.findUnique({
    where: { id: params.id },
  });
  if (!guide) notFound();

  const steps = parseSteps(guide.steps);

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <Link
        href="/guias"
        className="text-sm text-gray-500 hover:text-guards"
      >
        ← Todas las guías
      </Link>

      <div className="mt-3">
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
          {guide.category}
        </span>
        <h1 className="mt-2 text-2xl font-bold">{guide.title}</h1>
        <p className="mt-1 text-gray-500">
          {guide.model} · {guide.year ?? "—"}
        </p>
      </div>

      {guide.notes && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <strong>Nota:</strong> {guide.notes}
        </div>
      )}

      <div className="mt-6">
        <GuideViewer steps={steps} />
      </div>
    </main>
  );
}
