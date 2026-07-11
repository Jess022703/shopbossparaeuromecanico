import Image from "next/image";
import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrency } from "@/lib/format";
import { getPortalData } from "@/lib/store";

export default async function PortalDemoPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const flash = await searchParams;
  const data = await getPortalData("demo-token");
  if (!data) notFound();

  return (
    <main className="main" style={{ maxWidth: 960, margin: "0 auto" }}>
      <section className="panel">
        <div className="panel-header">
          <div>
            <Image src="/assets/logo-mark.png" alt="Euromecanico Corp" width={76} height={76} />
            <h1>Portal del cliente</h1>
            <p className="muted">{data.shop.name} · {data.shop.city}</p>
          </div>
          <StatusBadge value={data.order.status} />
        </div>
        <div className="cards-grid">
          <div className="mini-card"><span className="muted">Cliente</span><strong>{data.customer?.name}</strong></div>
          <div className="mini-card"><span className="muted">Vehiculo</span><strong>{data.vehicle?.year} {data.vehicle?.model}</strong></div>
          <div className="mini-card"><span className="muted">Total estimado</span><strong>{formatCurrency(data.order.totalCents)}</strong></div>
        </div>
      </section>
      <section className="panel" style={{ marginTop: 18 }}>
        <div className="panel-header"><h2>Inspeccion digital</h2></div>
        <div className="cards-grid">
          <div className="mini-card"><StatusBadge value="READY" /><strong>Frenos delanteros</strong><span className="muted">Dentro de especificacion.</span></div>
          <div className="mini-card"><StatusBadge value="PENDING" /><strong>Coolant crossover</strong><span className="muted">Monitorear en proximo servicio.</span></div>
          <div className="mini-card"><StatusBadge value="HIGH" /><strong>Boost leak</strong><span className="muted">Requiere aprobacion para prueba de humo.</span></div>
        </div>
        {flash.approved && <div className="alert ok" style={{ marginTop: 18 }}>Estimado aprobado correctamente.</div>}
        {data.order.approved ? (
          <button className="button" style={{ marginTop: 18 }} disabled>Estimado aprobado</button>
        ) : (
          <form action="/api/portal/approve" method="post">
            <input type="hidden" name="token" value={data.order.portalToken} />
            <button className="button" type="submit" style={{ marginTop: 18 }}>Aprobar estimado</button>
          </form>
        )}
      </section>
    </main>
  );
}
