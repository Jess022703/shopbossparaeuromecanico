import nodemailer from "nodemailer";
import { OrderStatus } from "./constants";
import { SHOP } from "./shop";

interface MessageContext {
  make: string;
  model: string;
}

// Spanish message templates per status (see project spec).
export function buildStatusMessage(
  status: OrderStatus,
  ctx: MessageContext
): string {
  const vehicle = `${ctx.make} ${ctx.model}`.trim();
  switch (status) {
    case "RECEIVED":
      return `Hemos recibido su vehículo ${vehicle}. Le notificaremos cuando comience el diagnóstico.`;
    case "DIAGNOSING":
      return "Estamos diagnosticando su vehículo. Le informaremos pronto.";
    case "WAITING_PARTS":
      return "Estamos esperando piezas para su vehículo. Le avisaremos cuando lleguen.";
    case "IN_REPAIR":
      return "Su vehículo está en proceso de reparación.";
    case "READY":
      return "¡Su vehículo está listo para ser recogido! Puede visitarnos en horario de lunes a viernes 8am-5pm.";
    case "DELIVERED":
      return "Gracias por confiar en Euromecanico Corp. ¡Hasta la próxima!";
    default:
      return "";
  }
}

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter | null {
  if (!process.env.SMTP_HOST) return null;
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT ?? 587) === 465,
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  });
  return transporter;
}

export interface SendResult {
  channel: string;
  body: string;
  delivered: boolean;
}

// Send an email if SMTP is configured and a recipient exists; otherwise
// fall back to logging. The body is always returned so it can be persisted
// to the MessageLog regardless of delivery.
export async function sendClientEmail(
  to: string | null | undefined,
  subject: string,
  body: string
): Promise<SendResult> {
  const t = getTransporter();
  if (!to) {
    return { channel: "none", body, delivered: false };
  }
  if (!t) {
    // No SMTP configured — log-only mode so the app works out of the box.
    console.log(`[email:log-only] to=${to} subject="${subject}" body="${body}"`);
    return { channel: "email-log", body, delivered: false };
  }
  try {
    await t.sendMail({
      from: process.env.SMTP_FROM ?? `${SHOP.name} <${SHOP.email}>`,
      to,
      subject,
      text: `${body}\n\n— ${SHOP.name}\n${SHOP.phone}\n${SHOP.hours}`,
    });
    return { channel: "email", body, delivered: true };
  } catch (err) {
    console.error("[email] send failed:", err);
    return { channel: "email-failed", body, delivered: false };
  }
}
