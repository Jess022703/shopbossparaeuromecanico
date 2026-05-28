import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ORDER_STATUSES, STATUS_META } from "@/lib/constants";
import { computeTotals, formatCurrency } from "@/lib/calc";
import { formatDateTime } from "@/lib/format";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const orders = await prisma.repairOrder.findMany({
    include: { vehicle: { include: { client: true } }, lineItems: true },
    orderBy: { updatedAt: "desc" },
  });

  const openOrders = orders.filter(
    (o) => o.status !== "DELIVERED"
  );
  const ready = orders.filter((o) => o.status === "READY");
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const todayActivity = orders.filter((o) => o.updatedAt >= startOfToday);

  const openValue = openOrders.reduce(
    (sum, o) => sum + computeTotals(o.lineItems).total,
    0
  );

  const byStatus = ORDER_STATUSES.map((s) => ({
    status: s,
    count: orders.filter((o) => o.status === s).length,
  }));

  const lowStock = await prisma.part.count({ where: { stock: { lte: 2 } } });

  return (
    <div>
      <PageHeader
        title="Panel de Control"
        subtitle={formatDateTime(new Date())}
      />

      <div className="p-6">
        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat label="Órdenes abiertas" value={openOrders.length} />
          <Stat label="Listos para recoger" value={ready.length} accent />
          <Stat
            label="Valor en taller"
            value={formatCurrency(openValue)}
            small
          />
          <Stat label="Piezas bajo stock" value={lowStock} />
        </div>

        {/* Status breakdown */}
        <div className="mt-6 rounded-lg border border-shop-800 bg-shop-900 p-4">
          <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-shop-400">
            Órdenes por estado
          </h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {byStatus.map((b) => (
              <div
                key={b.status}
                className="rounded border border-shop-700 bg-shop-950 p-3 text-center"
              >
                <div className="font-mono text-2xl font-bold text-shop-100">
                  {b.count}
                </div>
                <div className="mt-1 text-[10px] uppercase tracking-wide text-shop-400">
                  {STATUS_META[b.status].label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today / recent activity */}
        <div className="mt-6 rounded-lg border border-shop-800 bg-shop-900">
          <div className="flex items-center justify-between border-b border-shop-800 px-4 py-3">
            <h2 className="font-mono text-xs uppercase tracking-widest text-shop-400">
              Actividad de hoy ({todayActivity.length})
            </h2>
            <Link
              href="/orders"
              className="font-mono text-xs text-guards-light hover:underline"
            >
              Ver todas →
            </Link>
          </div>
          {(todayActivity.length ? todayActivity : openOrders)
            .slice(0, 8)
            .map((o) => (
              <Link
                key={o.id}
                href={`/orders/${o.id}`}
                className="flex items-center justify-between border-b border-shop-800/60 px-4 py-3 last:border-0 hover:bg-shop-800/50"
              >
                <div>
                  <div className="font-mono text-sm text-shop-100">
                    {o.vehicle.make} {o.vehicle.model}{" "}
                    <span className="text-shop-500">· {o.vehicle.year}</span>
                  </div>
                  <div className="text-xs text-shop-400">
                    {o.vehicle.client.name} · {o.description}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-shop-400">
                    {formatCurrency(computeTotals(o.lineItems).total)}
                  </span>
                  <StatusBadge status={o.status} />
                </div>
              </Link>
            ))}
          {!openOrders.length && (
            <div className="px-4 py-8 text-center text-sm text-shop-500">
              No hay órdenes. Cree una nueva para comenzar.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
  small,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
  small?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-4 ${
        accent
          ? "border-guards/40 bg-guards/10"
          : "border-shop-800 bg-shop-900"
      }`}
    >
      <div
        className={`font-mono font-bold text-shop-100 ${
          small ? "text-xl" : "text-3xl"
        } ${accent ? "text-guards-light" : ""}`}
      >
        {value}
      </div>
      <div className="mt-1 text-[10px] uppercase tracking-widest text-shop-400">
        {label}
      </div>
    </div>
  );
}
