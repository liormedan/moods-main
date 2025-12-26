import { serverApiRequest } from "./client-server"

export const usersApi = {
    getSettings: () => serverApiRequest<any>("/users/me/settings"),

    getContacts: () => serverApiRequest<any[]>("/users/me/contacts"),
    addContact: (data: any) => serverApiRequest("/users/me/contacts", { method: "POST", body: JSON.stringify(data) }),
    deleteContact: (id: string) => serverApiRequest(`/users/me/contacts/${id}`, { method: "DELETE" }),

    getTherapistInfo: () => serverApiRequest<any>("/users/me/therapist/info"),
    updateTherapistInfo: (data: any) => serverApiRequest("/users/me/therapist/info", { method: "PUT", body: JSON.stringify(data) }),

    getTherapistTasks: () => serverApiRequest<any[]>("/users/me/therapist/tasks"),
    addTask: (data: any) => serverApiRequest("/users/me/therapist/tasks", { method: "POST", body: JSON.stringify(data) }),
    toggleTask: (id: string, isCompleted: boolean) => serverApiRequest(`/users/me/therapist/tasks/${id}`, {
        method: "PUT",
        body: JSON.stringify({ is_completed: isCompleted, title: "" })
    }),

    getAppointments: () => serverApiRequest<any[]>("/appointments/"),
    addAppointment: (data: any) => serverApiRequest("/appointments/", { method: "POST", body: JSON.stringify(data) })
}

