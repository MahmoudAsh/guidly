'use client'

import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/dialog'
import Link from 'next/link'

export function SoftGateModal({ open, onOpenChange, onDismiss }: { open: boolean; onOpenChange: (v: boolean) => void; onDismiss: () => void }) {
  return (
    <Dialog open={open} onClose={() => onOpenChange(false)} size="md">
      <DialogTitle>Create a free account</DialogTitle>
      <DialogDescription>
        Personalize your feed, save articles for later, and take design quizzes.
      </DialogDescription>
      <DialogBody>
        <ul className="list-disc pl-5 text-sm text-zinc-700 dark:text-zinc-300">
          <li>Tailored topics based on your interests</li>
          <li>Save and sync reading list</li>
          <li>Weekly digest and quizzes</li>
        </ul>
      </DialogBody>
      <DialogActions>
        <button
          className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          onClick={() => onOpenChange(false)}
        >
          Continue reading
        </button>
        <Link
          href="/register"
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-500"
        >
          Create free account
        </Link>
        <Link href="/login" className="text-sm text-zinc-700 underline dark:text-zinc-300">
          Sign in
        </Link>
        <button onClick={onDismiss} className="text-sm text-zinc-500 underline">
          Don’t show for 7 days
        </button>
      </DialogActions>
    </Dialog>
  )
}


