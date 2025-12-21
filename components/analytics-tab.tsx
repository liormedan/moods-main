"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ChevronDown, TrendingUp, Activity, Calendar, BarChart3, Smile, Zap, AlertCircle, Heart } from "lucide-react"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { createClient } from "@/lib/supabase/client"
import { NotesHistory } from "@/components/notes-history"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface MoodEntry {
  id: string
  mood_level: number
  energy_level: number
  stress_level: number
  notes: string
  custom_metrics: any
  created_at: string
}

export function AnalyticsTab() {
  const [entries, setEntries] = useState<MoodEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [period, setPeriod] = useState<"7" | "14" | "30" | "all">("14")
  const [customMetrics, setCustomMetrics] = useState<string[]>([])
  const [selectedChart, setSelectedChart] = useState<string | null>(null)

  useEffect(() => {
    loadEntries()
  }, [])

  const loadEntries = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from("mood_entries").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("Error loading entries:", error)
      } else if (data) {
        setEntries(data)
        extractCustomMetrics(data)
      }
    } catch (error) {
      console.error("Unexpected error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const extractCustomMetrics = (data: MoodEntry[]) => {
    const metricsSet = new Set<string>()
    data.forEach((entry) => {
      if (entry.custom_metrics && Array.isArray(entry.custom_metrics)) {
        entry.custom_metrics.forEach((metric: any) => {
          if (metric.name) metricsSet.add(metric.name)
        })
      }
    })
    setCustomMetrics(Array.from(metricsSet))
  }

  const getFilteredEntries = () => {
    if (period === "all") return entries

    const days = Number.parseInt(period)
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    return entries.filter((e) => new Date(e.created_at) >= cutoffDate)
  }

  const getMoodTrend = () => {
    const filtered = getFilteredEntries()
    if (filtered.length < 2) return "אין מספיק נתונים"
    const recent = filtered.slice(0, 5).reduce((sum, e) => sum + e.mood_level, 0) / Math.min(5, filtered.length)
    const older =
      filtered.slice(5, 10).reduce((sum, e) => sum + e.mood_level, 0) / Math.max(1, Math.min(5, filtered.length - 5))

    if (recent > older + 1) return { text: "משתפר! 📈", color: "text-green-600" }
    if (recent < older - 1) return { text: "יורד 📉", color: "text-red-600" }
    return { text: "יציב ➡️", color: "text-blue-600" }
  }

  const getWeeklyAverage = () => {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const weekEntries = entries.filter((e) => new Date(e.created_at) >= weekAgo)
    if (weekEntries.length === 0) return null
    return {
      mood: Math.round((weekEntries.reduce((sum, e) => sum + e.mood_level, 0) / weekEntries.length) * 10) / 10,
      energy: Math.round((weekEntries.reduce((sum, e) => sum + e.energy_level, 0) / weekEntries.length) * 10) / 10,
      stress: Math.round((weekEntries.reduce((sum, e) => sum + e.stress_level, 0) / weekEntries.length) * 10) / 10,
      count: weekEntries.length,
    }
  }

  const prepareChartData = () => {
    const filtered = getFilteredEntries()
    const limit = period === "7" ? 7 : period === "14" ? 14 : period === "30" ? 30 : filtered.length

    return filtered
      .slice(0, limit)
      .reverse()
      .map((entry, index) => {
        const date = new Date(entry.created_at)
        const overall = Math.round(((entry.mood_level + entry.energy_level + entry.stress_level) / 3) * 10) / 10

        const customData: any = {}
        if (entry.custom_metrics && Array.isArray(entry.custom_metrics)) {
          entry.custom_metrics.forEach((metric: any) => {
            if (metric.name && metric.value) {
              customData[metric.name] = metric.value
            }
          })
        }

        return {
          date: date.toLocaleDateString("he-IL", { month: "short", day: "numeric" }),
          fullDate: date.toLocaleDateString("he-IL"),
          time: date.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" }),
          overall: overall,
          mood: entry.mood_level,
          energy: entry.energy_level,
          stress: entry.stress_level,
          ...customData,
        }
      })
  }

  const getOverallScore = () => {
    const filtered = getFilteredEntries()
    if (filtered.length === 0) return null
    const totalScore = filtered.reduce((sum, e) => sum + e.mood_level + e.energy_level + e.stress_level, 0)
    const average = Math.round((totalScore / (filtered.length * 3)) * 10) / 10
    return average
  }

  const calculateSummaryStats = () => {
    const chartData = prepareChartData()
    if (chartData.length === 0) return null

    const avgMood = chartData.reduce((sum, d) => sum + d.mood, 0) / chartData.length
    const avgEnergy = chartData.reduce((sum, d) => sum + d.energy, 0) / chartData.length
    const avgStress = chartData.reduce((sum, d) => sum + d.stress, 0) / chartData.length
    const avgOverall = chartData.reduce((sum, d) => sum + d.overall, 0) / chartData.length

    return {
      avgMood: avgMood.toFixed(1),
      avgEnergy: avgEnergy.toFixed(1),
      avgStress: avgStress.toFixed(1),
      avgOverall: avgOverall.toFixed(1),
      count: chartData.length,
    }
  }

  const chartConfig = {
    overall: {
      label: "ציון כולל",
      color: "hsl(174, 70%, 50%)",
    },
    mood: {
      label: "מצב רוח",
      color: "hsl(180, 80%, 50%)",
    },
    energy: {
      label: "אנרגיה",
      color: "hsl(45, 90%, 55%)",
    },
    stress: {
      label: "לחץ",
      color: "hsl(0, 80%, 60%)",
    },
    value: {
      label: "ערך",
      color: "hsl(var(--chart-1))",
    },
  }

  if (isLoading) {
    return <div className="text-center py-12">טוען ניתוח...</div>
  }

  if (entries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>ניתוח מצב רוח</CardTitle>
          <CardDescription>אין עדיין מספיק נתונים לניתוח</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">התחל לדווח על מצב הרוח שלך כדי לראות ניתוחים וטרנדים</p>
        </CardContent>
      </Card>
    )
  }

  const trend = getMoodTrend()
  const weeklyAvg = getWeeklyAverage()
  const chartData = prepareChartData()
  const summaryStats = calculateSummaryStats()
  const filteredEntries = getFilteredEntries()

  // Calculate averages for the updated section
  const averages = {
    mood: summaryStats?.avgMood ? Number.parseFloat(summaryStats.avgMood) : 0,
    energy: summaryStats?.avgEnergy ? Number.parseFloat(summaryStats.avgEnergy) : 0,
    stress: summaryStats?.avgStress ? Number.parseFloat(summaryStats.avgStress) : 0,
    overall: summaryStats?.avgOverall ? Number.parseFloat(summaryStats.avgOverall) : 0,
  }

  // Prepare data for weekly bar chart
  const weeklyData = weeklyAvg
    ? [
        {
          week: "שבוע זה",
          mood: weeklyAvg.mood,
          energy: weeklyAvg.energy,
          stress: weeklyAvg.stress,
        },
      ]
    : []

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="border-t-4 border-t-teal-500 md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ציון כולל</CardTitle>
            <TrendingUp className="h-5 w-5 text-teal-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-teal-600 dark:text-teal-400">{summaryStats?.avgOverall}/10</div>
            <p className="text-xs text-muted-foreground mt-1">שיכלול כל המדדים</p>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-cyan-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">מגמה כללית</CardTitle>
            <TrendingUp className="h-5 w-5 text-cyan-500" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${typeof trend === "object" ? trend.color : ""}`}>
              {typeof trend === "object" ? trend.text : trend}
            </div>
            <p className="text-xs text-muted-foreground mt-1">השוואה בין תקופות</p>
          </CardContent>
        </Card>

        {weeklyAvg && (
          <>
            <Card className="border-t-4 border-t-green-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ממוצע מצב רוח</CardTitle>
                <Activity className="h-5 w-5 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{weeklyAvg.mood}/10</div>
                <p className="text-xs text-muted-foreground mt-1">7 ימים אחרונים</p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-yellow-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ממוצע אנרגיה</CardTitle>
                <Activity className="h-5 w-5 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{weeklyAvg.energy}/10</div>
                <p className="text-xs text-muted-foreground mt-1">7 ימים אחרונים</p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-purple-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">סה״כ דיווחים</CardTitle>
                <Calendar className="h-5 w-5 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{summaryStats?.count}</div>
                <p className="text-xs text-muted-foreground mt-1">סה״כ רשומות</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="period-selector">
          <Card className="border-2 border-primary/20">
            <AccordionTrigger className="hover:no-underline [&[data-state=open]>div>svg]:rotate-180">
              <CardHeader className="text-center w-full py-4">
                <CardTitle className="text-xl flex items-center justify-center gap-2">
                  <Calendar className="h-5 w-5" />
                  בחר תקופה
                  <ChevronDown className="h-5 w-5 transition-transform duration-200" />
                </CardTitle>
                <CardDescription>השווה נתונים לפי תקופות זמן</CardDescription>
              </CardHeader>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent className="flex justify-center py-4">
                <Select value={period} onValueChange={(v) => setPeriod(v as any)}>
                  <SelectTrigger className="w-[240px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 ימים אחרונים</SelectItem>
                    <SelectItem value="14">14 ימים אחרונים</SelectItem>
                    <SelectItem value="30">30 ימים אחרונים</SelectItem>
                    <SelectItem value="all">כל הזמן</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>
      </Accordion>

      <div className="grid gap-6 md:grid-cols-2">
        {/* מעקב מצב רוח לאורך זמן */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl flex items-center justify-center gap-2">
              <TrendingUp className="h-5 w-5" />
              מעקב מצב רוח לאורך זמן
            </CardTitle>
            <CardDescription>עקוב אחרי מצב הרוח שלך לאורך זמן</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full overflow-hidden">
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(180, 70%, 50%)" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="hsl(180, 70%, 50%)" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 10]} />
                    <ChartTooltip position={{ y: -80 }} offset={20} />
                    <Area
                      type="monotone"
                      dataKey="mood"
                      name="מצב רוח"
                      stroke="hsl(180, 70%, 50%)"
                      strokeWidth={3}
                      fill="url(#colorMood)"
                      dot={{ r: 4, strokeWidth: 2, fill: "white" }}
                      activeDot={{ r: 6 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            <div className="mt-4 p-4 bg-gradient-to-r from-cyan-500/10 to-cyan-600/5 rounded-lg border border-cyan-500/20">
              <h4 className="text-sm font-medium text-center mb-3 flex items-center justify-center gap-2">
                <Smile className="h-4 w-4 text-cyan-500" />
                ממוצעים
              </h4>
              <div className="grid grid-cols-1 gap-2 text-sm text-center">
                <div className="flex items-center justify-center gap-2 p-2 bg-background/50 rounded-md">
                  <Heart className="h-4 w-4 text-cyan-500" />
                  <span className="text-muted-foreground">מצב רוח:</span>
                  <span className="font-bold text-cyan-500 text-lg">{averages.mood.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* שיכלול כולל - מעקב לאורך זמן */}
        <Card className="border-2 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-xl flex items-center justify-center gap-2">
              <Activity className="h-5 w-5" />
              שיכלול כולל - מעקב לאורך זמן
            </CardTitle>
            <CardDescription>ממוצע משוקלל של כל המדדים</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full overflow-hidden">
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorOverall" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(180, 70%, 50%)" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="hsl(180, 70%, 50%)" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 10]} />
                    <ChartTooltip position={{ y: -80 }} offset={20} />
                    <Area
                      type="monotone"
                      dataKey="overall"
                      name="ציון כולל"
                      stroke="hsl(180, 70%, 50%)"
                      strokeWidth={3}
                      fill="url(#colorOverall)"
                      dot={{ r: 4, strokeWidth: 2, fill: "white" }}
                      activeDot={{ r: 6 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            <div className="mt-4 p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
              <h4 className="text-sm font-medium text-center mb-3 flex items-center justify-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                פירוט הציון הכולל
              </h4>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="flex flex-col items-center gap-1 p-2 bg-cyan-500/10 rounded-md">
                  <Heart className="h-3 w-3 text-cyan-500" />
                  <span className="text-cyan-500 font-semibold">{averages.mood.toFixed(1)}</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-2 bg-yellow-500/10 rounded-md">
                  <Zap className="h-3 w-3 text-yellow-500" />
                  <span className="text-yellow-500 font-semibold">{averages.energy.toFixed(1)}</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-2 bg-red-500/10 rounded-md">
                  <AlertCircle className="h-3 w-3 text-red-500" />
                  <span className="text-red-500 font-semibold">{averages.stress.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* השוואת מדדים */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl flex items-center justify-center gap-2">
              <BarChart3 className="h-5 w-5" />
              השוואת מדדים
            </CardTitle>
            <CardDescription>מצב רוח, אנרגיה ולחץ</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full overflow-hidden">
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 10]} />
                    <ChartTooltip position={{ y: -80 }} offset={20} />
                    <Line
                      type="monotone"
                      dataKey="mood"
                      name="מצב רוח"
                      stroke="hsl(180, 70%, 50%)"
                      strokeWidth={3}
                      dot={{ r: 4, strokeWidth: 2, fill: "white" }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="energy"
                      name="אנרגיה"
                      stroke="hsl(50, 90%, 55%)"
                      strokeWidth={3}
                      dot={{ r: 4, strokeWidth: 2, fill: "white" }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="stress"
                      name="לחץ"
                      stroke="hsl(0, 70%, 60%)"
                      strokeWidth={3}
                      dot={{ r: 4, strokeWidth: 2, fill: "white" }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <h4 className="text-sm font-medium text-center mb-3">ממוצעים</h4>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="flex flex-col items-center gap-2 p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                  <Heart className="h-5 w-5 text-cyan-500" />
                  <div className="font-medium text-cyan-500">מצב רוח</div>
                  <div className="text-lg font-bold text-cyan-500">{averages.mood.toFixed(1)}</div>
                </div>
                <div className="flex flex-col items-center gap-2 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  <div className="font-medium text-yellow-500">אנרגיה</div>
                  <div className="text-lg font-bold text-yellow-500">{averages.energy.toFixed(1)}</div>
                </div>
                <div className="flex flex-col items-center gap-2 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <div className="font-medium text-red-500">לחץ</div>
                  <div className="text-lg font-bold text-red-500">{averages.stress.toFixed(1)}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ממוצעים שבועיים */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl flex items-center justify-center gap-2">
              <Calendar className="h-5 w-5" />
              ממוצעים שבועיים
            </CardTitle>
            <CardDescription>השוואה בין שבועות</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full overflow-hidden">
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="week" />
                    <YAxis domain={[0, 10]} />
                    <ChartTooltip position={{ y: -80 }} offset={20} />
                    <Bar dataKey="mood" name="מצב רוח" fill="hsl(180, 70%, 50%)" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="energy" name="אנרגיה" fill="hsl(50, 90%, 55%)" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="stress" name="לחץ" fill="hsl(0, 70%, 60%)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <h4 className="text-sm font-medium text-center mb-3 flex items-center justify-center gap-2">
                <Calendar className="h-4 w-4" />
                ממוצעים כלליים
              </h4>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="flex flex-col items-center gap-2 p-2 bg-cyan-500/5 rounded-md">
                  <Heart className="h-4 w-4 text-cyan-500" />
                  <div className="font-medium">מצב רוח</div>
                  <div className="text-lg font-bold text-cyan-500">{averages.mood.toFixed(1)}</div>
                </div>
                <div className="flex flex-col items-center gap-2 p-2 bg-yellow-500/5 rounded-md">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <div className="font-medium">אנרגיה</div>
                  <div className="text-lg font-bold text-yellow-500">{averages.energy.toFixed(1)}</div>
                </div>
                <div className="flex flex-col items-center gap-2 p-2 bg-red-500/5 rounded-md">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <div className="font-medium">לחץ</div>
                  <div className="text-lg font-bold text-red-500">{averages.stress.toFixed(1)}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={selectedChart !== null} onOpenChange={() => setSelectedChart(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">
              {selectedChart === "mood" && "מעקב מצב רוח לאורך זמן"}
              {selectedChart === "overall" && "שיכלול כולל - מעקב לאורך זמן"}
              {selectedChart === "compare" && "השוואת מדדים"}
              {selectedChart === "weekly" && "ממוצעים שבועיים"}
            </DialogTitle>
            <DialogDescription className="text-center">
              {selectedChart === "mood" && "מצב רוח בלבד"}
              {selectedChart === "overall" && "ממוצע של כל המדדים ביחד"}
              {selectedChart === "compare" && "מעקב אחר כל המדדים ביחד"}
              {selectedChart === "weekly" && "השבוע האחרון"}
            </DialogDescription>
          </DialogHeader>

          <div className="w-full">
            {selectedChart === "mood" && (
              <ChartContainer config={chartConfig} className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorMoodLarge" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(180, 70%, 50%)" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="hsl(180, 70%, 50%)" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip
                      cursor={{ stroke: "hsl(var(--muted-foreground))", strokeWidth: 1, strokeDasharray: "5 5" }}
                      position={{ y: -80 }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const value = payload[0].value
                          return (
                            <div className="rounded-lg border bg-background/95 backdrop-blur-sm px-3 py-2 shadow-xl">
                              <span className="text-2xl font-bold text-cyan-500">{value}</span>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="mood"
                      stroke="hsl(180, 70%, 50%)"
                      strokeWidth={3}
                      fill="url(#colorMoodLarge)"
                      dot={{ fill: "hsl(180, 70%, 50%)", strokeWidth: 2, r: 5, stroke: "#fff" }}
                      activeDot={{ r: 8, strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}

            {selectedChart === "overall" && (
              <ChartContainer config={chartConfig} className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorOverallLarge" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(180, 70%, 50%)" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="hsl(180, 70%, 50%)" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip
                      cursor={{ stroke: "hsl(var(--muted-foreground))", strokeWidth: 1, strokeDasharray: "5 5" }}
                      position={{ y: -80 }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const value = payload[0].value
                          return (
                            <div className="rounded-lg border bg-background/95 backdrop-blur-sm px-3 py-2 shadow-xl">
                              <span className="text-2xl font-bold text-teal-500">{value}</span>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="overall"
                      stroke="hsl(180, 70%, 50%)"
                      strokeWidth={3}
                      fill="url(#colorOverallLarge)"
                      dot={{ fill: "hsl(180, 70%, 50%)", strokeWidth: 2, r: 5, stroke: "#fff" }}
                      activeDot={{ r: 8, strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}

            {selectedChart === "compare" && (
              <ChartContainer config={chartConfig} className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip
                      position={{ y: -80 }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border bg-background/95 backdrop-blur-sm px-3 py-2 shadow-xl space-y-1">
                              {payload.map((entry: any) => (
                                <div key={entry.name} className="flex items-center gap-2">
                                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                                  <span className="text-lg font-bold" style={{ color: entry.color }}>
                                    {entry.value}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="mood"
                      stroke="hsl(180, 70%, 50%)"
                      strokeWidth={3}
                      name="מצב רוח"
                      dot={{ fill: "hsl(180, 70%, 50%)", strokeWidth: 2, r: 5, stroke: "#fff" }}
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="energy"
                      stroke="hsl(50, 90%, 55%)"
                      strokeWidth={3}
                      name="אנרגיה"
                      dot={{ fill: "hsl(50, 90%, 55%)", strokeWidth: 2, r: 5, stroke: "#fff" }}
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="stress"
                      stroke="hsl(0, 70%, 60%)"
                      strokeWidth={3}
                      name="לחץ"
                      dot={{ fill: "hsl(0, 70%, 60%)", strokeWidth: 2, r: 5, stroke: "#fff" }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </div>

          {summaryStats && (
            <div className="mt-4 p-4 rounded-lg bg-muted/50 space-y-2">
              <h4 className="font-semibold text-center mb-3">נתונים משוקללים לתקופה</h4>
              {selectedChart === "mood" && (
                <div className="text-center">
                  <span className="text-muted-foreground">מצב רוח ממוצע:</span>
                  <p className="text-3xl font-bold text-cyan-500">{summaryStats.avgMood}</p>
                </div>
              )}
              {selectedChart === "overall" && (
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="text-center">
                    <span className="text-muted-foreground">ציון כולל ממוצע:</span>
                    <p className="text-3xl font-bold text-teal-500">{summaryStats.avgOverall}</p>
                  </div>
                  <div className="text-center">
                    <span className="text-muted-foreground">מספר רשומות:</span>
                    <p className="text-3xl font-bold">{summaryStats.count}</p>
                  </div>
                </div>
              )}
              {selectedChart === "compare" && (
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div className="text-center">
                    <span className="text-muted-foreground">מצב רוח:</span>
                    <p className="text-3xl font-bold text-cyan-500">{summaryStats.avgMood}</p>
                  </div>
                  <div className="text-center">
                    <span className="text-muted-foreground">אנרגיה:</span>
                    <p className="text-3xl font-bold text-yellow-500">{summaryStats.avgEnergy}</p>
                  </div>
                  <div className="text-center">
                    <span className="text-muted-foreground">לחץ:</span>
                    <p className="text-3xl font-bold text-red-500">{summaryStats.avgStress}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* גרפים למדדים מותאמים אישית */}
      {customMetrics.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          {customMetrics.map((metricName) => {
            const metricData = chartData.map((d) => ({
              date: d.date,
              value: d[metricName] || 0,
            }))

            const avgValue = metricData.reduce((sum, d) => sum + d.value, 0) / metricData.length

            return (
              <Card key={metricName}>
                <CardHeader className="text-center">
                  <CardTitle className="text-xl flex items-center justify-center gap-2">{metricName}</CardTitle>
                  <CardDescription>מדד מותאם אישית</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="w-full overflow-hidden">
                    <ChartContainer config={chartConfig} className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={metricData}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                          <XAxis dataKey="date" />
                          <YAxis domain={[0, 10]} />
                          <Tooltip
                            cursor={{ stroke: "hsl(var(--muted-foreground))", strokeWidth: 1, strokeDasharray: "5 5" }}
                            position={{ y: -80 }}
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                const value = payload[0].value
                                return (
                                  <div className="rounded-lg border bg-background/95 backdrop-blur-sm px-3 py-2 shadow-xl">
                                    <span className="text-2xl font-bold text-primary">{value}</span>
                                  </div>
                                )
                              }
                              return null
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke="hsl(var(--primary))"
                            strokeWidth={3}
                            name={metricName}
                            dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 5, stroke: "#fff" }}
                            activeDot={{ r: 8 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                  <div className="mt-4 p-4 rounded-lg bg-muted/50 space-y-2">
                    <h4 className="font-semibold text-center mb-3">נתונים משוקללים</h4>
                    <div className="text-center">
                      <span className="text-muted-foreground">ממוצע:</span>
                      <p className="text-2xl font-bold text-primary">{avgValue.toFixed(1)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* היסטוריה מלאה */}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="full-history">
          <Card className="border-2 border-teal-500/20">
            <AccordionTrigger className="hover:no-underline [&[data-state=open]>div>svg]:rotate-180">
              <CardHeader className="text-center w-full py-4">
                <CardTitle className="text-2xl flex items-center justify-center gap-2">
                  היסטוריה מלאה
                  <ChevronDown className="h-5 w-5 transition-transform duration-200" />
                </CardTitle>
                <CardDescription>כל הרשומות שלך עם פרטים מלאים</CardDescription>
              </CardHeader>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent>
                {filteredEntries.length === 0 ? (
                  <p className="text-muted-foreground text-center">אין רשומות להצגה</p>
                ) : (
                  <Accordion type="single" collapsible className="w-full space-y-2">
                    {filteredEntries.map((entry, index) => {
                      let customMetrics = []
                      try {
                        if (entry.custom_metrics) {
                          customMetrics =
                            typeof entry.custom_metrics === "string"
                              ? JSON.parse(entry.custom_metrics)
                              : entry.custom_metrics
                        }
                      } catch (e) {
                        console.error("Failed to parse custom_metrics:", e)
                        customMetrics = []
                      }

                      return (
                        <AccordionItem key={entry.id} value={`item-${index}`} className="border rounded-lg px-4">
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center justify-between w-full pr-4">
                              <span className="text-sm font-medium">
                                {new Date(entry.created_at).toLocaleDateString("he-IL", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                              <div className="flex gap-2">
                                <span className="px-2 py-1 rounded bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300 text-xs">
                                  😊 {entry.mood_level}
                                </span>
                                <span className="px-2 py-1 rounded bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300 text-xs">
                                  ⚡ {entry.energy_level}
                                </span>
                                <span className="px-2 py-1 rounded bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 text-xs">
                                  😰 {entry.stress_level}
                                </span>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-4 pt-4">
                              {/* Main Metrics */}
                              <div className="grid grid-cols-3 gap-4">
                                <div className="text-center p-3 rounded-lg bg-cyan-50 dark:bg-cyan-950">
                                  <div className="text-2xl mb-1">😊</div>
                                  <div className="text-sm text-muted-foreground">מצב רוח</div>
                                  <div className="text-xl font-bold text-cyan-600 dark:text-cyan-400">
                                    {entry.mood_level}/10
                                  </div>
                                </div>
                                <div className="text-center p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950">
                                  <div className="text-2xl mb-1">⚡</div>
                                  <div className="text-sm text-muted-foreground">אנרגיה</div>
                                  <div className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                                    {entry.energy_level}/10
                                  </div>
                                </div>
                                <div className="text-center p-3 rounded-lg bg-red-50 dark:bg-red-950">
                                  <div className="text-2xl mb-1">😰</div>
                                  <div className="text-sm text-muted-foreground">לחץ</div>
                                  <div className="text-xl font-bold text-red-600 dark:text-red-400">
                                    {entry.stress_level}/10
                                  </div>
                                </div>
                              </div>

                              {/* Custom Metrics */}
                              {customMetrics.length > 0 && (
                                <div className="space-y-2">
                                  <h4 className="text-sm font-semibold text-center">מדדים נוספים</h4>
                                  <div className="grid grid-cols-2 gap-2">
                                    {customMetrics.map((metric: any, idx: number) => (
                                      <div key={idx} className="text-center p-2 rounded-lg bg-muted/50">
                                        <div className="text-sm text-muted-foreground">{metric.name}</div>
                                        <div className="text-lg font-semibold">{metric.value}/10</div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Notes Section */}
                              {entry.notes && (
                                <div className="space-y-2">
                                  <h4 className="text-sm font-semibold text-center">הערות</h4>
                                  <div className="p-3 rounded-lg bg-muted/30 border border-border">
                                    <p className="text-sm whitespace-pre-wrap">{entry.notes}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      )
                    })}
                  </Accordion>
                )}
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>
      </Accordion>

      <NotesHistory />
    </div>
  )
}
