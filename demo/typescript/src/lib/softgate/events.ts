'use client'

export function notifyArticleClick() {
  try {
    window.dispatchEvent(new CustomEvent('softgate:article_click'))
  } catch {}
}


