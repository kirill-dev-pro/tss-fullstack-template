import { createFileRoute, Outlet } from '@tanstack/react-router'

import { PreviewBridgeListener } from './-components/preview-bridge-listener'
import './-utils/instrumentation-client'

export const Route = createFileRoute('/telegram-mini-app')({
  component: RouteComponent,
  // Telegram initData / signals only exist on the client — SSR would mismatch.
  ssr: false,
})

function RouteComponent() {
  return (
    <>
      <PreviewBridgeListener />
      <Outlet />
    </>
  )
}
