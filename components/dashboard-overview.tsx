"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft, TrendingUp, TrendingDown, Calendar, Clock, Cloud, CloudRain, CloudSnow, Sun } from "lucide-react"

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

        calculateEnhancedStats(data, avgMood)
      }
    } catch (error) {
      console.error("[v0] Unexpected error:", error)
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
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">מזג האוויר הרגשי שלך</CardTitle>
          <CardDescription>מצבך הרגשי הכללי</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div className="mb-4">{getWeatherIcon(enhancedStats.emotionalWeather)}</div>
          <p className="text-3xl font-bold mb-2">{enhancedStats.emotionalWeather}</p>
          <p className="text-muted-foreground text-center">
            {enhancedStats.emotionalWeather === "שמש בהיר" && "מצב רוח מצוין! המשך ככה!"}
            {enhancedStats.emotionalWeather === "מעונן חלקית" && "מצב טוב בסך הכל, יש מקום לשיפור"}
            {enhancedStats.emotionalWeather === "מעונן" && "ימים קשים קצת, שמור על עצמך"}
            {enhancedStats.emotionalWeather === "גשום" && "זמן קשה, אולי כדאי לפנות לעזרה"}
          </p>
        </CardContent>
      </Card>

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

        <Card className="border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-red-500/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">רצף ימים</CardTitle>
            <span className="text-2xl">🔥</span>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{enhancedStats.currentStreak}</div>
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

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">השוואה שבועית</CardTitle>
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {enhancedStats.weekComparison > 0 ? (
                <TrendingUp className="h-8 w-8 text-green-500" />
              ) : enhancedStats.weekComparison < 0 ? (
                <TrendingDown className="h-8 w-8 text-red-500" />
              ) : (
                <div className="h-8 w-8" />
              )}
              <div>
                <p className="text-2xl font-bold">
                  {enhancedStats.weekComparison > 0 ? "+" : ""}
                  {enhancedStats.weekComparison}%
                </p>
                <p className="text-sm text-muted-foreground">לעומת השבוע שעבר</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">השוואה חודשית</CardTitle>
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {enhancedStats.monthComparison > 0 ? (
                <TrendingUp className="h-8 w-8 text-green-500" />
              ) : enhancedStats.monthComparison < 0 ? (
                <TrendingDown className="h-8 w-8 text-red-500" />
              ) : (
                <div className="h-8 w-8" />
              )}
              <div>
                <p className="text-2xl font-bold">
                  {enhancedStats.monthComparison > 0 ? "+" : ""}
                  {enhancedStats.monthComparison}%
                </p>
                <p className="text-sm text-muted-foreground">לעומת החודש שעבר</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <CardTitle>זמן אידיאלי לדיווח</CardTitle>
          </div>
          <CardDescription>על סמך ההיסטוריה שלך</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-center">{enhancedStats.bestReportingTime}</p>
          <p className="text-sm text-muted-foreground text-center mt-2">נראה שאתה נוטה לדווח בזמן הזה - המשך בשגרה!</p>
        </CardContent>
      </Card>

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
