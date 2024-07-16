import { drizzle } from "drizzle-orm/mysql2";
import { createConnection } from "mysql2/promise";
import { t_model, t_admin } from "$lib/schema";

const client = await createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
})
export const db = drizzle(client);

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
client.end()