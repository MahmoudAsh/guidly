import { createClientServer } from '../supabase/server'

export async function getSessionServer() {
  const supabase = createClientServer()
  const { data } = await supabase.auth.getUser()
  return data.user ?? null
}


