import { createFileRoute, Link } from '@tanstack/react-router'
import {
  BookOpen,
  ExternalLink,
  GitFork,
  Layers,
  Layout,
  LayoutDashboard,
  LogIn,
  MessageCircle,
  MessageSquare,
  Radio,
  Send,
  Smartphone,
  UserPlus,
  Zap,
  Container,
  Globe,
  Rabbit,
} from 'lucide-react'
import { useEffect, useState } from 'react'

import { ModeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export const Route = createFileRoute('/(public)/')({
  component: LandingPage,
})

// --- Sub-components ---

function TopBar() {
  return (
    <header className="col-span-full flex h-10 items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-panel-light)] px-3">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 font-bold tracking-tight">
          <svg
            className="h-3.5 w-3.5 fill-[var(--accent-blue)]"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          TSS-TEMPLATE
        </div>
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            className="flex items-center gap-1 text-xs text-[var(--accent-blue)]"
            to="/"
          >
            Overview
          </Link>
          <a
            className="flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-[var(--text-main)]"
            href="#"
          >
            Documentation
          </a>
          <a
            className="flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-[var(--text-main)]"
            href="#"
          >
            Benchmarks
          </a>
          <a
            className="flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-[var(--text-main)]"
            href="https://github.com/kirill-dev-pro/tss-fullstack-template"
            rel="noopener noreferrer"
            target="_blank"
          >
            Repository <ExternalLink className="h-2.5 w-2.5" />
          </a>
        </nav>
      </div>
      <div className="flex items-center gap-2">
        <ModeToggle />
        <Link to="/login">
          <Button className="gap-1.5" size="sm" variant="ghost">
            <LogIn className="h-3.5 w-3.5" />
            Login
          </Button>
        </Link>
        <Link to="/register">
          <Button className="gap-1.5" size="sm" variant="outline">
            <UserPlus className="h-3.5 w-3.5" />
            Register
          </Button>
        </Link>
        <a
          href="https://github.com/kirill-dev-pro/tss-fullstack-template/fork"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Button
            className="hidden gap-1.5 sm:flex"
            size="sm"
            variant="default"
          >
            <GitFork className="h-3.5 w-3.5" />
            Fork Repository
          </Button>
        </a>
      </div>
    </header>
  )
}

function ScrollActionBar() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!visible) return null

  return (
    <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-panel)] px-4 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.3)] backdrop-blur-sm">
      <Link to="/register">
        <Button className="gap-1.5" size="sm" variant="default">
          <UserPlus className="h-3.5 w-3.5" />
          Get Started
        </Button>
      </Link>
      <Link to="/dashboard">
        <Button className="gap-1.5" size="sm" variant="outline">
          Dashboard
        </Button>
      </Link>
      <div className="mx-2 h-4 w-px bg-[var(--border-subtle)]" />
      <Link to="/login">
        <Button className="gap-1.5" size="sm" variant="ghost">
          <LogIn className="h-3.5 w-3.5" />
          Login
        </Button>
      </Link>
    </div>
  )
}

function LeftSidebar() {
  const pages = [
    { icon: Layout, label: 'Hero Section', active: true },
    { icon: Layers, label: 'Stack Architecture' },
    { icon: Send, label: 'Telegram Integration' },
    { icon: MessageSquare, label: 'Community Logs' },
    { icon: BookOpen, label: 'Engineering Blog' },
  ]

  const configElements = [
    'tRPC Router',
    'Drizzle Schema',
    'Vite Config',
    'React Hook Form',
    'Zod Schema',
    'Better Auth',
    'TanStack Store',
    'Tailwind Config',
    'Docker Compose',
    'T3 Env',
  ]

  return (
    <aside className="hidden flex-col overflow-y-auto border-r border-[var(--border-subtle)] bg-[var(--bg-base)] lg:flex">
      <div className="border-b border-[var(--border-subtle)] py-2">
        <div className="px-3 py-1 text-[10px] font-semibold tracking-wider text-[var(--text-muted)] uppercase">
          Pages
        </div>
        {pages.map((page) => (
          <div
            className={`flex cursor-pointer items-center gap-2 px-3 py-1.5 text-xs ${
              page.active
                ? 'border-l-2 border-[var(--accent-blue)] bg-[var(--accent-blue)]/10 pl-[10px] text-[var(--accent-blue)]'
                : 'text-[var(--text-muted)] hover:bg-[var(--bg-panel)] hover:text-[var(--text-main)]'
            }`}
            key={page.label}
          >
            <page.icon className="h-3.5 w-3.5 opacity-70" />
            {page.label}
          </div>
        ))}
      </div>

      <div className="py-2">
        <div className="px-3 py-1 text-[10px] font-semibold tracking-wider text-[var(--text-muted)] uppercase">
          Config Elements
        </div>
        {configElements.map((item) => (
          <div
            className="flex cursor-pointer items-center gap-2 px-3 py-1.5 text-xs text-[var(--text-muted)] hover:bg-[var(--bg-panel)] hover:text-[var(--text-main)]"
            key={item}
          >
            <span className="font-mono text-[10px] text-[var(--text-muted)]">
              [ ]
            </span>{' '}
            {item}
          </div>
        ))}
      </div>
    </aside>
  )
}

