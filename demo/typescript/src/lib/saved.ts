export type SavedArticle = {
  id: string
  title: string
  url: string
  summary: string
  source: string
  tags?: string[]
  date: string
  image?: string
}

const STORAGE_KEY = 'guidly_saved_articles_v1'

function readStore(): SavedArticle[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed as SavedArticle[]
    return []
  } catch {
    return []
  }
}

function writeStore(items: SavedArticle[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // no-op
  }
}

export function listSaved(): SavedArticle[] {
  return readStore()
}

export function isSaved(id: string): boolean {
  return readStore().some((a) => a.id === id)
}

export function saveArticle(article: SavedArticle) {
  const items = readStore()
  if (items.some((a) => a.id === article.id)) return
  items.push(article)
  writeStore(items)
}

export function removeArticle(id: string) {
  const items = readStore().filter((a) => a.id !== id)
  writeStore(items)
}


