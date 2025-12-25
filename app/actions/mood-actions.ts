'use server'

import { createClient } from "@/lib/neon/client"
import { auth, currentUser } from "@clerk/nextjs/server"

export async function getMoodEntries() {
    try {
        const { userId } = await auth()

        if (!userId) {
            return { success: false, error: "Unauthorized" }
        }

        const client = createClient()
        // Filter by user_id
        const { data, error } = await client.from("mood_entries")
            .select("*")
            .eq("user_id", userId) // Assuming .eq is supported or we implement it
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
        const user = await currentUser()

        if (!user) {
            return { success: false, error: "Unauthorized" }
        }

        const client = createClient()

        // 1. Sync User (Upsert)
        // We need to ensure the user exists. 
        // Our client.ts abstraction is too weak for "INSERT ... ON CONFLICT".
        // We should probably expose a raw query method or extend the client.
        // Extending the client is cleaner.

        // For now, let's try to use a specialized method if we add it, or just use the `pool` directly if we exported it?
        // client.ts only exports `createClient`.

        // Let's add a `rpc` or `raw` method to client.ts? 
        // Or just make `createClient` return the pool? 
        // No, `createClient` returns the mock/wrapper.

        // Let's rely on `client.from('users').upsert(...)`?
        // Our current client only supports `select`.

        // RE-PLAN: I need to upgrade `client.ts` to support `insert` and `upsert` (or at least `insert` with raw query support).
        // I will write the logic here assuming `client.ts` will have `upsertUser` and `insertMood`.
        // Actually, let's just make `client.ts` expose a `sql` tag function or similar?
        // Or simply add `upsert` support to the builder.

        // Let's stick to the plan: Sync User.
        // I will use a helper `ensureUserExists` that I will assume works or impl in client.ts.

        // Let's Modify `client.ts` first? 
        // No, I'm already editing this file.
        // I'll write the code here assuming I'll fix client.ts immediately after.

        // Wait, I can't write invalid code that won't compile if I want to run verification.
        // I should probably update `client.ts` FIRST.
        // But I'm already in this tool call.

        // Let's cancel this tool call? No, I can't.
        // I will write standard Supabase-like syntax here:
        // supabase.from('users').upsert({...})
        // supabase.from('mood_entries').insert({...})

        // And then I will go and implement those methods in `client.ts`.

        // Upsert User
        const { error: userError } = await client.from("users").upsert({
            id: user.id,
            email: user.emailAddresses[0]?.emailAddress,
            name: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.username || 'Unknown',
            created_at: new Date().toISOString() // This might be ignored on update if we handle it right
        }) as any

        if (userError) {
            console.error("Error syncing user:", userError)
            return { success: false, error: "Failed to sync user" }
        }

        // Insert Mood
        // Map 'notes' from form to 'note' in DB
        const { notes, ...rest } = formData
        const { error: moodError } = await client.from("mood_entries").insert({
            user_id: user.id,
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
        const { userId } = await auth()
        if (!userId) return { success: false, error: "Unauthorized" }

        const client = createClient()
        const { error } = await client.from("mood_entries").delete().eq("user_id", userId) as any

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
