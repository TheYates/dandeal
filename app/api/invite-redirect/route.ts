import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // This route handles the invite token from Supabase email
    // The email sends users to /api/invite-redirect?token=XXX
    // We need to redirect them to /invite with the token in the URL hash

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

    // If we have a token, redirect to Supabase verify endpoint
    // This will verify the token and redirect back with access_token
    if (token) {
      console.log("Redirecting to Supabase verify endpoint");
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dandeal.vercel.app';

      // Redirect to Supabase verify endpoint
      // Supabase will verify the token and redirect back to /invite with access_token in hash
      const verifyUrl = `${supabaseUrl}/auth/v1/verify?token=${token}&type=invite&redirect_to=${encodeURIComponent(`${appUrl}/invite`)}`;

      console.log("Verify URL:", verifyUrl);
      return NextResponse.redirect(verifyUrl);
    }

    console.log("No token provided, redirecting to sign-in");
    return NextResponse.redirect(new URL("/sign-in", request.url));
  } catch (error) {
    console.error("Error in invite redirect:", error);
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
}

