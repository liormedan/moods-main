'use server'

import { createClient } from "@/lib/neon/client"
import { auth } from "@clerk/nextjs/server"

// --- Settings & Profile ---

export async function getSettings() {
    try {
        const { userId } = await auth()
        if (!userId) return { success: false, error: "Unauthorized" }

        const client = createClient()
        const { data, error } = await client.from("user_settings")
            .select("*")
            .eq("user_id", userId) as any

        if (error) {
            console.error("Error fetching settings:", error)
            return { success: false, error: error.message }
        }

        return { success: true, data: data?.[0] || null }
    } catch (error) {
        console.error("Server Action Error:", error)
        return { success: false, error: "Internal Error" }
    }
}

export async function updateSettings(settings: any) {
    try {
        const { userId } = await auth()
        if (!userId) return { success: false, error: "Unauthorized" }

        const client = createClient()
        const { error } = await client.from("user_settings").upsert({
            user_id: userId,
            ...settings,
            updated_at: new Date().toISOString()
        }) as any

        if (error) {
            console.error("Error updating settings:", error)
            return { success: false, error: error.message }
        }

        return { success: true }
    } catch (error) {
        console.error("Server Action Error:", error)
        return { success: false, error: "Internal Error" }
    }
}

// --- Emergency Contacts ---

export async function getEmergencyContacts() {
    try {
        const { userId } = await auth()
        if (!userId) return { success: false, error: "Unauthorized" }

        const client = createClient()
        const { data, error } = await client.from("emergency_contacts")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: true }) as any

        if (error) {
            console.error("Error fetching contacts:", error)
            return { success: false, error: error.message }
        }

        return { success: true, data: data || [] }
    } catch (error) {
        console.error("Server Action Error:", error)
        return { success: false, error: "Internal Error" }
    }
}

export async function addEmergencyContact(contact: any) {
    try {
        const { userId } = await auth()
        if (!userId) return { success: false, error: "Unauthorized" }

        const client = createClient()
        const { error } = await client.from("emergency_contacts").insert({
            user_id: userId,
            ...contact
        }) as any

        if (error) {
            console.error("Error adding contact:", error)
            return { success: false, error: error.message }
        }

        return { success: true }
    } catch (error) {
        console.error("Server Action Error:", error)
        return { success: false, error: "Internal Error" }
    }
}

export async function deleteEmergencyContact(contactId: string) {
    try {
        const { userId } = await auth()
        if (!userId) return { success: false, error: "Unauthorized" }

        const client = createClient()
        const { error } = await client.from("emergency_contacts").delete().eq("id", contactId).eq("user_id", userId) as any

        if (error) {
            console.error("Error deleting contact:", error)
            return { success: false, error: error.message }
        }

        return { success: true }
    } catch (error) {
        console.error("Server Action Error:", error)
        return { success: false, error: "Internal Error" }
    }
}

// --- Therapist Info ---

export async function getTherapistInfo() {
    try {
        const { userId } = await auth()
        if (!userId) return { success: false, error: "Unauthorized" }

        const client = createClient()
        const { data, error } = await client.from("therapist_info")
            .select("*")
            .eq("user_id", userId) as any

        if (error) {
            console.error("Error fetching therapist info:", error)
            return { success: false, error: error.message }
        }

        return { success: true, data: data?.[0] || null }
    } catch (error) {
        console.error("Server Action Error:", error)
        return { success: false, error: "Internal Error" }
    }
}

export async function updateTherapistInfo(info: any) {
    try {
        const { userId } = await auth()
        if (!userId) return { success: false, error: "Unauthorized" }

        const client = createClient()
        const { error } = await client.from("therapist_info").upsert({
            user_id: userId,
            ...info,
            updated_at: new Date().toISOString()
        }) as any

        if (error) {
            console.error("Error updating therapist info:", error)
            return { success: false, error: error.message }
        }

        return { success: true }
    } catch (error) {
        console.error("Server Action Error:", error)
        return { success: false, error: "Internal Error" }
    }
}

// --- Therapist Tasks ---

export async function getTherapistTasks() {
    try {
        const { userId } = await auth()
        if (!userId) return { success: false, error: "Unauthorized" }

        const client = createClient()
        const { data, error } = await client.from("therapist_tasks")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false }) as any

        if (error) {
            console.error("Error fetching tasks:", error)
            return { success: false, error: error.message }
        }

        return { success: true, data: data || [] }
    } catch (error) {
        console.error("Server Action Error:", error)
        return { success: false, error: "Internal Error" }
    }
}

export async function addTherapistTask(task: any) {
    try {
        const { userId } = await auth()
        if (!userId) return { success: false, error: "Unauthorized" }

        const client = createClient()
        const { error } = await client.from("therapist_tasks").insert({
            user_id: userId,
            ...task
        }) as any

        if (error) {
            console.error("Error adding task:", error)
            return { success: false, error: error.message }
        }

        return { success: true }
    } catch (error) {
        console.error("Server Action Error:", error)
        return { success: false, error: "Internal Error" }
    }
}

export async function toggleTherapistTask(taskId: string, isCompleted: boolean) {
    try {
        const { userId } = await auth()
        if (!userId) return { success: false, error: "Unauthorized" }

        const client = createClient()
        const { error } = await client.from("therapist_tasks")
            .update({ is_completed: isCompleted })
            .eq("id", taskId)
            .eq("user_id", userId) as any

        if (error) {
            console.error("Error toggling task:", error)
            return { success: false, error: error.message }
        }

        return { success: true }
    } catch (error) {
        console.error("Server Action Error:", error)
        return { success: false, error: "Internal Error" }
    }
}

// --- Appointments ---

export async function getAppointments() {
    try {
        const { userId } = await auth()
        if (!userId) return { success: false, error: "Unauthorized" }

        const client = createClient()
        const { data, error } = await client.from("appointments")
            .select("*")
            .eq("user_id", userId)
            .order("date", { ascending: true }) as any

        if (error) {
            console.error("Error fetching appointments:", error)
            return { success: false, error: error.message }
        }

        return { success: true, data: data || [] }
    } catch (error) {
        console.error("Server Action Error:", error)
        return { success: false, error: "Internal Error" }
    }
}

export async function addAppointment(appointment: any) {
    try {
        const { userId } = await auth()
        if (!userId) return { success: false, error: "Unauthorized" }

        const client = createClient()
        const { error } = await client.from("appointments").insert({
            user_id: userId,
            ...appointment
        }) as any

        if (error) {
            console.error("Error adding appointment:", error)
            return { success: false, error: error.message }
        }

        return { success: true }
    } catch (error) {
        console.error("Server Action Error:", error)
        return { success: false, error: "Internal Error" }
    }
}
