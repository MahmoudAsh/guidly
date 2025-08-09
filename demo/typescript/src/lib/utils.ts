import clsx, { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function truncate(input: string, maxChars: number) {
  if (input.length <= maxChars) return input
  return input.slice(0, Math.max(0, maxChars - 1)) + '…'
}

export function formatDate(iso?: string | null) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}


