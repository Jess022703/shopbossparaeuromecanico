import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ORDER_STATUSES, STATUS_META, isOrderStatus } from "@/lib/constants";
import { computeTotals, formatCurrency } from "@/lib/calc";
import { formatDate } from "@/lib/format";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";

export const dynamic = "force-dynamic";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const statusFilter =
    searchParams.status && isOrderStatus(searchParams.status)
      ? searchParams.status
      : undefined;

  const orders = await prisma.repairOrder.findMany({
    where: statusFilter ? { status: statusFilter } : undefined,
    include: { vehicle: { include: { client: true } }, lineItems: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <PageHeader
        title="Órdenes de Reparación"
        subtitle={`${orders.length} ${statusFilter ? "filtradas" : "en total"}`}
        action={
          <Link
            href="/orders/new"
            className="rounded bg-guards px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-white hover:bg-guards-dark"
          >
            + Nueva
          </Link>
        }
      />

      <div className="p-6">
        {/* Filter chips */}
        <div className="mb-4 flex flex-wrap gap-2">
          <FilterChip label="Todas" href="/orders" active={!statusFilter} />
          {ORDER_STATUSES.map((s) => (
            <FilterChip
              key={s}
              label={STATUS_META[s].label}
              href={`/orders?status=${s}`}
              active={statusFilter === s}
            />
          ))}
        </div>

        <div className="overflow-hidden rounded-lg border border-shop-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-shop-900 font-mono text-[10px] uppercase tracking-wider text-shop-400">
              <tr>
                <th className="px-4 py-2.5">Vehículo</th>
                <th className="px-4 py-2.5">Cliente</th>
                <th className="px-4 py-2.5">Descripción</th>
                <th className="px-4 py-2.5">Estado</th>
                <th className="px-4 py-2.5 text-right">Total</th>
                <th className="px-4 py-2.5 text-right">Actualizado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-shop-800 bg-shop-950">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-shop-900/60">
                  <td className="px-4 py-3">
                    <Link
                      href={`/orders/${o.id}`}
                      className="font-mono text-shop-100 hover:text-guards-light"
                    >
                      {o.vehicle.make} {o.vehicle.model}
                    </Link>
                    <div className="text-xs text-shop-500">
                      {o.vehicle.year} · {o.vehicle.plate ?? o.vehicle.vin}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-shop-300">
                    {o.vehicle.client.name}
                  </td>
                  <td className="max-w-xs truncate px-4 py-3 text-shop-400">
                    {o.description}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-shop-200">
                    {formatCurrency(computeTotals(o.lineItems).total)}
                  </td>
                  <td className="px-4 py-3 text-right text-xs text-shop-500">
                    {formatDate(o.updatedAt)}
                  </td>
                </tr>
              ))}
              {!orders.length && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-shop-500"
                  >
                    No hay órdenes en este estado.
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

function FilterChip({
  label,
  href,
  active,
}: {
  label: string;
  href: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-3 py-1 font-mono text-xs transition ${
        active
          ? "border-guards bg-guards/15 text-guards-light"
          : "border-shop-700 text-shop-400 hover:border-shop-500 hover:text-shop-200"
      }`}
    >
      {label}
    </Link>
  );
}
