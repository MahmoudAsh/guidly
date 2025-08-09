import React from 'react'

export function AuthCard({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-zinc-950/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
      <div className="mb-4">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-white">{title}</h1>
        {description ? (
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{description}</p>
        ) : null}
      </div>
      {children}
    </div>
  )
}


