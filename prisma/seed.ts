import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { initialData } from "../src/lib/seed-data";

async function main() {
  const dataDir = path.join(process.cwd(), "data");
  await mkdir(dataDir, { recursive: true });
  await writeFile(path.join(dataDir, "euroshop.json"), JSON.stringify(initialData, null, 2));
  console.log("Seed demo data written to data/euroshop.json");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
