import { NextResponse } from "next/server"

// This route is kept for backward compatibility but Clerk handles SSO via /sso-callback
export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const { searchParams, origin } = requestUrl
  const next = searchParams.get("next") ?? "/dashboard"
  
  // Redirect to SSO callback or dashboard
  return NextResponse.redirect(`${origin}${next}`)
}
