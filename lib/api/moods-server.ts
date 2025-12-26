import { serverApiRequest } from "./client-server"

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
    getAll: () => serverApiRequest<MoodEntry[]>("/moods/"),

    create: (data: any) => serverApiRequest<MoodEntry>("/moods/", {
        method: "POST",
        body: JSON.stringify(data)
    }),

    deleteAll: () => serverApiRequest("/moods/", {
        method: "DELETE"
    })
}

