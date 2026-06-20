import { PageHeader } from "@/components/layout/app-shell";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrency } from "@/lib/format";
import { readData } from "@/lib/store";

export default async function InvoicesPage() {
  const data = await readData();

  return (
    <>
      <PageHeader title="Facturas" description="Cuentas por cobrar y pagos" />
      <section className="panel">
        <div className="panel-header"><h2>Facturas</h2></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Factura</th><th>RO</th><th>Estado</th><th>Vence</th><th className="align-right">Total</th></tr></thead>
            <tbody>
              {data.invoices.map((invoice) => {
                const order = data.repairOrders.find((item) => item.id === invoice.repairOrderId);
                return (
                  <tr key={invoice.id}>
                    <td>{invoice.invoiceNumber}</td>
                    <td>{order?.roNumber}</td>
                    <td><StatusBadge value={invoice.status} /></td>
                    <td>{new Date(invoice.dueDate).toLocaleDateString("es-PR")}</td>
                    <td className="align-right">{formatCurrency(invoice.totalCents)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
