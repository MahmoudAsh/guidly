'use client'

import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'

type ToastVariant = 'success' | 'info' | 'warning' | 'error'

type ToastItem = {
  id: string
  title: string
  description?: string
  variant: ToastVariant
  durationMs?: number
}

type ToastContextValue = {
  show: (input: Omit<ToastItem, 'id' | 'variant'> & { variant?: ToastVariant }) => void
  success: (title: string, description?: string, durationMs?: number) => void
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const timers = useRef(new Map<string, number>())

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
    const t = timers.current.get(id)
    if (t) window.clearTimeout(t)
    timers.current.delete(id)
  }, [])

  const show = useCallback<ToastContextValue['show']>(({ title, description, variant = 'success', durationMs = 2400 }) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    setToasts((prev) => [...prev, { id, title, description, variant, durationMs }])
    const timeout = window.setTimeout(() => dismiss(id), durationMs)
    timers.current.set(id, timeout)
  }, [dismiss])

  const success = useCallback<ToastContextValue['success']>((title, description, durationMs) => {
    show({ title, description, variant: 'success', durationMs })
  }, [show])

  const value = useMemo(() => ({ show, success, dismiss }), [show, success, dismiss])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-96 max-w-[calc(100vw-2rem)] flex-col gap-3">
        {toasts.map((toast) => (
          <Toast key={toast.id} item={toast} onDismiss={() => dismiss(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function Toast({ item, onDismiss }: { item: ToastItem; onDismiss: () => void }) {
  const { title, description, variant } = item

  const stylesByVariant: Record<ToastVariant, { container: string; icon: React.ReactNode; title: string; body: string; button: string }> = {
    success: {
      container: 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800/40',
      icon: <CheckCircleIcon aria-hidden="true" className="size-5 text-green-600 dark:text-green-400" />,
      title: 'text-green-900 dark:text-green-300',
      body: 'text-green-800 dark:text-green-400',
      button: 'text-green-800 hover:bg-green-100 dark:text-green-300 dark:hover:bg-green-900/30',
    },
    info: {
      container: 'bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800/40',
      icon: <span className="size-5 rounded-full bg-blue-500" />,
      title: 'text-blue-900 dark:text-blue-300',
      body: 'text-blue-800 dark:text-blue-400',
      button: 'text-blue-800 hover:bg-blue-100 dark:text-blue-300 dark:hover:bg-blue-900/30',
    },
    warning: {
      container: 'bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800/40',
      icon: <span className="size-5 rounded-full bg-amber-500" />,
      title: 'text-amber-900 dark:text-amber-300',
      body: 'text-amber-800 dark:text-amber-400',
      button: 'text-amber-800 hover:bg-amber-100 dark:text-amber-300 dark:hover:bg-amber-900/30',
    },
    error: {
      container: 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800/40',
      icon: <span className="size-5 rounded-full bg-red-500" />,
      title: 'text-red-900 dark:text-red-300',
      body: 'text-red-800 dark:text-red-400',
      button: 'text-red-800 hover:bg-red-100 dark:text-red-300 dark:hover:bg-red-900/30',
    },
  }

  const s = stylesByVariant[variant]

  return (
    <div className={clsx('pointer-events-auto rounded-md border p-4 shadow-md backdrop-blur supports-[backdrop-filter]:bg-white/90 dark:supports-[backdrop-filter]:bg-zinc-900/80', s.container)}>
      <div className="flex">
        <div className="shrink-0">{s.icon}</div>
        <div className="ml-3 min-w-0">
          <h3 className={clsx('truncate text-sm font-medium', s.title)}>{title}</h3>
          {description && (
            <div className={clsx('mt-1 text-sm', s.body)}>
              <p className="line-clamp-3">{description}</p>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className={clsx('ml-3 inline-flex items-center rounded-md p-1.5 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600', s.button)}
          aria-label="Dismiss"
        >
          <XMarkIcon aria-hidden="true" className="size-4" />
        </button>
      </div>
    </div>
  )
}


