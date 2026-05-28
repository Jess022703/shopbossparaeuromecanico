import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/calc";
import PageHeader from "@/components/PageHeader";
import StockAdjuster from "./StockAdjuster";

export const dynamic = "force-dynamic";

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = (searchParams.q ?? "").trim();

  const parts = await prisma.part.findMany({
    where: q
      ? {
          OR: [
            { partNumber: { contains: q } },
            { description: { contains: q } },
            { brand: { contains: q } },
            { compatibleWith: { contains: q } },
          ],
        }
      : undefined,
    orderBy: { description: "asc" },
  });

  const lowCount = parts.filter((p) => p.stock <= 2).length;
  const totalValue = parts.reduce((s, p) => s + p.stock * p.unitCost, 0);

  return (
    <div>
      <PageHeader
        title="Inventario de Piezas"
        subtitle={`${parts.length} piezas · ${lowCount} bajo stock · valor ${formatCurrency(
          totalValue
        )}`}
      />
      <div className="p-6">
        <form className="mb-5" action="/inventory">
          <input
            name="q"
            defaultValue={q}
            placeholder="Buscar por número, descripción, marca o compatibilidad…"
            className="w-full max-w-md rounded border border-shop-600 bg-shop-950 px-4 py-2.5 font-mono text-sm text-shop-100 outline-none focus:border-guards"
          />
        </form>

        <div className="overflow-hidden rounded-lg border border-shop-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-shop-900 font-mono text-[10px] uppercase tracking-wider text-shop-400">
              <tr>
                <th className="px-4 py-2.5">No. Pieza</th>
                <th className="px-4 py-2.5">Descripción</th>
                <th className="px-4 py-2.5">Marca</th>
                <th className="px-4 py-2.5">Compatible</th>
                <th className="px-4 py-2.5">Ubicación</th>
                <th className="px-4 py-2.5 text-right">Costo</th>
                <th className="px-4 py-2.5 text-center">Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-shop-800 bg-shop-950">
              {parts.map((p) => (
                <tr
                  key={p.id}
                  className={`hover:bg-shop-900/60 ${
                    p.stock <= 2 ? "bg-guards/5" : ""
                  }`}
                >
                  <td className="px-4 py-3 font-mono text-xs text-shop-200">
                    {p.partNumber}
                  </td>
                  <td className="px-4 py-3 text-shop-100">{p.description}</td>
                  <td className="px-4 py-3 text-shop-400">{p.brand ?? "—"}</td>
                  <td className="px-4 py-3 text-xs text-shop-400">
                    {p.compatibleWith ?? "—"}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-shop-400">
                    {p.location ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-shop-300">
                    {formatCurrency(p.unitCost)}
                  </td>
                  <td className="px-4 py-3">
                    <StockAdjuster partId={p.id} stock={p.stock} />
                  </td>
                </tr>
              ))}
              {!parts.length && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-shop-500">
                    {q ? `Sin resultados para "${q}".` : "Inventario vacío."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
