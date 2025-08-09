import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

export async function getSessionServer() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  const cookieStore = cookies()
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: true, detectSessionInUrl: false },
  })

  const { data } = await supabase.auth.getSession()
  const session = data.session
  return session
}


