"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface VehicleOption {
  id: string;
  label: string;
}

export default function NewOrderForm({
  vehicles,
}: {
  vehicles: VehicleOption[];
}) {
  const router = useRouter();
  const [mode, setMode] = useState<"existing" | "new">(
    vehicles.length ? "existing" : "new"
  );
  const [vehicleId, setVehicleId] = useState(vehicles[0]?.id ?? "");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // new vehicle/client fields
  const [v, setV] = useState({
    vin: "",
    plate: "",
    make: "Porsche",
    model: "",
    year: "",
    color: "",
  });
  const [c, setC] = useState({ name: "", phone: "", email: "" });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const payload =
      mode === "existing"
        ? { vehicleId, description, notes }
        : { vehicle: v, client: c, description, notes };
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setBusy(false);
    const data = await res.json();
    if (res.ok) {
      router.push(`/orders/${data.id}`);
      router.refresh();
    } else {
      setError(data.error ?? "Error al crear la orden");
    }
  }

  const inputCls =
    "w-full rounded border border-shop-600 bg-shop-950 px-3 py-2 text-sm text-shop-100 outline-none focus:border-guards";
  const labelCls =
    "mb-1 block font-mono text-[10px] uppercase tracking-widest text-shop-500";

  return (
    <form onSubmit={submit} className="max-w-2xl space-y-6">
      {/* Mode toggle */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode("existing")}
          disabled={!vehicles.length}
          className={`flex-1 rounded border py-2 font-mono text-xs ${
            mode === "existing"
              ? "border-guards bg-guards/15 text-guards-light"
              : "border-shop-700 text-shop-400"
          } disabled:opacity-40`}
        >
          Vehículo existente
        </button>
        <button
          type="button"
          onClick={() => setMode("new")}
          className={`flex-1 rounded border py-2 font-mono text-xs ${
            mode === "new"
              ? "border-guards bg-guards/15 text-guards-light"
              : "border-shop-700 text-shop-400"
          }`}
        >
          Nuevo vehículo + cliente
        </button>
      </div>

      {mode === "existing" ? (
        <div>
          <label className={labelCls}>Vehículo</label>
          <select
            value={vehicleId}
            onChange={(e) => setVehicleId(e.target.value)}
            className={inputCls}
          >
            {vehicles.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="space-y-4 rounded-lg border border-shop-800 bg-shop-900 p-4">
          <h3 className="font-mono text-xs uppercase tracking-widest text-shop-400">
            Vehículo
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className={labelCls}>VIN *</label>
              <input
                className={inputCls}
                value={v.vin}
                onChange={(e) => setV({ ...v, vin: e.target.value })}
              />
            </div>
            <div>
              <label className={labelCls}>Marca *</label>
              <input
                className={inputCls}
                value={v.make}
                onChange={(e) => setV({ ...v, make: e.target.value })}
              />
            </div>
            <div>
              <label className={labelCls}>Modelo *</label>
              <input
                className={inputCls}
                value={v.model}
                onChange={(e) => setV({ ...v, model: e.target.value })}
              />
            </div>
            <div>
              <label className={labelCls}>Año *</label>
              <input
                className={inputCls}
                type="number"
                value={v.year}
                onChange={(e) => setV({ ...v, year: e.target.value })}
              />
            </div>
            <div>
              <label className={labelCls}>Placa</label>
              <input
                className={inputCls}
                value={v.plate}
                onChange={(e) => setV({ ...v, plate: e.target.value })}
              />
            </div>
            <div>
              <label className={labelCls}>Color</label>
              <input
                className={inputCls}
                value={v.color}
                onChange={(e) => setV({ ...v, color: e.target.value })}
              />
            </div>
          </div>

          <h3 className="pt-2 font-mono text-xs uppercase tracking-widest text-shop-400">
            Cliente
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Nombre *</label>
              <input
                className={inputCls}
                value={c.name}
                onChange={(e) => setC({ ...c, name: e.target.value })}
              />
            </div>
            <div>
              <label className={labelCls}>Teléfono *</label>
              <input
                className={inputCls}
                value={c.phone}
                onChange={(e) => setC({ ...c, phone: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Email</label>
              <input
                className={inputCls}
                type="email"
                value={c.email}
                onChange={(e) => setC({ ...c, email: e.target.value })}
              />
            </div>
          </div>
        </div>
      )}

      <div>
        <label className={labelCls}>Descripción del trabajo *</label>
        <textarea
          className={inputCls}
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ej. Cambio de aceite y revisión de frenos"
          required
        />
      </div>
      <div>
        <label className={labelCls}>Notas iniciales</label>
        <textarea
          className={inputCls}
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      {error && <p className="font-mono text-sm text-guards-light">{error}</p>}

      <button
        type="submit"
        disabled={busy}
        className="rounded bg-guards px-6 py-2.5 font-mono text-sm font-bold uppercase tracking-wider text-white hover:bg-guards-dark disabled:opacity-50"
      >
        {busy ? "Creando..." : "Crear orden"}
      </button>
    </form>
  );
}
