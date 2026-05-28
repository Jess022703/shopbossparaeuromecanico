"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GUIDE_CATEGORIES, GuideStep } from "@/lib/constants";

interface Guide {
  id: string;
  title: string;
  model: string;
  year: string | null;
  category: string;
  notes: string | null;
  steps: GuideStep[];
}

const blank = {
  id: "",
  title: "",
  model: "",
  year: "",
  category: GUIDE_CATEGORIES[0] as string,
  notes: "",
  steps: [{ title: "", description: "", warning: "" }] as GuideStep[],
};

export default function GuidesManager({
  initialGuides,
}: {
  initialGuides: Guide[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<typeof blank | null>(null);
  const [busy, setBusy] = useState(false);

  function startNew() {
    setEditing({ ...blank, steps: [{ title: "", description: "", warning: "" }] });
  }

  function startEdit(g: Guide) {
    setEditing({
      id: g.id,
      title: g.title,
      model: g.model,
      year: g.year ?? "",
      category: g.category,
      notes: g.notes ?? "",
      steps: g.steps.length
        ? g.steps.map((s) => ({ ...s, warning: s.warning ?? "" }))
        : [{ title: "", description: "", warning: "" }],
    });
  }

  async function save() {
    if (!editing) return;
    setBusy(true);
    const payload = {
      title: editing.title,
      model: editing.model,
      year: editing.year,
      category: editing.category,
      notes: editing.notes,
      steps: editing.steps.filter((s) => s.title.trim()),
    };
    const res = await fetch(
      editing.id ? `/api/guides/${editing.id}` : "/api/guides",
      {
        method: editing.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    setBusy(false);
    if (res.ok) {
      setEditing(null);
      router.refresh();
    }
  }

  async function remove(id: string) {
    if (!confirm("¿Eliminar esta guía?")) return;
    await fetch(`/api/guides/${id}`, { method: "DELETE" });
    router.refresh();
  }

  const inputCls =
    "w-full rounded border border-shop-600 bg-shop-950 px-3 py-2 text-sm text-shop-100 outline-none focus:border-guards";
  const labelCls =
    "mb-1 block font-mono text-[10px] uppercase tracking-widest text-shop-500";

  if (editing) {
    return (
      <div className="max-w-3xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-mono text-sm text-shop-200">
            {editing.id ? "Editar guía" : "Nueva guía"}
          </h2>
          <button
            onClick={() => setEditing(null)}
            className="font-mono text-xs text-shop-400 hover:text-shop-200"
          >
            ✕ Cancelar
          </button>
        </div>

        <div className="space-y-4 rounded-lg border border-shop-800 bg-shop-900 p-5">
          <div>
            <label className={labelCls}>Título *</label>
            <input
              className={inputCls}
              value={editing.title}
              onChange={(e) =>
                setEditing({ ...editing, title: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelCls}>Modelo Porsche *</label>
              <input
                className={inputCls}
                value={editing.model}
                onChange={(e) =>
                  setEditing({ ...editing, model: e.target.value })
                }
                placeholder="911 Carrera"
              />
            </div>
            <div>
              <label className={labelCls}>Rango de años</label>
              <input
                className={inputCls}
                value={editing.year}
                onChange={(e) =>
                  setEditing({ ...editing, year: e.target.value })
                }
                placeholder="2017-2022"
              />
            </div>
            <div>
              <label className={labelCls}>Categoría *</label>
              <select
                className={inputCls}
                value={editing.category}
                onChange={(e) =>
                  setEditing({ ...editing, category: e.target.value })
                }
              >
                {GUIDE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Steps editor */}
          <div>
            <label className={labelCls}>Pasos</label>
            <div className="space-y-3">
              {editing.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="rounded border border-shop-700 bg-shop-950 p-3"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-mono text-xs text-shop-400">
                      Paso {idx + 1}
                    </span>
                    {editing.steps.length > 1 && (
                      <button
                        onClick={() =>
                          setEditing({
                            ...editing,
                            steps: editing.steps.filter((_, i) => i !== idx),
                          })
                        }
                        className="font-mono text-xs text-shop-500 hover:text-guards-light"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <input
                    className={`${inputCls} mb-2`}
                    placeholder="Título del paso"
                    value={step.title}
                    onChange={(e) => {
                      const steps = [...editing.steps];
                      steps[idx] = { ...steps[idx], title: e.target.value };
                      setEditing({ ...editing, steps });
                    }}
                  />
                  <textarea
                    className={`${inputCls} mb-2`}
                    rows={2}
                    placeholder="Descripción"
                    value={step.description}
                    onChange={(e) => {
                      const steps = [...editing.steps];
                      steps[idx] = {
                        ...steps[idx],
                        description: e.target.value,
                      };
                      setEditing({ ...editing, steps });
                    }}
                  />
                  <input
                    className={`${inputCls} border-amber-800`}
                    placeholder="⚠ Advertencia (opcional)"
                    value={step.warning ?? ""}
                    onChange={(e) => {
                      const steps = [...editing.steps];
                      steps[idx] = { ...steps[idx], warning: e.target.value };
                      setEditing({ ...editing, steps });
                    }}
                  />
                </div>
              ))}
            </div>
            <button
              onClick={() =>
                setEditing({
                  ...editing,
                  steps: [
                    ...editing.steps,
                    { title: "", description: "", warning: "" },
                  ],
                })
              }
              className="mt-2 rounded border border-shop-600 px-3 py-1.5 font-mono text-xs text-shop-300 hover:border-guards hover:text-guards-light"
            >
              + Agregar paso
            </button>
          </div>

          <div>
            <label className={labelCls}>Notas</label>
            <textarea
              className={inputCls}
              rows={2}
              value={editing.notes}
              onChange={(e) =>
                setEditing({ ...editing, notes: e.target.value })
              }
            />
          </div>

          <button
            onClick={save}
            disabled={busy || !editing.title || !editing.model}
            className="rounded bg-guards px-6 py-2.5 font-mono text-sm font-bold uppercase tracking-wider text-white hover:bg-guards-dark disabled:opacity-50"
          >
            {busy ? "Guardando..." : "Guardar guía"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={startNew}
        className="mb-5 rounded bg-guards px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-white hover:bg-guards-dark"
      >
        + Nueva guía
      </button>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {initialGuides.map((g) => (
          <div
            key={g.id}
            className="rounded-lg border border-shop-800 bg-shop-900 p-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="font-mono text-sm font-bold text-shop-100">
                  {g.title}
                </div>
                <div className="mt-0.5 text-xs text-shop-400">
                  {g.model} · {g.year ?? "—"} · {g.steps.length} pasos
                </div>
              </div>
              <span className="rounded border border-shop-600 px-2 py-0.5 font-mono text-[10px] uppercase text-shop-300">
                {g.category}
              </span>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => startEdit(g)}
                className="rounded border border-shop-600 px-3 py-1 font-mono text-xs text-shop-200 hover:border-guards hover:text-guards-light"
              >
                Editar
              </button>
              <button
                onClick={() => remove(g.id)}
                className="rounded border border-shop-700 px-3 py-1 font-mono text-xs text-shop-400 hover:border-guards hover:text-guards-light"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
        {!initialGuides.length && (
          <p className="col-span-full py-10 text-center text-shop-500">
            No hay guías. Cree la primera.
          </p>
        )}
      </div>
    </div>
  );
}
