"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"

interface MoodEntry {
  id: string
  mood_level: number
  energy_level: number
  stress_level: number
  notes: string | null
  created_at: string
}

export function MoodHistory() {
  const [entries, setEntries] = useState<MoodEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadEntries()
  }, [])

  const loadEntries = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("mood_entries")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5)

      if (error) {
        console.error("[v0] Error loading mood entries:", error)
      } else {
        setEntries(data || [])
      }
    } catch (error) {
      console.error("[v0] Unexpected error loading entries:", error)
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

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>היסטוריית מצב רוח</CardTitle>
          <CardDescription>הרשומות האחרונות שלך</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">טוען...</p>
        </CardContent>
      </Card>
    )
  }

  if (entries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>היסטוריית מצב רוח</CardTitle>
          <CardDescription>הרשומות האחרונות שלך</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">עדיין אין רשומות. התחל לעקוב אחר מצב הרוח שלך!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>היסטוריית מצב רוח</CardTitle>
        <CardDescription>5 הרשומות האחרונות שלך</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {entries.map((entry) => (
            <div key={entry.id} className="border-b pb-4 last:border-0 last:pb-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  {new Date(entry.created_at).toLocaleDateString("he-IL", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span className="text-2xl">{getMoodEmoji(entry.mood_level)}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">מצב רוח: </span>
                  <span className="font-medium">{entry.mood_level}/10</span>
                </div>
                <div>
                  <span className="text-muted-foreground">אנרגיה: </span>
                  <span className="font-medium">{entry.energy_level}/10</span>
                </div>
                <div>
                  <span className="text-muted-foreground">לחץ: </span>
                  <span className="font-medium">{entry.stress_level}/10</span>
                </div>
              </div>
              {entry.notes && <p className="text-sm text-muted-foreground mt-2 italic">{entry.notes}</p>}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
