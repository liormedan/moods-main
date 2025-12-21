"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, Phone, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function EmergencyFloatingButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        size="lg"
        variant="destructive"
        className="fixed bottom-6 left-6 z-50 h-16 w-16 rounded-full shadow-2xl animate-pulse hover:animate-none"
        onClick={() => setIsOpen(true)}
        aria-label="חירום"
      >
        <AlertCircle className="h-8 w-8" />
      </Button>

      {/* דיאלוג חירום מהיר */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md border-red-500">
            <CardHeader className="relative">
              <Button variant="ghost" size="sm" className="absolute left-2 top-2" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
              <CardTitle className="text-center text-red-600 dark:text-red-400">
                <AlertCircle className="inline-block ml-2 h-6 w-6" />
                מצב חירום
              </CardTitle>
              <CardDescription className="text-center">בחר באפשרות המתאימה</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                size="lg"
                variant="destructive"
                className="w-full text-lg h-14"
                onClick={() => window.open("tel:1201", "_blank")}
              >
                <Phone className="ml-2 h-5 w-5" />
                חייג 1201 - ער״ן
              </Button>
              <Button
                size="lg"
                variant="destructive"
                className="w-full text-lg h-14"
                onClick={() => window.open("tel:100", "_blank")}
              >
                <Phone className="ml-2 h-5 w-5" />
                חייג 100 - משטרה
              </Button>
              <Button
                size="lg"
                variant="destructive"
                className="w-full text-lg h-14"
                onClick={() => window.open("tel:101", "_blank")}
              >
                <Phone className="ml-2 h-5 w-5" />
                חייג 101 - מד״א
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
