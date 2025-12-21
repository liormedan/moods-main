import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/dashboard"

  console.log("[v0] Auth callback received:", { code: !!code, next, origin })

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error("[v0] Error exchanging code for session:", error)
      return NextResponse.redirect(`${origin}/?error=${encodeURIComponent(error.message)}`)
    }

    console.log("[v0] Successfully exchanged code, redirecting to:", next)
    const forwardedSearchParams = new URLSearchParams()
    return NextResponse.redirect(`${origin}${next}`)
  }

  // אם אין code, חזור לדף הבית
  console.log("[v0] No code found, redirecting to home")
  return NextResponse.redirect(`${origin}/`)
}
