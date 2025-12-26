"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function Page() {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('access_token') || 
                  document.cookie.match(new RegExp('(^| )access_token=([^;]+)'))?.[2]
    
    if (token) {
      // User is authenticated, redirect to dashboard
      router.push("/dashboard")
    } else {
      // User is not authenticated, redirect to login
      router.push("/login")
    }
    setIsChecking(false)
  }, [router])

  // Show loading state while checking
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-sm text-muted-foreground">טוען...</p>
        </div>
      </div>
    )
  }

  return null
}
