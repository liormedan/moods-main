'use server'

import { moodsApi } from "@/lib/api/moods-server"

export async function getMoodEntries() {
    try {
        const data = await moodsApi.getAll()
        return { success: true, data }
    } catch (e: any) {
        console.error("getMoodEntries Error:", e)
        return { success: false, error: e.message }
    }
}

export async function logMoodEntry(formData: {
    mood_level: number
    energy_level: number
    stress_level: number
    notes: string
    custom_metrics: any[]
}) {
    try {
        // Map 'notes' to 'note' as expected by backend/schema
        const { notes, ...rest } = formData
        await moodsApi.create({
            note: notes,
            ...rest
        })
        return { success: true }
    } catch (e: any) {
        console.error("logMoodEntry Error:", e)
        return { success: false, error: e.message }
    }
}

export async function deleteAllMoodEntries() {
    try {
        await moodsApi.deleteAll()
        return { success: true }
    } catch (e: any) {
        console.error("deleteAllMoodEntries Error:", e)
        return { success: false, error: e.message }
    }
}
