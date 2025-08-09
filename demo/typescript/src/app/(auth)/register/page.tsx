// (Legacy demo markup removed in favor of client form below)

"use client"
export const dynamic = 'force-dynamic'
import { Logo } from '@/app/logo'
import { Button } from '@/components/button'
import { Checkbox, CheckboxField } from '@/components/checkbox'
import { Field, Label } from '@/components/fieldset'
import { Heading } from '@/components/heading'
import { Input } from '@/components/input'
import { Select } from '@/components/select'
import { Strong, Text, TextLink } from '@/components/text'
import { Suspense, useEffect, useState } from 'react'
import { RegisterForm } from '@/components/auth/RegisterForm'

export default function RegisterPage() {
  const [redirectTo, setRedirectTo] = useState<string | undefined>(undefined)
  useEffect(() => {
    try {
      const sp = new URLSearchParams(window.location.search)
      setRedirectTo(sp.get('redirect') || undefined)
    } catch {}
  }, [])
  return (
    <>
      <Suspense fallback={null}>
        <div />
      </Suspense>
    <div className="grid w-full max-w-sm grid-cols-1 gap-8">
      <Logo className="h-6 text-zinc-950 dark:text-white forced-colors:text-[CanvasText]" />
      <Heading>Create your account</Heading>
      <RegisterForm redirectTo={redirectTo} />
      <Text>
        Already have an account?{' '}
        <TextLink href="/login">
          <Strong>Sign in</Strong>
        </TextLink>
      </Text>
    </div>
    </>
  )
}
