
import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import { t_admin, t_model } from "../src/lib/schema";

const sqlite = new Database("sqlite.db");
const db = drizzle(sqlite);

await db
  .insert(t_model)
  .values([
    {
      model_id: 1,
      name: "None",
      group: ""
    },
    {
      model_id: 2,
      name: "Lenovo 11e",
      group: "CN=Lenovo 11E,OU=Computer Groups,OU=Groups,OU=BSC,DC=bsc,DC=local"
    }
  ])
await db
  .insert(t_admin)
  .values([
    {
      admin_id: "abc",
      dn: "Mr ABC",
      enabled: 1,
    },
  ])
