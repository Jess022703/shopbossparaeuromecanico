"use client";

import { useState } from "react";
import { GuideStep } from "@/lib/constants";

// Step-by-step viewer with progress tracking (checkable steps).
export default function GuideViewer({ steps }: { steps: GuideStep[] }) {
  const [done, setDone] = useState<boolean[]>(() => steps.map(() => false));

  if (!steps.length) {
    return (
      <p className="text-gray-400">Esta guía aún no tiene pasos.</p>
    );
  }

  const completed = done.filter(Boolean).length;
  const pct = Math.round((completed / steps.length) * 100);

  function toggle(i: number) {
    setDone((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
  }

  return (
    <div>
      {/* Progress bar */}
      <div className="sticky top-0 z-10 -mx-4 mb-4 bg-gray-50/90 px-4 py-2 backdrop-blur">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            {completed} de {steps.length} pasos
          </span>
          <span className="font-semibold text-guards">{pct}%</span>
        </div>
        <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full bg-guards transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <ol className="space-y-3">
        {steps.map((step, i) => (
          <li
            key={i}
            className={`rounded-xl border p-4 transition ${
              done[i]
                ? "border-green-200 bg-green-50"
                : "border-gray-200 bg-white"
            }`}
          >
            <div className="flex items-start gap-3">
              <button
                onClick={() => toggle(i)}
                aria-label="Marcar paso"
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition ${
                  done[i]
                    ? "border-green-500 bg-green-500 text-white"
                    : "border-gray-300 text-gray-400"
                }`}
              >
                {done[i] ? "✓" : i + 1}
              </button>
              <div className="flex-1">
                <h3
                  className={`font-semibold ${
                    done[i] ? "text-gray-400 line-through" : "text-gray-900"
                  }`}
                >
                  {step.title}
                </h3>
                {step.description && (
                  <p className="mt-1 text-sm text-gray-600">
                    {step.description}
                  </p>
                )}
                {step.warning && (
                  <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                    ⚠ {step.warning}
                  </p>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>

      {completed === steps.length && (
        <div className="mt-4 rounded-xl bg-green-600 p-4 text-center font-semibold text-white">
          ¡Guía completada! 🎉
        </div>
      )}
    </div>
  );
}
