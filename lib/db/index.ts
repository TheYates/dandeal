import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

// Create postgres client with serverless-optimized settings for Neon
const connectionString = process.env.DATABASE_URL;
const client = postgres(connectionString, {
  max: 1, // Limit to 1 connection per serverless function instance
  idle_timeout: 20,
  max_lifetime: 60 * 30,
  connect_timeout: 10,
});

// Create drizzle instance
export const db = drizzle(client, { schema });
