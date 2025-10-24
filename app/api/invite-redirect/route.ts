import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // This route handles the invite token from Supabase email
    // IMPORTANT: The email template should use {{ .ConfirmationURL }}
    // which automatically generates the correct verification URL
    //
    // If the email template is still using the old format with ?token=XXX,
    // this route will redirect to Supabase's verify endpoint

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
      console.log("Redirecting to Supabase verify endpoint with token");
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dandeal.vercel.app';

      if (!supabaseUrl) {
        console.error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable");
        return NextResponse.redirect(new URL("/sign-in", request.url));
      }

      // Redirect to Supabase verify endpoint
      // Supabase will verify the token and redirect back to /invite with access_token in hash
      const verifyUrl = `${supabaseUrl}/auth/v1/verify?token=${encodeURIComponent(token)}&type=invite&redirect_to=${encodeURIComponent(`${appUrl}/invite`)}`;

      console.log("Verify URL constructed (token hidden for security)");
      return NextResponse.redirect(verifyUrl);
    }

    console.log("No token provided, redirecting to sign-in");
    return NextResponse.redirect(new URL("/sign-in", request.url));
  } catch (error) {
    console.error("Error in invite redirect:", error);
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
}

