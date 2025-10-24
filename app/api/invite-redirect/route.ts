import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get the token from the query params
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get("token");
    
    console.log("Invite redirect - Token:", token ? "present" : "missing");
    
    if (!token) {
      console.log("No token provided, redirecting to homepage");
      // If no token, redirect to homepage
      return NextResponse.redirect(new URL("/", request.url));
    }
    
    // Build the Supabase verification URL
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dandeal.vercel.app';
    const redirectUrl = `${appUrl}/invite`;
    
    console.log("Redirecting to Supabase for verification");
    console.log("Redirect URL:", redirectUrl);
    
    // Redirect to Supabase for verification, which will then redirect back to /invite
    const verifyUrl = `${supabaseUrl}/auth/v1/verify?token=${token}&type=invite&redirect_to=${encodeURIComponent(redirectUrl)}`;
    
    return NextResponse.redirect(verifyUrl);
  } catch (error) {
    console.error("Error in invite redirect:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}

