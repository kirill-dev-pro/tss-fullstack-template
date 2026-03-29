'use client'

import { AppWindow, Smartphone, Tablet } from 'lucide-react'
import { useState } from 'react'

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
    /** Full width of card up to device width — avoids flex collapse to ~0px. */
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
    island: false,
  },
} as const

export function TelegramMiniAppPreview() {
  const [device, setDevice] = useState<DeviceMode>('phone')
  const f = FRAME[device]

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1.5">
          <CardTitle className="flex items-center gap-2">
            <AppWindow className="h-5 w-5 shrink-0 opacity-80" aria-hidden />
            Mini App preview
          </CardTitle>
          <CardDescription>
            Same route as BotFather Web App URL. Init data only appears inside
            Telegram; here you see layout and loading behavior.
          </CardDescription>
        </div>
        <ToggleGroup
          className="shrink-0"
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
      </CardHeader>
      <CardContent className="overflow-x-auto pt-2 pb-6">
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
                className="absolute inset-0 h-full w-full border-0 bg-background"
                src="/telegram-mini-app/"
                title="Telegram mini app preview"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
