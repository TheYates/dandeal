"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

// Note: If NEXT_PUBLIC_CONVEX_URL is missing at runtime/build-time, Convex internals can crash
// with a cryptic error (e.g. reading 'call'). Provide a clearer failure mode.
if (!convexUrl) {
  // Throwing here makes the issue obvious during development and in logs.
  throw new Error("NEXT_PUBLIC_CONVEX_URL is not set. Please configure it in your environment.");
}

const convex = new ConvexReactClient(convexUrl);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
