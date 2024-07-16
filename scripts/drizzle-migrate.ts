import { migrate } from "drizzle-orm/mysql2/migrator";
import { drizzle } from "drizzle-orm/mysql2";
import { createConnection } from "mysql2/promise";
import { configDotenv } from "dotenv";

configDotenv()

const client = await createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
})
const db = drizzle(client);
await migrate(db, { migrationsFolder: "./drizzle" });
client.end();
console.log("Finished Migration");