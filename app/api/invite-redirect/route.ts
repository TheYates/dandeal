import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // This route handles the case where Supabase sends the user to /api/invite-redirect
    // We need to redirect them to /invite with all the query parameters preserved

    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get("token");
    const type = searchParams.get("type");
    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");

    console.log("Invite redirect - Token present:", !!token);
    console.log("Invite redirect - Access token present:", !!accessToken);
    console.log("Invite redirect - Type:", type);

    // If we have access_token (from Supabase verification), redirect to /invite with hash
    if (accessToken) {
      console.log("Redirecting to /invite with access token");
      const inviteUrl = new URL("/invite", request.url);

      // Build the hash with all tokens
      const hashParams = new URLSearchParams();
      hashParams.set("access_token", accessToken);
      if (refreshToken) hashParams.set("refresh_token", refreshToken);
      if (type) hashParams.set("type", type);

      inviteUrl.hash = hashParams.toString();
      return NextResponse.redirect(inviteUrl);
    }

    // If we have a token but no access_token, this might be a direct link
    // Redirect to /invite and let it handle the token
    if (token) {
      console.log("Redirecting to /invite with token");
      const inviteUrl = new URL("/invite", request.url);
      inviteUrl.searchParams.set("token", token);
      if (type) inviteUrl.searchParams.set("type", type);
      return NextResponse.redirect(inviteUrl);
    }

    console.log("No token provided, redirecting to sign-in");
    return NextResponse.redirect(new URL("/sign-in", request.url));
  } catch (error) {
    console.error("Error in invite redirect:", error);
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
}

