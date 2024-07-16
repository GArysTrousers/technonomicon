import { rmSync } from "node:fs";

try {
  rmSync('./drizzle', { recursive: true, force: true })
  console.log("drizzle deleted");
} catch (e) {
  console.log("drizzle not deleted", e);
}
try {
  rmSync('./sqlite.db')
  console.log("sqlite deleted");
} catch (e) {
  console.log("sqlite not deleted");
}