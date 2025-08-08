import { ApplicationLayout } from './application-layout'
import { ToastProvider } from '@/components/toast'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <ApplicationLayout>{children}</ApplicationLayout>
    </ToastProvider>
  )
}
