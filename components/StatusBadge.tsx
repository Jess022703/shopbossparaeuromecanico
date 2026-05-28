import { OrderStatus, STATUS_META, isOrderStatus } from "@/lib/constants";

const COLORS: Record<OrderStatus, string> = {
  RECEIVED: "bg-shop-600 text-shop-100 border-shop-500",
  DIAGNOSING: "bg-amber-900/40 text-amber-300 border-amber-700",
  WAITING_PARTS: "bg-orange-900/40 text-orange-300 border-orange-700",
  IN_REPAIR: "bg-blue-900/40 text-blue-300 border-blue-700",
  READY: "bg-green-900/40 text-green-300 border-green-700",
  DELIVERED: "bg-shop-700 text-shop-300 border-shop-600",
};

export default function StatusBadge({ status }: { status: string }) {
  const valid = isOrderStatus(status);
  const meta = valid ? STATUS_META[status] : null;
  const color = valid ? COLORS[status] : "bg-shop-700 text-shop-300 border-shop-600";
  return (
    <span
      className={`inline-flex items-center rounded border px-2 py-0.5 font-mono text-xs uppercase tracking-wide ${color}`}
    >
      {meta?.label ?? status}
    </span>
  );
}
