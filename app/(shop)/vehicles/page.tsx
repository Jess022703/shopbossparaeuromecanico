import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";

export const dynamic = "force-dynamic";

export default async function VehiclesPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = (searchParams.q ?? "").trim();

  const vehicles = await prisma.vehicle.findMany({
    where: q
      ? {
          OR: [
            { vin: { contains: q } },
            { plate: { contains: q } },
            { model: { contains: q } },
            { client: { is: { name: { contains: q } } } },
          ],
        }
      : undefined,
    include: {
      client: true,
      orders: { orderBy: { updatedAt: "desc" }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <PageHeader
        title="Vehículos"
        subtitle="Busque por VIN, placa, modelo o cliente"
      />
      <div className="p-6">
        <form className="mb-5" action="/vehicles">
          <input
            name="q"
            defaultValue={q}
            placeholder="Buscar por VIN, placa, modelo o cliente…"
            className="w-full max-w-md rounded border border-shop-600 bg-shop-950 px-4 py-2.5 font-mono text-sm text-shop-100 outline-none focus:border-guards"
          />
        </form>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((v) => (
            <Link
              key={v.id}
              href={`/vehicles/${v.id}`}
              className="rounded-lg border border-shop-800 bg-shop-900 p-4 transition hover:border-guards/50"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-mono text-sm font-bold text-shop-100">
                    {v.make} {v.model}
                  </div>
                  <div className="text-xs text-shop-400">
                    {v.year} · {v.color ?? "—"}
                  </div>
                </div>
                {v.orders[0] && <StatusBadge status={v.orders[0].status} />}
              </div>
              <dl className="mt-3 space-y-1 font-mono text-xs text-shop-400">
                <div className="flex justify-between">
                  <dt>VIN</dt>
                  <dd className="text-shop-300">{v.vin}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Placa</dt>
                  <dd className="text-shop-300">{v.plate ?? "—"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Cliente</dt>
                  <dd className="text-shop-300">{v.client.name}</dd>
                </div>
              </dl>
            </Link>
          ))}
          {!vehicles.length && (
            <p className="col-span-full py-10 text-center text-shop-500">
              {q
                ? `Sin resultados para "${q}".`
                : "No hay vehículos registrados."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
