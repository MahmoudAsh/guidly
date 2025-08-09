"use client"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const browserClient = createClientComponentClient()

export function getSupabaseBrowser() {
  return browserClient
}

export const supabase = browserClient


