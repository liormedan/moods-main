"use client"

import { useState } from "react"
import { Activity } from "lucide-react"
import { LoginForm } from "@/components/login-form"
import { SignupForm } from "@/components/signup-form"
import { Button } from "@/components/ui/button"

export default function Page() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden lg:flex lg:flex-col lg:items-center lg:justify-center bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-600 p-12 text-white">
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

      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile branding */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Activity className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-bold">MOODS</h1>
            </div>
            <p className="text-xl text-muted-foreground">לניהול מצבי רוח</p>
          </div>

          {/* Toggle between login and signup */}
          <div className="flex gap-2 p-1 bg-muted rounded-lg">
            <Button variant={isLogin ? "default" : "ghost"} className="flex-1" onClick={() => setIsLogin(true)}>
              התחברות
            </Button>
            <Button variant={!isLogin ? "default" : "ghost"} className="flex-1" onClick={() => setIsLogin(false)}>
              הרשמה
            </Button>
          </div>

          {/* Forms */}
          {isLogin ? <LoginForm /> : <SignupForm />}
        </div>
      </div>
    </div>
  )
}
