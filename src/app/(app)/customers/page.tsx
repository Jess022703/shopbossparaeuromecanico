import { PageHeader } from "@/components/layout/app-shell";
import { readData } from "@/lib/store";

export default async function CustomersPage() {
  const data = await readData();

  return (
    <>
      <PageHeader title="Clientes" description="Base de clientes, contactos y notas" />
      <section className="content-grid">
        <form className="panel half" action="/api/customers" method="post">
          <div className="panel-header"><h2>Nuevo cliente</h2></div>
          <div className="form-grid">
            <div className="field"><label>Nombre</label><input className="input" name="name" required /></div>
            <div className="field"><label>Telefono</label><input className="input" name="phone" required /></div>
            <div className="field"><label>Email</label><input className="input" name="email" type="email" required /></div>
            <div className="field"><label>Direccion</label><input className="input" name="address" required /></div>
            <div className="field full"><label>Notas</label><textarea className="textarea" name="notes" /></div>
            <div className="field full"><button className="button" type="submit">Guardar cliente</button></div>
          </div>
        </form>
        <article className="panel half">
          <div className="panel-header"><h2>Clientes registrados</h2></div>
          <div className="cards-grid">
            {data.customers.map((customer) => (
              <div className="mini-card" key={customer.id}>
                <strong>{customer.name}</strong>
                <span className="muted">{customer.phone}</span>
                <span className="muted">{customer.email}</span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </>
  );
}
