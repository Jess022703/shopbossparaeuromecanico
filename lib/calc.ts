import { IVU_RATE } from "./constants";

export interface LineItemLike {
  quantity: number;
  unitPrice: number;
}

export interface EstimateTotals {
  subtotal: number;
  tax: number;
  total: number;
}

// Compute subtotal, IVU tax (11.5%) and total for a set of line items.
export function computeTotals(items: LineItemLike[]): EstimateTotals {
  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const tax = subtotal * IVU_RATE;
  const total = subtotal + tax;
  return {
    subtotal: round2(subtotal),
    tax: round2(tax),
    total: round2(total),
  };
}

export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}
