import { createClientServer } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function DashboardPage() {
  const supabase = createClientServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  async function signOutAction() {
    'use server'
    const supa = createClientServer()
    await supa.auth.signOut()
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="text-zinc-600 dark:text-zinc-300">Signed in as {user?.email}</p>
      <form action={signOutAction}>
        <button className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white dark:bg-white dark:text-zinc-900">Sign out</button>
      </form>
    </div>
  )
}


