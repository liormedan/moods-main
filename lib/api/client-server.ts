import 'server-only'
import { cookies } from 'next/headers'

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

// Server-side API request function (for Server Actions)
export async function serverApiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    let token: string | undefined | null = null

    try {
        const cookieStore = cookies()
        token = cookieStore.get('access_token')?.value
    } catch (e) {
        // Ignored: likely called outside of request context or during build
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
        const errorMessage = errorData.detail || `API Error: ${res.statusText}`
        console.error(`API Error [${res.status}]:`, errorMessage, { endpoint, token: token ? 'present' : 'missing' })
        throw new Error(errorMessage)
    }

    return res.json()
}

