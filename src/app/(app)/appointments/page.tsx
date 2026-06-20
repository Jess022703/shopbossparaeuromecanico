import { PageHeader } from "@/components/layout/app-shell";
import { StatusBadge } from "@/components/ui/status-badge";
import { readData } from "@/lib/store";

export default async function AppointmentsPage() {
  const data = await readData();

  return (
    <>
      <PageHeader title="Citas" description="Agenda del taller y recordatorios SMS" />
      <section className="content-grid">
        <form className="panel half" action="/api/appointments" method="post">
          <div className="panel-header"><h2>Nueva cita</h2></div>
          <div className="form-grid">
            <div className="field"><label>Cliente</label><input className="input" name="customerName" required /></div>
            <div className="field"><label>Vehiculo</label><input className="input" name="vehicleInfo" placeholder="2020 Macan S" required /></div>
            <div className="field"><label>Servicio</label><input className="input" name="serviceType" required /></div>
            <div className="field"><label>Fecha y hora</label><input className="input" name="scheduledAt" type="datetime-local" required /></div>
            <div className="field full"><button className="button" type="submit">Crear cita</button></div>
          </div>
        </form>
        <article className="panel half">
          <div className="panel-header"><h2>Calendario</h2></div>
          {data.appointments.map((appointment) => (
            <div className="appointment-row" key={appointment.id}>
              <time>{new Date(appointment.scheduledAt).toLocaleString("es-PR", { hour: "numeric", minute: "2-digit", month: "short", day: "numeric" })}</time>
              <div><strong>{appointment.vehicleInfo}</strong><div className="muted">{appointment.customerName} · {appointment.serviceType}</div></div>
              <StatusBadge value={appointment.status} />
            </div>
          ))}
        </article>
      </section>
    </>
  );
}
