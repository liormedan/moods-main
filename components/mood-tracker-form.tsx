"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useUser } from "@clerk/nextjs"
import { createClient } from "@/lib/neon/client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, X } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface CustomSlider {
  id: string
  name: string
  lowLabel: string
  highLabel: string
  value: number
  emoji: string
}

interface MoodTrackerFormProps {
  onSuccess?: () => void
}

const PRESET_SLIDERS = [
  { name: "שינה", lowLabel: "ישentai מצוין", highLabel: "לא ישentai", emoji: "😴" },
  { name: "תיאבון", lowLabel: "שבע", highLabel: "רעב", emoji: "🍽️" },
  { name: "ריכוז", lowLabel: "ממוקד", highLabel: "מפוזר", emoji: "🎯" },
  { name: "חברתי", lowLabel: "חברתי", highLabel: "מבודד", emoji: "👥" },
  { name: "מוטיבציה", lowLabel: "נמוכה", highLabel: "גבוהה", emoji: "🚀" },
  { name: "כאב", lowLabel: "ללא כאב", highLabel: "כאב חזק", emoji: "💊" },
  { name: "חרדה", lowLabel: "רגוע", highLabel: "חרד", emoji: "😰" },
]

export function MoodTrackerForm({ onSuccess }: MoodTrackerFormProps = {}) {
  const { user } = useUser()
  const [moodLevel, setMoodLevel] = useState([5])
  const [energyLevel, setEnergyLevel] = useState([5])
  const [stressLevel, setStressLevel] = useState([5])
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [customSliders, setCustomSliders] = useState<CustomSlider[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newSliderName, setNewSliderName] = useState("")
  const [newSliderLowLabel, setNewSliderLowLabel] = useState("")
  const [newSliderHighLabel, setNewSliderHighLabel] = useState("")
  const [newSliderEmoji, setNewSliderEmoji] = useState("📊")
  const [selectedPreset, setSelectedPreset] = useState<string>("")

  const { toast } = useToast()

  const addCustomSlider = () => {
    if (customSliders.length >= 10) {
      toast({
        title: "הגעת למקסימום",
        description: "ניתן להוסיף עד 10 סליידרים נוספים",
        variant: "destructive",
      })
      return
    }

    if (!newSliderName.trim()) {
      toast({
        title: "שם חסר",
        description: "יש להזין שם לסליידר",
        variant: "destructive",
      })
      return
    }

    const newSlider: CustomSlider = {
      id: Date.now().toString(),
      name: newSliderName,
      lowLabel: newSliderLowLabel || "נמוך",
      highLabel: newSliderHighLabel || "גבוה",
      value: 5,
      emoji: newSliderEmoji,
    }

    setCustomSliders([...customSliders, newSlider])
    setNewSliderName("")
    setNewSliderLowLabel("")
    setNewSliderHighLabel("")
    setNewSliderEmoji("📊")
    setSelectedPreset("")
    setIsAddDialogOpen(false)
  }

  const addPresetSlider = () => {
    const preset = PRESET_SLIDERS.find((p) => p.name === selectedPreset)
    if (!preset) return

    if (customSliders.length >= 10) {
      toast({
        title: "הגעת למקסימום",
        description: "ניתן להוסיף עד 10 סליידרים נוספים",
        variant: "destructive",
      })
      return
    }

    const newSlider: CustomSlider = {
      id: Date.now().toString(),
      name: preset.name,
      lowLabel: preset.lowLabel,
      highLabel: preset.highLabel,
      value: 5,
      emoji: preset.emoji,
    }

    setCustomSliders([...customSliders, newSlider])
    setSelectedPreset("")
    setIsAddDialogOpen(false)
  }

  const removeCustomSlider = (id: string) => {
    setCustomSliders(customSliders.filter((s) => s.id !== id))
  }

  const updateSliderValue = (id: string, value: number[]) => {
    setCustomSliders(customSliders.map((s) => (s.id === id ? { ...s, value: value[0] } : s)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!user) {
        toast({
          title: "שגיאה",
          description: "נדרש להיות מחובר כדי לשמור מצב רוח",
          variant: "destructive",
        })
        return
      }

      const supabase = createClient()
      const customMetrics = customSliders.map((slider) => ({
        name: slider.name,
        value: slider.value,
        lowLabel: slider.lowLabel,
        highLabel: slider.highLabel,
        emoji: slider.emoji,
      }))

      const { error } = await supabase.from("mood_entries").insert({
        user_id: user.id,
        mood_level: moodLevel[0],
        energy_level: energyLevel[0],
        stress_level: stressLevel[0],
        notes: notes.trim() || null,
        custom_metrics: customMetrics,
      })

      if (error) {
        // If error message indicates database not configured, show helpful message
        if (error.message && error.message.includes("not configured")) {
          toast({
            title: "מסד נתונים לא מוגדר",
            description: "אנא הגדר את מסד הנתונים כדי לשמור מצבי רוח.",
            variant: "destructive",
          })
        } else {
          console.error("[v0] Error saving mood entry:", error)
          toast({
            title: "שגיאה בשמירה",
            description: "לא הצלחנו לשמור את מצב הרוח. נסה שוב.",
            variant: "destructive",
          })
        }
      } else {
        toast({
          title: "נשמר בהצלחה!",
          description: "מצב הרוח שלך נשמר בהצלחה",
        })
        setMoodLevel([5])
        setEnergyLevel([5])
        setStressLevel([5])
        setNotes("")
        setCustomSliders([])
        onSuccess?.()
      }
    } catch (error) {
      console.error("[v0] Unexpected error:", error)
      toast({
        title: "שגיאה",
        description: "משהו השתבש. נסה שוב.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getMoodEmoji = (level: number) => {
    if (level <= 3) return "😢"
    if (level <= 5) return "😐"
    if (level <= 7) return "🙂"
    return "😄"
  }

  const getEnergyEmoji = (level: number) => {
    if (level <= 3) return "🔋"
    if (level <= 6) return "⚡"
    return "⚡⚡"
  }

  const getStressEmoji = (level: number) => {
    if (level <= 3) return "😌"
    if (level <= 6) return "😰"
    return "🤯"
  }

  return (
    <div className="flex items-start justify-center w-full px-4 py-4 md:py-6">
      <div className="w-full max-w-3xl">
        <Card>
          <CardHeader className="text-center pb-2 md:pb-4">
            <CardTitle className="text-lg md:text-xl">איך אתה מרגיש היום?</CardTitle>
            <CardDescription className="text-xs md:text-sm">עקוב אחר מצב הרוח, האנרגיה והלחץ שלך</CardDescription>
          </CardHeader>
          <CardContent className="px-4 md:px-6 pb-4 md:pb-6">
            <form onSubmit={handleSubmit} className="space-y-2.5 md:space-y-4">
              <div className="space-y-2.5 md:space-y-3">
                <div className="space-y-1 md:space-y-1.5">
                  <div className="flex items-center justify-center gap-2">
                    <Label className="text-sm md:text-base">מצב רוח {getMoodEmoji(moodLevel[0])}</Label>
                    <span className="text-lg md:text-xl font-bold">{moodLevel[0]}/10</span>
                  </div>
                  <Slider value={moodLevel} onValueChange={setMoodLevel} min={1} max={10} step={1} className="w-full" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>שמח</span>
                    <span>עצוב</span>
                  </div>
                </div>

                <div className="space-y-1 md:space-y-1.5">
                  <div className="flex items-center justify-center gap-2">
                    <Label className="text-sm md:text-base">רמת אנרגיה {getEnergyEmoji(energyLevel[0])}</Label>
                    <span className="text-lg md:text-xl font-bold">{energyLevel[0]}/10</span>
                  </div>
                  <Slider
                    value={energyLevel}
                    onValueChange={setEnergyLevel}
                    min={1}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>מלא אנרגיה</span>
                    <span>מותש</span>
                  </div>
                </div>

                <div className="space-y-1 md:space-y-1.5">
                  <div className="flex items-center justify-center gap-2">
                    <Label className="text-sm md:text-base">רמת לחץ {getStressEmoji(stressLevel[0])}</Label>
                    <span className="text-lg md:text-xl font-bold">{stressLevel[0]}/10</span>
                  </div>
                  <Slider
                    value={stressLevel}
                    onValueChange={setStressLevel}
                    min={1}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>מלחיץ</span>
                    <span>רגוע</span>
                  </div>
                </div>

                {customSliders.map((slider) => (
                  <div key={slider.id} className="space-y-1 md:space-y-1.5 border-t pt-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center justify-center gap-2 flex-1">
                        <Label className="text-sm md:text-base">
                          {slider.name} {slider.emoji}
                        </Label>
                        <span className="text-lg md:text-xl font-bold">{slider.value}/10</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCustomSlider(slider.id)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <Slider
                      value={[slider.value]}
                      onValueChange={(value) => updateSliderValue(slider.id, value)}
                      min={1}
                      max={10}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{slider.highLabel}</span>
                      <span>{slider.lowLabel}</span>
                    </div>
                  </div>
                ))}

                {customSliders.length < 10 && (
                  <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                      <Button type="button" variant="outline" className="w-full bg-transparent text-xs md:text-sm">
                        <Plus className="ml-2 h-3 w-3 md:h-4 md:w-4" />
                        הוסף מדד נוסף ({customSliders.length}/10)
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader className="text-center">
                        <DialogTitle className="text-center">הוסף מדד למעקב</DialogTitle>
                        <DialogDescription className="text-center">בחר מפריסט או צור מדד משלך</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-center block w-full">בחר מדד מוכן</Label>
                          <Select value={selectedPreset} onValueChange={setSelectedPreset}>
                            <SelectTrigger className="text-center">
                              <SelectValue placeholder="בחר מדד..." />
                            </SelectTrigger>
                            <SelectContent className="text-center">
                              {PRESET_SLIDERS.map((preset) => (
                                <SelectItem key={preset.name} value={preset.name} className="justify-center">
                                  <span className="flex items-center gap-2">
                                    {preset.emoji} {preset.name}
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {selectedPreset && (
                            <Button type="button" onClick={addPresetSlider} className="w-full">
                              הוסף "{selectedPreset}"
                            </Button>
                          )}
                        </div>

                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                          </div>
                          <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">או</span>
                          </div>
                        </div>

                        <Accordion type="single" collapsible>
                          <AccordionItem value="custom-metric">
                            <AccordionTrigger className="text-center justify-center">צור מדד משלך</AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-2 pt-2">
                                <input
                                  placeholder="שם המדד (לדוגמא: כאב ראש)"
                                  value={newSliderName}
                                  onChange={(e) => setNewSliderName(e.target.value)}
                                  className="w-full px-4 py-2 border rounded text-center"
                                />
                                <input
                                  placeholder="תווית ערך גבוה (לדוגמא: כאב חזק)"
                                  value={newSliderHighLabel}
                                  onChange={(e) => setNewSliderHighLabel(e.target.value)}
                                  className="w-full px-4 py-2 border rounded text-center"
                                />
                                <input
                                  placeholder="תווית ערך נמוך (לדוגמא: ללא כאב)"
                                  value={newSliderLowLabel}
                                  onChange={(e) => setNewSliderLowLabel(e.target.value)}
                                  className="w-full px-4 py-2 border rounded text-center"
                                />
                                <input
                                  placeholder="אימוג'י (לדוגמא: 🤕)"
                                  value={newSliderEmoji}
                                  onChange={(e) => setNewSliderEmoji(e.target.value)}
                                  maxLength={2}
                                  className="w-full px-4 py-2 border rounded text-center"
                                />
                                <Button type="button" onClick={addCustomSlider} className="w-full">
                                  הוסף מדד מותאם אישית
                                </Button>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}

                <div className="space-y-1 md:space-y-1.5">
                  <Label htmlFor="notes" className="block text-center text-sm md:text-base">
                    הערות (אופציונלי)
                  </Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="רשום איך אתה מרגיש, מה קרה היום..."
                    className="min-h-[60px] md:min-h-[80px] resize-none w-full px-4 py-2 border rounded text-sm"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full text-sm md:text-base" disabled={isSubmitting}>
                {isSubmitting ? "שומר..." : "שמור מצב רוח"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
