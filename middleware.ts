import { type NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  
  // Check if user is on homepage with invite token in hash/query
  // Since middleware can't access hash (#), we check for common patterns
  if (url.pathname === "/" || url.pathname === "") {
    // Check if this looks like an invite redirect by checking query params
    // Supabase sometimes uses query params before converting to hash
    const searchParams = url.searchParams;
    
    if (
      searchParams.has("access_token") ||
      searchParams.has("type") === true
    ) {
      const type = searchParams.get("type");
      
      // If it's an invite type, redirect to invite page with all params
      if (type === "invite") {
        console.log("Middleware: Detected invite token on homepage, redirecting to /invite");
        url.pathname = "/invite";
        return NextResponse.redirect(url);
      }
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};

