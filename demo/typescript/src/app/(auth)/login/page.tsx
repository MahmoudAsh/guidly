"use client"
export const dynamic = 'force-dynamic'
import { Logo } from '@/app/logo'
import { Button } from '@/components/button'
import { Checkbox, CheckboxField } from '@/components/checkbox'
import { Field, Label } from '@/components/fieldset'
import { Heading } from '@/components/heading'
import { Input } from '@/components/input'
import { Strong, Text, TextLink } from '@/components/text'
import { Suspense, useEffect, useState } from 'react'
import { LoginForm } from '@/components/auth/LoginForm'

export default function LoginPage() {
  const [redirectTo, setRedirectTo] = useState<string | undefined>(undefined)
  const [registered, setRegistered] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    try {
      const sp = new URLSearchParams(window.location.search)
      setRedirectTo(sp.get('redirect') || sp.get('next') || undefined)
      setRegistered(sp.get('registered') === '1')
    } catch {}
  }, [])

  return (
    <>
      <Suspense fallback={null}>
        <div />
      </Suspense>
    <div className="grid w-full max-w-sm grid-cols-1 gap-8">
      <Logo className="h-6 text-zinc-950 dark:text-white forced-colors:text-[CanvasText]" />
      <Heading>Sign in to your account</Heading>
      {registered && !dismissed && (
        <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700 dark:border-green-500/30 dark:bg-green-950/20 dark:text-green-300">
          Account created. Please sign in.
          <button className="ml-2 text-xs underline" onClick={() => setDismissed(true)}>Dismiss</button>
        </div>
      )}
      <LoginForm redirectTo={redirectTo} />
      <Text>
        Don’t have an account?{' '}
        <TextLink href="/register">
          <Strong>Sign up</Strong>
        </TextLink>
      </Text>
    </div>
    </>
  )
}
