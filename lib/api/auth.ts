import { apiRequest } from "./client"

export interface User {
    id: string
    email: string
    is_active: boolean
}

export interface AuthResponse {
    access_token: string
    token_type: string
}

export const authApi = {
    login: async (formData: FormData) => {
        // OAuth2PasswordRequestForm expects form-data, not JSON
        // But our apiRequest does JSON by default. We need to override.
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/auth/login/access-token`, {
            method: 'POST',
            body: formData, // FormData sends multipart/form-data
        })

        if (!res.ok) {
            const err = await res.json().catch(() => ({}))
            throw new Error(err.detail || "Login failed")
        }
        return res.json() as Promise<AuthResponse>
    },

    signup: (data: any) => {
        return apiRequest<User>("/auth/signup", {
            method: "POST",
            body: JSON.stringify(data),
        })
    },

    me: () => {
        // We don't have a direct /auth/me, but we can use /users/me/settings to return user
        return apiRequest<User>("/users/me/settings")
    }
}
