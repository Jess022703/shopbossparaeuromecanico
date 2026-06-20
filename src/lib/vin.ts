export function detectPorscheGeneration(year?: number, model = "") {
  if (!year) return undefined;
  const normalized = model.toLowerCase();

  if (normalized.includes("911")) {
    if (year >= 2020) return "992";
    if (year >= 2017) return "991.2";
    if (year >= 2012) return "991.1";
    if (year >= 2009) return "997.2";
    if (year >= 2005) return "997.1";
    if (year >= 1999) return "996";
    return "Classic 911";
  }

  if (normalized.includes("cayenne")) {
    if (year >= 2019) return "E3";
    if (year >= 2011) return "958";
    return "955/957";
  }

  if (normalized.includes("boxster") || normalized.includes("cayman")) {
    if (year >= 2017) return "982";
    if (year >= 2013) return "981";
    if (year >= 2005) return "987";
    return "986";
  }

  if (normalized.includes("panamera")) {
    if (year >= 2017) return "971";
    return "970";
  }

  if (normalized.includes("macan")) return year >= 2022 ? "95B.2" : "95B.1";
  if (normalized.includes("taycan")) return "J1";

  return undefined;
}

export async function decodeVin(vin: string) {
  const cleanVin = vin.trim().toUpperCase();
  if (cleanVin.length < 11) {
    throw new Error("VIN invalido");
  }

  const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/${cleanVin}?format=json`, {
    next: { revalidate: 60 * 60 * 24 }
  });

  if (!response.ok) {
    throw new Error("No se pudo consultar NHTSA");
  }

  const json = await response.json();
  const result = json.Results?.[0] ?? {};
  const year = Number(result.ModelYear || 0) || undefined;
  const make = result.Make || "";
  const model = result.Model || "";

  return {
    vin: cleanVin,
    year,
    make,
    model,
    trim: result.Trim || result.Series || "",
    bodyClass: result.BodyClass || "",
    engine: result.EngineModel || result.EngineConfiguration || "",
    generation: make.toLowerCase().includes("porsche") ? detectPorscheGeneration(year, model) : undefined
  };
}
