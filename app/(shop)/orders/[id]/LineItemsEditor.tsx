"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IVU_RATE } from "@/lib/constants";
import { computeTotals, formatCurrency } from "@/lib/calc";

interface Item {
  id: string;
  type: string;
  description: string;
  quantity: number;
  unitPrice: number;
  partNumber: string | null;
}

export default function LineItemsEditor({
  orderId,
  items,
}: {
  orderId: string;
  items: Item[];
}) {
  const router = useRouter();
  const [type, setType] = useState<"LABOR" | "PART">("LABOR");
  const [description, setDescription] = useState("");
  const [partNumber, setPartNumber] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [unitPrice, setUnitPrice] = useState("");
  const [busy, setBusy] = useState(false);

  const totals = computeTotals(items);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await fetch(`/api/orders/${orderId}/line-items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        description,
        partNumber: type === "PART" ? partNumber : null,
        quantity: Number(quantity),
        unitPrice: Number(unitPrice),
      }),
    });
    setBusy(false);
    if (res.ok) {
      setDescription("");
      setPartNumber("");
      setQuantity("1");
      setUnitPrice("");
      router.refresh();
    }
  }

  async function remove(id: string) {
    await fetch(`/api/line-items/${id}`, { method: "DELETE" });
    router.refresh();
  }

  const inputCls =
    "w-full rounded border border-shop-600 bg-shop-950 px-2 py-1.5 font-mono text-sm text-shop-100 outline-none focus:border-guards";

  return (
    <div>
      {/* Existing items */}
      <table className="w-full text-left text-sm">
        <thead className="font-mono text-[10px] uppercase tracking-wider text-shop-500">
          <tr className="border-b border-shop-800">
            <th className="py-2">Tipo</th>
            <th className="py-2">Descripción</th>
            <th className="py-2 text-right">Cant.</th>
            <th className="py-2 text-right">Precio</th>
            <th className="py-2 text-right">Subtotal</th>
            <th className="py-2"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-shop-800/60">
          {items.map((it) => (
            <tr key={it.id}>
              <td className="py-2">
                <span
                  className={`rounded px-1.5 py-0.5 font-mono text-[10px] ${
                    it.type === "LABOR"
                      ? "bg-blue-900/40 text-blue-300"
                      : "bg-shop-700 text-shop-200"
                  }`}
                >
                  {it.type === "LABOR" ? "MANO" : "PIEZA"}
                </span>
              </td>
              <td className="py-2 text-shop-200">
                {it.description}
                {it.partNumber && (
                  <span className="ml-1 font-mono text-xs text-shop-500">
                    [{it.partNumber}]
                  </span>
                )}
              </td>
              <td className="py-2 text-right font-mono text-shop-300">
                {it.quantity}
              </td>
              <td className="py-2 text-right font-mono text-shop-300">
                {formatCurrency(it.unitPrice)}
              </td>
              <td className="py-2 text-right font-mono text-shop-100">
                {formatCurrency(it.quantity * it.unitPrice)}
              </td>
              <td className="py-2 text-right">
                <button
                  onClick={() => remove(it.id)}
                  className="font-mono text-xs text-shop-500 hover:text-guards-light"
                  title="Eliminar"
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
          {!items.length && (
            <tr>
              <td colSpan={6} className="py-4 text-center text-shop-500">
                Sin partidas. Agregue mano de obra o piezas.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Totals */}
      <div className="mt-3 ml-auto w-full max-w-xs space-y-1 border-t border-shop-800 pt-3 font-mono text-sm">
        <Row label="Subtotal" value={formatCurrency(totals.subtotal)} />
        <Row
          label={`IVU (${(IVU_RATE * 100).toFixed(1)}%)`}
          value={formatCurrency(totals.tax)}
        />
        <Row label="Total" value={formatCurrency(totals.total)} bold />
      </div>

      {/* Add form */}
      <form
        onSubmit={add}
        className="mt-5 rounded border border-shop-700 bg-shop-950 p-3"
      >
        <div className="mb-2 flex gap-2">
          <button
            type="button"
            onClick={() => setType("LABOR")}
            className={`flex-1 rounded py-1.5 font-mono text-xs ${
              type === "LABOR"
                ? "bg-guards text-white"
                : "bg-shop-800 text-shop-300"
            }`}
          >
            Mano de obra
          </button>
          <button
            type="button"
            onClick={() => setType("PART")}
            className={`flex-1 rounded py-1.5 font-mono text-xs ${
              type === "PART"
                ? "bg-guards text-white"
                : "bg-shop-800 text-shop-300"
            }`}
          >
            Pieza
          </button>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-12">
          <input
            className={`${inputCls} sm:col-span-5`}
            placeholder="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          {type === "PART" && (
            <input
              className={`${inputCls} sm:col-span-3`}
              placeholder="No. de pieza"
              value={partNumber}
              onChange={(e) => setPartNumber(e.target.value)}
            />
          )}
          <input
            className={`${inputCls} ${type === "PART" ? "sm:col-span-1" : "sm:col-span-2"}`}
            type="number"
            step="0.1"
            min="0.1"
            placeholder={type === "LABOR" ? "Horas" : "Cant."}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
          <input
            className={`${inputCls} ${type === "PART" ? "sm:col-span-2" : "sm:col-span-3"}`}
            type="number"
            step="0.01"
            min="0"
            placeholder={type === "LABOR" ? "$/hora" : "$/unidad"}
            value={unitPrice}
            onChange={(e) => setUnitPrice(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={busy}
            className="rounded bg-guards px-3 py-1.5 font-mono text-xs font-bold text-white hover:bg-guards-dark disabled:opacity-50 sm:col-span-2"
          >
            + Agregar
          </button>
        </div>
      </form>
    </div>
  );
}

function Row({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div
      className={`flex justify-between ${
        bold ? "text-base font-bold text-shop-100" : "text-shop-300"
      }`}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
