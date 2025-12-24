"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSignUp } from "@clerk/nextjs"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export function SignupForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { signUp, setActive } = useSignUp()


  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!signUp) return
    
    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError("הסיסמאות אינן תואמות")
      setIsLoading(false)
      return
    }

    try {
      const result = await signUp.create({
        emailAddress: email,
        password,
      })

      console.log("🟣 [SIGNUP] Sign up result:", {
        status: result.status,
        hasSessionId: !!result.createdSessionId,
      })

      if (result.status === "complete") {
        if (result.createdSessionId) {
          await setActive({ session: result.createdSessionId })
          console.log("🟣 [SIGNUP] Session activated, redirecting to dashboard")
          // Use window.location for more reliable redirect
          window.location.href = "/dashboard"
        } else {
          setError("ההרשמה הושלמה אבל לא נוצר session. אנא נסה להתחבר.")
        }
      } else if (result.status === "missing_requirements") {
        // Handle email verification or other requirements
        if (result.unverifiedFields?.includes("email_address")) {
          setError("נא לאמת את האימייל שלך - נשלח לך אימייל")
        } else {
          setError("נא להשלים את כל השדות הנדרשים")
        }
      } else {
        setError("ההרשמה לא הושלמה. נא לנסות שוב.")
      }
    } catch (error: unknown) {
      console.error("🔴 [SIGNUP] Sign up error:", error)
      setError(error instanceof Error ? error.message : "אירעה שגיאה")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    if (!signUp) return
    
    setIsLoading(true)
    setError(null)

    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: `${window.location.origin}/sso-callback`,
        redirectUrlComplete: `${window.location.origin}/dashboard`,
      })
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "אירעה שגיאה בהרשמה עם Google")
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {/* Clerk CAPTCHA widget - hidden, used for bot protection */}
      <div id="clerk-captcha" style={{ display: "none" }} />
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">הרשמה</CardTitle>
          <CardDescription>צור חשבון חדש כדי להתחיל</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">אימייל</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">סיסמה</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="repeat-password">אימות סיסמה</Label>
                <Input
                  id="repeat-password"
                  type="password"
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "יוצר חשבון..." : "הירשם"}
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">או</span>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full bg-transparent"
                onClick={(e) => {
                  console.log("🟣 [SIGNUP] Google button clicked!")
                  console.log("🟣 [SIGNUP] Event:", e)
                  console.log("🟣 [SIGNUP] Current URL:", window.location.href)
                  handleGoogleSignup()
                }}
                disabled={isLoading}
              >
                <svg className="ml-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                המשך עם Google
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              כבר יש לך חשבון?{" "}
              <Link href="/login" prefetch={false} className="underline underline-offset-4">
                התחבר
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
