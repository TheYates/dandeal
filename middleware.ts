import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  
  // Protected admin routes
  if (pathname.startsWith("/admin")) {
    if (!req.auth) {
      // Redirect to sign-in if not authenticated
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  // Redirect to admin if already authenticated and trying to access sign-in
  if (pathname === "/sign-in" && req.auth) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/sign-in"],
};
