import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { initData, mainButton, useSignal, type User } from '@tma.js/sdk-react'
import { useEffect, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import type { TmaPreviewPostMessage } from './-utils/preview-message'

export const Route = createFileRoute('/telegram-mini-app/')({
  validateSearch: (search: Record<string, unknown>) => ({
    preview: search.preview === '1' ? true : undefined,
  }),
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
  const { preview: isDashboardPreview } = Route.useSearch()
  const [previewProfile, setPreviewProfile] = useState<
    TmaPreviewPostMessage['profile'] | null
  >(null)

  const initDataState = useSignal(initData.state)
  const initDataRaw = useSignal(initData.raw)
  const user = initDataState?.user

  const rows = useMemo(() => (user ? rowsFromUser(user) : []), [user])

  useEffect(() => {
    const onUpdate = (e: Event) => {
      const detail = (e as CustomEvent<TmaPreviewPostMessage>).detail
      if (detail?.profile) {
        setPreviewProfile(detail.profile)
      }
    }
    window.addEventListener('tma-preview-update', onUpdate)
    return () => {
      window.removeEventListener('tma-preview-update', onUpdate)
    }
  }, [])

  useEffect(() => {
    if (isDashboardPreview || !initDataRaw) {
      return
    }
    fetch('/api/telegram/track-open', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initData: initDataRaw }),
    }).catch(() => {})
  }, [isDashboardPreview, initDataRaw])

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

  const showPreviewStrip =
    previewProfile &&
    (previewProfile.displayName.trim() !== '' ||
      previewProfile.avatarUrl !== '')

  return (
    <div className="flex w-full flex-col items-center gap-4 p-4">
      {showPreviewStrip ? (
        <div className="flex w-full max-w-md items-center gap-3 rounded-xl border border-[var(--tg-theme-hint-color,#708499)]/40 bg-[var(--tg-theme-secondary-bg-color,#232e3c)] px-3 py-2">
          {previewProfile.avatarUrl ? (
            <img
              alt={
                previewProfile.displayName
                  ? `Avatar for ${previewProfile.displayName}`
                  : 'Profile avatar'
              }
              className="size-10 shrink-0 rounded-full object-cover"
              height={40}
              src={previewProfile.avatarUrl}
              width={40}
            />
          ) : null}
          {previewProfile.displayName ? (
            <span className="min-w-0 truncate text-sm font-medium text-[var(--tg-theme-text-color)]">
              {previewProfile.displayName}
            </span>
          ) : null}
        </div>
      ) : null}
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
                  <dd className="font-mono text-sm wrap-break-word">
                    {row.value}
                  </dd>
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
