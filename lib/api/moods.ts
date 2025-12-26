import { apiRequest } from "./client"

export interface MoodEntry {
    id: string
    mood_level: number
    energy_level: number
    stress_level: number
    note: string | null
    custom_metrics: any
    created_at: string
}

export const moodsApi = {
    getAll: () => apiRequest<MoodEntry[]>("/moods/"),

    create: (data: any) => apiRequest<MoodEntry>("/moods/", {
        method: "POST",
        body: JSON.stringify(data)
    }),

    deleteAll: () => apiRequest("/moods/", {
        method: "DELETE"
    })
}
