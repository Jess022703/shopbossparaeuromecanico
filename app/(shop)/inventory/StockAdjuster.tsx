"use client";

import { useState } from "react";

export default function StockAdjuster({
  partId,
  stock,
}: {
  partId: string;
  stock: number;
}) {
  const [value, setValue] = useState(stock);
  const [busy, setBusy] = useState(false);

  async function adjust(delta: number) {
    setBusy(true);
    const res = await fetch(`/api/parts/${partId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ delta }),
    });
    setBusy(false);
    if (res.ok) {
      const data = await res.json();
      setValue(data.stock);
    }
  }

  const low = value <= 2;

  return (
    <div className="flex items-center justify-end gap-1.5">
      <button
        onClick={() => adjust(-1)}
        disabled={busy || value === 0}
        className="h-6 w-6 rounded border border-shop-600 font-mono text-sm text-shop-300 hover:border-guards hover:text-guards-light disabled:opacity-30"
      >
        −
      </button>
      <span
        className={`w-8 text-center font-mono text-sm font-bold ${
          low ? "text-guards-light" : "text-shop-100"
        }`}
      >
        {value}
      </span>
      <button
        onClick={() => adjust(1)}
        disabled={busy}
        className="h-6 w-6 rounded border border-shop-600 font-mono text-sm text-shop-300 hover:border-guards hover:text-guards-light disabled:opacity-30"
      >
        +
      </button>
    </div>
  );
}
