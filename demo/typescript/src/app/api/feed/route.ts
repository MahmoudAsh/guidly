import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

type Article = {
  id: string
  title: string
  url: string
  summary: string
  source: 'Medium' | 'Reddit' | 'NN/g' | string
  tags?: string[]
  date: string // ISO date
  image?: string
}

function daysAgoIso(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString().slice(0, 10)
}

function sampleArticles(): Article[] {
  return [
    {
      id: 'm-1',
      title: '5 UI Tips for Better Onboarding',
      url: 'https://medium.com/@design/5-ui-tips-for-better-onboarding',
      summary: 'Key principles, patterns, and examples for reducing friction during user onboarding in modern products.',
      source: 'Medium',
      tags: ['UI', 'Onboarding'],
      date: daysAgoIso(1),
      image: 'https://picsum.photos/seed/m-1/640/360',
    },
    {
      id: 'r-1',
      title: 'What are underrated UX research methods?',
      url: 'https://www.reddit.com/r/userexperience/',
      summary: 'A community discussion on overlooked, practical research techniques you can apply on a tight budget and timeline.',
      source: 'Reddit',
      tags: ['Research', 'Practical'],
      date: daysAgoIso(2),
      image: 'https://picsum.photos/seed/r-1/640/360',
    },
    {
      id: 'nng-1',
      title: 'UX Heuristics Revisited for AI Products',
      url: 'https://www.nngroup.com/articles/',
      summary: 'How classic usability heuristics translate to AI-driven interfaces and what needs rethinking in 2025.',
      source: 'NN/g',
      tags: ['Heuristics', 'AI'],
      date: daysAgoIso(3),
      image: 'https://picsum.photos/seed/nng-1/640/360',
    },
    {
      id: 'm-2',
      title: 'Design Tokens at Scale: A Practical Guide',
      url: 'https://medium.com/@design/design-tokens-at-scale',
      summary: 'A hands-on approach to setting up, naming, and governing design tokens across multiple platforms and brands.',
      source: 'Medium',
      tags: ['Design Systems', 'Tokens'],
      date: daysAgoIso(4),
      image: 'https://picsum.photos/seed/m-2/640/360',
    },
    {
      id: 'r-2',
      title: 'Show HN: I built a color contrast checker with real content previews',
      url: 'https://www.reddit.com/r/design/',
      summary: 'A maker post sharing a new accessibility tool with discussion on practical contrast testing workflows.',
      source: 'Reddit',
      tags: ['Accessibility', 'Tools'],
      date: daysAgoIso(5),
      image: 'https://picsum.photos/seed/r-2/640/360',
    },
    {
      id: 'nng-2',
      title: 'Information Architecture for Complex SaaS',
      url: 'https://www.nngroup.com/articles/',
      summary: 'Patterns, pitfalls, and recommendations for structuring navigation and content in enterprise SaaS products.',
      source: 'NN/g',
      tags: ['IA', 'SaaS'],
      date: daysAgoIso(6),
      image: 'https://picsum.photos/seed/nng-2/640/360',
    },
  ]
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const byId = searchParams.get('id')
  const limitParam = searchParams.get('limit')
  const limit = limitParam ? Math.max(1, Math.min(100, parseInt(limitParam, 10) || 20)) : 20

  // For now, return a shuffled sample. Later, replace with RSS-backed data.
  const items = sampleArticles()

  if (byId) {
    const found = items.find((a) => a.id === byId)
    if (!found) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(found, { status: 200 })
  }
  const shuffled = items
    .map((a) => ({ a, r: Math.random() }))
    .sort((x, y) => x.r - y.r)
    .map(({ a }) => a)
    .slice(0, limit)

  return NextResponse.json(shuffled, { status: 200 })
}


