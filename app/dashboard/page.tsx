"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardOverview } from "@/components/dashboard-overview"
import { MoodTrackerForm } from "@/components/mood-tracker-form"
import { AnalyticsTab } from "@/components/analytics-tab"
import { EmergencyContactTab } from "@/components/emergency-contact-tab"
import { SettingsTab } from "@/components/settings-tab"
import { UserProfileMenu } from "@/components/user-profile-menu"
import { ThemeToggle } from "@/components/theme-toggle"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const router = useRouter()

  useEffect(() => {
    const loadUser = async () => {
      const supabase = createClient()
      const { data, error } = await supabase.auth.getUser()

      if (error || !data?.user) {
        router.push("/login")
      } else {
        setUser(data.user)
      }
      setIsLoading(false)
    }

    loadUser()
  }, [router])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
  }

  if (isLoading) {
    return <div className="min-h-svh flex items-center justify-center">טוען...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-svh w-full bg-gradient-to-br from-background to-muted/20">
      {/* Mobile Header - sticky at top */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3 md:hidden">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-lg font-bold truncate">שלום, {user.email?.split("@")[0]}!</h1>
            <p className="text-xs text-muted-foreground">איך אתה מרגיש היום?</p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <UserProfileMenu email={user.email || ""} createdAt={user.created_at} onSignOut={handleSignOut} />
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block p-6 md:p-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">שלום, {user.email?.split("@")[0]}!</h1>
              <p className="text-muted-foreground mt-1">איך אתה מרגיש היום?</p>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <UserProfileMenu email={user.email || ""} createdAt={user.created_at} onSignOut={handleSignOut} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with mobile padding */}
      <div className="pb-20 md:pb-6">
        <div className="mx-auto max-w-7xl px-4 md:px-10">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Desktop Tabs - horizontal */}
            <TabsList className="hidden md:grid w-full grid-cols-5 mb-8" dir="ltr">
              <TabsTrigger value="settings" className="gap-2">
                <span className="text-lg">⚙️</span>
                <span>הגדרות</span>
              </TabsTrigger>
              <TabsTrigger value="emergency" className="gap-2">
                <span className="text-lg">🆘</span>
                <span>קשר</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="gap-2">
                <span className="text-lg">📈</span>
                <span>ניתוח</span>
              </TabsTrigger>
              <TabsTrigger value="report" className="gap-2">
                <span className="text-lg">✍️</span>
                <span>דיווח</span>
              </TabsTrigger>
              <TabsTrigger value="overview" className="gap-2">
                <span className="text-lg">📊</span>
                <span>לוח בקרה</span>
              </TabsTrigger>
            </TabsList>

            {/* Mobile Bottom Navigation - native app style */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border safe-bottom">
              <div className="grid grid-cols-5 h-16">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                    activeTab === "overview" ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <span className="text-xl">📊</span>
                  <span className="text-xs font-medium">בקרה</span>
                </button>
                <button
                  onClick={() => setActiveTab("report")}
                  className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                    activeTab === "report" ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <span className="text-xl">✍️</span>
                  <span className="text-xs font-medium">דיווח</span>
                </button>
                <button
                  onClick={() => setActiveTab("analytics")}
                  className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                    activeTab === "analytics" ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <span className="text-xl">📈</span>
                  <span className="text-xs font-medium">ניתוח</span>
                </button>
                <button
                  onClick={() => setActiveTab("emergency")}
                  className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                    activeTab === "emergency" ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <span className="text-xl">🆘</span>
                  <span className="text-xs font-medium">קשר</span>
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                    activeTab === "settings" ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <span className="text-xl">⚙️</span>
                  <span className="text-xs font-medium">הגדרות</span>
                </button>
              </div>
            </div>

            <TabsContent value="overview" className="mt-0">
              <DashboardOverview
                userEmail={user.email || ""}
                userId={user.id}
                onNavigateToReport={() => setActiveTab("report")}
              />
            </TabsContent>

            <TabsContent value="report" className="mt-0">
              <div className="max-w-3xl mx-auto">
                <MoodTrackerForm />
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="mt-0">
              <AnalyticsTab userId={user.id} />
            </TabsContent>

            <TabsContent value="emergency" className="mt-0">
              <EmergencyContactTab />
            </TabsContent>

            <TabsContent value="settings" className="mt-0">
              <SettingsTab userEmail={user.email || ""} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
