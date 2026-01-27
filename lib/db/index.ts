import { drizzle } from "drizzle-orm/postgres-js";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// NOTE:
// This module is imported by many Next.js route handlers.
// Throwing at import-time breaks builds/environments where DATABASE_URL is not set
// (e.g. some CI steps, preview builds, or deployments that don't need Postgres).
//
// We therefore initialize the Drizzle client lazily:
// - importing `db` is always safe
// - the first actual DB usage will throw a clear error if DATABASE_URL is missing

export type Db = PostgresJsDatabase<typeof schema>;

let _db: Db | null = null;

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export function getDb(): Db {
  if (_db) return _db;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Configure it to use Postgres-backed API routes."
    );
  }

  // Create postgres client with serverless-optimized settings for Neon
  const client = postgres(connectionString, {
    max: 1, // Limit to 1 connection per serverless function instance
    idle_timeout: 20,
    max_lifetime: 60 * 30,
    connect_timeout: 10,
  });

  _db = drizzle(client, { schema });
  return _db;
}

/**
 * A lazily initialized Drizzle database instance.
 *
 * This is implemented as a Proxy so existing imports (`import { db } from "@/lib/db"`)
 * keep working while deferring initialization until the first property access.
 */
export const db: Db = new Proxy({} as Db, {
  get(_target, prop, receiver) {
    const realDb = getDb() as any;
    return Reflect.get(realDb, prop, receiver);
  },
});
