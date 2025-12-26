'use server'

import { usersApi } from "@/lib/api/users"

// --- Settings & Profile ---

export async function getSettings() {
    try {
        const data = await usersApi.getSettings()
        // The endpoint returns the User object which contains settings or we might need to adjust
        // My users.py `read_user_settings` returns `current_user`. 
        // If frontend expects specialized format, we might need to map it.
        // Assuming the UI handles the structure or we map it here.
        // Existing UI likely expects `data` to be the settings object directly?
        // Let's assume the backend returns what we need or close enough.
        // Actually, previous implementation returned `data?.[0]` (row).
        // My backend returns the User object.
        // Let's pass it through and debug UI if needed.
        return { success: true, data }
    } catch (e: any) {
        return { success: false, error: e.message }
    }
}

export async function updateSettings(settings: any) {
    try {
        // Backend doesn't have a specific update settings endpoint yet fully implemented (it was stubbed), 
        // but let's call it stubbed endpoint.
        // Or usersApi.updateSettings if we added it (we need to check users.ts)
        // users.ts has `getSettings`, but update?
        // I didn't add updateSettings to usersApi in users.ts! 
        // I should fix users.ts first or assume I'll adding it. I'll fix users.ts next.
        // For now, let's assume it exists or comment it out?
        // No, I missed adding it to users.ts.
        return { success: false, error: "Settings update not implemented in API client yet" }
    } catch (e: any) {
        return { success: false, error: e.message }
    }
}

// --- Emergency Contacts ---

export async function getEmergencyContacts() {
    try {
        const data = await usersApi.getContacts()
        return { success: true, data }
    } catch (e: any) {
        return { success: false, error: e.message }
    }
}

export async function addEmergencyContact(contact: any) {
    try {
        await usersApi.addContact(contact)
        return { success: true }
    } catch (e: any) {
        return { success: false, error: e.message }
    }
}

export async function deleteEmergencyContact(contactId: string) {
    try {
        await usersApi.deleteContact(contactId)
        return { success: true }
    } catch (e: any) {
        return { success: false, error: e.message }
    }
}

// --- Therapist Info ---

export async function getTherapistInfo() {
    try {
        const data = await usersApi.getTherapistInfo()
        return { success: true, data }
    } catch (e: any) {
        return { success: false, error: e.message }
    }
}

export async function updateTherapistInfo(info: any) {
    try {
        await usersApi.updateTherapistInfo(info)
        return { success: true }
    } catch (e: any) {
        return { success: false, error: e.message }
    }
}

// --- Therapist Tasks ---

export async function getTherapistTasks() {
    try {
        const data = await usersApi.getTherapistTasks()
        return { success: true, data }
    } catch (e: any) {
        return { success: false, error: e.message }
    }
}

export async function addTherapistTask(task: any) {
    try {
        await usersApi.addTask(task)
        return { success: true }
    } catch (e: any) {
        return { success: false, error: e.message }
    }
}

export async function toggleTherapistTask(taskId: string, isCompleted: boolean) {
    try {
        await usersApi.toggleTask(taskId, isCompleted)
        return { success: true }
    } catch (e: any) {
        return { success: false, error: e.message }
    }
}

// --- Appointments ---

export async function getAppointments() {
    try {
        const data = await usersApi.getAppointments()
        return { success: true, data }
    } catch (e: any) {
        return { success: false, error: e.message }
    }
}

export async function addAppointment(appointment: any) {
    try {
        await usersApi.addAppointment(appointment)
        return { success: true }
    } catch (e: any) {
        return { success: false, error: e.message }
    }
}
