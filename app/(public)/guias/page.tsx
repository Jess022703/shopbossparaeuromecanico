import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { parseSteps } from "@/lib/guides";
import { GUIDE_CATEGORIES } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function PublicGuidesPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string };
}) {
  const q = (searchParams.q ?? "").trim();
  const category = searchParams.category ?? "";

  const rows = await prisma.repairGuide.findMany({
    where: {
      AND: [
        category ? { category } : {},
        q
          ? {
              OR: [
                { title: { contains: q } },
                { model: { contains: q } },
                { year: { contains: q } },
              ],
            }
          : {},
      ],
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold">Guías de reparación</h1>
      <p className="mt-1 text-gray-500">
        Busque por modelo, año o categoría.
      </p>

      <form className="mt-5 flex flex-col gap-2 sm:flex-row" action="/guias">
        <input
          name="q"
          defaultValue={q}
          placeholder="Modelo o año (ej. 911, 2019)…"
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-guards"
        />
        <select
          name="category"
          defaultValue={category}
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-guards"
        >
          <option value="">Todas las categorías</option>
          {GUIDE_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button className="rounded-lg bg-guards px-5 py-2.5 text-sm font-semibold text-white hover:bg-guards-dark">
          Buscar
        </button>
      </form>

      <div className="mt-6 space-y-3">
        {rows.map((g) => {
          const steps = parseSteps(g.steps);
          return (
            <Link
              key={g.id}
              href={`/guias/${g.id}`}
              className="block rounded-xl border border-gray-200 bg-white p-5 transition hover:border-guards/40"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold">{g.title}</h2>
                  <p className="mt-0.5 text-sm text-gray-500">
                    {g.model} · {g.year ?? "—"} · {steps.length} pasos
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                  {g.category}
                </span>
              </div>
            </Link>
          );
        })}
        {!rows.length && (
          <p className="py-10 text-center text-gray-400">
            No se encontraron guías.
          </p>
        )}
      </div>
    </main>
  );
}
