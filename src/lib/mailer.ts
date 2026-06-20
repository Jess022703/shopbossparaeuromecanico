import nodemailer from "nodemailer";
import type { Contact, ContactGroup } from "./types";

// --- Configuracion del taller / cuenta de envio --------------------------
export const SENDER_EMAIL = "admin@euromecanicocorp.com";
export const SENDER_NAME = "Euromecanico Corp";
export const SHOP_NAME = "EUROMECANICO CORP";
export const SHOP_PHONE = "(787) 344-6328";
export const SHOP_PHONE_TEL = "+17873446328";
export const SHOP_LOCATION = "Sabana Seca, Toa Baja, Puerto Rico";
export const BRAND_RED = "#E31A2B";

const SMTP_HOST = "smtp.gmail.com";
const SMTP_PORT = 465;

// Limites de seguridad para el envio desde una peticion web.
const MAX_PER_RUN = 50; // contactos reales por click (evita timeouts y bloqueos de Gmail)
const TEST_LIMIT_DEFAULT = 3;
const DELAY_MS = 200;

// --- Mensaje por defecto (editable por grupo, con placeholders) ----------
export const DEFAULT_SUBJECT = "Recordatorio de mantenimiento - {vehiculo}";
export const DEFAULT_BODY = `Hola {nombre},

Le escribimos desde ${SHOP_NAME} para recordarle que su {vehiculo} esta proximo a cumplir su intervalo de mantenimiento recomendado (aproximadamente cada 6 meses).

Mantener el servicio al dia ayuda a preservar el rendimiento, la fiabilidad y el valor de su Porsche. Con gusto coordinamos una cita cuando mejor le convenga.

Para agendar, llamenos al {telefono}.`;

// --- Helpers de formato --------------------------------------------------
export function firstName(name: string): string {
  if (!name) return "Cliente";
  const token = name.trim().split(/\s+/)[0] ?? "";
  if (!token) return "Cliente";
  return token.charAt(0).toUpperCase() + token.slice(1).toLowerCase();
}

export function formatVehicle(vehicle: string): string {
  if (!vehicle) return "su vehiculo";
  return vehicle
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

export function applyPlaceholders(template: string, contact: Contact): string {
  return template
    .replaceAll("{nombre}", firstName(contact.name))
    .replaceAll("{vehiculo}", formatVehicle(contact.vehicle))
    .replaceAll("{telefono}", SHOP_PHONE);
}

function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

/** Envuelve el cuerpo (ya con placeholders aplicados) en el shell HTML de marca. */
export function wrapHtml(renderedBody: string): string {
  const paragraphs = renderedBody
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map(
      (block) =>
        `<p style="margin:0 0 16px;">${escapeHtml(block).replaceAll("\n", "<br>")}</p>`
    )
    .join("\n");

  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#1a1a1a;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#1a1a1a;padding:24px 0;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:10px;overflow:hidden;">
        <tr>
          <td style="background-color:#0a0a0a;padding:28px 32px;text-align:center;border-bottom:3px solid ${BRAND_RED};">
            <span style="color:${BRAND_RED};font-size:26px;font-weight:bold;letter-spacing:2px;">${SHOP_NAME}</span>
            <div style="color:#c9a227;font-size:11px;letter-spacing:3px;margin-top:6px;text-transform:uppercase;">Independent Porsche Specialists</div>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;color:#222222;font-size:15px;line-height:1.6;">
            ${paragraphs}
            <table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0;">
              <tr>
                <td style="background-color:${BRAND_RED};border-radius:6px;">
                  <a href="tel:${SHOP_PHONE_TEL}" style="display:inline-block;padding:14px 26px;color:#ffffff;font-size:16px;font-weight:bold;text-decoration:none;">Llamar al ${SHOP_PHONE}</a>
                </td>
              </tr>
            </table>
            <p style="margin:0;color:#555555;font-size:14px;">Telefono del taller: <strong>${SHOP_PHONE}</strong><br>${SHOP_LOCATION}</p>
          </td>
        </tr>
        <tr>
          <td style="background-color:#f2f2f2;padding:20px 32px;color:#888888;font-size:12px;line-height:1.5;text-align:center;">
            Si ya realizo este servicio recientemente o no desea recibir estos recordatorios, puede ignorar este mensaje.<br>
            &copy; ${new Date().getFullYear()} ${SHOP_NAME} &middot; ${SHOP_LOCATION}
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// --- Envio ---------------------------------------------------------------
export type SendOptions = { testMode: boolean; testEmail?: string; limit?: number };
export type SendResult = {
  sent: number;
  failed: number;
  remaining: number;
  errors: string[];
  sentEmails: string[];
  testMode: boolean;
};

export function getTransport() {
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!pass) {
    throw new Error("Falta la variable de entorno GMAIL_APP_PASSWORD en el servidor.");
  }
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: true,
    auth: { user: SENDER_EMAIL, pass }
  });
}

/** Construye el objeto de correo para un contacto (recipient opcional para modo prueba). */
export function buildMail(group: ContactGroup, contact: Contact, recipient?: string) {
  const subjectTemplate = group.subject?.trim() || DEFAULT_SUBJECT;
  const bodyTemplate = group.body?.trim() || DEFAULT_BODY;
  return {
    from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
    to: recipient ?? contact.email,
    subject: applyPlaceholders(subjectTemplate, contact),
    html: wrapHtml(applyPlaceholders(bodyTemplate, contact))
  };
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function sendGroup(group: ContactGroup, options: SendOptions): Promise<SendResult> {
  // Construir lista de trabajo
  let worklist: Contact[];
  let remaining = 0;
  if (options.testMode) {
    const limit = Math.max(1, options.limit ?? TEST_LIMIT_DEFAULT);
    // Enviar EXACTAMENTE `limit` correos de prueba; si el grupo tiene menos
    // contactos, se cicla sobre ellos para honrar el numero pedido.
    worklist = group.contacts.length
      ? Array.from({ length: limit }, (_, i) => group.contacts[i % group.contacts.length])
      : [];
  } else {
    const pending = group.contacts.filter((c) => !c.sentAt);
    worklist = pending.slice(0, MAX_PER_RUN);
    remaining = Math.max(0, pending.length - worklist.length);
  }

  if (options.testMode && !options.testEmail) {
    throw new Error("En modo prueba debes indicar un email de prueba.");
  }

  const transport = getTransport();
  const errors: string[] = [];
  const sentEmails: string[] = [];
  let sent = 0;
  let failed = 0;

  for (let i = 0; i < worklist.length; i++) {
    const contact = worklist[i];
    try {
      await transport.sendMail(buildMail(group, contact, options.testMode ? options.testEmail! : undefined));
      sent++;
      if (!options.testMode) sentEmails.push(contact.email);
    } catch (error) {
      failed++;
      const message = error instanceof Error ? error.message : String(error);
      errors.push(`${contact.email}: ${message}`);
    }
    if (i < worklist.length - 1) await sleep(DELAY_MS);
  }

  transport.close();
  return { sent, failed, remaining, errors, sentEmails, testMode: options.testMode };
}
