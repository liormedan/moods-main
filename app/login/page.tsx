"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { Activity } from "lucide-react"
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  const router = useRouter()
  const { user, isLoaded } = useUser()

  useEffect(() => {
    if (isLoaded && user) {
      router.push("/dashboard")
    }
  }, [router, user, isLoaded])

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-12 w-12 mx-auto mb-4 text-primary animate-pulse" />
          <p className="text-muted-foreground">טוען...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect to dashboard
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center p-6 lg:p-12 order-2 lg:order-1">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile branding */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Activity className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-bold">MOODS</h1>
            </div>
            <p className="text-xl text-muted-foreground">לניהול מצבי רוח</p>
          </div>

          <LoginForm />
        </div>
      </div>

      <div className="hidden lg:flex lg:flex-col lg:items-center lg:justify-center bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-600 p-12 text-white order-1 lg:order-2">
        <div className="space-y-8 text-center max-w-md">
          <div className="flex items-center justify-center gap-3">
            <Activity className="h-16 w-16" />
            <h1 className="text-6xl font-bold">MOODS</h1>
          </div>
          <p className="text-3xl font-semibold">לניהול מצבי רוח</p>
          <p className="text-xl leading-relaxed opacity-90">
            עקוב אחרי מצב הרוח, האנרגיה והרווחה שלך. קבל תובנות מעמיקות על הדפוסים היומיומיים שלך ושפר את איכות החיים.
          </p>
        </div>
      </div>
    </div>
  )
}

