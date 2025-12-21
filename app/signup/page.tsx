import { SignupForm } from "@/components/signup-form"
import { Activity } from "lucide-react"

export default function Page() {
  return (
    <div className="flex min-h-screen w-full">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-600 via-cyan-600 to-teal-700 dark:from-teal-800 dark:via-cyan-900 dark:to-teal-950 items-center justify-center p-12">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Activity className="h-16 w-16 text-white" />
            <h1 className="text-6xl font-bold text-white">MOODS</h1>
          </div>
          <p className="text-2xl text-white/90 font-medium">לניהול מצבי רוח</p>
          <p className="text-lg text-white/70 max-w-md mx-auto">
            עקוב אחר מצבי הרוח שלך, נתח דפוסים וקבל תובנות על הרווחה הנפשית שלך
          </p>
        </div>
      </div>

      {/* Right side - Signup Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <SignupForm />
        </div>
      </div>
    </div>
  )
}
