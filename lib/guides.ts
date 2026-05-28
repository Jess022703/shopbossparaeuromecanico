import { GuideStep } from "./constants";

// Steps are stored as a JSON string (SQLite has no Json type).
export function parseSteps(raw: string | null | undefined): GuideStep[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as GuideStep[]) : [];
  } catch {
    return [];
  }
}
