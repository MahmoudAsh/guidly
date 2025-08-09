'use client'

import { Button } from '@/components/button'
import type { Article } from '@/components/article-card'
import { useEffect, useState } from 'react'
import { isSaved as isSavedHelper, saveArticle, removeArticle } from '@/lib/saved'
import { useToast } from './toast'
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/20/solid'
import { BookmarkIcon as BookmarkOutline } from '@heroicons/react/24/outline'

export function ArticleActions({ article }: { article: Article }) {
  const [isSaved, setIsSaved] = useState(false)
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
    <div className="flex flex-wrap gap-3">
      <Button href={article.url} target="_blank" rel="noreferrer">
        Read full article
      </Button>
      <Button plain onClick={handleToggleSave} aria-pressed={isSaved}>
        <span className="inline-flex items-center gap-2">
          {isSaved ? (
            <BookmarkSolid className="size-4" aria-hidden="true" />
          ) : (
            <BookmarkOutline className="size-4" aria-hidden="true" />
          )}
          {isSaved ? 'Saved' : 'Save to read later'}
        </span>
      </Button>
    </div>
  )
}


