import Link from "next/link";
import { PageHeader } from "@/components/layout/app-shell";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrency, formatShortDate } from "@/lib/format";
import { getDashboardData } from "@/lib/store";

export default async function DashboardPage() {
  const data = await getDashboardData();
  const orders = data.repairOrders.slice(0, 5);

  return (
    <>
      <PageHeader title="Dashboard" description="Resumen operativo de Euromecanico Corp" action={<Link className="button" href="/repair-orders">+ Nueva RO</Link>} />

      <section className="kpi-grid">
        <article className="kpi-card">
          <span className="eyebrow">Ingresos abiertos</span>
          <strong>{formatCurrency(data.metrics.revenueCents)}</strong>
          <p className="positive">+12.5% vs mes anterior</p>
        </article>
        <article className="kpi-card">
          <span className="eyebrow">Ordenes activas</span>
          <strong>{data.metrics.activeOrders}</strong>
          <p className="danger">{data.metrics.highPriority} alta prioridad</p>
        </article>
        <article className="kpi-card">
          <span className="eyebrow">Citas de hoy</span>
          <strong>{data.metrics.appointmentsToday}</strong>
          <p className="positive">{data.metrics.confirmedAppointments} confirmadas por SMS</p>
        </article>
        <article className="kpi-card">
          <span className="eyebrow">Partes inventario</span>
          <strong>{formatCurrency(data.metrics.inventoryValueCents)}</strong>
          <p>{data.metrics.inventoryItems} items</p>
        </article>
      </section>

      <section className="panel brand-video-panel" aria-label="Video de marca Euromecanico Corp">
        <div className="brand-video-copy">
          <span className="eyebrow">Euromecanico Corp</span>
          <h2>Presentacion premium</h2>
          <p>Independent Porsche Specialists</p>
        </div>
        <div className="brand-video-frame">
          <video className="brand-video" autoPlay muted loop playsInline preload="metadata" controls>
            <source src="/assets/premium-logo-reveal.mp4" type="video/mp4" />
          </video>
        </div>
      </section>

      <section className="content-grid">
        <article className="panel ro-panel">
          <div className="panel-header">
            <h2>Ordenes de reparacion</h2>
            <Link className="muted" href="/repair-orders">Ver todas</Link>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>RO #</th>
                  <th>Vehiculo</th>
                  <th>Cliente</th>
                  <th>Estado</th>
                  <th>Prioridad</th>
                  <th className="align-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const vehicle = data.vehicles.find((item) => item.id === order.vehicleId);
                  const customer = data.customers.find((item) => item.id === order.customerId);
                  return (
                    <tr key={order.id}>
                      <td>{order.roNumber}</td>
                      <td>{vehicle ? `${vehicle.year} ${vehicle.model}` : "Sin vehiculo"}</td>
                      <td>{customer?.name ?? "Sin cliente"}</td>
                      <td><StatusBadge value={order.status} /></td>
                      <td><StatusBadge value={order.priority} /></td>
                      <td className="align-right">{formatCurrency(order.totalCents)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </article>

        <article className="panel appointments-panel">
          <div className="panel-header">
            <h2>Citas</h2>
            <Link className="muted" href="/appointments">Ver calendario</Link>
          </div>
          {data.appointments.slice(0, 5).map((appointment) => (
            <div className="appointment-row" key={appointment.id}>
              <time>{new Date(appointment.scheduledAt).toLocaleTimeString("es-PR", { hour: "numeric", minute: "2-digit" })}</time>
              <div>
                <strong>{appointment.vehicleInfo}</strong>
                <div className="muted">{appointment.serviceType}</div>
              </div>
              <StatusBadge value={appointment.status} />
            </div>
          ))}
        </article>

        <article className="panel third">
          <div className="panel-header"><h2>Ingresos</h2><span className="badge neutral">Este mes</span></div>
          <div className="cards-grid">
            {["$26K", "$6K", "$20K", "$41K", "$27K", "$17K"].map((value) => (
              <div className="mini-card" key={value}><span className="muted">Dia</span><strong>{value}</strong></div>
            ))}
          </div>
        </article>

        <article className="panel third">
          <div className="panel-header"><h2>Servicios principales</h2></div>
          {["Reparacion de motor", "Mantenimiento", "Diagnostico PIWIS", "Frenos", "Servicio AC"].map((name, index) => (
            <div className="service-row" key={name}>
              <span>{name}</span>
              <strong>{[38, 25, 17, 12, 8][index]}%</strong>
            </div>
          ))}
        </article>

        <article className="panel third">
          <div className="panel-header"><h2>Actividad reciente</h2></div>
          {data.activities.slice(0, 5).map((activity) => (
            <div className="activity-row" key={activity.id}>
              <span>{activity.label}</span>
              <time className="muted">{formatShortDate(activity.createdAt)}</time>
            </div>
          ))}
        </article>
      </section>
    </>
  );
}
