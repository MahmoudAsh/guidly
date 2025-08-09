'use client'

import { Avatar } from '@/components/avatar'
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from '@/components/dropdown'
import { Navbar, NavbarItem, NavbarSection, NavbarSpacer } from '@/components/navbar'
import { Switch } from '@/components/switch'
import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarHeading,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  SidebarSpacer,
} from '@/components/sidebar'
import { SidebarLayout } from '@/components/sidebar-layout'
import {
  ArrowRightStartOnRectangleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Cog8ToothIcon,
  LightBulbIcon,
  PlusIcon,
  ShieldCheckIcon,
  UserCircleIcon,
} from '@heroicons/react/16/solid'
import {
  Cog6ToothIcon,
  HomeIcon,
  QuestionMarkCircleIcon,
  Square2StackIcon,
  BookmarkIcon,
  MoonIcon,
} from '@heroicons/react/20/solid'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getSupabaseBrowser } from '@/lib/supabase/client'

function AccountDropdownMenu({ anchor }: { anchor: 'top start' | 'bottom end' }) {
  return (
    <DropdownMenu className="min-w-64" anchor={anchor}>
      <DropdownItem href="#">
        <UserCircleIcon />
        <DropdownLabel>My account</DropdownLabel>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem href="#">
        <ShieldCheckIcon />
        <DropdownLabel>Privacy policy</DropdownLabel>
      </DropdownItem>
      <DropdownItem href="#">
        <LightBulbIcon />
        <DropdownLabel>Share feedback</DropdownLabel>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem href="/login">
        <ArrowRightStartOnRectangleIcon />
        <DropdownLabel>Sign out</DropdownLabel>
      </DropdownItem>
    </DropdownMenu>
  )
}

export function ApplicationLayout({ children }: { children: React.ReactNode }) {
  let pathname = usePathname()
  const [isDark, setIsDark] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)
  const [userName, setUserName] = useState<string>('')
  const [userEmail, setUserEmail] = useState<string>('')

  useEffect(() => {
    setHasMounted(true)
    try {
      const stored = localStorage.getItem('theme')
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      const isDark = stored ? stored === 'dark' : prefersDark
      document.documentElement.classList.toggle('dark', isDark)
      setIsDark(isDark)
    } catch {
      // no-op
    }
    // Load user for sidebar
    const supabase = getSupabaseBrowser()
    supabase.auth.getUser().then(({ data }) => {
      const u = data.user
      if (u) {
        const meta = (u.user_metadata as any) || {}
        setUserName((meta.display_name as string) || (meta.name as string) || '')
        setUserEmail(u.email || '')
      }
    })
    const onProfile = () => {
      const supa = getSupabaseBrowser()
      supa.auth.getUser().then(({ data }) => {
        const u = data.user
        if (u) {
          const meta = (u.user_metadata as any) || {}
          setUserName((meta.display_name as string) || (meta.name as string) || '')
          setUserEmail(u.email || '')
        }
      })
    }
    window.addEventListener('profile-updated', onProfile)
    return () => window.removeEventListener('profile-updated', onProfile)
  }, [])

  function handleToggleDarkMode(next: boolean) {
    setIsDark(next)
    try {
      const root = document.documentElement
      root.classList.remove('dark')
      if (next) root.classList.add('dark')
      localStorage.setItem('theme', next ? 'dark' : 'light')
    } catch {
      // no-op
    }
  }

  // Always render the structural shell on the server. Client-only bits below are already guarded.

  return (
    <SidebarLayout
      navbar={
        <Navbar>
          <NavbarSpacer />
          <NavbarSection>
            <Dropdown>
              <DropdownButton as={NavbarItem}>
                <Avatar src="/users/erica.jpg" square />
              </DropdownButton>
              <AccountDropdownMenu anchor="bottom end" />
            </Dropdown>
          </NavbarSection>
        </Navbar>
      }
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <Dropdown>
              <DropdownButton as={SidebarItem}>
                <Avatar src="/teams/catalyst.svg" />
                <SidebarLabel>Catalyst</SidebarLabel>
                <ChevronDownIcon />
              </DropdownButton>
              <DropdownMenu className="min-w-80 lg:min-w-64" anchor="bottom start">
                <DropdownItem href="/settings">
                  <Cog8ToothIcon />
                  <DropdownLabel>Settings</DropdownLabel>
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem href="#">
                  <Avatar slot="icon" src="/teams/catalyst.svg" />
                  <DropdownLabel>Catalyst</DropdownLabel>
                </DropdownItem>
                <DropdownItem href="#">
                  <Avatar slot="icon" initials="BE" className="bg-purple-500 text-white" />
                  <DropdownLabel>Big Events</DropdownLabel>
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem href="#">
                  <PlusIcon />
                  <DropdownLabel>New team&hellip;</DropdownLabel>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </SidebarHeader>

          <SidebarBody>
            <SidebarSection>
              <SidebarItem href="/" current={pathname === '/'}>
                <HomeIcon />
                <SidebarLabel>Home</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/feed" current={pathname.startsWith('/feed')}>
                <Square2StackIcon />
                <SidebarLabel>Feed</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/saved" current={pathname.startsWith('/saved')}>
                <BookmarkIcon />
                <SidebarLabel>Saved</SidebarLabel>
              </SidebarItem>
            </SidebarSection>

            {/* Upcoming Events section removed */}

            <SidebarSpacer />

            <SidebarSection>
              <SidebarItem href="/settings" current={pathname.startsWith('/settings')}>
                <Cog6ToothIcon />
                <SidebarLabel>Settings</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="#">
                <QuestionMarkCircleIcon />
                <SidebarLabel>Support</SidebarLabel>
              </SidebarItem>
              {hasMounted && (
                <SidebarItem>
                  <MoonIcon />
                  <SidebarLabel>Dark mode</SidebarLabel>
                  <span className="ml-auto">
                    <Switch checked={isDark} onChange={handleToggleDarkMode} />
                  </span>
                </SidebarItem>
              )}
            </SidebarSection>
          </SidebarBody>

          <SidebarFooter className="max-lg:hidden">
            <Dropdown>
              <DropdownButton as={SidebarItem}>
                <span className="flex min-w-0 items-center gap-3">
                  <Avatar initials={(userName || userEmail || 'U?').slice(0,1).toUpperCase() + ((userName.split(' ')[1]?.[0]||'').toUpperCase())} className="size-10" square alt={userName || userEmail} />
                  <span className="min-w-0">
                    <span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">{userName || 'Your name'}</span>
                    <span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">
                      {userEmail || 'you@example.com'}
                    </span>
                  </span>
                </span>
                <ChevronUpIcon />
              </DropdownButton>
              <AccountDropdownMenu anchor="top start" />
            </Dropdown>
          </SidebarFooter>
        </Sidebar>
      }
    >
      {children}
    </SidebarLayout>
  )
}
