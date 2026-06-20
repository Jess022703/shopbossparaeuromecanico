import Link from "next/link";
import { PageHeader } from "@/components/layout/app-shell";
import { listContactGroups } from "@/lib/store";

export default async function RemindersPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const groups = await listContactGroups();

  return (
    <>
      <PageHeader title="Recordatorios" description="Sube tus Excels, crea grupos de contactos y envia recordatorios" />

      {sp.error && <div className="alert error">{sp.error}</div>}
      {sp.deleted && <div className="alert ok">Grupo eliminado.</div>}

      <section className="content-grid">
        <form className="panel half" action="/api/reminders/groups" method="post" encType="multipart/form-data">
          <div className="panel-header"><h2>Subir Excel</h2></div>
          <div className="form-grid">
            <div className="field full">
              <label>Nombre del grupo (opcional)</label>
              <input className="input" name="name" placeholder="Ej: Reminder 6 meses" />
            </div>
            <div className="field full">
              <label>Archivo .xlsx</label>
              <input className="input" type="file" name="file" accept=".xlsx,.xls" required />
            </div>
            <div className="field full">
              <button className="button" type="submit">Crear grupo</button>
            </div>
          </div>
          <p className="field-hint">
            Columnas esperadas: <strong>Nombre, Telefono, Email, Vehiculo</strong>.<br />
            Se usa la hoja &quot;Para Reminder 6 Meses&quot; si existe, si no la primera. La fila 1 se trata como encabezado.
          </p>
        </form>

        <article className="panel half">
          <div className="panel-header"><h2>Grupos de contactos</h2></div>
          {groups.length === 0 ? (
            <p className="muted">Aun no hay grupos. Sube un Excel para crear el primero.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Grupo</th>
                    <th>Contactos</th>
                    <th>Enviados</th>
                    <th>Creado</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {groups.map((group) => {
                    const enviados = group.contacts.filter((contact) => contact.sentAt).length;
                    return (
                      <tr key={group.id}>
                        <td><Link className="link" href={`/reminders/${group.id}`}>{group.name}</Link></td>
                        <td>{group.contacts.length}</td>
                        <td>{enviados}</td>
                        <td>{new Date(group.createdAt).toLocaleDateString("es-PR")}</td>
                        <td style={{ textAlign: "right" }}>
                          <form action={`/api/reminders/groups/${group.id}/delete`} method="post">
                            <button className="button secondary" type="submit">Borrar</button>
                          </form>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </article>
      </section>
    </>
  );
}
