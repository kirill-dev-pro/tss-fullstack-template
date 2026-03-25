import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { initData, mainButton, useSignal, type User } from '@tma.js/sdk-react'
import { useEffect, useMemo } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/telegram-mini-app/')({
  component: () => <TmaApp />,
  wrapInSuspense: true,
})

function formatUserValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '—'
  }
  if (typeof value === 'boolean') {
    return value ? 'yes' : 'no'
  }
  if (typeof value === 'object') {
    return JSON.stringify(value)
  }
  return String(value)
}

function rowsFromUser(user: User): { key: string; value: string }[] {
  return Object.entries(user).map(([k, v]) => ({
    key: k,
    value: formatUserValue(v),
  }))
}

function TmaApp() {
  const initDataState = useSignal(initData.state)
  const initDataRaw = useSignal(initData.raw)
  const user = initDataState?.user

  const rows = useMemo(() => (user ? rowsFromUser(user) : []), [user])

  useEffect(() => {
    if (initDataRaw) {
      fetch('/api/telegram/track-open', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData: initDataRaw }),
      }).catch(() => {})
    }
  }, [initDataRaw])

  useEffect(() => {
    mainButton.mount()
    mainButton.show()
    mainButton.setText('Reload')
    mainButton.onClick(() => {
      mainButton.hide()
      window.location.reload()
    })
    return () => {
      mainButton.hide()
    }
  }, [])

  return (
    <div className="flex w-full flex-col items-center gap-4 p-4">
      <DotLottieReact
        src="/stickers/dog_share.json"
        loop
        autoplay
        className="w-120"
      />
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Telegram mini app for TSS fulstack template</CardTitle>
        </CardHeader>
        <CardContent>
          {rows.length > 0 ? (
            <dl className="grid gap-3">
              {rows.map((row) => (
                <div
                  key={row.key}
                  className="grid gap-0.5 border-b border-border pb-3 last:border-0 last:pb-0"
                >
                  <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    {row.key}
                  </dt>
                  <dd className="font-mono text-sm break-words">{row.value}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="text-sm text-muted-foreground">
              No user in init data. Open the mini app inside Telegram (or enable
              mock init data for local dev).
            </p>
          )}
        </CardContent>
      </Card>

      <Link to="/telegram-mini-app/initData">
        <Button>View init data</Button>
      </Link>
    </div>
  )
}
