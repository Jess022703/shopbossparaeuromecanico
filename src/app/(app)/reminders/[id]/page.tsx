import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/app-shell";
import { AutoRefresh } from "@/components/reminders/auto-refresh";
import { getContactGroup } from "@/lib/store";
import { DEFAULT_BODY, DEFAULT_SUBJECT } from "@/lib/mailer";
import { getJobStatus, isSending } from "@/lib/reminder-jobs";

const PREVIEW_LIMIT = 50;

export default async function ReminderGroupPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const group = await getContactGroup(id);
  if (!group) notFound();

  const total = group.contacts.length;
  const enviados = group.contacts.filter((contact) => contact.sentAt).length;
  const pendientes = total - enviados;
  const preview = group.contacts.slice(0, PREVIEW_LIMIT);
  const restantes = total - preview.length;

  const sending = isSending(id);
  const job = getJobStatus(id);
  const pct = total > 0 ? Math.round((enviados / total) * 100) : 0;

  return (
    <>
      <PageHeader title={group.name} description={`${total} contactos · ${enviados} enviados · ${pendientes} pendientes`} />

      <p style={{ marginBottom: 16 }}>
        <Link className="link" href="/reminders">&larr; Volver a grupos</Link>
      </p>

      {sp.created && <div className="alert ok">Grupo creado con {sp.created} contactos.</div>}
      {sp.saved && <div className="alert ok">Mensaje guardado.</div>}
      {sp.error && <div className="alert error">{sp.error}</div>}
      {sp.sent !== undefined && (
        <div className="alert ok">
          Envio ({sp.mode === "test" ? "prueba" : "real"}): {sp.sent} enviados
          {sp.failed && sp.failed !== "0" ? `, ${sp.failed} fallidos` : ""}
          {sp.remaining && sp.remaining !== "0" ? `, ${sp.remaining} pendientes` : ""}.
        </div>
      )}

      {(sending || (job && !sending)) && (
        <div className="panel" style={{ marginBottom: 18 }}>
          {sending && <AutoRefresh seconds={5} />}
          <div className="panel-header">
            <h2>{sending ? "Enviando recordatorios…" : "Resultado del envio masivo"}</h2>
          </div>
          <div style={{ height: 10, borderRadius: 6, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
            <div style={{ width: `${pct}%`, height: "100%", background: "linear-gradient(90deg,#c91515,#ff5252)" }} />
          </div>
          <p style={{ marginTop: 10 }}>
            <strong>{enviados}</strong> de <strong>{total}</strong> enviados ({pct}%)
            {job && job.failed > 0 ? ` · ${job.failed} fallidos` : ""}
            {pendientes > 0 ? ` · ${pendientes} pendientes` : ""}.
          </p>
          {sending && <p className="field-hint">El envio corre en segundo plano. No cierres el servidor; esta pagina se actualiza sola.</p>}
          {job?.error && <div className="alert error" style={{ marginTop: 10, marginBottom: 0 }}>{job.error}</div>}
          {!sending && pendientes === 0 && !job?.error && <p className="field-hint">✅ Todos los contactos fueron enviados.</p>}
        </div>
      )}

      <section className="content-grid">
        <form className="panel half" action={`/api/reminders/groups/${group.id}/message`} method="post">
          <div className="panel-header"><h2>Mensaje del recordatorio</h2></div>
          <div className="form-grid">
            <div className="field full">
              <label>Asunto</label>
              <input className="input" name="subject" defaultValue={group.subject ?? DEFAULT_SUBJECT} />
            </div>
            <div className="field full">
              <label>Cuerpo</label>
              <textarea className="textarea" name="body" rows={10} defaultValue={group.body ?? DEFAULT_BODY} style={{ minHeight: 200 }} />
            </div>
            <div className="field full">
              <button className="button" type="submit">Guardar mensaje</button>
            </div>
          </div>
          <p className="field-hint">
            Placeholders: <strong>{"{nombre}"}</strong> (primer nombre), <strong>{"{vehiculo}"}</strong>, <strong>{"{telefono}"}</strong>.<br />
            El texto se envuelve automaticamente en el diseno de marca (header rojo, footer).
          </p>
        </form>

        <article className="panel half">
          <div className="panel-header"><h2>Enviar</h2></div>

          <h3 style={{ margin: "0 0 10px", fontSize: 13, textTransform: "uppercase", color: "var(--muted)" }}>Envio real a todos</h3>
          {sending ? (
            <button className="button" type="button" disabled>Enviando… ({enviados}/{total})</button>
          ) : pendientes > 0 ? (
            <form action={`/api/reminders/groups/${group.id}/send-all`} method="post">
              <button className="button" type="submit">Enviar a todos los pendientes ({pendientes})</button>
            </form>
          ) : (
            <form action={`/api/reminders/groups/${group.id}/resend-all`} method="post">
              <button className="button" type="submit">Reenviar a todos ({total})</button>
            </form>
          )}
          <p className="field-hint">
            {pendientes === 0 && !sending
              ? <>Todos fueron enviados. <strong>Reenviar</strong> reinicia el estado y vuelve a enviar a los {total} contactos.</>
              : <>Envia a todos los contactos que aun no han recibido, en segundo plano y con pausa entre cada uno. Los ya enviados se omiten. Requiere <strong>GMAIL_APP_PASSWORD</strong>.</>}
          </p>

          <hr style={{ border: 0, borderTop: "1px solid var(--line)", margin: "18px 0" }} />

          <h3 style={{ margin: "0 0 10px", fontSize: 13, textTransform: "uppercase", color: "var(--muted)" }}>Prueba</h3>
          <form action={`/api/reminders/groups/${group.id}/send`} method="post">
            <div className="form-grid">
              <div className="field full" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input type="checkbox" name="testMode" id="testMode" defaultChecked />
                <label htmlFor="testMode" style={{ margin: 0 }}>Modo prueba (envia al email de prueba)</label>
              </div>
              <div className="field full">
                <label>Email de prueba</label>
                <input className="input" type="email" name="testEmail" placeholder="tu-correo@ejemplo.com" />
              </div>
              <div className="field full">
                <label>Cuantas veces enviar</label>
                <input className="input" type="number" name="testCount" defaultValue={3} min={1} max={10} step={1} />
                <p className="field-hint" style={{ marginBottom: 0 }}>Numero de correos de prueba que se enviaran al email de arriba (1 a 10).</p>
              </div>
              <div className="field full">
                <button className="button secondary" type="submit">Enviar prueba</button>
              </div>
            </div>
          </form>
        </article>
      </section>

      <section className="content-grid" style={{ marginTop: 18 }}>
        <article className="panel full">
          <div className="panel-header"><h2>Contactos ({total})</h2></div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Vehiculo</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {preview.map((contact, index) => (
                  <tr key={`${contact.email}-${index}`}>
                    <td>{contact.name}</td>
                    <td>{contact.email}</td>
                    <td>{contact.vehicle}</td>
                    <td>
                      {contact.sentAt ? (
                        <span className="badge green">Enviado</span>
                      ) : (
                        <span className="badge neutral">Pendiente</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {restantes > 0 && <p className="field-hint">... y {restantes} contactos mas.</p>}
        </article>
      </section>
    </>
  );
}
