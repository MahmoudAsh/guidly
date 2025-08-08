'use client'

import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { isSaved as isSavedHelper, saveArticle, removeArticle } from '@/lib/saved'
import { useToast } from './toast'
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/20/solid'
import { BookmarkIcon as BookmarkOutline } from '@heroicons/react/24/outline'

export type Article = {
  id: string
  title: string
  url: string
  summary: string
  source: string
  tags?: string[]
  date: string
  image?: string
}

function formatDate(isoDate: string): string {
  try {
    let d = new Date(isoDate)
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return isoDate
  }
}

export function ArticleCard({ article, className }: { article: Article; className?: string }) {
  const [isSaved, setIsSaved] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const { success } = useToast()

  useEffect(() => {
    setIsSaved(isSavedHelper(article.id))
  }, [article.id])

  function handleToggleSave() {
    if (isSaved) {
      removeArticle(article.id)
      setIsSaved(false)
      success('Removed from Saved', article.title)
    } else {
      saveArticle(article)
      setIsSaved(true)
      success('Saved to read later', article.title)
    }
  }

  return (
    <article
      className={clsx(
        className,
        'flex h-full flex-col rounded-lg border border-zinc-950/10 bg-white p-5 shadow-xs transition hover:shadow-sm dark:border-white/10 dark:bg-zinc-900'
      )}
    >
      {article.image && (
        <a href={article.url} target="_blank" rel="noreferrer" className="block -mx-5 -mt-5 mb-4">
          <img
            src={article.image}
            alt=""
            className="aspect-[16/9] w-full rounded-t-lg object-cover"
            loading="lazy"
          />
        </a>
      )}
      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-base/6 font-semibold text-zinc-950 dark:text-white">
            <a href={`/feed/${article.id}`} className="hover:underline">
              {article.title}
            </a>
          </h3>
          <span className="shrink-0 rounded-md bg-zinc-100 px-2 py-0.5 text-xs/5 text-zinc-700 dark:bg-white/10 dark:text-zinc-300">
            {article.source}
          </span>
        </div>

        <p
          className={clsx(
            'mt-2 text-zinc-600 dark:text-zinc-300',
            'line-clamp-3'
          )}
          style={{
            // Fallback clamp if utility not available
            display: 'webkitBox' as unknown as string,
            WebkitLineClamp: 3 as unknown as number,
            WebkitBoxOrient: 'vertical' as unknown as string,
            overflow: 'hidden',
          }}
        >
          {article.summary}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs/6 text-zinc-500 dark:text-zinc-400">
        <time dateTime={article.date}>{formatDate(article.date)}</time>
        {article.tags && article.tags.length > 0 && (
          <div className="ml-2 flex flex-wrap gap-1">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs/5 text-zinc-700 dark:bg-white/10 dark:text-zinc-300"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
        <button
          onClick={handleToggleSave}
          className={clsx(
            'ml-auto inline-flex items-center rounded-md p-1.5',
            isSaved
              ? 'cursor-default text-zinc-900 dark:text-white'
              : 'text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white'
          )}
          aria-pressed={isSaved}
          aria-label={isSaved ? 'Saved' : 'Save for later'}
          title={isSaved ? 'Saved' : 'Save for later'}
        >
          {isSaved ? (
            <BookmarkSolid className={clsx('size-5', 'animate-buzz')} aria-hidden="true" />
          ) : (
            <BookmarkOutline className={clsx('size-5', 'animate-buzz')} aria-hidden="true" />
          )}
          <span className="sr-only">{isSaved ? 'Saved' : 'Save'}</span>
        </button>
      </div>

      {/* Toasts rendered globally via ToastProvider */}
    </article>
  )
}


