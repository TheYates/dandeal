import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

// Create postgres client
const connectionString = process.env.DATABASE_URL;
const client = postgres(connectionString);

// Create drizzle instance
export const db = drizzle(client, { schema });
