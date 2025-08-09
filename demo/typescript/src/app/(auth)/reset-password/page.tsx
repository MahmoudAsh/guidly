"use client"
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { AuthCard } from '@/components/auth/AuthCard'
import { getSupabaseBrowser } from '@/lib/supabase/client'
import { useState } from 'react'

const schema = z.object({ email: z.string().email() })

export default function ResetPasswordPage() {
  const supabase = getSupabaseBrowser()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<{ email: string }>({ resolver: zodResolver(schema) })
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(values: { email: string }) {
    setError(null); setMessage(null)
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const { error } = await supabase.auth.resetPasswordForEmail(values.email, { redirectTo: `${SITE_URL}/auth/callback` })
    if (error) setError(error.message)
    else setMessage('Check your email for a reset link.')
  }

  return (
    <AuthCard title="Reset password" description="We’ll email you a reset link">
      <form className="grid gap-3" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-1">
          <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Email</label>
          <input type="email" className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-zinc-800 dark:text-white" {...register('email')} />
          {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
        </div>
        {error && <div className="rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-950/20 dark:text-red-300">{error}</div>}
        {message && <div className="rounded-md border border-green-200 bg-green-50 p-2 text-sm text-green-700 dark:border-green-500/30 dark:bg-green-950/20 dark:text-green-300">{message}</div>}
        <button type="submit" disabled={isSubmitting} className="mt-2 w-full rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200">Send reset link</button>
      </form>
    </AuthCard>
  )
}


