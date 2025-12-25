"use client"

import { useState, useEffect } from "react"
import { getMoodEntries } from "@/app/actions/mood-actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Calendar, FileText } from "lucide-react"

interface NoteEntry {
  id: string
  notes: string
  created_at: string
}

export function NotesHistory() {
  const [notesEntries, setNotesEntries] = useState<NoteEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadNotes()
  }, [])

  const loadNotes = async () => {
    try {
      const res = await getMoodEntries()

      if (res.success && res.data) {
        // Filter entries that have notes
        // Map 'note' from DB to 'notes'
        const validNotes = res.data
          .filter((e: any) => e.note && e.note.trim().length > 0)
          .map((e: any) => ({
            id: e.id,
            notes: e.note,
            created_at: e.created_at
          }))

        setNotesEntries(validNotes)
      }
    } catch (error) {
      console.error("Unexpected error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("he-IL", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle>היסטוריית הערות</CardTitle>
          <CardDescription>טוען נתונים...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (notesEntries.length === 0) {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle>היסטוריית הערות</CardTitle>
          <CardDescription>עדיין לא נכתבו הערות בדיווחים</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <FileText className="h-5 w-5" />
          היסטוריית הערות
        </CardTitle>
        <CardDescription>כל ההערות שכתבת בדיווחים שלך</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {notesEntries.map((entry, index) => (
            <AccordionItem key={entry.id} value={`note-${entry.id}`}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center justify-between w-full pr-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{formatDate(entry.created_at)}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">הערה #{notesEntries.length - index}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="bg-muted/50 rounded-lg p-4 mt-2">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{entry.notes}</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}
