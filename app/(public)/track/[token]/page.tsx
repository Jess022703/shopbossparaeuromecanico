import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { STATUS_META, isOrderStatus, OrderStatus } from "@/lib/constants";
import { formatDateTime } from "@/lib/format";
import { SHOP } from "@/lib/shop";
import StatusProgress from "@/components/StatusProgress";

export const dynamic = "force-dynamic";

// Big reassuring status icon per status.
const STATUS_ICON: Record<OrderStatus, string> = {
  RECEIVED: "🚗",
  DIAGNOSING: "🔍",
  WAITING_PARTS: "📦",
  IN_REPAIR: "🔧",
  READY: "✅",
  DELIVERED: "🎉",
};

export default async function TrackPage({
  params,
}: {
  params: { token: string };
}) {
  const order = await prisma.repairOrder.findUnique({
    where: { qrToken: params.token },
    include: { vehicle: true },
  });
  if (!order) notFound();

  const status = order.status;
  const meta = isOrderStatus(status) ? STATUS_META[status as OrderStatus] : null;
  const icon = isOrderStatus(status) ? STATUS_ICON[status as OrderStatus] : "🚗";
  const isReady = status === "READY";

  return (
    <main className="mx-auto max-w-md px-4 py-8">
      {/* Vehicle */}
      <div className="text-center">
        <p className="text-xs uppercase tracking-widest text-gray-400">
          Su vehículo
        </p>
        <h1 className="mt-1 text-2xl font-bold">
          {order.vehicle.make} {order.vehicle.model}
        </h1>
        <p className="text-sm text-gray-500">
          {order.vehicle.year}
          {order.vehicle.color ? ` · ${order.vehicle.color}` : ""}
        </p>
      </div>

      {/* Big status */}
      <div
        className={`mt-8 rounded-2xl border p-8 text-center ${
          isReady
            ? "border-green-200 bg-green-50"
            : "border-gray-200 bg-white"
        }`}
      >
        <div className="text-6xl">{icon}</div>
        <h2
          className={`mt-4 text-2xl font-bold ${
            isReady ? "text-green-700" : "text-guards"
          }`}
        >
          {meta?.label ?? status}
        </h2>
        <p className="mt-1 text-gray-500">{meta?.description ?? ""}</p>
      </div>

      {/* Progress */}
      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6">
        <StatusProgress status={status} light />
      </div>

      {/* Notes from shop */}
      {order.notes && (
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-xs uppercase tracking-widest text-gray-400">
            Nota del taller
          </p>
          <p className="mt-2 text-gray-700">{order.notes}</p>
        </div>
      )}

      <p className="mt-6 text-center text-xs text-gray-400">
        Última actualización: {formatDateTime(order.updatedAt)}
      </p>

      {isReady && (
        <div className="mt-6 rounded-2xl bg-guards p-5 text-center text-white">
          <p className="font-semibold">¡Su vehículo está listo!</p>
          <p className="mt-1 text-sm text-white/90">
            Visítenos en horario de {SHOP.hours.toLowerCase()}.
          </p>
          <a
            href={`tel:${SHOP.phone}`}
            className="mt-3 inline-block rounded-lg bg-white px-4 py-2 text-sm font-semibold text-guards"
          >
            Llamar: {SHOP.phone}
          </a>
        </div>
      )}
    </main>
  );
}
