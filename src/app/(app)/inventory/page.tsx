import { PageHeader } from "@/components/layout/app-shell";
import { formatCurrency } from "@/lib/format";
import { readData } from "@/lib/store";

export default async function InventoryPage() {
  const data = await readData();

  return (
    <>
      <PageHeader title="Inventario" description="Partes, costo, precio y ubicacion" />
      <section className="content-grid">
        <form className="panel half" action="/api/inventory" method="post">
          <div className="panel-header"><h2>Agregar parte</h2></div>
          <div className="form-grid">
            <div className="field"><label>Numero de parte</label><input className="input" name="partNumber" required /></div>
            <div className="field"><label>Marca</label><input className="input" name="brand" required /></div>
            <div className="field full"><label>Descripcion</label><input className="input" name="description" required /></div>
            <div className="field"><label>Cantidad</label><input className="input" name="quantity" type="number" required /></div>
            <div className="field"><label>Minimo</label><input className="input" name="minQuantity" type="number" defaultValue="1" /></div>
            <div className="field"><label>Costo</label><input className="input" name="unitCost" type="number" step="0.01" required /></div>
            <div className="field"><label>Precio</label><input className="input" name="unitPrice" type="number" step="0.01" required /></div>
            <div className="field"><label>Ubicacion</label><input className="input" name="location" required /></div>
            <div className="field full"><button className="button" type="submit">Guardar parte</button></div>
          </div>
        </form>
        <article className="panel half">
          <div className="panel-header"><h2>Partes</h2></div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Parte</th><th>Descripcion</th><th>Cant.</th><th>Precio</th></tr></thead>
              <tbody>
                {data.inventory.map((item) => (
                  <tr key={item.id}>
                    <td>{item.partNumber}</td>
                    <td>{item.description}</td>
                    <td>{item.quantity}</td>
                    <td>{formatCurrency(item.unitPriceCents)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </>
  );
}
