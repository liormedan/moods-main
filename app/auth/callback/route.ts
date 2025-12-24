import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const { searchParams, origin, hostname, protocol } = requestUrl
  const code = searchParams.get("code")
  const errorParam = searchParams.get("error")
  const errorCode = searchParams.get("error_code")
  const errorDescription = searchParams.get("error_description")
  
  // if "next" is in param, use it as the redirect URL
  let next = searchParams.get("next") ?? "/dashboard"
  if (!next.startsWith("/")) {
    // if "next" is not a relative URL, use the default
    next = "/dashboard"
  }


  const supabase = await createClient()

  // אם יש שגיאה מ-Google OAuth או מ-Supabase
  if (errorParam || errorCode) {
    const errorMessage = errorDescription || errorParam || "שגיאה בהתחברות"
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(errorMessage)}`)
  }

  if (code) {
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        return NextResponse.redirect(
          `${origin}/login?error=${encodeURIComponent(error.message || "שגיאה בהתחברות")}`
        )
      }

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        return NextResponse.redirect(
          `${origin}/login?error=${encodeURIComponent("ההתחברות נכשלה")}`
        )
      }

      return NextResponse.redirect(`${origin}${next}`)
    } catch (err) {
      return NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent("שגיאה בלתי צפויה")}`
      )
    }
  }

  // אם אין code, בדוק אם המשתמש כבר מחובר
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    return NextResponse.redirect(`${origin}${next}`)
  }

  return NextResponse.redirect(`${origin}/login`)
}