function TerminalBlock() {
  return (
    <div className="overflow-hidden rounded-md border border-[var(--border-subtle)] bg-[var(--bg-base)] shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
      <div className="flex items-center gap-1.5 border-b border-[var(--border-subtle)] bg-[var(--bg-panel)] px-3 py-2">
        <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
        <div className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
        <div className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
        <span className="ml-2 font-mono text-[10px] leading-none text-[var(--text-muted)]">
          bash - node
        </span>
      </div>
      <div className="p-4 font-mono text-xs leading-relaxed text-[var(--text-muted)]">
        <div>
          <span className="text-[var(--accent-blue)]">npx</span>{' '}
          <span className="text-[var(--text-main)]">
            create-stack-init@latest
          </span>{' '}
          my-app
        </div>
        <div className="text-[var(--text-muted)]">
          ✔ Select rendering:{' '}
          <span className="text-[var(--text-main)]">TanStack Start (SSR)</span>
        </div>
        <div className="text-[var(--text-muted)]">
          ✔ Select database:{' '}
          <span className="text-[var(--text-main)]">PostgreSQL</span>
        </div>
        <div className="text-[var(--text-muted)]">
          ✔ Configure ORM:{' '}
          <span className="text-[var(--text-main)]">Drizzle</span>
        </div>
        <br />
        <div className="text-[var(--text-muted)]">
          Scaffolding application...
        </div>
        <div>
          <span className="text-[var(--accent-green)]">✔ Done.</span> Full-stack
          types synchronized.
        </div>
        <div>
          <span className="text-[var(--accent-blue)]">cd</span>{' '}
          <span className="text-[var(--text-main)]">my-app</span> &&{' '}
          <span className="text-[var(--accent-blue)]">npm</span>{' '}
          <span className="text-[var(--text-main)]">run dev</span>
        </div>
        <div>
          <span className="animate-blink">█</span>
        </div>
      </div>
    </div>
  )
}

function HeroSection() {
  return (
    <section className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
      <div>
        <div className="mb-4 flex w-fit items-center gap-1 rounded-sm border border-[var(--border-blue)] bg-[var(--bg-deep)] p-0.5">
          <div className="rounded-[2px] bg-[var(--accent-blue)] px-1.5 py-0.5 text-[11px] text-white">
            Combo Stack{' '}
            <span className="ml-1 cursor-pointer opacity-60 hover:opacity-100">
              ×
            </span>
          </div>
          <div className="px-1.5 py-0.5 text-[11px] text-[var(--text-muted)]">
            v2.4.1
          </div>
        </div>
        <h1 className="mb-3 text-[32px] leading-tight font-medium tracking-tight">
          End-to-end type safety, zero configuration fatigue.
        </h1>
        <p className="mb-6 max-w-[400px] text-sm text-[var(--text-muted)]">
          A production-ready boilerplate fusing React, TanStack Start, tRPC, and
          Drizzle — with built-in Telegram Mini App, web chat, and broadcast
          support. Skip the plumbing, start writing business logic.
        </p>
        <div className="flex gap-3">
          <a
            href="https://github.com/kirill-dev-pro/tss-fullstack-template/fork"
            rel="noopener noreferrer"
            target="_blank"
          >
            <Button className="gap-1.5 px-4 py-2" variant="default">
              <GitFork className="h-4 w-4" />
              Fork & Initialize
            </Button>
          </a>
          <Button className="px-4 py-2" variant="outline">
            Read Docs
          </Button>
        </div>
      </div>
      <TerminalBlock />
    </section>
  )
}

