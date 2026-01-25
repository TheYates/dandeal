import { ConvexHttpClient } from "convex/browser";

// Server-side Convex client for use in API routes and server components
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!;

if (!convexUrl) {
  throw new Error("NEXT_PUBLIC_CONVEX_URL is not set");
}

// HTTP client for server-side usage (API routes, server components)
export const convex = new ConvexHttpClient(convexUrl);
