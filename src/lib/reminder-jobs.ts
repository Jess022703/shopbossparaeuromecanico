import { getContactGroup, markContactsSent } from "./store";
import { buildMail, getTransport } from "./mailer";

// Trabajo de envio masivo en segundo plano.
// El progreso durable vive en data/euroshop.json (cada contacto enviado obtiene sentAt);
// este Map en memoria solo aporta el estado "en ejecucion" y el ultimo error.

export type JobStatus = {
  running: boolean;
  total: number; // pendientes al iniciar
  sent: number;
  failed: number;
  error?: string;
  finishedAt?: string;
};

const jobs = new Map<string, JobStatus>();
const BULK_DELAY_MS = 800; // pausa entre envios (gentil con Gmail)
const MAX_CONSECUTIVE_FAILURES = 5; // aborta si parece auth/limite roto

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function getJobStatus(groupId: string): JobStatus | undefined {
  return jobs.get(groupId);
}

export function isSending(groupId: string): boolean {
  return jobs.get(groupId)?.running ?? false;
}

/** Inicia (si no hay uno activo) el envio a TODOS los contactos pendientes. No bloquea. */
export async function startSendAll(groupId: string): Promise<{ started: boolean; error?: string }> {
  if (isSending(groupId)) return { started: false, error: "Ya hay un envio en curso." };

  const group = await getContactGroup(groupId);
  if (!group) return { started: false, error: "Grupo no encontrado." };

  // Validar credencial antes de marcar el job como activo.
  try {
    getTransport().close();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    jobs.set(groupId, { running: false, total: 0, sent: 0, failed: 0, error: message, finishedAt: new Date().toISOString() });
    return { started: false, error: message };
  }

  const pending = group.contacts.filter((c) => !c.sentAt);
  jobs.set(groupId, { running: true, total: pending.length, sent: 0, failed: 0 });
  void runJob(groupId);
  return { started: true };
}

async function runJob(groupId: string) {
  const status = jobs.get(groupId)!;
  let transport;
  try {
    transport = getTransport();
  } catch (error) {
    status.running = false;
    status.error = error instanceof Error ? error.message : String(error);
    status.finishedAt = new Date().toISOString();
    return;
  }

  let consecutiveFailures = 0;
  try {
    const group = await getContactGroup(groupId);
    if (!group) return;
    const pending = group.contacts.filter((c) => !c.sentAt);

    for (let i = 0; i < pending.length; i++) {
      if (!jobs.get(groupId)?.running) break; // cancelado / reiniciado
      const contact = pending[i];
      try {
        await transport.sendMail(buildMail(group, contact));
        await markContactsSent(groupId, [contact.email]); // progreso durable
        status.sent++;
        status.error = undefined;
        consecutiveFailures = 0;
      } catch (error) {
        status.failed++;
        consecutiveFailures++;
        status.error = error instanceof Error ? error.message : String(error);
        if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
          status.error = `Detenido tras ${MAX_CONSECUTIVE_FAILURES} fallos seguidos: ${status.error}`;
          break;
        }
      }
      if (i < pending.length - 1) await sleep(BULK_DELAY_MS);
    }
  } finally {
    try {
      transport.close();
    } catch {
      // ignore
    }
    status.running = false;
    status.finishedAt = new Date().toISOString();
  }
}
