import { cookies } from 'next/headers'

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    let token: string | undefined | null = null

    // Server-side
    if (typeof window === 'undefined') {
        try {
            const cookieStore = await cookies()
            token = cookieStore.get('access_token')?.value
        } catch (e) {
            // Ignored: likely called outside of request context or during build
        }
    } else {
        // Client-side
        // We expect the token to be stored in a cookie named 'access_token'
        const match = document.cookie.match(new RegExp('(^| )access_token=([^;]+)'))
        if (match) token = match[2]
    }

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...(options.headers as any),
    }

    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    })

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.detail || `API Error: ${res.statusText}`)
    }

    return res.json()
}
