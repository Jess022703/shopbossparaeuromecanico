"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Editable notes + client-approval toggle for an order.
export default function OrderControls({
  orderId,
  notes,
  approved,
}: {
  orderId: string;
  notes: string;
  approved: boolean;
}) {
  const router = useRouter();
  const [value, setValue] = useState(notes);
  const [isApproved, setIsApproved] = useState(approved);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  async function patch(payload: object) {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setSavedAt(new Date().toLocaleTimeString("es-PR"));
      router.refresh();
    }
  }

  async function toggleApproved() {
    const next = !isApproved;
    setIsApproved(next);
    await patch({ approved: next });
  }

  return (
    <div className="space-y-3">
      <label className="flex cursor-pointer items-center gap-2">
        <input
          type="checkbox"
          checked={isApproved}
          onChange={toggleApproved}
          className="h-4 w-4 accent-guards"
        />
        <span className="font-mono text-sm text-shop-200">
          Estimado aprobado por el cliente
        </span>
      </label>

      <div>
        <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-shop-500">
          Notas (visibles para el cliente)
        </label>
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => patch({ notes: value })}
          rows={3}
          className="w-full rounded border border-shop-600 bg-shop-950 px-3 py-2 text-sm text-shop-100 outline-none focus:border-guards"
          placeholder="Notas para el cliente..."
        />
        {savedAt && (
          <p className="mt-1 font-mono text-[10px] text-green-400">
            Guardado {savedAt}
          </p>
        )}
      </div>
    </div>
  );
}
