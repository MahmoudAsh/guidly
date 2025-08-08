'use client'
import { Heading, Subheading } from '@/components/heading'
import { ArticleCard, type Article } from '@/components/article-card'
import { useEffect, useState } from 'react'
import { listSaved, removeArticle } from '@/lib/saved'
// Note: client components cannot export metadata. Title is handled via parent layout.

export default function SavedPage() {
  'use client'
  const [items, setItems] = useState<Article[]>([])

  useEffect(() => {
    setItems(listSaved() as Article[])
  }, [])

  return (
    <div className="space-y-6">
      <Heading>Saved</Heading>
      <Subheading className="text-zinc-500">Your saved items</Subheading>

      {items.length === 0 ? (
        <div className="rounded-lg border border-zinc-950/10 bg-white p-6 text-zinc-600 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300">
          You have no saved articles.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((a) => (
            <div key={a.id} className="relative">
              <ArticleCard article={a} />
              <button
                className="absolute right-3 top-3 rounded bg-white/80 px-2 py-1 text-xs text-zinc-700 shadow hover:bg-white dark:bg-zinc-900/80 dark:text-zinc-200"
                onClick={() => {
                  removeArticle(a.id)
                  setItems((s) => s.filter((x) => x.id !== a.id))
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


