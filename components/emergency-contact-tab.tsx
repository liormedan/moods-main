"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Phone, MessageCircle, AlertCircle, MessageSquare, Calendar, CheckCircle, Mail } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useUser } from "@clerk/nextjs"
import { toast } from "sonner"
import {
  getTherapistInfo,
  updateTherapistInfo,
  getTherapistTasks,
  addTherapistTask,
  toggleTherapistTask,
  getAppointments,
  addAppointment
} from "@/app/actions/user-actions"

interface TherapistInfo {
  name: string
  phone: string
  email?: string
}

interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  created_at: string
}

interface Appointment {
  id: string
  date: string
  time: string
  notes: string
}

export function EmergencyContactTab() {
  const { user } = useUser()
  const [therapist, setTherapist] = useState<TherapistInfo>({
    name: "",
    phone: "",
    email: "",
  })
  const [tasks, setTasks] = useState<Task[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [newTask, setNewTask] = useState({ title: "", description: "" })
  const [newAppointment, setNewAppointment] = useState({ date: "", time: "", notes: "" })

  useEffect(() => {
    if (user) {
      loadTherapistInfo()
      loadTasks()
      loadAppointments()
    }
  }, [user])

  const loadTherapistInfo = async () => {
    const res = await getTherapistInfo()
    if (res.success && res.data) {
      setTherapist(res.data)
    }
  }

  const saveTherapistInfo = async () => {
    const res = await updateTherapistInfo(therapist)
    if (res.error) {
      toast.error("שגיאה בשמירת הנתונים")
    } else {
      toast.success("פרטי המטפל נשמרו בהצלחה")
    }
  }

  const loadTasks = async () => {
    const res = await getTherapistTasks()
    if (res.success && res.data) setTasks(res.data)
  }

  const addTask = async () => {
    if (!newTask.title) return

    const res = await addTherapistTask(newTask)

    if (res.success) {
      setNewTask({ title: "", description: "" })
      loadTasks()
      toast.success("משימה נוספה")
    } else {
      toast.error("שגיאה בהוספת משימה")
    }
  }

  const toggleTask = async (taskId: string, completed: boolean) => {
    // Optimistic update
    setTasks(tasks.map(t => t.id === taskId ? { ...t, completed } : t))

    const res = await toggleTherapistTask(taskId, completed)
    if (!res.success) {
      toast.error("שגיאה בעדכון משימה")
      loadTasks() // Revert
    }
  }

  const loadAppointments = async () => {
    const res = await getAppointments()
    if (res.success && res.data) setAppointments(res.data)
  }

  const addAppointment = async () => {
    if (!newAppointment.date || !newAppointment.time) return

    const res = await addAppointment(newAppointment)

    if (res.success) {
      setNewAppointment({ date: "", time: "", notes: "" })
      loadAppointments()
      toast.success("פגישה נוספה")
    } else {
      toast.error("שגיאה בהוספת פגישה")
    }
  }

  const sendEmail = async () => {
    if (!therapist.email) {
      toast.error("לא הוזן כתובת מייל של המטפל")
      return
    }

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: therapist.email,
          subject: "פנייה דחופה ממערכת MOODS",
          message: "שלום, אני זקוק לסיוע. אנא צור/צרי איתי קשר בהקדם.",
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success("המייל נשלח בהצלחה")
      } else {
        toast.error(data.error || "שגיאה בשליחת המייל")
      }
    } catch (error) {
      console.error("[v0] Email send error:", error)
      toast.error("שגיאה בשליחת המייל")
    }
  }

  const openEmail = () => {
    sendEmail()
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card className="border-red-500 bg-red-50 dark:bg-red-950">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-red-700 dark:text-red-400 text-2xl">
            <AlertCircle className="h-7 w-7" />
            במצב חירום - לחץ כאן
          </CardTitle>
          <CardDescription className="text-red-600 dark:text-red-300 text-center text-lg">
            אם אתה בסכנה מיידית, התקשר למוקד החירום 24/7
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            size="lg"
            variant="destructive"
            className="w-full text-2xl h-20 font-bold"
            onClick={() => window.open("tel:1201", "_blank")}
          >
            <Phone className="ml-2 h-8 w-8" />
            חייג למוקד סיוע נפשי - 1201
          </Button>
          <p className="text-base text-center text-red-600 dark:text-red-300 font-semibold">
            זמין 24 שעות ביממה, 7 ימים בשבוע
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <MessageSquare className="h-5 w-5" />
            המטפל/ת שלי
          </CardTitle>
          <CardDescription className="text-center">פרטי קשר ותקשורת מהירה</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <Label className="text-center block mb-2">שם המטפל/ת</Label>
              <Input
                className="text-center"
                value={therapist.name}
                onChange={(e) => setTherapist({ ...therapist, name: e.target.value })}
                placeholder="הזן שם"
              />
            </div>
            <div>
              <Label className="text-center block mb-2">מספר טלפון</Label>
              <Input
                className="text-center"
                value={therapist.phone}
                onChange={(e) => setTherapist({ ...therapist, phone: e.target.value })}
                placeholder="05X-XXXXXXX"
              />
            </div>
            <div>
              <Label className="text-center block mb-2">דוא״ל (אופציונלי)</Label>
              <Input
                className="text-center"
                type="email"
                value={therapist.email || ""}
                onChange={(e) => setTherapist({ ...therapist, email: e.target.value })}
                placeholder="therapist@example.com"
              />
            </div>
          </div>

          <Button onClick={saveTherapistInfo} className="w-full">
            שמור פרטים
          </Button>

          {therapist.phone && (
            <div className="grid grid-cols-2 gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => window.open(`tel:${therapist.phone}`, "_blank")}>
                <Phone className="ml-1 h-4 w-4" />
                חייג
              </Button>
              {therapist.email && (
                <Button variant="outline" onClick={openEmail} className="bg-blue-50 dark:bg-blue-950">
                  <Mail className="ml-1 h-4 w-4" />
                  מייל
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <CheckCircle className="h-5 w-5" />
            משימות ותרגילים
          </CardTitle>
          <CardDescription className="text-center">תרגילים שהמטפל שלח</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* הוספת משימה חדשה */}
          <Accordion type="single" collapsible>
            <AccordionItem value="add-task">
              <AccordionTrigger className="text-center">
                <span className="w-full text-center">➕ הוסף משימה חדשה</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-4">
                <Input
                  className="text-center"
                  placeholder="כותרת המשימה"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
                <Textarea
                  className="text-center"
                  placeholder="תיאור ופרטים"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
                <Button onClick={addTask} className="w-full">
                  הוסף משימה
                </Button>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* רשימת המשימות */}
          <div className="space-y-2">
            {tasks.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">אין משימות עדיין</p>
            ) : (
              tasks.map((task) => (
                <div key={task.id} className="flex items-start gap-3 p-4 border rounded-lg">
                  <Checkbox checked={task.completed} onCheckedChange={(checked) => toggleTask(task.id, !!checked)} />
                  <div className="flex-1">
                    <p className={`font-semibold ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                      {task.title}
                    </p>
                    {task.description && <p className="text-sm text-muted-foreground mt-1">{task.description}</p>}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Calendar className="h-5 w-5" />
            פגישות קרובות
          </CardTitle>
          <CardDescription className="text-center">ניהול מפגשים עם המטפל</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* הוספת פגישה */}
          <Accordion type="single" collapsible>
            <AccordionItem value="add-appointment">
              <AccordionTrigger className="text-center">
                <span className="w-full text-center">➕ קבע פגישה חדשה</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-center block mb-2">תאריך</Label>
                    <Input
                      type="date"
                      className="text-center"
                      value={newAppointment.date}
                      onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label className="text-center block mb-2">שעה</Label>
                    <Input
                      type="time"
                      className="text-center"
                      value={newAppointment.time}
                      onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                    />
                  </div>
                </div>
                <Textarea
                  className="text-center"
                  placeholder="הערות (אופציונלי)"
                  value={newAppointment.notes}
                  onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                />
                <Button onClick={addAppointment} className="w-full">
                  הוסף פגישה
                </Button>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* רשימת פגישות */}
          <div className="space-y-2">
            {appointments.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">אין פגישות מתוכננות</p>
            ) : (
              appointments.map((apt) => (
                <div key={apt.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">
                        {new Date(apt.date).toLocaleDateString("he-IL")} בשעה {apt.time}
                      </p>
                      {apt.notes && <p className="text-sm text-muted-foreground mt-1">{apt.notes}</p>}
                    </div>
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* קווי סיוע */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle>קווי סיוע וייעוץ</CardTitle>
          <CardDescription className="text-center">שירותים זמינים לתמיכה רגשית</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-semibold">ער״ן - עזרה ראשונה נפשית</p>
              <p className="text-sm text-muted-foreground">שיחה אנונימית עם מתנדבים מיומנים</p>
            </div>
            <Button variant="outline" onClick={() => window.open("tel:1201", "_blank")}>
              <Phone className="ml-2 h-4 w-4" />
              1201
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-semibold">נט״ל - קו למשפחות חיילים</p>
              <p className="text-sm text-muted-foreground">תמיכה למשפחות של חיילים</p>
            </div>
            <Button variant="outline" onClick={() => window.open("tel:1800363363", "_blank")}>
              <Phone className="ml-2 h-4 w-4" />
              1-800-363-363
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-semibold">סה״ר - סיוע והקשבה ברשת</p>
              <p className="text-sm text-muted-foreground">צ׳אט מקוון עם יועצים</p>
            </div>
            <Button variant="outline" onClick={() => window.open("https://www.sahar.org.il", "_blank")}>
              <MessageCircle className="ml-2 h-4 w-4" />
              לצ׳אט
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
