"use client"

import type React from "react"
import { User, Bell, Users, Shield, Download, FileDown, FileSpreadsheet, FileText } from "lucide-react"

import { useState } from "react"
import { CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { createClient } from "@/lib/supabase/client"

interface SettingsTabProps {
  userEmail: string
}

export function SettingsTab({ userEmail }: SettingsTabProps) {
  const [notifications, setNotifications] = useState(true)
  const [dailyReminders, setDailyReminders] = useState(true)
  const [isResetting, setIsResetting] = useState(false)
  const [exportDialogOpen, setExportDialogOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const { toast } = useToast()

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "הגדרות נשמרו",
      description: "השינויים שלך נשמרו בהצלחה",
    })
  }

  const handleResetData = async () => {
    setIsResetting(true)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("משתמש לא מחובר")
      }

      const { error } = await supabase.from("mood_entries").delete().eq("user_id", user.id)

      if (error) throw error

      toast({
        title: "הנתונים אופסו בהצלחה",
        description: "כל רשומות מעקב המצב רוח נמחקו",
      })
    } catch (error) {
      console.error("Error resetting data:", error)
      toast({
        title: "שגיאה באיפוס נתונים",
        description: "אירעה שגיאה במהלך מחיקת הנתונים",
        variant: "destructive",
      })
    } finally {
      setIsResetting(false)
    }
  }

  const handleExportCSV = async () => {
    setIsExporting(true)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("משתמש לא מחובר")
      }

      const { data: entries, error } = await supabase
        .from("mood_entries")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error

      const headers = ["תאריך", "מצב רוח", "אנרגיה", "לחץ", "הערות", "מדדים נוספים"]
      const csvContent = [
        headers.join(","),
        ...(entries || []).map((entry) => {
          const customMetrics = entry.custom_metrics ? JSON.stringify(entry.custom_metrics).replace(/,/g, ";") : ""
          return [
            new Date(entry.created_at).toLocaleString("he-IL"),
            entry.mood || "",
            entry.energy || "",
            entry.stress || "",
            `"${(entry.notes || "").replace(/"/g, '""')}"`,
            `"${customMetrics}"`,
          ].join(",")
        }),
      ].join("\n")

      const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `mood-data-${new Date().toISOString().split("T")[0]}.csv`
      link.click()
      URL.revokeObjectURL(url)

      toast({
        title: "הנתונים יוצאו בהצלחה",
        description: "הקובץ הורד למחשב שלך",
      })
      setExportDialogOpen(false)
    } catch (error) {
      console.error("Error exporting data:", error)
      toast({
        title: "שגיאה בייצוא נתונים",
        description: "אירעה שגיאה במהלך ייצוא הנתונים",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportJSON = async () => {
    setIsExporting(true)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("משתמש לא מחובר")
      }

      const { data: entries, error } = await supabase
        .from("mood_entries")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error

      const jsonContent = JSON.stringify(entries, null, 2)
      const blob = new Blob([jsonContent], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `mood-data-${new Date().toISOString().split("T")[0]}.json`
      link.click()
      URL.revokeObjectURL(url)

      toast({
        title: "הנתונים יוצאו בהצלחה",
        description: "הקובץ הורד למחשב שלך",
      })
      setExportDialogOpen(false)
    } catch (error) {
      console.error("Error exporting data:", error)
      toast({
        title: "שגיאה בייצוא נתונים",
        description: "אירעה שגיאה במהלך ייצוא הנתונים",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportPDF = async () => {
    setIsExporting(true)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("משתמש לא מחובר")
      }

      const { data: entries, error } = await supabase
        .from("mood_entries")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error

      const htmlContent = `
        <!DOCTYPE html>
        <html dir="rtl" lang="he">
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: 'Arial', sans-serif; direction: rtl; padding: 40px; }
            h1 { color: #0ea5e9; text-align: center; margin-bottom: 30px; }
            h2 { color: #14b8a6; border-bottom: 2px solid #14b8a6; padding-bottom: 10px; margin-top: 30px; }
            .summary { background: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
            .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; }
            .summary-item { text-align: center; }
            .summary-item .label { font-size: 14px; color: #64748b; }
            .summary-item .value { font-size: 24px; font-weight: bold; color: #0ea5e9; }
            .entry { background: #ffffff; border: 1px solid #e2e8f0; padding: 20px; margin-bottom: 15px; border-radius: 8px; page-break-inside: avoid; }
            .entry-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; }
            .entry-date { font-weight: bold; color: #334155; }
            .metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 15px; }
            .metric { padding: 10px; background: #f8fafc; border-radius: 6px; text-align: center; }
            .metric-label { font-size: 12px; color: #64748b; }
            .metric-value { font-size: 20px; font-weight: bold; color: #14b8a6; }
            .custom-metrics { margin-top: 15px; padding: 15px; background: #fefce8; border-radius: 6px; }
            .custom-metric { display: inline-block; margin: 5px 10px; padding: 5px 15px; background: #fef3c7; border-radius: 4px; font-size: 14px; }
            .notes { margin-top: 15px; padding: 15px; background: #f0fdfa; border-radius: 6px; color: #134e4a; }
            .footer { text-align: center; margin-top: 50px; color: #94a3b8; font-size: 12px; }
          </style>
        </head>
        <body>
          <h1>דוח מעקב מצב רוח - MOODS</h1>
          
          <div class="summary">
            <h2>סיכום כללי</h2>
            <div class="summary-grid">
              <div class="summary-item">
                <div class="label">ממוצע מצב רוח</div>
                <div class="value">${entries && entries.length > 0 ? (entries.reduce((acc, e) => acc + (e.mood || 0), 0) / entries.length).toFixed(1) : "-"}</div>
              </div>
              <div class="summary-item">
                <div class="label">ממוצע אנרגיה</div>
                <div class="value">${entries && entries.length > 0 ? (entries.reduce((acc, e) => acc + (e.energy || 0), 0) / entries.length).toFixed(1) : "-"}</div>
              </div>
              <div class="summary-item">
                <div class="label">ממוצע לחץ</div>
                <div class="value">${entries && entries.length > 0 ? (entries.reduce((acc, e) => acc + (e.stress || 0), 0) / entries.length).toFixed(1) : "-"}</div>
              </div>
            </div>
          </div>

          <h2>רשומות מפורטות</h2>
          ${
            entries && entries.length > 0
              ? entries
                  .map(
                    (entry) => `
            <div class="entry">
              <div class="entry-header">
                <span class="entry-date">${new Date(entry.created_at).toLocaleDateString("he-IL", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
              </div>
              <div class="metrics">
                <div class="metric">
                  <div class="metric-label">מצב רוח</div>
                  <div class="metric-value">${entry.mood || "-"}</div>
                </div>
                <div class="metric">
                  <div class="metric-label">אנרגיה</div>
                  <div class="metric-value">${entry.energy || "-"}</div>
                </div>
                <div class="metric">
                  <div class="metric-label">לחץ</div>
                  <div class="metric-value">${entry.stress || "-"}</div>
                </div>
              </div>
              ${
                entry.custom_metrics
                  ? `
              <div class="custom-metrics">
                <strong>מדדים נוספים:</strong><br/>
                ${Object.entries(
                  typeof entry.custom_metrics === "string" ? JSON.parse(entry.custom_metrics) : entry.custom_metrics,
                )
                  .map(
                    ([key, value]: [string, any]) =>
                      `<span class="custom-metric">${value.name || key}: ${value.value || "-"}</span>`,
                  )
                  .join("")}
              </div>
              `
                  : ""
              }
              ${entry.notes ? `<div class="notes"><strong>הערות:</strong><br/>${entry.notes.replace(/\n/g, "<br/>")}</div>` : ""}
            </div>
          `,
                  )
                  .join("")
              : "<p>אין נתונים להצגה</p>"
          }
          
          <div class="footer">
            <p>דוח זה נוצר בתאריך ${new Date().toLocaleDateString("he-IL")}</p>
            <p>MOODS - מערכת לניהול מצבי רוח</p>
          </div>
        </body>
        </html>
      `

      const printWindow = window.open("", "", "width=800,height=600")
      if (printWindow) {
        printWindow.document.write(htmlContent)
        printWindow.document.close()
        printWindow.focus()
        setTimeout(() => {
          printWindow.print()
          printWindow.close()
        }, 500)
      }

      toast({
        title: "דוח PDF מוכן",
        description: "חלון ההדפסה נפתח - שמור כ-PDF",
      })
      setExportDialogOpen(false)
    } catch (error) {
      console.error("Error exporting PDF:", error)
      toast({
        title: "שגיאה בייצוא PDF",
        description: "אירעה שגיאה במהלך יצירת הדוח",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Accordion type="multiple" className="space-y-4">
        {/* פרטי חשבון */}
        <AccordionItem value="account" className="border rounded-lg border-primary/20">
          <AccordionTrigger className="px-6 hover:no-underline">
            <div className="text-center w-full">
              <div className="flex items-center justify-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-semibold">פרטי חשבון</h3>
              </div>
              <p className="text-sm text-muted-foreground">עדכן את הפרטים האישיים שלך</p>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="block text-center">
                    כתובת מייל
                  </Label>
                  <Input id="email" type="email" defaultValue={userEmail} disabled className="text-center" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name" className="block text-center">
                    שם מלא
                  </Label>
                  <Input id="name" type="text" placeholder="הזן את שמך המלא" className="text-center" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="block text-center">
                    מספר טלפון
                  </Label>
                  <Input id="phone" type="tel" placeholder="050-1234567" className="text-center" />
                </div>
                <div className="flex justify-center">
                  <Button type="submit">שמור שינויים</Button>
                </div>
              </form>
            </CardContent>
          </AccordionContent>
        </AccordionItem>

        {/* התראות */}
        <AccordionItem value="notifications" className="border rounded-lg border-primary/20">
          <AccordionTrigger className="px-6 hover:no-underline">
            <div className="text-center w-full">
              <div className="flex items-center justify-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-semibold">התראות</h3>
              </div>
              <p className="text-sm text-muted-foreground">נהל את העדפות ההתראות שלך</p>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center gap-4">
                <div className="space-y-0.5 text-center flex-1 max-w-xs">
                  <Label htmlFor="notifications">התראות דחיפה</Label>
                  <p className="text-sm text-muted-foreground">קבל התראות על עדכונים חשובים</p>
                </div>
                <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
              </div>
              <Separator />
              <div className="flex items-center justify-center gap-4">
                <div className="space-y-0.5 text-center flex-1 max-w-xs">
                  <Label htmlFor="reminders">תזכורות יומיות</Label>
                  <p className="text-sm text-muted-foreground">תזכורת יומית לדווח על מצב הרוח</p>
                </div>
                <Switch id="reminders" checked={dailyReminders} onCheckedChange={setDailyReminders} />
              </div>
            </CardContent>
          </AccordionContent>
        </AccordionItem>

        {/* פרטי מטפל */}
        <AccordionItem value="therapist" className="border rounded-lg border-primary/20">
          <AccordionTrigger className="px-6 hover:no-underline">
            <div className="text-center w-full">
              <div className="flex items-center justify-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-semibold">פרטי מטפל</h3>
              </div>
              <p className="text-sm text-muted-foreground">הוסף את פרטי המטפל שלך</p>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="therapist-name" className="block text-center">
                    שם המטפל
                  </Label>
                  <Input id="therapist-name" type="text" placeholder="ד״ר שם המטפל" className="text-center" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="therapist-phone" className="block text-center">
                    טלפון המטפל
                  </Label>
                  <Input id="therapist-phone" type="tel" placeholder="050-1234567" className="text-center" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="therapist-email" className="block text-center">
                    מייל המטפל
                  </Label>
                  <Input
                    id="therapist-email"
                    type="email"
                    placeholder="therapist@example.com"
                    className="text-center"
                  />
                </div>
                <div className="flex justify-center">
                  <Button type="submit">שמור פרטים</Button>
                </div>
              </form>
            </CardContent>
          </AccordionContent>
        </AccordionItem>

        {/* פרטיות ואבטחה */}
        <AccordionItem value="privacy" className="border rounded-lg border-destructive/20">
          <AccordionTrigger className="px-6 hover:no-underline">
            <div className="text-center w-full">
              <div className="flex items-center justify-center gap-2">
                <Shield className="h-5 w-5 text-destructive" />
                <h3 className="text-xl font-semibold">פרטיות ואבטחה</h3>
              </div>
              <p className="text-sm text-muted-foreground">נהל את הגדרות האבטחה של החשבון</p>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full bg-transparent">
                שנה סיסמה
              </Button>
              <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Download className="ml-2 h-4 w-4" />
                    ייצא נתונים
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-center">ייצוא נתונים</DialogTitle>
                    <DialogDescription className="text-center">בחר את פורמט הקובץ שברצונך להוריד</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <Button
                      onClick={handleExportPDF}
                      disabled={isExporting}
                      className="w-full h-20 flex flex-col items-center justify-center gap-2 bg-transparent"
                      variant="outline"
                    >
                      <FileDown className="h-8 w-8" />
                      <span>ייצא כקובץ PDF</span>
                      <span className="text-xs text-muted-foreground">דוח מעוצב ומסודר</span>
                    </Button>
                    <Button
                      onClick={handleExportCSV}
                      disabled={isExporting}
                      className="w-full h-20 flex flex-col items-center justify-center gap-2 bg-transparent"
                      variant="outline"
                    >
                      <FileSpreadsheet className="h-8 w-8" />
                      <span>ייצא כקובץ CSV</span>
                      <span className="text-xs text-muted-foreground">מתאים לאקסל וגוגל שיטס</span>
                    </Button>
                    <Button
                      onClick={handleExportJSON}
                      disabled={isExporting}
                      className="w-full h-20 flex flex-col items-center justify-center gap-2 bg-transparent"
                      variant="outline"
                    >
                      <FileText className="h-8 w-8" />
                      <span>ייצא כקובץ JSON</span>
                      <span className="text-xs text-muted-foreground">פורמט נתונים גולמי</span>
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Separator />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent border-destructive text-destructive hover:bg-destructive/10"
                  >
                    אפס את כל הנתונים
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-center">האם אתה בטוח?</AlertDialogTitle>
                    <AlertDialogDescription className="text-center">
                      פעולה זו תמחק את כל רשומות מעקב מצב הרוח שלך. לא ניתן לבטל פעולה זו.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex-row-reverse gap-2">
                    <AlertDialogCancel>ביטול</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleResetData}
                      disabled={isResetting}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {isResetting ? "מאפס..." : "כן, אפס הכל"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button variant="destructive" className="w-full">
                מחק חשבון
              </Button>
            </CardContent>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
