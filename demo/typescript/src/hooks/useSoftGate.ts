'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export const SOFTGATE_CLICK_THRESHOLD = 10
export const SOFTGATE_TIME_MS = 30_000
export const SOFTGATE_DISMISS_DAYS = 7

function isDismissed() {
  try {
    const raw = localStorage.getItem('guidly.softgate.dismissed')
    if (!raw) return false
    const until = Number(raw)
    return Number.isFinite(until) && Date.now() < until
  } catch {
    return false
  }
}

function setDismissed(days: number) {
  try {
    const until = Date.now() + days * 24 * 60 * 60 * 1000
    localStorage.setItem('guidly.softgate.dismissed', String(until))
  } catch {}
}

export function useSoftGate() {
  const [open, setOpen] = useState(false)
  const clicks = useRef(0)
  const timer = useRef<number | null>(null)

  const onArticleClick = useCallback(() => {
    if (open || isDismissed()) return
    clicks.current += 1
    if (clicks.current >= SOFTGATE_CLICK_THRESHOLD) setOpen(true)
  }, [open])

  const dismiss = useCallback(() => {
    setDismissed(SOFTGATE_DISMISS_DAYS)
    setOpen(false)
  }, [])

  useEffect(() => {
    if (isDismissed()) return
    timer.current = window.setTimeout(() => setOpen(true), SOFTGATE_TIME_MS)
    return () => {
      if (timer.current) window.clearTimeout(timer.current)
    }
  }, [])

  useEffect(() => {
    function onClick() {
      onArticleClick()
    }
    window.addEventListener('softgate:article_click' as any, onClick)
    return () => window.removeEventListener('softgate:article_click' as any, onClick)
  }, [onArticleClick])

  return { open, setOpen, onArticleClick, dismiss }
}


