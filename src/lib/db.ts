import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USER } from "$env/static/private";
import { drizzle } from "drizzle-orm/mysql2";
import { createPool } from "mysql2/promise";

console.log(`connecting to db: ${DB_USER}@${DB_HOST}:${DB_PORT}`);


const pool = createPool({
  host: DB_HOST,
  port: Number(DB_PORT),
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});
export const db = drizzle(pool);