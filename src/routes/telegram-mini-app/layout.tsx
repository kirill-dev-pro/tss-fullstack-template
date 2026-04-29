import { createFileRoute, Outlet } from '@tanstack/react-router'

import { useTelegramMiniApp } from '@/hooks/use-telegram-mini-app'

import { PreviewBridgeListener } from './-components/preview-bridge-listener'

export const Route = createFileRoute('/telegram-mini-app')({
  component: RouteComponent,
  // Telegram initData / signals only exist on the client — SSR would mismatch.
  ssr: false,
})

function RouteComponent() {
  useTelegramMiniApp()
  return (
    <>
      <PreviewBridgeListener />
      <Outlet />
    </>
  )
}