function QuickLinks() {
  const links = [
    {
      icon: ExternalLink,
      label: 'Open Repo',
      description: 'View source code on GitHub',
      href: 'https://github.com/kirill-dev-pro/tss-fullstack-template',
      external: true,
    },
    {
      icon: LayoutDashboard,
      label: 'Demo Dashboard',
      description: 'Explore the admin dashboard',
      href: '/dashboard',
      external: false,
    },
    {
      icon: MessageCircle,
      label: 'Telegram Mini App',
      description: 'Try the Telegram Mini App',
      href: '/telegram-mini-app',
      external: false,
    },
  ]

  return (
    <section>
      <SectionTitle>Quick Links</SectionTitle>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {links.map((link) => (
          <a
            className="group flex flex-col items-center gap-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-panel)] p-6 transition-colors hover:border-[var(--accent-blue)] hover:bg-[var(--bg-panel-light)]"
            href={link.href}
            key={link.label}
            rel={link.external ? 'noopener noreferrer' : undefined}
            target={link.external ? '_blank' : undefined}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--bg-deep)] transition-colors group-hover:bg-[var(--accent-blue)]/10">
              <link.icon className="h-6 w-6 text-[var(--text-muted)] transition-colors group-hover:text-[var(--accent-blue)]" />
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-[var(--text-main)]">
                {link.label}
              </div>
              <div className="mt-0.5 text-[11px] text-[var(--text-muted)]">
                {link.description}
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}

function TelegramSection() {
  const features = [
    {
      icon: Smartphone,
      title: 'Mini App',
      badge: 'live',
      description:
        'Full Telegram Mini App with WebApp SDK, native auth, and haptic feedback.',
      href: '/telegram-mini-app',
      linkLabel: 'Open Mini App',
      codeLine: 'telegram-mini-app/',
    },
    {
      icon: MessageCircle,
      title: 'Web Chat',
      badge: 'ready',
      description:
        'Dashboard chat backed by the bot. Real-time via webhooks + tRPC subscriptions.',
      href: '/dashboard/telegram/chats',
      linkLabel: 'View Chats',
      codeLine: 'api/webhooks/telegram.ts',
    },
    {
      icon: Radio,
      title: 'Broadcasts',
      badge: 'ready',
      description:
        'Send messages to filtered contact segments with delivery tracking.',
      href: '/dashboard/telegram/contacts',
      linkLabel: 'Manage Contacts',
      codeLine: 'api/telegram/contacts-table.ts',
    },
  ]

  return (
    <section>
      <SectionTitle>Telegram Integration</SectionTitle>
      <div className="overflow-hidden rounded border border-[var(--border-subtle)] bg-[var(--bg-panel)]">
        {/* Header row */}
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-panel-light)] px-3 py-2">
          <div className="flex items-center gap-2">
            <svg
              className="h-3.5 w-3.5 fill-[var(--accent-blue)]"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Telegram</title>
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
            </svg>
            <span className="text-[11px] font-semibold tracking-wider uppercase">
              Built-in Telegram Platform
            </span>
          </div>
          <a
            className="text-[11px] text-[var(--accent-blue)] hover:underline"
            href="/telegram-mini-app"
          >
            Try Mini App →
          </a>
        </div>
        {/* Feature cards */}
        <div className="grid grid-cols-1 divide-y divide-[var(--border-subtle)] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {features.map((feature) => (
            <div
              className="flex flex-col gap-3 p-4 hover:bg-[var(--bg-panel-light)]"
              key={feature.title}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <feature.icon className="h-3.5 w-3.5 text-[var(--accent-blue)]" />
                  <span className="text-xs font-medium text-[var(--text-main)]">
                    {feature.title}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-[var(--accent-green)]">
                  {feature.badge}
                </span>
              </div>
              <p className="text-[11px] leading-relaxed text-[var(--text-muted)]">
                {feature.description}
              </p>
              <div className="mt-auto flex flex-col gap-1.5">
                <div className="overflow-hidden rounded bg-[var(--bg-deep)] px-2 py-1 font-mono text-[10px] text-[var(--text-muted)]">
                  <span className="block truncate">{feature.codeLine}</span>
                </div>
                <a
                  className="text-[11px] text-[var(--accent-blue)] hover:underline"
                  href={feature.href}
                >
                  {feature.linkLabel} →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-2 font-mono text-[11px] tracking-widest text-[var(--accent-blue)] uppercase">
      <span className="inline-block h-2 w-2 rounded-[2px] bg-[var(--accent-blue)]" />
      {children}
    </div>
  )
}

