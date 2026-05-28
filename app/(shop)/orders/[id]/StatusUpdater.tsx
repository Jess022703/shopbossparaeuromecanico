"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ORDER_STATUSES, STATUS_META } from "@/lib/constants";

export default function StatusUpdater({
  orderId,
  current,
}: {
  orderId: string;
  current: string;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState<string | null>(null);
  const [note, setNote] = useState<string>("");

  async function setStatus(status: string) {
    if (status === current) return;
    setSaving(status);
    setNote("");
    const res = await fetch(`/api/orders/${orderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setSaving(null);
    if (res.ok) {
      const data = await res.json();
      setNote(
        data.message?.delivered
          ? "Estado actualizado · email enviado al cliente"
          : "Estado actualizado · mensaje registrado (sin email)"
      );
      router.refresh();
    } else {
      setNote("Error al actualizar");
    }
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {ORDER_STATUSES.map((s) => {
          const active = s === current;
          return (
            <button
              key={s}
              onClick={() => setStatus(s)}
              disabled={!!saving}
              className={`rounded border px-3 py-2 text-left font-mono text-xs transition disabled:opacity-50 ${
                active
                  ? "border-guards bg-guards text-white"
                  : "border-shop-700 bg-shop-950 text-shop-300 hover:border-shop-500 hover:text-shop-100"
              }`}
            >
              <span className="mr-1 opacity-60">{STATUS_META[s].step}</span>
              {STATUS_META[s].label}
              {saving === s && <span className="ml-1 animate-pulse">…</span>}
            </button>
          );
        })}
      </div>
      {note && (
        <p className="mt-3 font-mono text-xs text-green-400">{note}</p>
      )}
    </div>
  );
}
