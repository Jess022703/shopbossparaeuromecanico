import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { STATUS_META, isOrderStatus } from "@/lib/constants";
import { computeTotals, formatCurrency } from "@/lib/calc";
import { formatDate } from "@/lib/format";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import VehicleNotes from "./VehicleNotes";

export const dynamic = "force-dynamic";

export default async function VehicleHistoryPage({
  params,
}: {
  params: { id: string };
}) {
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: params.id },
    include: {
      client: true,
      orders: {
        include: { lineItems: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!vehicle) notFound();

  const lifetimeValue = vehicle.orders.reduce(
    (sum, o) => sum + computeTotals(o.lineItems).total,
    0
  );

  return (
    <div>
      <PageHeader
        title={`${vehicle.make} ${vehicle.model}`}
        subtitle={`Historial completo · ${vehicle.year}`}
        action={
          <Link
            href="/vehicles"
            className="font-mono text-xs text-shop-400 hover:text-shop-200"
          >
            ← Vehículos
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-3">
        {/* Timeline */}
        <div className="lg:col-span-2">
          <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-shop-400">
            Línea de tiempo de servicios ({vehicle.orders.length})
          </h2>
          <ol className="relative border-l border-shop-700 pl-6">
            {vehicle.orders.map((o) => {
              const totals = computeTotals(o.lineItems);
              return (
                <li key={o.id} className="mb-6 last:mb-0">
                  <span className="absolute -left-[7px] mt-1.5 h-3 w-3 rounded-full border-2 border-guards bg-shop-950" />
                  <Link
                    href={`/orders/${o.id}`}
                    className="block rounded-lg border border-shop-800 bg-shop-900 p-4 transition hover:border-guards/50"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-mono text-xs text-shop-500">
                          {formatDate(o.createdAt)}
                        </div>
                        <div className="mt-0.5 text-sm text-shop-100">
                          {o.description}
                        </div>
                      </div>
                      <StatusBadge status={o.status} />
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-shop-800 pt-2 text-xs">
                      <span className="text-shop-500">
                        {o.lineItems.length} partida(s) ·{" "}
                        {isOrderStatus(o.status)
                          ? STATUS_META[o.status].description
                          : o.status}
                      </span>
                      <span className="font-mono font-bold text-shop-200">
                        {formatCurrency(totals.total)}
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
            {!vehicle.orders.length && (
              <li className="text-sm text-shop-500">
                Sin servicios registrados.
              </li>
            )}
          </ol>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <section className="rounded-lg border border-shop-800 bg-shop-900 p-5">
            <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-shop-400">
              Información
            </h2>
            <dl className="space-y-2 text-sm">
              <Field label="VIN" value={vehicle.vin} mono />
              <Field label="Placa" value={vehicle.plate ?? "—"} mono />
              <Field label="Año" value={String(vehicle.year)} />
              <Field label="Color" value={vehicle.color ?? "—"} />
              <Field label="Cliente" value={vehicle.client.name} />
              <Field label="Teléfono" value={vehicle.client.phone} />
              <Field label="Email" value={vehicle.client.email ?? "—"} />
            </dl>
          </section>

          <section className="rounded-lg border border-guards/40 bg-guards/10 p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest text-shop-400">
              Valor histórico de servicios
            </div>
            <div className="mt-1 font-mono text-2xl font-bold text-guards-light">
              {formatCurrency(lifetimeValue)}
            </div>
          </section>

          <section className="rounded-lg border border-shop-800 bg-shop-900 p-5">
            <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-shop-400">
              Notas del vehículo
            </h2>
            <VehicleNotes vehicleId={vehicle.id} notes={vehicle.notes ?? ""} />
          </section>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex justify-between gap-2">
      <dt className="text-shop-500">{label}</dt>
      <dd className={`text-right text-shop-200 ${mono ? "font-mono" : ""}`}>
        {value}
      </dd>
    </div>
  );
}
