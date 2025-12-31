"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardOverview } from "@/components/dashboard-overview"
import { MoodTrackerForm } from "@/components/mood-tracker-form"
import { AnalyticsTab } from "@/components/analytics-tab"
import { EmergencyContactTab } from "@/components/emergency-contact-tab"
import { SettingsTab } from "@/components/settings-tab"
import { UserProfileMenu } from "@/components/user-profile-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Plus, BarChart3, FileText, TrendingUp, Phone, Settings, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

import { authApi } from "@/lib/api/auth"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isMoodDialogOpen, setIsMoodDialogOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      // Check if user is authenticated
      const token = localStorage.getItem('access_token') ||
        document.cookie.match(new RegExp('(^| )access_token=([^;]+)'))?.[2]

      if (!token) {
        // User is not authenticated, redirect to login
        router.push("/login")
        return
      }

      try {
        const userData = await authApi.me()
        setUser(userData)
      } catch (error) {
        console.error("Failed to fetch user data", error)
        // Optionally redirect to login if me() fails (token invalid)
      } finally {
        setIsCheckingAuth(false)
      }
    }

    checkAuth()
  }, [router])

  const handleSignOut = async () => {
    // Clear authentication
    localStorage.removeItem('access_token')
    document.cookie = 'access_token=; path=/; max-age=0'
    router.push("/login")
  }

  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-sm text-muted-foreground">טוען...</p>
        </div>
      </div>
    )
  }

  const sidebarItems = [
    { id: "overview", label: "בקרה", icon: BarChart3 },
    { id: "report", label: "דיווח", icon: FileText },
    { id: "analytics", label: "ניתוח", icon: TrendingUp },
    { id: "emergency", label: "קשר", icon: Phone },
    { id: "settings", label: "הגדרות", icon: Settings },
  ]

  return (
    <div className="min-h-svh w-full bg-gradient-to-br from-background to-muted/20 overflow-x-hidden">
      {/* Mobile Header - sticky at top */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border px-3 py-3 md:hidden safe-top">
        <div className="flex items-center justify-between gap-3 max-w-full">
          <div className="flex-1 min-w-0 text-right">
            <h1 className="text-lg font-bold truncate">שלום{user?.email ? `, ${user.email.split('@')[0]}` : ''}!</h1>
            <p className="text-xs text-muted-foreground">איך אתה מרגיש היום?</p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="p-1.5 rounded-lg border border-border bg-card/50 hover:bg-card transition-colors">
              <ThemeToggle />
            </div>
            <div className="rounded-lg border border-border bg-card/50">
              <UserProfileMenu email={user?.email || ""} createdAt="" onSignOut={handleSignOut} />
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:flex min-h-screen">
        {/* Sidebar */}
        <aside
          className={cn(
            "bg-card border-r border-border flex flex-col fixed right-0 top-0 h-screen z-40 transition-all duration-300",
            isSidebarCollapsed ? "w-20" : "w-64",
          )}
        >
          {/* Sidebar Header */}
          <div className="p-6 border-b border-border flex items-center justify-between">
            {!isSidebarCollapsed && (
              <div>
                <h2 className="text-xl font-bold">MOODS</h2>
                <p className="text-sm text-muted-foreground mt-1">ניהול מצבי רוח</p>
              </div>
            )}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className={cn("p-2 rounded-lg hover:bg-muted transition-colors", isSidebarCollapsed && "mx-auto")}
              aria-label={isSidebarCollapsed ? "פתח תפריט" : "סגור תפריט"}
            >
              {isSidebarCollapsed ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-4 space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                  "justify-center",
                  activeTab === item.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground",
                )}
                title={isSidebarCollapsed ? item.label : undefined}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!isSidebarCollapsed && <span className="font-medium">{item.label}</span>}
              </button>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div
            className={cn("p-4 border-t border-border space-y-3", isSidebarCollapsed && "flex flex-col items-center")}
          >
            <div className={cn("flex items-center gap-2", isSidebarCollapsed ? "justify-center" : "px-2")}>
              <ThemeToggle />
            </div>
            <div className={cn("w-full", isSidebarCollapsed && "flex justify-center")}>
              <UserProfileMenu
                email={user?.email || ""}
                createdAt=""
                onSignOut={handleSignOut}
                compact={isSidebarCollapsed}
              />
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main
          className={cn("flex-1 overflow-y-auto transition-all duration-300", isSidebarCollapsed ? "pr-20" : "pr-64")}
        >
          <div className="p-6 md:p-10">
            <div className="mx-auto max-w-6xl">
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold">שלום{user?.email ? `, ${user.email.split('@')[0]}` : ''}!</h1>
                <p className="text-muted-foreground mt-1">איך אתה מרגיש היום?</p>
              </div>

              {/* Content */}
              {activeTab === "overview" && (
                <DashboardOverview
                  userEmail={user?.email || ""}
                  userId={user?.id || ""}
                  onNavigateToReport={() => setActiveTab("report")}
                />
              )}

              {activeTab === "report" && (
                <div className="max-w-3xl mx-auto">
                  <MoodTrackerForm />
                </div>
              )}

              {activeTab === "analytics" && <AnalyticsTab />}

              {activeTab === "emergency" && <EmergencyContactTab />}

              {activeTab === "settings" && <SettingsTab userEmail="" />}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile FAB Button */}
      <Dialog open={isMoodDialogOpen} onOpenChange={setIsMoodDialogOpen}>
        <DialogTrigger asChild>
          <button
            className="md:hidden fixed bottom-20 right-4 z-40 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center safe-bottom"
            aria-label="דווח מצב רוח"
          >
            <Plus className="w-6 h-6" />
          </button>
        </DialogTrigger>
        <DialogContent className="w-[95vw] max-w-2xl max-h-[85vh] overflow-y-auto">
          <MoodTrackerForm onSuccess={() => setIsMoodDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Mobile Content with bottom navigation */}
      <div className="md:hidden pb-24">
        <div className="mx-auto max-w-7xl px-3">
          {activeTab === "overview" && (
            <DashboardOverview
              userEmail={user?.email || ""}
              userId={user?.id || ""}
              onNavigateToReport={() => setActiveTab("report")}
            />
          )}

          {activeTab === "report" && (
            <div className="max-w-3xl mx-auto">
              <MoodTrackerForm />
            </div>
          )}

          {activeTab === "analytics" && <AnalyticsTab />}

          {activeTab === "emergency" && <EmergencyContactTab />}

          {activeTab === "settings" && <SettingsTab userEmail="" />}
        </div>
      </div>

      {/* Mobile Bottom Navigation - native app style */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border safe-bottom">
        <div className="grid grid-cols-5 h-16">
          <button
            onClick={() => setActiveTab("overview")}
            className={cn(
              "flex flex-col items-center justify-center gap-1 transition-colors",
              activeTab === "overview" ? "text-primary" : "text-muted-foreground",
            )}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-xs font-medium">בקרה</span>
          </button>
          <button
            onClick={() => setActiveTab("report")}
            className={cn(
              "flex flex-col items-center justify-center gap-1 transition-colors",
              activeTab === "report" ? "text-primary" : "text-muted-foreground",
            )}
          >
            <FileText className="w-5 h-5" />
            <span className="text-xs font-medium">דיווח</span>
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={cn(
              "flex flex-col items-center justify-center gap-1 transition-colors",
              activeTab === "analytics" ? "text-primary" : "text-muted-foreground",
            )}
          >
            <TrendingUp className="w-5 h-5" />
            <span className="text-xs font-medium">ניתוח</span>
          </button>
          <button
            onClick={() => setActiveTab("emergency")}
            className={cn(
              "flex flex-col items-center justify-center gap-1 transition-colors",
              activeTab === "emergency" ? "text-primary" : "text-muted-foreground",
            )}
          >
            <Phone className="w-5 h-5" />
            <span className="text-xs font-medium">קשר</span>
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={cn(
              "flex flex-col items-center justify-center gap-1 transition-colors",
              activeTab === "settings" ? "text-primary" : "text-muted-foreground",
            )}
          >
            <Settings className="w-5 h-5" />
            <span className="text-xs font-medium">הגדרות</span>
          </button>
        </div>
      </div>
    </div>
  )
}
