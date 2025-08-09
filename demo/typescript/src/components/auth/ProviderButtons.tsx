"use client"
import { getSupabaseBrowser } from '@/lib/supabase/client'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export function ProviderButtons() {
  async function signInWithProvider(provider: 'google' | 'github') {
    const supabase = getSupabaseBrowser()
    await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: `${SITE_URL}/auth/callback` } })
  }

  return (
    <div className="mt-4 grid gap-2">
      <button
        className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
        onClick={() => signInWithProvider('google')}
      >
        Continue with Google
      </button>
      <button
        className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
        onClick={() => signInWithProvider('github')}
      >
        Continue with GitHub
      </button>
    </div>
  )
}


