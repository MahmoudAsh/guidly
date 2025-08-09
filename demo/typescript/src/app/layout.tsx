import '@/styles/tailwind.css'
import type { Metadata } from 'next'
import Script from 'next/script'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: {
    template: '%s - Catalyst',
    default: 'Catalyst',
  },
  description: '',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className="text-zinc-950 antialiased lg:bg-zinc-100 dark:bg-zinc-900 dark:text-white dark:lg:bg-zinc-950"
    >
      <head>
        <Script id="theme-init" strategy="beforeInteractive">{
`(function(){
  try {
    var stored = localStorage.getItem('theme');
    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    var isDark = stored ? stored === 'dark' : prefersDark;
    var root = document.documentElement;
    root.classList.remove('dark');
    if (isDark) root.classList.add('dark');
  } catch (e) {}
})();`
        }</Script>
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </head>
      <body>{children}</body>
    </html>
  )
}