function CoreInfrastructure() {
  const rows = [
    {
      label: 'Routing',
      value: 'TanStack Start (File-based, SSR/CSR hybrid)',
    },
    {
      label: 'Data Fetching',
      value: (
        <>
          <code className="rounded bg-[var(--bg-panel-light)] px-1 font-mono text-[var(--accent-blue)]">
            useQuery
          </code>{' '}
          via TanStack Query v5
        </>
      ),
    },
    {
      label: 'API Layer',
      value: 'tRPC (Type-safe RPC, zero build step)',
    },
    {
      label: 'Database',
      value: 'Drizzle ORM (Edge-ready, raw SQL performance)',
    },
    {
      label: 'Telegram',
      value: 'Grammy bot · Mini App SDK · Webhook handler · Broadcasts',
    },
  ]

  return (
    <section>
      <SectionTitle>Core Infrastructure</SectionTitle>
      <div className="overflow-hidden rounded border border-[var(--border-subtle)] bg-[var(--bg-panel)]">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-panel-light)] px-3 py-2 text-[11px] font-semibold tracking-wider uppercase">
          System Capabilities
        </div>
        {rows.map((row) => (
          <div
            className="grid grid-cols-[100px_1fr] items-center border-b border-[var(--bg-deep)] px-3 py-2 last:border-b-0"
            key={row.label}
          >
            <div className="text-xs text-[var(--text-muted)]">{row.label}</div>
            <div className="text-[var(--text-main)]">{row.value}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

function CommunityValidation() {
  const commits = [
    {
      hash: 'a1b2c3d',
      msg: 'feat: migrated from massive custom webpack setup to Stack_Init. Saved ~40hrs of config maintenance this month alone.',
      author: '@sarah_dev',
    },
    {
      hash: '8f9e0a1',
      msg: 'chore: the tRPC + Drizzle integration here is flawless. Autocomplete from DB schema straight to React components is magic.',
      author: '@techlead_jim',
    },
    {
      hash: '5d6c7b8',
      msg: 'fix: deploying to edge workers was trivial with Vite build output. Highly recommend.',
      author: '@edge_lord',
    },
  ]

  return (
    <section>
      <SectionTitle>Community Validation</SectionTitle>
      <div className="overflow-hidden rounded border border-[var(--border-subtle)]">
        {commits.map((commit) => (
          <div
            className="grid grid-cols-[80px_1fr_100px] items-center gap-3 border-b border-[var(--border-subtle)] bg-[var(--bg-panel)] px-4 py-3 last:border-b-0"
            key={commit.hash}
          >
            <div className="font-mono text-[11px] text-[var(--accent-orange)]">
              {commit.hash}
            </div>
            <div className="text-[var(--text-main)]">{commit.msg}</div>
            <div className="text-right text-[11px] text-[var(--text-muted)]">
              {commit.author}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function SocialMedia() {
  const posts = [
    {
      icon: (
        <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      name: '@tannerlinsley',
      role: 'Creator of TanStack',
      text: '"Stack_Init is what I wish existed when I was building my first production apps. The integration between Start, Query, and Router is seamless."',
      likes: '2.4k',
      shares: '847',
      time: '2 days ago',
    },
    {
      icon: (
        <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
        </svg>
      ),
      name: 'Lee Robinson',
      role: '@leeerob',
      text: '"Finally a boilerplate that gets the DX right. The file-based routing with automatic API types is *chef\'s kiss* 🔥"',
      likes: '1.8k',
      shares: '623',
      time: '5 days ago',
    },
    {
      icon: (
        <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.995 16.368l-3.707-3.702 3.707-3.702-1.293-1.293-3.707 3.702-3.702-3.702-1.293 1.293 3.702 3.702-3.702 3.702 1.293 1.293 3.702-3.702 3.707 3.702 1.293-1.293z" />
        </svg>
      ),
      name: 'Theo - t3.gg',
      role: '@t3dotgg',
      text: '"This is how you do full-stack TypeScript. Everything just works. No more `any` types in your API layer!"',
      likes: '3.2k',
      shares: '1.1k',
      time: '1 week ago',
    },
    {
      icon: (
        <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
        </svg>
      ),
      name: 'Github Trending',
      role: '#1 TypeScript',
      text: '"stack-init/stack-init just hit 15k stars! The community response has been incredible. Check out the new docs redesign."',
      likes: '5.1k',
      shares: '2.3k',
      time: '3 days ago',
    },
  ]

  return (
    <section>
      <SectionTitle>Social Media</SectionTitle>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {posts.map((post) => (
          <Card className="flex flex-col gap-3 p-5" key={post.name}>
            <div className="flex items-center gap-3">
              <div className="text-[var(--text-muted)]">{post.icon}</div>
              <div>
                <div className="font-medium">{post.name}</div>
                <div className="text-[11px] text-[var(--text-muted)]">
                  {post.role}
                </div>
              </div>
            </div>
            <div className="text-[13px] leading-relaxed text-[var(--text-muted)]">
              {post.text}
            </div>
            <div className="mt-auto flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
              <span>♥ {post.likes}</span>
              <span>↗ {post.shares}</span>
              <span className="ml-auto">{post.time}</span>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}

function BlogSection() {
  const posts = [
    {
      category: 'Architecture',
      title: 'How we achieved 100% type safety across the entire stack',
      excerpt:
        'Exploring the tRPC + Drizzle integration pattern that eliminates runtime errors...',
      date: 'Jan 15',
      readTime: '8 min read',
    },
    {
      category: 'Performance',
      title: 'Edge runtime deployment strategies with Vite 5',
      excerpt:
        'Benchmarks comparing cold starts and bundle sizes across providers...',
      date: 'Jan 12',
      readTime: '12 min read',
    },
    {
      category: 'Tutorial',
      title: 'Building AI-powered features with @ai-sdk/react',
      excerpt: 'Complete guide to integrating streaming AI responses...',
      date: 'Jan 8',
      readTime: '15 min read',
    },
  ]

  return (
    <section>
      <SectionTitle>From the Blog</SectionTitle>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {posts.map((post) => (
          <Card className="flex flex-col gap-3 p-4" key={post.title}>
            <div className="text-[11px] text-[var(--accent-blue)] uppercase">
              {post.category}
            </div>
            <div className="text-sm leading-snug font-medium">{post.title}</div>
            <div className="text-xs text-[var(--text-muted)]">
              {post.excerpt}
            </div>
            <div className="mt-auto flex items-center gap-1.5 text-[11px] text-[var(--text-muted)]">
              <span className="font-mono">{post.date}</span> · {post.readTime}
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="flex items-center justify-between border-t border-[var(--border-subtle)] py-10 text-[11px] text-[var(--text-muted)]">
      <div>© 2025 TSS Template. MIT Licensed.</div>
      <div className="font-mono">v.2.4.1 // SYSTEM_ONLINE</div>
    </footer>
  )
}

// --- Right Sidebar ---

function RightSidebar() {
  const [strictTypes, setStrictTypes] = useState(true)
  const [edgeRuntime, setEdgeRuntime] = useState(false)

  const npmDependencies = [
    { name: 'React', version: '19.2' },
    { name: 'React DOM', version: '19.2' },
    { name: 'TanStack Start', version: '1.167' },
    { name: 'TanStack Router', version: '1.168' },
    { name: 'TanStack Query', version: '5.95' },
    { name: 'TanStack Form', version: '1.28' },
    { name: 'TanStack Store', version: '0.8' },
    { name: 'TanStack DB', version: '0.1' },
    { name: 'tRPC', version: '11.15' },
    { name: 'Drizzle ORM', version: '0.44' },
    { name: 'Vite', version: '7.3' },
    { name: 'Tailwind CSS', version: '4.2' },
    { name: 'Better Auth', version: '1.5' },
    { name: 'React Hook Form', version: '7.72' },
    { name: 'Zod', version: '4.3' },
    { name: '@ai-sdk/react', version: '2.0' },
    { name: 'ai', version: '6.0' },
    { name: 'Resend', version: '6.9' },
    { name: 'React Email', version: '4.3' },
    { name: 'i18next', version: '25.10' },
    { name: 'Sentry', version: '10.45' },
    { name: 'shadcn/ui', version: 'latest' },
    { name: 'Lucide Icons', version: '0.546' },
    { name: 'Framer Motion', version: '12.38' },
    { name: 'Grammy (Telegram)', version: '1.36' },
  ]

  const deploymentTargets = [
    { name: 'Bun', version: '1.3', icon: Rabbit },
    { name: 'Docker', version: 'latest', icon: Container },
    { name: 'Vercel', version: 'ready', icon: Globe },
  ]

  return (
    <aside className="hidden flex-col overflow-y-auto border-l border-[var(--border-subtle)] bg-[var(--bg-panel)] lg:flex">
      {/* Stack Selectors */}
      <div className="border-b border-[var(--border-subtle)] p-3">
        <div className="mb-2 text-[11px] font-semibold text-[var(--text-muted)]">
          Stack Selectors
        </div>
        <div className="flex items-center gap-1 rounded border border-[var(--border-blue)] bg-black p-1">
          <div className="flex items-center gap-1 rounded-[2px] bg-[var(--accent-blue)] px-1.5 py-0.5 text-[11px] text-white">
            full_stack{' '}
            <span className="cursor-pointer opacity-60 hover:opacity-100">
              ×
            </span>
          </div>
          <div className="flex items-center gap-1 rounded-[2px] bg-[var(--accent-blue)] px-1.5 py-0.5 text-[11px] text-white">
            type_safe{' '}
            <span className="cursor-pointer opacity-60 hover:opacity-100">
              ×
            </span>
          </div>
          <div className="flex items-center gap-1 rounded-[2px] bg-[#229ED9]/80 px-1.5 py-0.5 text-[11px] text-white">
            telegram{' '}
            <span className="cursor-pointer opacity-60 hover:opacity-100">
              ×
            </span>
          </div>
          <input
            className="ml-1 w-20 bg-transparent text-[11px] text-white outline-none"
            placeholder="Add module..."
            type="text"
          />
        </div>
      </div>

      {/* Architecture Widget */}
      <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-deep)] p-6">
        <div className="font-mono text-[10px] text-[var(--text-muted)]">
          <div className="relative rounded border border-dashed border-[#333] bg-[#111] p-6">
            <span className="absolute top-1 left-1.5 text-[10px] text-[#666]">
              DATABASE
            </span>
            <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[10px] text-[var(--accent-orange)]">
              SQL
            </span>

            <div className="relative mt-6 rounded border border-[#3f3f46] bg-[#18181b] p-6">
              <span className="absolute top-1 left-1.5 text-[10px] text-[#888]">
                SERVER
              </span>
              <span className="absolute top-1/2 left-1 -translate-y-1/2 text-[10px] text-[var(--accent-orange)]">
                tRPC
              </span>
              <span className="absolute top-1/2 right-1 -translate-y-1/2 text-[10px] text-[var(--accent-orange)]">
                ORM
              </span>

              <div className="relative mt-6 flex items-center justify-center rounded border border-[#52525b] bg-[#27272a] px-0 py-4 text-xs font-medium text-white">
                <span className="absolute top-1 left-1.5 font-mono text-[10px] text-[#bbb]">
                  CLIENT
                </span>
                React / UI
              </div>
            </div>
          </div>
          <div className="mt-2 text-[var(--accent-orange)]">
            Type Safety 100%
          </div>
        </div>
      </div>

      {/* NPM Dependencies */}
      <div className="border-b border-[var(--border-subtle)]">
        <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-panel-light)] px-3 py-2 text-[11px] font-semibold tracking-wider uppercase">
          NPM Dependencies
        </div>
        {npmDependencies.map((dep) => (
          <div
            className="grid grid-cols-[14px_1fr_40px] items-center gap-3 border-b border-[var(--border-subtle)] px-3 py-1.5 hover:bg-[var(--bg-panel-light)]"
            key={dep.name}
          >
            <Zap className="h-3.5 w-3.5 text-[var(--accent-blue)] opacity-80" />
            <div className="text-xs">{dep.name}</div>
            <div className="text-right font-mono text-[10px] text-[var(--text-muted)]">
              {dep.version}
            </div>
          </div>
        ))}
      </div>

      {/* Deployment Targets */}
      <div className="border-b border-[var(--border-subtle)]">
        <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-panel-light)] px-3 py-2 text-[11px] font-semibold tracking-wider uppercase">
          Deployment Targets
        </div>
        {deploymentTargets.map((target) => (
          <div
            className="grid grid-cols-[14px_1fr_40px] items-center gap-3 border-b border-[var(--border-subtle)] px-3 py-1.5 hover:bg-[var(--bg-panel-light)]"
            key={target.name}
          >
            <target.icon className="h-3.5 w-3.5 text-[var(--accent-orange)] opacity-80" />
            <div className="text-xs">{target.name}</div>
            <div className="text-right font-mono text-[10px] text-[var(--text-muted)]">
              {target.version}
            </div>
          </div>
        ))}
      </div>

      {/* Toggles */}
      <div className="p-3">
        <div className="flex items-center justify-between pb-3">
          <div className="text-xs text-[var(--text-muted)]">Strict Types</div>
          <div
            className={`relative h-3 w-6 cursor-pointer rounded-full border transition-colors ${
              strictTypes
                ? 'border-[var(--accent-blue)] bg-[var(--accent-blue)]'
                : 'border-[var(--border-active)] bg-[var(--bg-deep)]'
            }`}
            onClick={() => setStrictTypes(!strictTypes)}
          >
            <div
              className={`absolute top-px h-2 w-2 rounded-full transition-all ${
                strictTypes
                  ? 'left-[13px] bg-white'
                  : 'left-0.5 bg-[var(--text-muted)]'
              }`}
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-xs text-[var(--text-muted)]">Edge Runtime</div>
          <div
            className={`relative h-3 w-6 cursor-pointer rounded-full border transition-colors ${
              edgeRuntime
                ? 'border-[var(--accent-blue)] bg-[var(--accent-blue)]'
                : 'border-[var(--border-active)] bg-[var(--bg-deep)]'
            }`}
            onClick={() => setEdgeRuntime(!edgeRuntime)}
          >
            <div
              className={`absolute top-px h-2 w-2 rounded-full transition-all ${
                edgeRuntime
                  ? 'left-[13px] bg-white'
                  : 'left-0.5 bg-[var(--text-muted)]'
              }`}
            />
          </div>
        </div>
      </div>
    </aside>
  )
}

// --- Main Page ---

function LandingPage() {
  return (
    <div className="grid h-screen grid-cols-1 grid-rows-[40px_1fr] lg:grid-cols-[280px_1fr_320px]">
      <TopBar />
      <LeftSidebar />
      <main className="relative overflow-y-auto bg-[var(--bg-deep)]">
        {/* Dot grid background */}
        <div className="pointer-events-none absolute inset-0 z-0 opacity-30">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(var(--border-subtle) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
        </div>

        <div className="relative z-10 mx-auto flex max-w-[900px] flex-col gap-15 px-10 py-10">
          <HeroSection />
          <QuickLinks />
          <TelegramSection />
          <CoreInfrastructure />
          <CommunityValidation />
          <SocialMedia />
          <BlogSection />
          <Footer />
        </div>
      </main>
      <RightSidebar />
      <ScrollActionBar />
    </div>
  )
}
