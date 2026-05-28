import Link from "next/link";
import { SHOP } from "@/lib/shop";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <div className="text-center">
        <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-guards font-mono text-3xl font-black text-white">
          E
        </span>
        <h1 className="text-2xl font-bold">{SHOP.name}</h1>
        <p className="mt-1 text-gray-500">{SHOP.tagline} · {SHOP.address}</p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold">Siga su vehículo</h2>
          <p className="mt-1 text-sm text-gray-500">
            Escanee el código QR que recibió en el taller para ver el estado de
            su reparación en tiempo real.
          </p>
          <div className="mt-3 rounded-lg bg-gray-50 p-3 text-center text-xs text-gray-400">
            📷 Escanee su código QR
          </div>
        </div>
        <Link
          href="/guias"
          className="rounded-xl border border-gray-200 bg-white p-6 transition hover:border-guards/40"
        >
          <h2 className="text-lg font-semibold">Guías de reparación</h2>
          <p className="mt-1 text-sm text-gray-500">
            Consulte nuestras guías paso a paso para modelos Porsche.
          </p>
          <span className="mt-3 inline-block text-sm font-medium text-guards">
            Explorar guías →
          </span>
        </Link>
      </div>

      <div className="mt-10 rounded-xl border border-gray-200 bg-white p-6 text-center">
        <h2 className="font-semibold">¿Necesita ayuda?</h2>
        <p className="mt-1 text-sm text-gray-500">
          Llámenos al{" "}
          <a href={`tel:${SHOP.phone}`} className="font-medium text-guards">
            {SHOP.phone}
          </a>
        </p>
        <p className="text-sm text-gray-400">{SHOP.hours}</p>
      </div>
    </main>
  );
}
