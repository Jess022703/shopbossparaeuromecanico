import ExcelJS from "exceljs";
import type { Cell } from "exceljs";
import type { Contact } from "./types";

const PREFERRED_SHEET = "Para Reminder 6 Meses";

/** Convierte el valor de una celda de exceljs a texto plano de forma robusta. */
function cellText(cell: Cell): string {
  const value = cell.value;
  if (value === null || value === undefined) return "";

  if (typeof value === "object") {
    // Hyperlink (ej: celdas de email), formula con resultado, o rich text.
    const obj = value as unknown as Record<string, unknown>;
    if (typeof obj.text === "string") return obj.text.trim();
    if (Array.isArray(obj.richText)) {
      return obj.richText.map((part) => String((part as { text?: string }).text ?? "")).join("").trim();
    }
    if (obj.result !== undefined && obj.result !== null) return String(obj.result).trim();
    if (typeof obj.hyperlink === "string") return obj.hyperlink.replace(/^mailto:/i, "").trim();
    if (value instanceof Date) return value.toISOString();
  }

  return String(value).trim();
}

/**
 * Lee un .xlsx (buffer) y devuelve los contactos.
 * Columnas esperadas (1-indexadas en exceljs): 1=nombre, 2=telefono, 3=email, 4=vehiculo.
 * Salta la fila de encabezado y las filas sin email valido.
 */
export async function parseContactsFromBuffer(buffer: ArrayBuffer): Promise<Contact[]> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);

  const sheet = workbook.getWorksheet(PREFERRED_SHEET) ?? workbook.worksheets[0];
  if (!sheet) return [];

  const contacts: Contact[] = [];
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // encabezado

    const name = cellText(row.getCell(1));
    const phone = cellText(row.getCell(2));
    const email = cellText(row.getCell(3));
    const vehicle = cellText(row.getCell(4));

    if (!email || !email.includes("@")) return; // email invalido/vacio
    contacts.push({ name, phone, email, vehicle });
  });

  return contacts;
}
