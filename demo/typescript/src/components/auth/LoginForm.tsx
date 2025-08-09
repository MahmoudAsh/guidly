"use client"
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { getSupabaseBrowser } from '@/lib/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

type Values = z.infer<typeof schema>

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const supabase = getSupabaseBrowser()
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema) })
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(values: Values) {
    setError(null)
    const { data, error } = await supabase.auth.signInWithPassword(values)
    if (error) {
      setError(error.message)
      return
    }
    if (!data.session) {
      setError('Please confirm your email, then sign in.')
      return
    }
    const target = redirectTo && redirectTo.startsWith('/') ? redirectTo : '/feed'
    // Force full reload so middleware sees fresh auth cookies
    window.location.assign(target)
  }

  return (
    <form className="grid gap-3" method="post" action="/login" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-1">
        <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Email</label>
        <input
          type="email"
          autoComplete="email"
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-zinc-800 dark:text-white"
          {...register('email')}
        />
        {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
      </div>
      <div className="grid gap-1">
        <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Password</label>
        <input
          type="password"
          autoComplete="current-password"
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-zinc-800 dark:text-white"
          {...register('password')}
        />
        {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
      </div>
      {error && <div className="rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-950/20 dark:text-red-300">{error}</div>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 w-full rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        Log in
      </button>
    </form>
  )
}


