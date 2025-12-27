export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1"

// Client-side API request function (for use in client components)
export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    let token: string | undefined | null = null

    // Client-side only - get token from localStorage or cookie
    if (typeof window !== 'undefined') {
        // Try to get token from localStorage first (more reliable)
        token = localStorage.getItem('access_token')

        // Fallback to cookie if localStorage doesn't have it
        if (!token) {
            const match = document.cookie.match(new RegExp('(^| )access_token=([^;]+)'))
            if (match) token = match[2]
        }
    }

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...(options.headers as any),
    }

    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include', // Include cookies in request
    })

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        const errorMessage = errorData.detail || `API Error: ${res.statusText}`
        console.error(`API Error [${res.status}]:`, errorMessage, { endpoint, token: token ? 'present' : 'missing' })
        throw new Error(errorMessage)
    }

    return res.json()
}
