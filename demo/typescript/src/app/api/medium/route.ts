import { NextResponse } from 'next/server'
import * as cheerio from 'cheerio'
import RSSParser from 'rss-parser'
import https from 'node:https'

type MediumItem = {
  id: string
  title: string
  url: string
  summary: string
  source: string
  tags: string[]
  date: string
  image?: string
}

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = (searchParams.get('q') ?? 'product design').trim()
  const limit = Math.min(20, Math.max(1, parseInt(searchParams.get('limit') ?? '12') || 12))

  // Prefer Medium tag RSS instead of scraping dynamic search HTML
  const tagSlug = q.toLowerCase().replace(/\s+/g, '-')
  const feedUrl = `https://medium.com/feed/tag/${encodeURIComponent(tagSlug)}`

  try {
    const xml = await new Promise<string>((resolve, reject) => {
      const req = https.get(
        feedUrl,
        {
          headers: { accept: 'application/rss+xml,text/xml,application/xml' },
        },
        (res) => {
          if (res.statusCode && res.statusCode >= 400) {
            reject(new Error(`HTTP ${res.statusCode}`))
            return
          }
          let data = ''
          res.setEncoding('utf8')
          res.on('data', (chunk) => (data += chunk))
          res.on('end', () => resolve(data))
        }
      )
      req.on('error', reject)
    })

    const parser = new RSSParser()
    const feed = await parser.parseString(xml)

    const items: MediumItem[] = []
    for (const it of feed.items.slice(0, limit)) {
      const title = (it.title || '').trim()
      const url = (it.link || '').trim()
      const summary = (it.contentSnippet || it.content || '').toString().replace(/\s+/g, ' ').trim().slice(0, 320)
      const date = (it.isoDate || new Date().toISOString()).slice(0, 10)
      let image: string | undefined
      if (it['content:encoded'] || it.content) {
        const $ = cheerio.load((it['content:encoded'] as string) || (it.content as string))
        const src = $('img').first().attr('src')
        if (src) image = src
      }
      const id = url.replace(/^https?:\/\//, '')
      if (title && url) {
        items.push({ id, title, url, summary, source: 'Medium', tags: [tagSlug], date, image })
      }
    }

    return NextResponse.json(items, { status: 200 })
  } catch (e) {
    return NextResponse.json({ error: 'Scrape failed' }, { status: 500 })
  }
}


