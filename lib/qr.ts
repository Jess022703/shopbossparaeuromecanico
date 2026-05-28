import QRCode from "qrcode";
import { baseUrl } from "./format";

export function trackUrl(qrToken: string): string {
  return `${baseUrl()}/track/${qrToken}`;
}

export async function qrDataUrl(qrToken: string): Promise<string> {
  return QRCode.toDataURL(trackUrl(qrToken), {
    width: 320,
    margin: 1,
    color: { dark: "#171513", light: "#ffffff" },
  });
}
