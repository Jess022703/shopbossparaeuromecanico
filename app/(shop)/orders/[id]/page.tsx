import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { STATUS_META, isOrderStatus } from "@/lib/constants";
import { formatDateTime } from "@/lib/format";
import { qrDataUrl, trackUrl } from "@/lib/qr";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import StatusProgress from "@/components/StatusProgress";
import StatusUpdater from "./StatusUpdater";
import LineItemsEditor from "./LineItemsEditor";
import OrderControls from "./OrderControls";
import QrCard from "./QrCard";

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const order = await prisma.repairOrder.findUnique({
    where: { id: params.id },
    include: {
      vehicle: { include: { client: true } },
      lineItems: true,
      messages: { orderBy: { sentAt: "desc" } },
    },
  });
  if (!order) notFound();

  const dataUrl = await qrDataUrl(order.qrToken);
  const url = trackUrl(order.qrToken);

  return (
    <div>
      <PageHeader
        title={`${order.vehicle.make} ${order.vehicle.model}`}
        subtitle={`Orden · ${order.vehicle.year} · ${
          order.vehicle.plate ?? order.vehicle.vin
        }`}
        action={
          <div className="flex items-center gap-2">
            <StatusBadge status={order.status} />
            <Link
              href={`/estimate/${order.id}`}
              className="rounded border border-shop-600 px-3 py-1.5 font-mono text-xs text-shop-200 hover:border-guards hover:text-guards-light"
            >
              Estimado / PDF
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Progress */}
          <section className="rounded-lg border border-shop-800 bg-shop-900 p-5">
            <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-shop-400">
              Progreso
            </h2>
            <StatusProgress status={order.status} />
            <p className="mt-4 text-xs text-shop-500">
              {isOrderStatus(order.status)
                ? STATUS_META[order.status].description
                : order.status}{" "}
              · Actualizado {formatDateTime(order.updatedAt)}
            </p>
          </section>

          {/* Status updater */}
          <section className="rounded-lg border border-shop-800 bg-shop-900 p-5">
            <h2 className="mb-1 font-mono text-xs uppercase tracking-widest text-shop-400">
              Cambiar estado
            </h2>
            <p className="mb-4 text-xs text-shop-500">
              Al cambiar el estado se envía un mensaje automático al cliente.
            </p>
            <StatusUpdater orderId={order.id} current={order.status} />
          </section>

          {/* Line items / estimate */}
          <section className="rounded-lg border border-shop-800 bg-shop-900 p-5">
            <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-shop-400">
              Estimado — Partidas
            </h2>
            <LineItemsEditor orderId={order.id} items={order.lineItems} />
          </section>

          {/* Messages log */}
          <section className="rounded-lg border border-shop-800 bg-shop-900 p-5">
            <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-shop-400">
              Mensajes enviados ({order.messages.length})
            </h2>
            <ul className="space-y-2">
              {order.messages.map((m) => (
                <li
                  key={m.id}
                  className="rounded border border-shop-800 bg-shop-950 p-3 text-sm"
                >
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-shop-500">
                      {m.channel}
                    </span>
                    <span className="font-mono text-[10px] text-shop-500">
                      {formatDateTime(m.sentAt)}
                    </span>
                  </div>
                  <p className="text-shop-200">{m.body}</p>
                </li>
              ))}
              {!order.messages.length && (
                <li className="py-3 text-center text-sm text-shop-500">
                  Aún no se han enviado mensajes.
                </li>
              )}
            </ul>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <section className="rounded-lg border border-shop-800 bg-shop-900 p-5">
            <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-shop-400">
              Cliente y vehículo
            </h2>
            <dl className="space-y-2 text-sm">
              <Field label="Cliente" value={order.vehicle.client.name} />
              <Field label="Teléfono" value={order.vehicle.client.phone} />
              <Field
                label="Email"
                value={order.vehicle.client.email ?? "—"}
              />
              <Field label="VIN" value={order.vehicle.vin} mono />
              <Field label="Placa" value={order.vehicle.plate ?? "—"} mono />
              <Field label="Color" value={order.vehicle.color ?? "—"} />
            </dl>
            <Link
              href={`/vehicles/${order.vehicle.id}`}
              className="mt-3 inline-block font-mono text-xs text-guards-light hover:underline"
            >
              Ver historial del vehículo →
            </Link>
          </section>

          <section className="rounded-lg border border-shop-800 bg-shop-900 p-5">
            <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-shop-400">
              Trabajo
            </h2>
            <p className="mb-4 text-sm text-shop-200">{order.description}</p>
            <OrderControls
              orderId={order.id}
              notes={order.notes ?? ""}
              approved={order.approved}
            />
          </section>

          <QrCard
            dataUrl={dataUrl}
            trackUrl={url}
            vehicle={`${order.vehicle.make} ${order.vehicle.model} ${order.vehicle.year}`}
          />
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
