"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VehicleNotes({
  vehicleId,
  notes,
}: {
  vehicleId: string;
  notes: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(notes);
  const [saved, setSaved] = useState(false);

  async function save() {
    const res = await fetch(`/api/vehicles/${vehicleId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes: value }),
    });
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      router.refresh();
    }
  }

  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={save}
        rows={4}
        placeholder="Notas del vehículo (preferencias del cliente, historial, etc.)"
        className="w-full rounded border border-shop-600 bg-shop-950 px-3 py-2 text-sm text-shop-100 outline-none focus:border-guards"
      />
      {saved && (
        <p className="mt-1 font-mono text-[10px] text-green-400">Guardado ✓</p>
      )}
    </div>
  );
}
