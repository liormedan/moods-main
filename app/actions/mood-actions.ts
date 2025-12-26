'use server'

import { createClient } from "@/lib/neon/client"

export async function getMoodEntries() {
    try {

        const client = createClient()
        // Get all entries (no user filtering)
        const { data, error } = await client.from("mood_entries")
            .select("*")
            .order("created_at", { ascending: false }) as any

        // Note: Our manual client.ts might not support .eq().select() chaining perfectly 
        // depending on how we wrote it. Let's check client.ts implementation details if needed.
        // The current client.ts mock implementation of `from()` returns a builder with `select`, 
        // but `select` returns a builder with `order`. It DOES NOT seem to have `eq`.
        // We need to upgrade client.ts or handle filtering differently (e.g. raw SQL in client.ts).
        // Actually, for better security/performance with the Pool, we should just write the query with WHERE clause.
        // access client.ts implementation is barebones. 
        // Let's rely on the fact we are rewriting this file, so we can fix it.

        // WAIT: The previous client.ts implementation was:
        // from(table) -> select(cols) -> order() -> then()
        // It constructed `SELECT cols FROM table ORDER BY ...`
        // It does NOT support WHERE clauses. 

        // I should modify client.ts to support .eq() OR just pass a custom filter to it?
        // Or I can just write raw SQL here if I expose the pool? No, we want to keep abstraction layer or fix it.

        // Let's modify client.ts to support basic .eq() or changing the abstraction.
        // OR, I can just cheat and fetch all and filter in JS? NO, that's bad security (fetching other users data).

        // BETTER APPROACH: Update client.ts to support .eq() in the chain.
        // But since I am editing THIS file, I cannot edit client.ts in the same step easily without context switching.
        // Actually, I can use the `multi_replace_file_content` to edit both if I call it sequentially.
        // But wait, I am in `mood-actions.ts`.

        // Let's assume I will update `client.ts` as well.
        // For now, I will write the code here assuming `client.ts` supports `.eq(column, value)`.

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
