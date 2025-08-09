import { createClient } from '@supabase/supabase-js'

export type ArticleRow = {
  id: string
  title: string
  url: string
  source: string
  summary: string | null
  tags: string[] | null
  published_at: string | null
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const ARTICLES_TABLE = process.env.NEXT_PUBLIC_SUPABASE_ARTICLES_TABLE || 'articles'
const serverClient = createClient(supabaseUrl, supabaseAnonKey)

export async function getArticles({ tag, limit = 24, offset = 0 }: { tag?: string; limit?: number; offset?: number }) {
  function selectFor(tableName: string) {
    return tableName === 'Article'
      ? 'id,title,url,source,summary,tags,published_at:publishedAt'
      : 'id,title,url,source,summary,tags,published_at'
  }

  async function fetchFrom(tableName: string) {
    const select = selectFor(tableName)
    let query = serverClient
      .from(tableName)
      .select(select)
      .order(tableName === 'Article' ? 'publishedAt' : 'published_at', { ascending: false })

    if (tag) {
      query = query.contains('tags', [tag]) as typeof query
    }

    return query.range(offset, offset + limit - 1)
  }

  let { data, error } = await fetchFrom(ARTICLES_TABLE)
  if (error) {
    // Fallback to likely-cased name
    const fb = await fetchFrom('Article')
    data = fb.data
    error = fb.error ?? null
  }
  if (error) throw error
  return (data ?? []) as ArticleRow[]
}

export async function getArticleById(id: string) {
  function selectFor(tableName: string) {
    return tableName === 'Article'
      ? 'id,title,url,source,summary,tags,published_at:publishedAt'
      : 'id,title,url,source,summary,tags,published_at'
  }

  async function fetchFrom(tableName: string) {
    const select = selectFor(tableName)
    return serverClient.from(tableName).select(select).eq('id', id).maybeSingle()
  }

  let { data, error } = await fetchFrom(ARTICLES_TABLE)
  if (error) {
    const fb = await fetchFrom('Article')
    data = fb.data
    error = fb.error ?? null
  }
  if (error) throw error
  return data as ArticleRow | null
}


