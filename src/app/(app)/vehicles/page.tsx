import { PageHeader } from "@/components/layout/app-shell";
import { readData } from "@/lib/store";

export default async function VehiclesPage() {
  const data = await readData();

  return (
    <>
      <PageHeader title="Vehiculos" description="Registro de VIN, millaje e historial" />
      <section className="content-grid">
        <form className="panel half" action="/api/vehicles" method="post">
          <div className="panel-header"><h2>Nuevo vehiculo</h2></div>
          <div className="form-grid">
            <div className="field full">
              <label>Cliente</label>
              <select className="select" name="customerId" required>
                {data.customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}
              </select>
            </div>
            <div className="field"><label>VIN</label><input className="input" name="vin" required /></div>
            <div className="field"><label>Ano</label><input className="input" name="year" type="number" required /></div>
            <div className="field"><label>Marca</label><input className="input" name="make" defaultValue="Porsche" required /></div>
            <div className="field"><label>Modelo</label><input className="input" name="model" required /></div>
            <div className="field"><label>Generacion</label><input className="input" name="generation" placeholder="991.2, E3, 981..." /></div>
            <div className="field"><label>Millaje</label><input className="input" name="mileage" type="number" /></div>
            <div className="field full"><button className="button" type="submit">Guardar vehiculo</button></div>
          </div>
        </form>
        <article className="panel half">
          <div className="panel-header"><h2>Garage</h2></div>
          <div className="cards-grid">
            {data.vehicles.map((vehicle) => (
              <div className="mini-card" key={vehicle.id}>
                <strong>{vehicle.year} {vehicle.make} {vehicle.model}</strong>
                <span className="muted">{vehicle.generation ?? "Sin generacion"} · {vehicle.mileage.toLocaleString()} mi</span>
                <span className="muted">{vehicle.vin}</span>
              </div>
            ))}
          </div>
        </article>
        <article className="panel full">
          <div className="panel-header"><h2>VIN decoder</h2><span className="muted">Endpoint listo: /api/vehicles/vin-decode?vin=...</span></div>
          <p className="muted">El endpoint consulta NHTSA y agrega deteccion de generacion Porsche cuando aplica.</p>
        </article>
      </section>
    </>
  );
}
