import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import NewOrderForm from "./NewOrderForm";

export const dynamic = "force-dynamic";

export default async function NewOrderPage() {
  const vehicles = await prisma.vehicle.findMany({
    include: { client: true },
    orderBy: { createdAt: "desc" },
  });

  const options = vehicles.map((v) => ({
    id: v.id,
    label: `${v.make} ${v.model} ${v.year} — ${v.plate ?? v.vin} (${v.client.name})`,
  }));

  return (
    <div>
      <PageHeader
        title="Nueva Orden de Reparación"
        subtitle="Seleccione un vehículo existente o registre uno nuevo"
      />
      <div className="p-6">
        <NewOrderForm vehicles={options} />
      </div>
    </div>
  );
}
