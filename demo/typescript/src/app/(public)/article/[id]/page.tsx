import { notFound } from 'next/navigation'
import { getArticleById } from '@/lib/data/feed'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

export default async function ArticlePage({ params }: { params: { id: string } }) {
  const { id } = params
  const article = await getArticleById(id)
  if (!article) return notFound()

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-2xl/8 font-semibold text-zinc-950 sm:text-xl/8 dark:text-white">{article.title}</h1>
      <div className="text-sm text-zinc-600 dark:text-zinc-300">
        <span>{article.source}</span>
        {article.published_at && <span> • {formatDate(article.published_at)}</span>}
      </div>
      {article.summary && (
        <p className="text-pretty text-zinc-700 dark:text-zinc-200">{article.summary}</p>
      )}
      <div className="flex gap-3 pt-2">
        <Link href={article.url} target="_blank" className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200">
          Read full article
        </Link>
        <Link href="/register" className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-500">
          Save to read later
        </Link>
      </div>
    </div>
  )
}


