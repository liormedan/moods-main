'use server'

import { createClient } from "@/lib/neon/client"

export async function getMoodEntries() {
    try {

        const client = createClient()
        const { data, error } = await client.from("mood_entries")
            .select("*")
            .order("created_at", { ascending: false }) as any

        if (error) {
            console.error("Server Action Error fetching moods:", error)
            return { success: false, error: error.message || "Failed to fetch mood entries" }
        }

        return { success: true, data }
    } catch (error) {
        console.error("Unexpected Server Action Error:", error)
        return { success: false, error: "Internal server error" }
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
        const client = createClient()

        // Insert Mood (no user authentication)
        // Map 'notes' from form to 'note' in DB
        const { notes, ...rest } = formData
        const { error: moodError } = await client.from("mood_entries").insert({
            user_id: null, // No user ID needed
            note: notes,
            ...rest
        }) as any

        if (moodError) {
            console.error("Error logging mood:", moodError)
            return { success: false, error: "Failed to log mood" }
        }

        return { success: true }

    } catch (error) {
        console.error("Unexpected Server Action Error:", error)
        return { success: false, error: "Internal server error" }
    }
}

export async function deleteAllMoodEntries() {
    try {
        const client = createClient()
        const { error } = await client.from("mood_entries").delete() as any

        if (error) {
            console.error("Error deleting all moods:", error)
            return { success: false, error: error.message }
        }

        return { success: true }
    } catch (error) {
        console.error("Server Action Error:", error)
        return { success: false, error: "Internal server error" }
    }
}
