import { Heading, Subheading } from '@/components/heading'
import { Text } from '@/components/text'
import { headers } from 'next/headers'
import { ArticleActions } from '@/components/article-actions'

type Article = {
  id: string
  title: string
  url: string
  summary: string
  source: string
  tags?: string[]
  date: string
  image?: string
}

async function getArticle(id: string): Promise<Article> {
  const hdrs = headers()
  const proto = hdrs.get('x-forwarded-proto') ?? 'http'
  const host = hdrs.get('host') ?? 'localhost:3000'
  const base = `${proto}://${host}`
  const url = `${base}/api/feed?id=${encodeURIComponent(id)}`
  const res = await fetch(url, { cache: 'no-store', next: { revalidate: 0 } })
  if (!res.ok) throw new Error('Failed to load')
  return res.json()
}

export default async function ArticlePage({ params }: { params: { id: string } }) {
  const article = await getArticle(params.id)

  const preview = article.summary?.slice(0, Math.ceil(article.summary.length * 0.3)) ?? ''

  return (
    <div className="space-y-6">
      <Heading>{article.title}</Heading>
      <Subheading className="text-zinc-500">{article.source}</Subheading>

      {article.image && (
        <img src={article.image} alt="" className="mt-2 w-full rounded-lg object-cover" />
      )}

      <Text className="text-zinc-700 dark:text-zinc-200">{preview}</Text>

      <ArticleActions article={article} />
    </div>
  )
}


