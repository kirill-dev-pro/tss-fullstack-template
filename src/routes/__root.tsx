import type { QueryClient } from '@tanstack/react-query'
import type { TRPCOptionsProxy } from '@trpc/tanstack-react-query'

import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from '@tanstack/react-router'
import { ThemeProvider } from 'next-themes'
import { I18nextProvider } from 'react-i18next'

import type { TRPCRouter } from '@/server/router'

import { DevTools } from '@/components/dev-tools'
import { Toaster } from '@/components/ui/sonner'
import i18n from '@/lib/intl/i18n'
import { seo } from '@/lib/seo'

interface MyRouterContext {
  queryClient: QueryClient
  trpc: TRPCOptionsProxy<TRPCRouter>
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      ...seo({
        title: 'Modern Full-Stack Boilerplate',
        description:
          'A feature-rich, type-safe starter for building modern web applications with React, tRPC, Drizzle ORM, and more.',
        keywords:
          'React, TypeScript, tRPC, Drizzle ORM, TanStack, Full-Stack, Web Development, Boilerplate, SaaS, Starter, Tailwind CSS',
      }),
    ],
  }),
  component: () => <RootDocument />,
  wrapInSuspense: true,
})

function RootDocument() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          <I18nextProvider defaultNS={'translation'} i18n={i18n}>
            <Outlet />
            <Toaster />
            {import.meta.env.DEV && <DevTools />}
            <Scripts />
          </I18nextProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
