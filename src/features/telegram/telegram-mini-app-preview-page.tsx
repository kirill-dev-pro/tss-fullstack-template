'use client'

import {
  AppWindow,
  ArrowLeft,
  RefreshCw,
  Smartphone,
  Tablet,
} from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { cn } from '@/lib/utils'

type DeviceMode = 'phone' | 'tablet'

const FRAME = {
  phone: {
    aspect: 'aspect-[390/844]' as const,
    shell: 'w-full max-w-[390px]',
    screenMaxH: 'max-h-[min(78vh,844px)]',
    radiusOuter: 'rounded-[2.35rem]',
    radiusInner: 'rounded-[1.85rem]',
    island: true,
  },
  tablet: {
    aspect: 'aspect-[820/1180]' as const,
    shell: 'w-full max-w-[820px]',
    screenMaxH: 'max-h-[min(82vh,1180px)]',
    radiusOuter: 'rounded-[1.75rem]',
    radiusInner: 'rounded-[1.25rem]',
    island: false as boolean,
  },
} as const

export function TelegramMiniAppPreviewPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [device, setDevice] = useState<DeviceMode>('phone')
  const [iframeReady, setIframeReady] = useState(false)
  const [iframeCanGoBack, setIframeCanGoBack] = useState(false)

  const f = FRAME[device]

  const syncIframeHistory = useCallback(() => {
    const win = iframeRef.current?.contentWindow
    if (!win) {
      setIframeCanGoBack(false)
      return
    }
    try {
      setIframeCanGoBack(win.history.length > 1)
    } catch {
      setIframeCanGoBack(false)
    }
  }, [])

  useEffect(() => {
    if (!iframeReady) {
      return
    }
    const win = iframeRef.current?.contentWindow
    if (!win) {
      return
    }
    syncIframeHistory()
    win.addEventListener('popstate', syncIframeHistory)
    const intervalId = window.setInterval(syncIframeHistory, 400)
    return () => {
      win.removeEventListener('popstate', syncIframeHistory)
      window.clearInterval(intervalId)
    }
  }, [iframeReady, syncIframeHistory])

  const handleIframeBack = () => {
    if (!iframeCanGoBack) {
      return
    }
    iframeRef.current?.contentWindow?.history.back()
  }

  const handleIframeReload = () => {
    setIframeReady(false)
    iframeRef.current?.contentWindow?.location.reload()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mini App preview</h1>
        <p className="text-muted-foreground">
          Same route as BotFather Web App URL. Theme and profile are pushed into
          the iframe only; init data still comes from Telegram in production.
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <ToggleGroup
              onValueChange={(v) => {
                if (v === 'phone' || v === 'tablet') {
                  setDevice(v)
                }
              }}
              type="single"
              value={device}
              variant="outline"
            >
              <ToggleGroupItem aria-label="Phone frame" value="phone">
                <Smartphone className="mr-1.5 size-4" aria-hidden />
                Phone
              </ToggleGroupItem>
              <ToggleGroupItem aria-label="Tablet frame" value="tablet">
                <Tablet className="mr-1.5 size-4" aria-hidden />
                Tablet
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div
            className={cn(
              'relative mx-auto bg-linear-to-b from-zinc-800 to-zinc-950 p-[10px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.55)] ring-1 ring-zinc-950/80',
              f.radiusOuter,
              f.shell,
            )}
          >
            <div
              className={cn(
                'relative overflow-hidden bg-zinc-950',
                f.radiusInner,
              )}
            >
              {f.island ? (
                <div
                  aria-hidden
                  className="pointer-events-none absolute top-2 left-1/2 z-10 h-6 w-[88px] -translate-x-1/2 rounded-full bg-black/90 shadow-inner"
                />
              ) : null}
              <div
                className={cn(
                  'relative min-h-[360px] w-full bg-background',
                  f.aspect,
                  f.screenMaxH,
                )}
              >
                <iframe
                  ref={iframeRef}
                  className="absolute inset-0 h-full w-full border-0 bg-background"
                  onLoad={() => {
                    setIframeReady(true)
                    syncIframeHistory()
                  }}
                  src="/telegram-mini-app/?preview=1"
                  title="Telegram mini app preview"
                />
              </div>
            </div>
          </div>
        </div>

        <Card className="w-full shrink-0 lg:w-[380px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AppWindow className="size-4 opacity-80" aria-hidden />
              Preview controls
            </CardTitle>
            <CardDescription>
              Iframe history only — does not navigate the dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-2">
              <Button
                className="min-w-0 flex-1 gap-2"
                disabled={!iframeCanGoBack}
                onClick={handleIframeBack}
                type="button"
                variant="secondary"
              >
                <ArrowLeft className="size-4 shrink-0" aria-hidden />
                <span className="truncate">Back</span>
              </Button>
              <Button
                className="min-w-0 flex-1 gap-2"
                onClick={handleIframeReload}
                type="button"
                variant="secondary"
              >
                <RefreshCw className="size-4 shrink-0" aria-hidden />
                <span className="truncate">Reload</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
