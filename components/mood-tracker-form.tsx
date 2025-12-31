"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { logMoodEntry } from "@/app/actions/mood-actions"
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
import { Switch } from "@/components/ui/switch"
import { Plus, X, MessageSquare } from "lucide-react"
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
  { name: "מוטיבציה", lowLabel: "נמוכה", highLabel: "גבוהה", emoji: "🚀" },
  { name: "כאב", lowLabel: "ללא כאב", highLabel: "כאב חזק", emoji: "💊" },
]

export function MoodTrackerForm({ onSuccess }: MoodTrackerFormProps = {}) {
  const [moodLevel, setMoodLevel] = useState([5])
  const [energyLevel, setEnergyLevel] = useState([5])
  const [stressLevel, setStressLevel] = useState([5])
  const [sleepLevel, setSleepLevel] = useState([5]) // 0-10, displayed as 10-value for reverse (0=right/low, 10=left/high)
  const [appetiteLevel, setAppetiteLevel] = useState([5]) // 1-10, low (right), high (left)
  const [concentrationLevel, setConcentrationLevel] = useState([5]) // 1-10, low (right), high (left)
  const [socialLevel, setSocialLevel] = useState([5]) // 1-10, loneliness (right), fullness (left)
  const [anxietyLevel, setAnxietyLevel] = useState([5]) // 1-10, low (right), high (left)
  const [medicationTaken, setMedicationTaken] = useState(false) // Yes/No
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Notes for each slider
  const [moodNote, setMoodNote] = useState("")
  const [energyNote, setEnergyNote] = useState("")
  const [stressNote, setStressNote] = useState("")
  const [sleepNote, setSleepNote] = useState("")
  const [appetiteNote, setAppetiteNote] = useState("")
  const [concentrationNote, setConcentrationNote] = useState("")
  const [socialNote, setSocialNote] = useState("")
  const [anxietyNote, setAnxietyNote] = useState("")
  const [medicationNote, setMedicationNote] = useState("")
  
  // Dialog state for notes
  const [noteDialogOpen, setNoteDialogOpen] = useState(false)
  const [currentNoteField, setCurrentNoteField] = useState<string>("")
  const [currentNoteValue, setCurrentNoteValue] = useState("")

  const [customSliders, setCustomSliders] = useState<CustomSlider[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newSliderName, setNewSliderName] = useState("")
  const [newSliderLowLabel, setNewSliderLowLabel] = useState("")
  const [newSliderHighLabel, setNewSliderHighLabel] = useState("")
  const [newSliderEmoji, setNewSliderEmoji] = useState("📊")
  const [selectedPreset, setSelectedPreset] = useState<string>("")
  
  // Track which additional fields are visible
  const [visibleAdditionalFields, setVisibleAdditionalFields] = useState<Set<string>>(new Set())
  const [isAddFieldDialogOpen, setIsAddFieldDialogOpen] = useState(false)

  const { toast } = useToast()
  
  // Available additional fields
  const ADDITIONAL_FIELDS = [
    { id: "sleep", name: "שינה", emoji: "😴" },
    { id: "appetite", name: "תיאבון", emoji: "🍽️" },
    { id: "concentration", name: "ריכוז", emoji: "🎯" },
    { id: "social", name: "חברתי", emoji: "👥" },
    { id: "anxiety", name: "חרדה", emoji: "😰" },
    { id: "medication", name: "לקיחת תרופות", emoji: "💊" },
  ]
  
  const toggleAdditionalField = (fieldId: string) => {
    setVisibleAdditionalFields(prev => {
      const newSet = new Set(prev)
      if (newSet.has(fieldId)) {
        newSet.delete(fieldId)
      } else {
        newSet.add(fieldId)
      }
      return newSet
    })
  }

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
      const result = await logMoodEntry({
        mood_level: moodLevel[0],
        energy_level: energyLevel[0],
        stress_level: stressLevel[0],
        notes: notes.trim(), // Server action expects string, handle null there or pass empty string
        custom_metrics: [
          // Main metrics with notes
          { name: "מצב רוח", value: moodLevel[0], lowLabel: "רע", highLabel: "טוב", emoji: getMoodEmoji(moodLevel[0]), note: moodNote },
          { name: "רמת אנרגיה", value: energyLevel[0], lowLabel: "נמוכה", highLabel: "גבוהה", emoji: getEnergyEmoji(energyLevel[0]), note: energyNote },
          { name: "רמת לחץ", value: stressLevel[0], lowLabel: "נמוכה", highLabel: "גבוהה", emoji: getStressEmoji(stressLevel[0]), note: stressNote },
          // Only include additional fields that are visible
          ...(visibleAdditionalFields.has("sleep") ? [{ name: "שינה", value: 10 - sleepLevel[0], lowLabel: "0 שעות", highLabel: "10+ שעות", emoji: "😴", note: sleepNote }] : []),
          ...(visibleAdditionalFields.has("appetite") ? [{ name: "תיאבון", value: appetiteLevel[0], lowLabel: "נמוך", highLabel: "גבוה", emoji: "🍽️", note: appetiteNote }] : []),
          ...(visibleAdditionalFields.has("concentration") ? [{ name: "ריכוז", value: concentrationLevel[0], lowLabel: "נמוך", highLabel: "גבוה", emoji: "🎯", note: concentrationNote }] : []),
          ...(visibleAdditionalFields.has("social") ? [{ name: "חברתי", value: socialLevel[0], lowLabel: "הרגשת בדידות", highLabel: "הרגשת מלאות", emoji: "👥", note: socialNote }] : []),
          ...(visibleAdditionalFields.has("anxiety") ? [{ name: "חרדה", value: anxietyLevel[0], lowLabel: "נמוך", highLabel: "גבוה", emoji: "😰", note: anxietyNote }] : []),
          ...(visibleAdditionalFields.has("medication") ? [{ name: "לקיחת תרופות", value: medicationTaken ? 1 : 0, lowLabel: "לא", highLabel: "כן", emoji: "💊", note: medicationNote }] : []),
          // Custom sliders
          ...customSliders.map((slider) => ({
            name: slider.name,
            value: slider.value,
            lowLabel: slider.lowLabel,
            highLabel: slider.highLabel,
            emoji: slider.emoji,
          })),
        ],
      })

      if (!result.success) {
        if (result.error && result.error.includes("not configured")) {
          toast({
            title: "מסד נתונים לא מוגדר",
            description: "אנא הגדר את מסד הנתונים כדי לשמור מצבי רוח.",
            variant: "destructive",
          })
        } else {
          console.error("[v0] Error saving mood entry:", result.error)
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
        setSleepLevel([5])
        setAppetiteLevel([5])
        setConcentrationLevel([5])
        setSocialLevel([5])
        setAnxietyLevel([5])
        setMedicationTaken(false)
        setNotes("")
        setCustomSliders([])
        setVisibleAdditionalFields(new Set())
        // Reset all notes
        setMoodNote("")
        setEnergyNote("")
        setStressNote("")
        setSleepNote("")
        setAppetiteNote("")
        setConcentrationNote("")
        setSocialNote("")
        setAnxietyNote("")
        setMedicationNote("")
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

  const getFieldName = (fieldId: string): string => {
    const fieldNames: Record<string, string> = {
      mood: "מצב רוח",
      energy: "רמת אנרגיה",
      stress: "רמת לחץ",
      sleep: "שינה",
      appetite: "תיאבון",
      concentration: "ריכוז",
      social: "חברתי",
      anxiety: "חרדה",
      medication: "לקיחת תרופות",
    }
    return fieldNames[fieldId] || fieldId
  }

  const openNoteDialog = (fieldId: string) => {
    setCurrentNoteField(fieldId)
    // Get the current note value for this field
    const noteValues: Record<string, string> = {
      mood: moodNote,
      energy: energyNote,
      stress: stressNote,
      sleep: sleepNote,
      appetite: appetiteNote,
      concentration: concentrationNote,
      social: socialNote,
      anxiety: anxietyNote,
      medication: medicationNote,
    }
    setCurrentNoteValue(noteValues[fieldId] || "")
    setNoteDialogOpen(true)
  }

  const saveNote = () => {
    // Save the note to the appropriate state
    switch (currentNoteField) {
      case "mood":
        setMoodNote(currentNoteValue)
        break
      case "energy":
        setEnergyNote(currentNoteValue)
        break
      case "stress":
        setStressNote(currentNoteValue)
        break
      case "sleep":
        setSleepNote(currentNoteValue)
        break
      case "appetite":
        setAppetiteNote(currentNoteValue)
        break
      case "concentration":
        setConcentrationNote(currentNoteValue)
        break
      case "social":
        setSocialNote(currentNoteValue)
        break
      case "anxiety":
        setAnxietyNote(currentNoteValue)
        break
      case "medication":
        setMedicationNote(currentNoteValue)
        break
    }
    setNoteDialogOpen(false)
  }

  return (
    <div className="w-full">
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
                    <span>רע</span>
                    <span>טוב</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => openNoteDialog("mood")}
                    className="w-full text-xs h-8"
                  >
                    <MessageSquare className="ml-2 h-3 w-3" />
                    {moodNote ? "ערוך הערה" : "הוסף הערה"}
                  </Button>
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
                    <span>נמוכה</span>
                    <span>גבוהה</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => openNoteDialog("energy")}
                    className="w-full text-xs h-8"
                  >
                    <MessageSquare className="ml-2 h-3 w-3" />
                    {energyNote ? "ערוך הערה" : "הוסף הערה"}
                  </Button>
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
                    <span>נמוכה</span>
                    <span>גבוהה</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => openNoteDialog("stress")}
                    className="w-full text-xs h-8"
                  >
                    <MessageSquare className="ml-2 h-3 w-3" />
                    {stressNote ? "ערוך הערה" : "הוסף הערה"}
                  </Button>
                </div>

                {/* Button to add additional fields */}
                {visibleAdditionalFields.size < ADDITIONAL_FIELDS.length && (
                  <div className="border-t pt-3">
                    <Dialog open={isAddFieldDialogOpen} onOpenChange={setIsAddFieldDialogOpen}>
                      <DialogTrigger asChild>
                        <Button type="button" variant="outline" className="w-full bg-transparent text-xs md:text-sm">
                          <Plus className="ml-2 h-3 w-3 md:h-4 md:w-4" />
                          הוסף שדות נוספים
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="text-center">בחר שדות להוספה</DialogTitle>
                          <DialogDescription className="text-center">בחר אילו שדות תרצה להוסיף לטופס</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                          {ADDITIONAL_FIELDS.map((field) => (
                            <div key={field.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{field.emoji}</span>
                                <Label className="text-sm md:text-base cursor-pointer" onClick={() => toggleAdditionalField(field.id)}>
                                  {field.name}
                                </Label>
                              </div>
                              <Switch
                                checked={visibleAdditionalFields.has(field.id)}
                                onCheckedChange={() => toggleAdditionalField(field.id)}
                              />
                            </div>
                          ))}
                        </div>
                        <Button onClick={() => setIsAddFieldDialogOpen(false)} className="w-full mt-4">
                          סיום
                        </Button>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}

                {/* שינה - 0-10, 0 מימין (הכי נמוך), 10 משמאל (הכי גבוה) - הפוך את הערך */}
                {visibleAdditionalFields.has("sleep") && (
                <div className="space-y-1 md:space-y-1.5 border-t pt-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center justify-center gap-2 flex-1">
                      <Label className="text-sm md:text-base">שינה 😴</Label>
                      <span className="text-lg md:text-xl font-bold">{10 - sleepLevel[0]}/10</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleAdditionalField("sleep")}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <Slider 
                    value={sleepLevel} 
                    onValueChange={(val) => setSleepLevel(val)} 
                    min={0} 
                    max={10} 
                    step={1} 
                    className="w-full" 
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>10+ שעות</span>
                    <span>0 שעות</span>
                  </div>
                </div>
                )}

                {/* תיאבון - נמוך מימין, גבוה משמאל */}
                {visibleAdditionalFields.has("appetite") && (
                <div className="space-y-1 md:space-y-1.5 border-t pt-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center justify-center gap-2 flex-1">
                      <Label className="text-sm md:text-base">תיאבון 🍽️</Label>
                      <span className="text-lg md:text-xl font-bold">{appetiteLevel[0]}/10</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleAdditionalField("appetite")}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <Slider value={appetiteLevel} onValueChange={setAppetiteLevel} min={1} max={10} step={1} className="w-full" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>גבוה</span>
                    <span>נמוך</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => openNoteDialog("appetite")}
                    className="w-full text-xs h-8"
                  >
                    <MessageSquare className="ml-2 h-3 w-3" />
                    {appetiteNote ? "ערוך הערה" : "הוסף הערה"}
                  </Button>
                </div>
                )}

                {/* ריכוז - נמוך מימין, גבוה משמאל */}
                {visibleAdditionalFields.has("concentration") && (
                <div className="space-y-1 md:space-y-1.5 border-t pt-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center justify-center gap-2 flex-1">
                      <Label className="text-sm md:text-base">ריכוז 🎯</Label>
                      <span className="text-lg md:text-xl font-bold">{concentrationLevel[0]}/10</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleAdditionalField("concentration")}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <Slider value={concentrationLevel} onValueChange={setConcentrationLevel} min={1} max={10} step={1} className="w-full" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>גבוה</span>
                    <span>נמוך</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => openNoteDialog("concentration")}
                    className="w-full text-xs h-8"
                  >
                    <MessageSquare className="ml-2 h-3 w-3" />
                    {concentrationNote ? "ערוך הערה" : "הוסף הערה"}
                  </Button>
                </div>
                )}

                {/* חברתי - בדידות מימין, מלאות משמאל */}
                {visibleAdditionalFields.has("social") && (
                <div className="space-y-1 md:space-y-1.5 border-t pt-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center justify-center gap-2 flex-1">
                      <Label className="text-sm md:text-base">חברתי 👥</Label>
                      <span className="text-lg md:text-xl font-bold">{socialLevel[0]}/10</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleAdditionalField("social")}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <Slider value={socialLevel} onValueChange={setSocialLevel} min={1} max={10} step={1} className="w-full" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>הרגשת מלאות</span>
                    <span>הרגשת בדידות</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => openNoteDialog("social")}
                    className="w-full text-xs h-8"
                  >
                    <MessageSquare className="ml-2 h-3 w-3" />
                    {socialNote ? "ערוך הערה" : "הוסף הערה"}
                  </Button>
                </div>
                )}

                {/* חרדה - נמוך מימין, גבוה משמאל */}
                {visibleAdditionalFields.has("anxiety") && (
                <div className="space-y-1 md:space-y-1.5 border-t pt-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center justify-center gap-2 flex-1">
                      <Label className="text-sm md:text-base">חרדה 😰</Label>
                      <span className="text-lg md:text-xl font-bold">{anxietyLevel[0]}/10</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleAdditionalField("anxiety")}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <Slider value={anxietyLevel} onValueChange={setAnxietyLevel} min={1} max={10} step={1} className="w-full" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>גבוה</span>
                    <span>נמוך</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => openNoteDialog("anxiety")}
                    className="w-full text-xs h-8"
                  >
                    <MessageSquare className="ml-2 h-3 w-3" />
                    {anxietyNote ? "ערוך הערה" : "הוסף הערה"}
                  </Button>
                </div>
                )}

                {/* לקיחת תרופות - כן/לא */}
                {visibleAdditionalFields.has("medication") && (
                <div className="space-y-1 md:space-y-1.5 border-t pt-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="medication" className="text-sm md:text-base">לקיחת תרופות 💊</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{medicationTaken ? "כן" : "לא"}</span>
                      <Switch
                        id="medication"
                        checked={medicationTaken}
                        onCheckedChange={setMedicationTaken}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleAdditionalField("medication")}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                )}

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
                      <span>{slider.lowLabel}</span>
                      <span>{slider.highLabel}</span>
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
      
      {/* Note Dialog */}
      <Dialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>הערה עבור {getFieldName(currentNoteField)}</DialogTitle>
            <DialogDescription>הוסף הערה ספציפית למדד זה (אופציונלי)</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={currentNoteValue}
              onChange={(e) => setCurrentNoteValue(e.target.value)}
              placeholder="רשום הערה..."
              className="min-h-[100px]"
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setNoteDialogOpen(false)}>
                ביטול
              </Button>
              <Button onClick={saveNote}>
                שמור
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
