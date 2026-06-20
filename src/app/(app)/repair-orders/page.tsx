import { PageHeader } from "@/components/layout/app-shell";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrency } from "@/lib/format";
import { readData } from "@/lib/store";

export default async function RepairOrdersPage() {
  const data = await readData();

  return (
    <>
      <PageHeader title="Ordenes / RO" description="Ciclo completo de reparacion, aprobacion y cobro" />
      <section className="content-grid">
        <form className="panel half" action="/api/repair-orders" method="post">
          <div className="panel-header"><h2>Nueva orden</h2></div>
          <div className="form-grid">
            <div className="field">
              <label>Cliente</label>
              <select className="select" name="customerId" required>
                {data.customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Vehiculo</label>
              <select className="select" name="vehicleId" required>
                {data.vehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.year} {vehicle.model}</option>)}
              </select>
            </div>
            <div className="field full"><label>Queja / trabajo solicitado</label><textarea className="textarea" name="complaint" required /></div>
            <div className="field"><label>Prioridad</label><select className="select" name="priority"><option value="MEDIUM">Media</option><option value="HIGH">Alta</option><option value="LOW">Baja</option></select></div>
            <div className="field"><label>Labor estimada</label><input className="input" name="labor" type="number" step="0.01" defaultValue="145" /></div>
            <div className="field"><label>Partes estimadas</label><input className="input" name="parts" type="number" step="0.01" defaultValue="0" /></div>
            <div className="field full"><button className="button" type="submit">Crear RO</button></div>
          </div>
        </form>

        <article className="panel half">
          <div className="panel-header"><h2>Ordenes activas</h2></div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>RO</th><th>Vehiculo</th><th>Estado</th><th>Total</th><th>Actualizar</th></tr></thead>
              <tbody>
                {data.repairOrders.map((order) => {
                  const vehicle = data.vehicles.find((item) => item.id === order.vehicleId);
                  return (
                    <tr key={order.id}>
                      <td>{order.roNumber}</td>
                      <td>{vehicle?.year} {vehicle?.model}</td>
                      <td><StatusBadge value={order.status} /></td>
                      <td>{formatCurrency(order.totalCents)}</td>
                      <td>
                        <form action="/api/repair-orders" method="post">
                          <input type="hidden" name="_method" value="status" />
                          <input type="hidden" name="id" value={order.id} />
                          <select className="select" name="status" defaultValue={order.status}>
                            <option value="PENDING">Pendiente</option>
                            <option value="APPROVED">Aprobada</option>
                            <option value="IN_PROGRESS">En proceso</option>
                            <option value="WAITING_PARTS">Esperando partes</option>
                            <option value="QUALITY_CHECK">DVI</option>
                            <option value="READY">Lista</option>
                            <option value="COMPLETED">Completada</option>
                            <option value="INVOICED">Facturada</option>
                            <option value="PAID">Pagada</option>
                          </select>
                          <button className="button secondary" type="submit">OK</button>
                        </form>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </>
  );
}
