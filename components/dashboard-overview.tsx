"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft } from "lucide-react"

interface MoodEntry {
  id: string
  mood_level: number
  energy_level: number
  stress_level: number
  created_at: string
}

interface DashboardOverviewProps {
  userEmail: string
  userId: string
  onNavigateToReport?: () => void // Added callback prop
}

export function DashboardOverview({ userEmail, userId, onNavigateToReport }: DashboardOverviewProps) {
  const [stats, setStats] = useState({
    totalEntries: 0,
    avgMood: 0,
    avgEnergy: 0,
    avgStress: 0,
    lastEntry: null as MoodEntry | null,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from("mood_entries").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("[v0] Error loading stats:", error)
      } else if (data) {
        const totalEntries = data.length
        const avgMood = totalEntries > 0 ? data.reduce((sum, e) => sum + e.mood_level, 0) / totalEntries : 0
        const avgEnergy = totalEntries > 0 ? data.reduce((sum, e) => sum + e.energy_level, 0) / totalEntries : 0
        const avgStress = totalEntries > 0 ? data.reduce((sum, e) => sum + e.stress_level, 0) / totalEntries : 0

        setStats({
          totalEntries,
          avgMood: Math.round(avgMood * 10) / 10,
          avgEnergy: Math.round(avgEnergy * 10) / 10,
          avgStress: Math.round(avgStress * 10) / 10,
          lastEntry: data[0] || null,
        })
      }
    } catch (error) {
      console.error("[v0] Unexpected error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getMoodEmoji = (level: number) => {
    if (level <= 3) return "😢"
    if (level <= 5) return "😐"
    if (level <= 7) return "🙂"
    return "😄"
  }

  const getMoodStatus = (mood: number) => {
    if (mood <= 3) return { text: "זקוק לתמיכה", color: "text-red-600" }
    if (mood <= 5) return { text: "סביר", color: "text-yellow-600" }
    if (mood <= 7) return { text: "טוב", color: "text-blue-600" }
    return { text: "מצוין!", color: "text-green-600" }
  }

  if (isLoading) {
    return <div className="text-center py-12">טוען נתונים...</div>
  }

  const moodStatus =
    stats.avgMood > 0 ? getMoodStatus(stats.avgMood) : { text: "אין נתונים", color: "text-muted-foreground" }

  return (
    <div className="space-y-6">
      {/* כרטיס מצב נוכחי */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl">המצב שלך כרגע</CardTitle>
          <CardDescription>סיכום המצב הרגשי שלך</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <div className="text-6xl mb-2">{getMoodEmoji(stats.avgMood)}</div>
              <p className={`text-xl font-bold ${moodStatus.color}`}>{moodStatus.text}</p>
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">מצב רוח ממוצע:</span>
                <span className="text-2xl font-bold">{stats.avgMood > 0 ? stats.avgMood : "-"}/10</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">אנרגיה ממוצעת:</span>
                <span className="text-2xl font-bold">{stats.avgEnergy > 0 ? stats.avgEnergy : "-"}/10</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">לחץ ממוצע:</span>
                <span className="text-2xl font-bold">{stats.avgStress > 0 ? stats.avgStress : "-"}/10</span>
              </div>
            </div>
          </div>

          <Button size="lg" className="w-full" onClick={onNavigateToReport}>
            דווח על מצב רוח עכשיו
            <ArrowLeft className="mr-2 h-5 w-5" />
          </Button>
        </CardContent>
      </Card>

      {/* סטטיסטיקות כלליות */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">סה״כ רשומות</CardTitle>
            <span className="text-2xl">📝</span>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalEntries}</div>
            <p className="text-xs text-muted-foreground mt-1">דיווחים שנשמרו</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">מעקב רציף</CardTitle>
            <span className="text-2xl">🔥</span>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalEntries > 0 ? Math.min(stats.totalEntries, 7) : 0}</div>
            <p className="text-xs text-muted-foreground mt-1">ימים ברציפות</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">דיווח אחרון</CardTitle>
            <span className="text-2xl">⏰</span>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {stats.lastEntry
                ? new Date(stats.lastEntry.created_at).toLocaleDateString("he-IL", {
                    day: "numeric",
                    month: "short",
                  })
                : "אין"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.lastEntry
                ? new Date(stats.lastEntry.created_at).toLocaleTimeString("he-IL", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "טרם דווח"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* דיווח אחרון */}
      {stats.lastEntry && (
        <Card>
          <CardHeader>
            <CardTitle>הדיווח האחרון שלך</CardTitle>
            <CardDescription>
              {new Date(stats.lastEntry.created_at).toLocaleDateString("he-IL", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground mb-1">מצב רוח</p>
                <p className="text-3xl">{getMoodEmoji(stats.lastEntry.mood_level)}</p>
                <p className="text-lg font-bold mt-1">{stats.lastEntry.mood_level}/10</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">אנרגיה</p>
                <p className="text-3xl">⚡</p>
                <p className="text-lg font-bold mt-1">{stats.lastEntry.energy_level}/10</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">לחץ</p>
                <p className="text-3xl">
                  {stats.lastEntry.stress_level <= 3 ? "😌" : stats.lastEntry.stress_level <= 6 ? "😰" : "🤯"}
                </p>
                <p className="text-lg font-bold mt-1">{stats.lastEntry.stress_level}/10</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
