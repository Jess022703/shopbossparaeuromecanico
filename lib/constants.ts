// Enum-like constants (SQLite has no native enum support).

export const ORDER_STATUSES = [
  "RECEIVED",
  "DIAGNOSING",
  "WAITING_PARTS",
  "IN_REPAIR",
  "READY",
  "DELIVERED",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const LINE_TYPES = ["LABOR", "PART"] as const;
export type LineType = (typeof LINE_TYPES)[number];

// Puerto Rico IVU (sales tax)
export const IVU_RATE = 0.115;

// Spanish labels + descriptions for each status (used in shop + client UI).
export const STATUS_META: Record<
  OrderStatus,
  { label: string; description: string; step: number }
> = {
  RECEIVED: {
    label: "Recibido",
    description: "Vehículo recibido en el taller",
    step: 1,
  },
  DIAGNOSING: {
    label: "Diagnóstico",
    description: "Diagnosticando el vehículo",
    step: 2,
  },
  WAITING_PARTS: {
    label: "Esperando Piezas",
    description: "En espera de piezas",
    step: 3,
  },
  IN_REPAIR: {
    label: "En Reparación",
    description: "Reparación en proceso",
    step: 4,
  },
  READY: {
    label: "Listo",
    description: "Listo para recoger",
    step: 5,
  },
  DELIVERED: {
    label: "Entregado",
    description: "Vehículo entregado",
    step: 6,
  },
};

export const TOTAL_STATUS_STEPS = ORDER_STATUSES.length;

export const GUIDE_CATEGORIES = [
  "Motor",
  "Frenos",
  "Suspensión",
  "Eléctrico",
  "Transmisión",
  "Refrigeración",
  "Otros",
] as const;

export function isOrderStatus(value: string): value is OrderStatus {
  return (ORDER_STATUSES as readonly string[]).includes(value);
}

export interface GuideStep {
  title: string;
  description: string;
  warning?: string;
}
