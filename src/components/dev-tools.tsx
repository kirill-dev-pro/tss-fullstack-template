import { lazy, Suspense } from 'react'

const TanStackDevtools = lazy(() =>
  import('@tanstack/react-devtools').then((m) => ({
    default: m.TanStackDevtools,
  })),
)
const ReactQueryDevtoolsPanel = lazy(() =>
  import('@tanstack/react-query-devtools').then((m) => ({
    default: m.ReactQueryDevtoolsPanel,
  })),
)
const TanStackRouterDevtoolsPanel = lazy(() =>
  import('@tanstack/react-router-devtools').then((m) => ({
    default: m.TanStackRouterDevtoolsPanel,
  })),
)

export function DevTools() {
  return (
    <Suspense fallback={null}>
      <TanStackDevtools
        config={{ defaultOpen: false }}
        plugins={[
          {
            name: 'Tanstack Query',
            render: <ReactQueryDevtoolsPanel />,
          },
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
          {
            name: 'Drizzle Studio',
            render: () => (
              <iframe
                title="Drizzle Studio"
                src="https://local.drizzle.studio"
                style={{
                  flexGrow: 1,
                  width: '100%',
                  height: '100%',
                  border: 0,
                }}
              />
            ),
          },
        ]}
      />
    </Suspense>
  )
}
