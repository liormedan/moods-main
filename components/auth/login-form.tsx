'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authApi } from '@/lib/api/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export function LoginForm() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setLoading(true)
        setError('')

        const formData = new FormData(event.currentTarget)

        try {
            const res = await authApi.login(formData)
            // Store token in cookie for server actions compatible access
            // and in localStorage if needed for client access simplification
            document.cookie = `access_token=${res.access_token}; path=/; max-age=604800; SameSite=Lax`
            localStorage.setItem('access_token', res.access_token)

            router.push('/dashboard')
            router.refresh()
        } catch (e: any) {
            console.error(e)
            setError(e.message || 'Login failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="grid gap-6">
            <form onSubmit={onSubmit}>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="username">Email</Label>
                        <Input
                            id="username"
                            name="username" // OAuth2 form expects 'username' field (even if it's email)
                            placeholder="name@example.com"
                            type="email"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            disabled={loading}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            autoCapitalize="none"
                            autoComplete="current-password"
                            disabled={loading}
                            required
                        />
                    </div>
                    {error && (
                        <div className="text-sm font-medium text-destructive">
                            {error}
                        </div>
                    )}
                    <Button disabled={loading}>
                        {loading ? "Signing In..." : "Sign In"}
                    </Button>
                </div>
            </form>
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                    </span>
                </div>
            </div>
            <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="underline hover:text-primary">
                    Sign up
                </Link>
            </div>
        </div>
    )
}
