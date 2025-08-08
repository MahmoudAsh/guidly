import { Heading, Subheading } from '@/components/heading'
import { ArticleFeed } from '@/components/article-feed'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Feed',
}

export default function FeedPage() {
  return (
    <div className="space-y-6">
      <Heading>Feed</Heading>
      <Subheading className="text-zinc-500">Curated design articles</Subheading>
      <ArticleFeed />
    </div>
  )
}


