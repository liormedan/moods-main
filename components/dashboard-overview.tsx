"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useUser } from "@clerk/nextjs"
import { getMoodEntries } from "@/app/actions/mood-actions"
import { ArrowLeft, TrendingUp, TrendingDown, Clock, Cloud, CloudRain, CloudSnow, Sun } from "lucide-react"

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
  const [enhancedStats, setEnhancedStats] = useState({
    currentStreak: 0,
    bestReportingTime: "",
    weekComparison: 0,
    monthComparison: 0,
    emotionalWeather: "",
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const result = await getMoodEntries()

      if (!result.success || !result.data) {
        // If error, set empty stats
        // console.error("[v0] Error loading stats:", result.error) // Optional logging
        setStats({
          totalEntries: 0,
          avgMood: 0,
          avgEnergy: 0,
          avgStress: 0,
          lastEntry: null,
        })
      } else if (Array.isArray(result.data) && result.data.length > 0) {
        const data = result.data as MoodEntry[]
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

        calculateEnhancedStats(data, avgMood)
      } else {
        // No data available
        setStats({
          totalEntries: 0,
          avgMood: 0,
          avgEnergy: 0,
          avgStress: 0,
          lastEntry: null,
        })
      }
    } catch (error) {
      console.error("[v0] Unexpected error:", error)
      setStats({
        totalEntries: 0,
        avgMood: 0,
        avgEnergy: 0,
        avgStress: 0,
        lastEntry: null,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const calculateEnhancedStats = (entries: MoodEntry[], currentAvgMood: number) => {
    let streak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (let i = 0; i < entries.length; i++) {
      const entryDate = new Date(entries[i].created_at)
      entryDate.setHours(0, 0, 0, 0)
      const daysDiff = Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24))

      if (daysDiff === i) {
        streak++
      } else {
        break
      }
    }

    const timeDistribution: { [key: string]: number } = {}
    entries.forEach((entry) => {
      const hour = new Date(entry.created_at).getHours()
      const timeSlot = hour < 12 ? "בוקר (6:00-12:00)" : hour < 18 ? "אחר הצהריים (12:00-18:00)" : "ערב (18:00-24:00)"
      timeDistribution[timeSlot] = (timeDistribution[timeSlot] || 0) + 1
    })
    const bestTime = Object.entries(timeDistribution).sort((a, b) => b[1] - a[1])[0]?.[0] || "אחר הצהריים (12:00-18:00)"

    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    const thisWeek = entries.filter((e) => new Date(e.created_at) >= oneWeekAgo)
    const twoWeeksAgo = new Date()
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)
    const lastWeek = entries.filter((e) => new Date(e.created_at) >= twoWeeksAgo && new Date(e.created_at) < oneWeekAgo)

    const thisWeekAvg = thisWeek.length > 0 ? thisWeek.reduce((sum, e) => sum + e.mood_level, 0) / thisWeek.length : 0
    const lastWeekAvg = lastWeek.length > 0 ? lastWeek.reduce((sum, e) => sum + e.mood_level, 0) / lastWeek.length : 0
    const weekChange = thisWeekAvg && lastWeekAvg ? ((thisWeekAvg - lastWeekAvg) / lastWeekAvg) * 100 : 0

    const oneMonthAgo = new Date()
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
    const thisMonth = entries.filter((e) => new Date(e.created_at) >= oneMonthAgo)
    const twoMonthsAgo = new Date()
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2)
    const lastMonth = entries.filter(
      (e) => new Date(e.created_at) >= twoMonthsAgo && new Date(e.created_at) < oneMonthAgo,
    )

    const thisMonthAvg =
      thisMonth.length > 0 ? thisMonth.reduce((sum, e) => sum + e.mood_level, 0) / thisMonth.length : 0
    const lastMonthAvg =
      lastMonth.length > 0 ? lastMonth.reduce((sum, e) => sum + e.mood_level, 0) / lastMonth.length : 0
    const monthChange = thisMonthAvg && lastMonthAvg ? ((thisMonthAvg - lastMonthAvg) / lastMonthAvg) * 100 : 0

    let weather = "שמש בהיר"
    if (currentAvgMood >= 8) weather = "שמש בהיר"
    else if (currentAvgMood >= 6) weather = "מעונן חלקית"
    else if (currentAvgMood >= 4) weather = "מעונן"
    else weather = "גשום"

    setEnhancedStats({
      currentStreak: streak,
      bestReportingTime: bestTime,
      weekComparison: Math.round(weekChange),
      monthComparison: Math.round(monthChange),
      emotionalWeather: weather,
    })
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

  const getWeatherIcon = (weather: string) => {
    switch (weather) {
      case "שמש בהיר":
        return <Sun className="h-16 w-16 text-yellow-500" />
      case "מעונן חלקית":
        return <Cloud className="h-16 w-16 text-blue-400" />
      case "מעונן":
        return <CloudRain className="h-16 w-16 text-blue-600" />
      case "גשום":
        return <CloudSnow className="h-16 w-16 text-blue-800" />
      default:
        return <Cloud className="h-16 w-16" />
    }
  }

  if (isLoading) {
    return <div className="text-center py-12">טוען נתונים...</div>
  }

  const moodStatus =
    stats.avgMood > 0 ? getMoodStatus(stats.avgMood) : { text: "אין נתונים", color: "text-muted-foreground" }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">מזג האוויר הרגשי</CardTitle>
            <CardDescription className="text-xs">מצבך הכללי</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>{getWeatherIcon(enhancedStats.emotionalWeather)}</div>
              <div>
                <p className="text-2xl font-bold">{enhancedStats.emotionalWeather}</p>
                <p className="text-xs text-muted-foreground">
                  {enhancedStats.emotionalWeather === "שמש בהיר" && "מצוין!"}
                  {enhancedStats.emotionalWeather === "מעונן חלקית" && "טוב בסך הכל"}
                  {enhancedStats.emotionalWeather === "מעונן" && "ימים קשים"}
                  {enhancedStats.emotionalWeather === "גשום" && "זמן קשה"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">המצב שלך כרגע</CardTitle>
            <CardDescription className="text-xs">ממוצעים כלליים</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-xs text-muted-foreground">מצב רוח</p>
                <p className="text-2xl font-bold">{stats.avgMood > 0 ? stats.avgMood : "-"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">אנרגיה</p>
                <p className="text-2xl font-bold">{stats.avgEnergy > 0 ? stats.avgEnergy : "-"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">לחץ</p>
                <p className="text-2xl font-bold">{stats.avgStress > 0 ? stats.avgStress : "-"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">רשומות</CardTitle>
              <span className="text-xl">📝</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEntries}</div>
          </CardContent>
        </Card>

        <Card className="border-orange-500/20">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">רצף ימים</CardTitle>
              <span className="text-xl">🔥</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enhancedStats.currentStreak}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">שבועי</CardTitle>
              {enhancedStats.weekComparison > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : enhancedStats.weekComparison < 0 ? (
                <TrendingDown className="h-4 w-4 text-red-500" />
              ) : null}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {enhancedStats.weekComparison > 0 ? "+" : ""}
              {enhancedStats.weekComparison}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">חודשי</CardTitle>
              {enhancedStats.monthComparison > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : enhancedStats.monthComparison < 0 ? (
                <TrendingDown className="h-4 w-4 text-red-500" />
              ) : null}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {enhancedStats.monthComparison > 0 ? "+" : ""}
              {enhancedStats.monthComparison}%
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <CardTitle className="text-sm">זמן אידיאלי</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold">{enhancedStats.bestReportingTime}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">פעולה מהירה</CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={onNavigateToReport}>
              דווח עכשיו
              <ArrowLeft className="mr-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {stats.lastEntry && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">הדיווח האחרון</CardTitle>
            <CardDescription className="text-xs">
              {new Date(stats.lastEntry.created_at).toLocaleDateString("he-IL", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-muted-foreground mb-1">מצב רוח</p>
                <p className="text-2xl">{getMoodEmoji(stats.lastEntry.mood_level)}</p>
                <p className="text-sm font-bold">{stats.lastEntry.mood_level}/10</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">אנרגיה</p>
                <p className="text-2xl">⚡</p>
                <p className="text-sm font-bold">{stats.lastEntry.energy_level}/10</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">לחץ</p>
                <p className="text-2xl">
                  {stats.lastEntry.stress_level <= 3 ? "😌" : stats.lastEntry.stress_level <= 6 ? "😰" : "🤯"}
                </p>
                <p className="text-sm font-bold">{stats.lastEntry.stress_level}/10</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
