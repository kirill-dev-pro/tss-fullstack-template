import { createFileRoute } from '@tanstack/react-router'
import {
  initData,
  type User,
  useRawInitData,
  useSignal,
} from '@tma.js/sdk-react'
import { useMemo } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

export const Route = createFileRoute('/telegram-mini-app/initData')({
  component: RouteComponent,
})

type DataRow = { label: string; value: string }

function RouteComponent() {
  return <InitDataPage />
}

function formatCell(value: unknown): string {
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

function rowsFromUser(user: User): DataRow[] {
  return Object.entries(user).map(([label, value]) => ({
    label,
    value: formatCell(value),
  }))
}

function DataSection({ title, rows }: { title: string; rows: DataRow[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-3">
          {rows.map((row) => (
            <div
              key={row.label}
              className="grid gap-0.5 border-b border-border pb-3 last:border-0 last:pb-0"
            >
              <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {row.label}
              </dt>
              <dd className="font-mono text-sm wrap-break-word">{row.value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  )
}

export default function InitDataPage() {
  const initDataRaw = useRawInitData()
  const initDataState = useSignal(initData.state)

  const initDataRows = useMemo<DataRow[] | undefined>(() => {
    if (!initDataState || !initDataRaw) {
      return
    }
    const rest = Object.entries(initDataState).reduce<DataRow[]>(
      (acc, [title, value]) => {
        if (value instanceof Date) {
          acc.push({ label: title, value: value.toISOString() })
          return acc
        }
        if (!value || typeof value !== 'object') {
          acc.push({ label: title, value: formatCell(value) })
        }
        return acc
      },
      [],
    )
    return [{ label: 'raw', value: initDataRaw }, ...rest]
  }, [initDataState, initDataRaw])

  const userRows = useMemo<DataRow[] | undefined>(() => {
    return initDataState?.user ? rowsFromUser(initDataState.user) : undefined
  }, [initDataState])

  const receiverRows = useMemo<DataRow[] | undefined>(() => {
    return initDataState?.receiver
      ? rowsFromUser(initDataState.receiver)
      : undefined
  }, [initDataState])

  const chatRows = useMemo<DataRow[] | undefined>(() => {
    if (!initDataState?.chat) {
      return
    }
    return Object.entries(initDataState.chat).map(([label, value]) => ({
      label,
      value: formatCell(value),
    }))
  }, [initDataState])

  if (!initDataRows) {
    return (
      <div className="flex w-full flex-col p-4">
        <Empty>
          <EmptyHeader>
            <EmptyMedia>
              <img
                alt="Telegram loading animation"
                className="block size-36"
                height={144}
                src="https://xelene.me/telegram.gif"
                width={144}
              />
            </EmptyMedia>
            <EmptyTitle>Oops</EmptyTitle>
            <EmptyDescription>
              Application was launched with missing init data
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col gap-4 p-4">
      <DataSection rows={initDataRows} title="Init data" />
      {userRows ? <DataSection rows={userRows} title="User" /> : null}
      {receiverRows ? (
        <DataSection rows={receiverRows} title="Receiver" />
      ) : null}
      {chatRows ? <DataSection rows={chatRows} title="Chat" /> : null}
    </div>
  )
}
