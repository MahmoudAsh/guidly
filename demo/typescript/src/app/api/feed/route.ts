import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

type Article = {
  id: string
  title: string
  url: string
  summary: string
  source: string
  tags?: string[]
  date: string // ISO date
  image?: string
}

import { createClient } from '@supabase/supabase-js'
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

function mapDbToApi(a: any): Article {
  const dt = a.publishedAt ?? a.createdAt ?? null
  const dateIso = dt ? new Date(dt).toISOString() : new Date().toISOString()
  return {
    id: String(a.id),
    title: a.title,
    url: a.url,
    summary: a.summary ?? '',
    source: a.source,
    tags: Array.isArray(a.tags) ? a.tags : [],
    date: dateIso,
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const byId = searchParams.get('id')
  const limitParam = searchParams.get('limit')
  const limit = limitParam ? Math.max(1, Math.min(100, parseInt(limitParam, 10) || 20)) : 20

  try {
    if (byId) {
      const idNum = parseInt(byId, 10)
      if (!Number.isFinite(idNum)) {
        return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
      }
      if (!supabase) return NextResponse.json({ error: 'Server not configured' }, { status: 500 })
      const { data, error } = await supabase
        .from('Article')
        .select('id,title,url,source,summary,tags,publishedAt,createdAt')
        .eq('id', idNum)
        .maybeSingle()
      if (error) throw error
      if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
      const mapped = mapDbToApi(data)
      return NextResponse.json(mapped, { status: 200 })
    }

    if (!supabase) return NextResponse.json({ error: 'Server not configured' }, { status: 500 })
    const { data, error } = await supabase
      .from('Article')
      .select('id,title,url,source,summary,tags,publishedAt,createdAt')
      .order('publishedAt', { ascending: false, nullsFirst: false })
      .order('createdAt', { ascending: false })
      .limit(limit)
    if (error) throw error
    const mapped = (data ?? []).map(mapDbToApi)
    return NextResponse.json(mapped, { status: 200 })
  } catch (e) {
    console.error('[api/feed] Error', e)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}


