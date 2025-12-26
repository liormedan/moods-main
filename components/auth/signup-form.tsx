'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authApi } from '@/lib/api/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export function SignupForm() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setLoading(true)
        setError('')

        const formData = new FormData(event.currentTarget)
        const email = formData.get("email")
        const password = formData.get("password")

        try {
            await authApi.signup({
                email,
                password
            })
            // Auto login after signup? Or redirect to login.
            // Let's redirect to login for simplicity or auto-login.
            // For now, redirect to login.
            router.push('/login?signedUp=true')
        } catch (e: any) {
            console.error(e)
            setError(e.message || 'Signup failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="grid gap-6">
            <form onSubmit={onSubmit}>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
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
                            autoComplete="new-password"
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
                        {loading ? "Creating Account..." : "Create Account"}
                    </Button>
                </div>
            </form>
            <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="underline hover:text-primary">
                    Sign in
                </Link>
            </div>
        </div>
    )
}
