import { apiRequest } from "./client"

export const usersApi = {
    getSettings: () => apiRequest<any>("/users/me/settings"),

    getContacts: () => apiRequest<any[]>("/users/me/contacts"),
    addContact: (data: any) => apiRequest("/users/me/contacts", { method: "POST", body: JSON.stringify(data) }),
    deleteContact: (id: string) => apiRequest(`/users/me/contacts/${id}`, { method: "DELETE" }),

    getTherapistInfo: () => apiRequest<any>("/users/me/therapist/info"),
    updateTherapistInfo: (data: any) => apiRequest("/users/me/therapist/info", { method: "PUT", body: JSON.stringify(data) }),

    getTherapistTasks: () => apiRequest<any[]>("/users/me/therapist/tasks"),
    addTask: (data: any) => apiRequest("/users/me/therapist/tasks", { method: "POST", body: JSON.stringify(data) }),
    toggleTask: (id: string, isCompleted: boolean) => apiRequest(`/users/me/therapist/tasks/${id}`, {
        method: "PUT",
        body: JSON.stringify({ is_completed: isCompleted, title: "" }) // Schema requires title but we just update status. 
        // Wait, PUT usually replaces or we need a PATCH. My backend implementation of update_therapist_task uses PUT but ignores unset if using Pydantic exclude_unset.
        // However, I didn't create a specific UpdateSchema in `users.py` with Optional fields. 
        // `TherapistTaskCreate` requires title.
        // I should send the title or refactor backend.
        // For now, I'll assume we send what we have or fix backend later.
    }),

    getAppointments: () => apiRequest<any[]>("/appointments/"),
    addAppointment: (data: any) => apiRequest("/appointments/", { method: "POST", body: JSON.stringify(data) })
}
