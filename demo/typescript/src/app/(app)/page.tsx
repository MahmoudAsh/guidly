import { ArticleCard } from '@/components/feed/ArticleCard'
import { getArticles } from '@/lib/data/feed'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Home() {
  const articles = await getArticles({ limit: 24 })
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <h1 className="text-2xl/8 font-semibold text-zinc-950 sm:text-xl/8 dark:text-white">Feed</h1>
      <h2 className="text-zinc-500 text-base/7 font-semibold text-zinc-950 sm:text-sm/6 dark:text-white">Curated design articles</h2>
      {articles.length === 0 ? (
        <div className="rounded-lg border border-zinc-950/10 bg-white p-6 text-zinc-600 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300">
          No articles right now. Please check back later.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      )}
    </div>
  )
}


