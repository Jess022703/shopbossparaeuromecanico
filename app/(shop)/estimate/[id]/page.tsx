import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { IVU_RATE } from "@/lib/constants";
import { computeTotals, formatCurrency } from "@/lib/calc";
import { SHOP } from "@/lib/shop";
import { formatDate } from "@/lib/format";
import PageHeader from "@/components/PageHeader";
import LineItemsEditor from "../../orders/[id]/LineItemsEditor";
import OrderControls from "../../orders/[id]/OrderControls";

export const dynamic = "force-dynamic";

export default async function EstimatePage({
  params,
}: {
  params: { id: string };
}) {
  const order = await prisma.repairOrder.findUnique({
    where: { id: params.id },
    include: { vehicle: { include: { client: true } }, lineItems: true },
  });
  if (!order) notFound();

  const totals = computeTotals(order.lineItems);

  return (
    <div>
      <PageHeader
        title="Estimado"
        subtitle={`${order.vehicle.make} ${order.vehicle.model} ${order.vehicle.year} · ${order.vehicle.client.name}`}
        action={
          <div className="flex items-center gap-2">
            <Link
              href={`/orders/${order.id}`}
              className="rounded border border-shop-600 px-3 py-1.5 font-mono text-xs text-shop-200 hover:border-shop-400"
            >
              ← Orden
            </Link>
            <a
              href={`/api/estimate/${order.id}/pdf`}
              target="_blank"
              rel="noreferrer"
              className="rounded bg-guards px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-white hover:bg-guards-dark"
            >
              ⬇ Exportar PDF
            </a>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <section className="rounded-lg border border-shop-800 bg-shop-900 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-mono text-xs uppercase tracking-widest text-shop-400">
                Partidas del estimado
              </h2>
              {order.approved ? (
                <span className="rounded border border-green-700 bg-green-900/40 px-2 py-0.5 font-mono text-xs text-green-300">
                  Aprobado
                </span>
              ) : (
                <span className="rounded border border-shop-600 px-2 py-0.5 font-mono text-xs text-shop-400">
                  Pendiente de aprobación
                </span>
              )}
            </div>
            <LineItemsEditor orderId={order.id} items={order.lineItems} />
          </section>
        </div>

        <div className="space-y-6">
          {/* Summary card resembling the printed estimate */}
          <section className="rounded-lg border border-shop-800 bg-shop-900 p-5">
            <div className="mb-3 border-b border-shop-800 pb-3">
              <div className="font-mono text-sm font-bold text-shop-100">
                {SHOP.name}
              </div>
              <div className="text-xs text-shop-500">
                {SHOP.phone} · {SHOP.email}
              </div>
              <div className="mt-1 text-[10px] text-shop-500">
                Estimado generado {formatDate(new Date())}
              </div>
            </div>
            <dl className="space-y-1.5 font-mono text-sm">
              <div className="flex justify-between text-shop-300">
                <dt>Subtotal</dt>
                <dd>{formatCurrency(totals.subtotal)}</dd>
              </div>
              <div className="flex justify-between text-shop-300">
                <dt>IVU ({(IVU_RATE * 100).toFixed(1)}%)</dt>
                <dd>{formatCurrency(totals.tax)}</dd>
              </div>
              <div className="flex justify-between border-t border-shop-800 pt-2 text-base font-bold text-shop-100">
                <dt>Total</dt>
                <dd>{formatCurrency(totals.total)}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-lg border border-shop-800 bg-shop-900 p-5">
            <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-shop-400">
              Aprobación y notas
            </h2>
            <OrderControls
              orderId={order.id}
              notes={order.notes ?? ""}
              approved={order.approved}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
