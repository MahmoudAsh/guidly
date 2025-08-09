import { ApplicationLayout } from './application-layout'
import { ToastProvider } from '@/components/toast'
import { createClientServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClientServer()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    redirect('/login')
  }
  return (
    <ToastProvider>
      <ApplicationLayout>{children}</ApplicationLayout>
    </ToastProvider>
  )
}
