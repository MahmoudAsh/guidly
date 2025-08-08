import { Heading, Subheading } from '@/components/heading'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Saved',
}

export default function SavedPage() {
  return (
    <div className="space-y-6">
      <Heading>Saved</Heading>
      <Subheading className="text-zinc-500">Your saved items</Subheading>
    </div>
  )
}


