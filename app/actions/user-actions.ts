'use server'

// --- Settings & Profile ---

export async function getSettings() {
    return { success: true, data: null }
}

export async function updateSettings(settings: any) {
    return { success: true }
}

// --- Emergency Contacts ---

export async function getEmergencyContacts() {
    return { success: true, data: [] }
}

export async function addEmergencyContact(contact: any) {
    return { success: true }
}

export async function deleteEmergencyContact(contactId: string) {
    return { success: true }
}

// --- Therapist Info ---

export async function getTherapistInfo() {
    return { success: true, data: null }
}

export async function updateTherapistInfo(info: any) {
    return { success: true }
}

// --- Therapist Tasks ---

export async function getTherapistTasks() {
    return { success: true, data: [] }
}

export async function addTherapistTask(task: any) {
    return { success: true }
}

export async function toggleTherapistTask(taskId: string, isCompleted: boolean) {
    return { success: true }
}

// --- Appointments ---

export async function getAppointments() {
    return { success: true, data: [] }
}

export async function addAppointment(appointment: any) {
    return { success: true }
}
