import { priorityLabel, statusLabel } from "@/lib/format";

export function StatusBadge({ value }: { value: string }) {
  const tone: Record<string, string> = {
    HIGH: "red",
    MEDIUM: "orange",
    LOW: "neutral",
    IN_PROGRESS: "gold",
    WAITING_PARTS: "blue",
    QUALITY_CHECK: "purple",
    READY: "green",
    COMPLETED: "green",
    PAID: "green",
    CONFIRMED: "green",
    PENDING: "orange"
  };

  const label = ["HIGH", "MEDIUM", "LOW"].includes(value) ? priorityLabel(value) : statusLabel(value);
  return <span className={`badge ${tone[value] ?? "neutral"}`}>{label}</span>;
}
