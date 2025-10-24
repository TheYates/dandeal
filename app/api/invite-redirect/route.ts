import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Get the token from the query params
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get("token");
  
  if (!token) {
    // If no token, redirect to homepage
    return NextResponse.redirect(new URL("/", request.url));
  }
  
  // Build the Supabase verification URL
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://dandeal.vercel.app'}/invite`;
  
  // Redirect to Supabase for verification, which will then redirect back to /invite
  const verifyUrl = `${supabaseUrl}/auth/v1/verify?token=${token}&type=invite&redirect_to=${encodeURIComponent(redirectUrl)}`;
  
  return NextResponse.redirect(verifyUrl);
}

