import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { schema } from "./schema";
import { appLogger } from "../../../utils/logger";

// Create the pool for PostgreSQL connection
const pool = new Pool({
  database: process.env["PGSQL_DB"],
  host: process.env["PGSQL_HOST"],
  password: process.env["PGSQL_PASSWORD"],
  port: process.env["PGSQL_PORT"] ? Number(process.env["PGSQL_PORT"]) : 5432, // Correct default port for PostgreSQL
  user: process.env["PGSQL_USER"],
  max: 20, // Example: max number of clients in the pool
  idleTimeoutMillis: 30000, // Example: how long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // Example: how long to wait for a connection
});

// Optional: check DB connection
pool
  .connect()
  .then((client) => {
    appLogger.info("PostgreSQL connected successfully");
    client.release(); // Release the client back to the pool
  })
  .catch((err) => {
    appLogger.error("PostgreSQL connection failed:", err);
    process.exit(1); // Optionally exit if critical
  });

// Initialize Drizzle with the pool
export const db = drizzle(pool, { schema });
