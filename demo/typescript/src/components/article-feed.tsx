'use client'

import React, { useEffect, useState } from 'react'
import { Article, ArticleCard } from './article-card'

type FeedState = {
  status: 'idle' | 'loading' | 'error' | 'ready'
  error?: string
  items: Article[]
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-lg border border-zinc-950/10 bg-white p-5 dark:border-white/10 dark:bg-zinc-900">
      <div className="h-5 w-2/3 rounded bg-zinc-200 dark:bg-white/10" />
      <div className="mt-2 h-4 w-full rounded bg-zinc-200 dark:bg-white/10" />
      <div className="mt-1 h-4 w-11/12 rounded bg-zinc-200 dark:bg-white/10" />
      <div className="mt-1 h-4 w-10/12 rounded bg-zinc-200 dark:bg-white/10" />
      <div className="mt-4 h-4 w-32 rounded bg-zinc-200 dark:bg-white/10" />
    </div>
  )
}

export function ArticleFeed() {
  let [state, setState] = useState<FeedState>({ status: 'idle', items: [] })

  useEffect(() => {
    let aborted = false
    async function run() {
      setState((s) => ({ ...s, status: 'loading', error: undefined }))
      try {
        const res = await fetch('/api/feed', { cache: 'no-store' })
        if (!res.ok) throw new Error(`Request failed: ${res.status}`)
        const data = (await res.json()) as Article[]
        if (!aborted) setState({ status: 'ready', items: data })
      } catch (e: unknown) {
        if (aborted) return
        const msg = e instanceof Error ? e.message : 'Unknown error'
        setState({ status: 'error', error: msg, items: [] })
      }
    }
    run()
    return () => {
      aborted = true
    }
  }, [])

  if (state.status === 'loading' || state.status === 'idle') {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (state.status === 'error') {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-500/30 dark:bg-red-950/20 dark:text-red-300">
        Failed to load articles: {state.error}
      </div>
    )
  }

  if (state.items.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-950/10 bg-white p-6 text-zinc-600 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300">
        No articles right now. Please check back later.
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {state.items.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  )
}


