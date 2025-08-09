'use client'

import { getSupabaseBrowser } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { Input } from '@/components/input'
import { Button } from '@/components/button'
import { Subheading } from '@/components/heading'
import { Text } from '@/components/text'

function computeInitials(name?: string | null, email?: string | null) {
  const source = (name || email || '').trim()
  if (!source) return ''
  const parts = source.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return source.slice(0, 2).toUpperCase()
}

export function AccountForm() {
  const supabase = getSupabaseBrowser()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    async function run() {
      setLoading(true)
      const { data } = await supabase.auth.getUser()
      if (!mounted) return
      const u = data.user
      const meta = (u?.user_metadata as any) || {}
      setName(meta.display_name || meta.name || '')
      setEmail(u?.email || '')
      setLoading(false)
    }
    run()
    return () => {
      mounted = false
    }
  }, [supabase])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    setError(null)
    setSaving(true)
    try {
      // Update name in user_metadata, keep display_name in sync
      const { error: e1 } = await supabase.auth.updateUser({ data: { name, display_name: name } })
      if (e1) throw e1
      // Update email if changed
      const { data: userData } = await supabase.auth.getUser()
      if (userData.user?.email && userData.user.email !== email && email) {
        const { error: e2 } = await supabase.auth.updateUser({ email })
        if (e2) throw e2
        setMessage('Check your inbox to confirm the new email address.')
      } else {
        setMessage('Profile updated')
      }
      // Notify layout to refresh user display
      window.dispatchEvent(new CustomEvent('profile-updated'))
    } catch (err: any) {
      setError(err?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form id="account-form" onSubmit={onSubmit} className="grid gap-6">
      <div>
        <Subheading>Account</Subheading>
        <Text>Update your name and email shown in the sidebar.</Text>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Full name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Jane Doe" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Email</label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Text className="text-xs text-zinc-500">Changing email may require confirmation.</Text>
        </div>
      </div>
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-950/20 dark:text-red-300">
          {error}
        </div>
      )}
      {message && (
        <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700 dark:border-green-500/30 dark:bg-green-950/20 dark:text-green-300">
          {message}
        </div>
      )}
      <div className="flex justify-end">
        <Button type="submit" data-disabled={saving || loading}>
          Save changes
        </Button>
      </div>
    </form>
  )
}


