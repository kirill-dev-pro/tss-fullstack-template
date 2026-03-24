import * as Sentry from '@sentry/tanstackstart-react'
import {
  createRouter as createTanstackRouter,
  ErrorComponent,
} from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'

import DefaultLoading from './components/default-loading'
import NotFound from './components/not-found'
import './styles.css'
import {
  createQueryClient,
  createServerHelpers,
  Provider,
} from './lib/trpc/root-provider'
// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Create a new router instance
export const getRouter = () => {
  const queryClient = createQueryClient()
  const serverHelpers = createServerHelpers({
    queryClient,
  })
  const router = createTanstackRouter({
    routeTree,
    context: {
      queryClient,
      trpc: serverHelpers,
    },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultStaleTime: 0,
    defaultPreload: 'intent',
    defaultViewTransition: true,
    defaultPendingComponent: DefaultLoading,
    defaultNotFoundComponent: NotFound,
    defaultErrorComponent: ({ error }) => <ErrorComponent error={error} />,
    Wrap: (props: { children: React.ReactNode }) => (
      <Provider queryClient={queryClient}>{props.children}</Provider>
    ),
  })

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  })

  const dsn = import.meta.env.VITE_SENTRY_DSN
  if (!import.meta.env.SSR && dsn) {
    Sentry.init({
      dsn,
      sendDefaultPii: true,
      integrations: [Sentry.tanstackRouterBrowserTracingIntegration(router)],
      tracesSampleRate: import.meta.env.PROD ? 0.2 : 1.0,
    })
  }

  return router
}

// // Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
