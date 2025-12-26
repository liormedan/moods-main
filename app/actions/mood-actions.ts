'use server'

export async function getMoodEntries() {
    console.warn("getMoodEntries: Backend is being migrated. Returning empty list.");
    return { success: true, data: [] }
}

export async function logMoodEntry(formData: {
    mood_level: number
    energy_level: number
    stress_level: number
    notes: string
    custom_metrics: any[]
}) {
    console.warn("logMoodEntry: Backend is being migrated. Action ignored.");
    return { success: true }
}

export async function deleteAllMoodEntries() {
    console.warn("deleteAllMoodEntries: Backend is being migrated. Action ignored.");
    return { success: true }
}
