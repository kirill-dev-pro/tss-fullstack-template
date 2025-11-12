/** biome-ignore-all lint/nursery/useConsistentTypeDefinitions: Type definitions for tasnstack */
import { createRouter as createTanstackRouter, ErrorComponent } from "@tanstack/react-router"
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query"
import { createQueryClient, createServerHelpers, Provider } from "./lib/trpc/root-provider"

// Import the generated route tree
import { routeTree } from "./routeTree.gen"

import "./styles.css"
import DefaultLoading from "./components/default-loading"
import NotFound from "./components/not-found"

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
    defaultPreload: "intent",
    defaultViewTransition: true,
    defaultPendingComponent: DefaultLoading,
    defaultNotFoundComponent: NotFound,
    defaultErrorComponent: ({ error }) => <ErrorComponent error={error} />,
    Wrap: (props: { children: React.ReactNode }) => <Provider queryClient={queryClient}>{props.children}</Provider>,
  })

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  })

  return router
}

// // Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
