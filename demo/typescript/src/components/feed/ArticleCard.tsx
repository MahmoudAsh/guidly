'use client'

import Link from 'next/link'
import { ArticleRow } from '@/lib/data/feed'
import { formatDate } from '@/lib/utils'
import { notifyArticleClick } from '@/lib/softgate/events'

export function ArticleCard({ article }: { article: ArticleRow }) {
  const { id, title, summary, tags, source, published_at } = article
  return (
    <article className="group rounded-lg border border-zinc-950/10 bg-white p-5 transition hover:shadow-sm dark:border-white/10 dark:bg-zinc-900">
      <h3 className="text-base/6 font-semibold text-zinc-950 dark:text-white">
        <Link href={`/article/${id}`} className="hover:underline" onClick={notifyArticleClick}>
          {title}
        </Link>
      </h3>
      {summary && (
        <p className="mt-2 line-clamp-3 text-sm text-zinc-600 dark:text-zinc-300">{summary}</p>
      )}
      <div className="mt-4 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
        <div className="flex flex-wrap items-center gap-2">
          <span>{source}</span>
          {published_at && <span>• {formatDate(published_at)}</span>}
        </div>
        <div className="flex flex-wrap gap-1">
          {(tags ?? []).slice(0, 3).map((t) => (
            <span key={t} className="rounded bg-zinc-100 px-1.5 py-0.5 text-zinc-700 dark:bg-white/10 dark:text-zinc-200">
              {t}
            </span>
          ))}
        </div>
      </div>
    </article>
  )
}


