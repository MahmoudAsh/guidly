"use client"
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { getSupabaseBrowser } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const schema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Uppercase required')
    .regex(/[0-9]/, 'Number required'),
})

type Values = z.infer<typeof schema>

export function RegisterForm({ redirectTo }: { redirectTo?: string }) {
  const supabase = getSupabaseBrowser()
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema) })
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  async function onSubmit(values: Values) {
    setError(null)
    setMessage(null)
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: { data: { name: values.name } },
    })
    if (error) {
      setError(error.message)
      return
    }
    const target = redirectTo && redirectTo.startsWith('/') ? redirectTo : '/dashboard'
    // For email confirmation setups, redirect to login; otherwise, go straight to dashboard
    router.replace('/login?registered=1&redirect=' + encodeURIComponent(target))
  }

  return (
    <form className="grid gap-3" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-1">
        <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Name</label>
        <input
          type="text"
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-zinc-800 dark:text-white"
          {...register('name')}
        />
        {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
      </div>
      <div className="grid gap-1">
        <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Email</label>
        <input
          type="email"
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-zinc-800 dark:text-white"
          {...register('email')}
        />
        {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
      </div>
      <div className="grid gap-1">
        <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Password</label>
        <input
          type="password"
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-zinc-800 dark:text-white"
          {...register('password')}
        />
        {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
      </div>
      {error && <div className="rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-950/20 dark:text-red-300">{error}</div>}
      {message && <div className="rounded-md border border-green-200 bg-green-50 p-2 text-sm text-green-700 dark:border-green-500/30 dark:bg-green-950/20 dark:text-green-300">{message}</div>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 w-full rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        Create account
      </button>
    </form>
  )
}


