'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { saveArticle } from '@/lib/saved'

export default function SaveArticlePage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [status, setStatus] = useState<'idle' | 'saving' | 'done' | 'error'>('idle')

  useEffect(() => {
    let aborted = false
    async function run() {
      setStatus('saving')
      try {
        const res = await fetch(`/api/feed?id=${encodeURIComponent(params.id)}`, { cache: 'no-store' })
        if (!res.ok) throw new Error('not ok')
        const article = await res.json()
        if (!aborted) {
          saveArticle(article)
          setStatus('done')
          router.replace('/saved')
        }
      } catch {
        if (!aborted) setStatus('error')
      }
    }
    run()
    return () => {
      aborted = true
    }
  }, [params.id, router])

  return (
    <div className="rounded-lg border border-zinc-950/10 bg-white p-6 text-zinc-600 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300">
      {status === 'saving' && 'Saving...'}
      {status === 'error' && 'Failed to save.'}
    </div>
  )
}


