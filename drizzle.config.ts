import { configDotenv } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

configDotenv()

export default defineConfig({
  dialect: "mysql",
  schema: "./src/lib/schema.ts",
  out: process.env.DRIZZLE_DIR,
  dbCredentials: {
    host: process.env.DB_HOST || "",
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE || "",
  },
})