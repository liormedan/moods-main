"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // בדיקה שהמשתמש הגיע דרך לינק איפוס תקין
    const checkSession = async () => {
      const supabase = createClient()
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        router.push("/")
      }
    }
    checkSession()
  }, [router])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError("הסיסמאות אינן תואמות")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("הסיסמה חייבת להכיל לפחות 6 תווים")
      setIsLoading(false)
      return
    }

    const supabase = createClient()

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      })

      if (error) throw error

      setSuccess(true)
      setTimeout(() => {
        router.push("/")
      }, 2000)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "אירעה שגיאה")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4" dir="rtl">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-green-600">הסיסמה שונתה בהצלחה!</CardTitle>
            <CardDescription>מעביר אותך לדף ההתחברות...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4" dir="rtl">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">איפוס סיסמה</CardTitle>
          <CardDescription>הזן סיסמה חדשה לחשבון שלך</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResetPassword}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="password">סיסמה חדשה</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="לפחות 6 תווים"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">אימות סיסמה</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="הזן שוב את הסיסמה"
                />
              </div>
              {error && <p className="text-sm text-red-500 text-center">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "משנה סיסמה..." : "שנה סיסמה"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
