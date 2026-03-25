'use client'

import { useQuery } from '@tanstack/react-query'
import { Send } from 'lucide-react'
import { useEffect, useRef } from 'react'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useTRPC } from '@/lib/trpc/react'
import { cn } from '@/lib/utils'

interface ChatHistoryDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  telegramUserId: number
  username: string | null
  firstName: string | null
}

export function ChatHistoryDrawer({
  open,
  onOpenChange,
  telegramUserId,
  username,
  firstName,
}: ChatHistoryDrawerProps) {
  const trpc = useTRPC()
  const { data: messages, isLoading } = useQuery({
    ...trpc.telegram.getMessages.queryOptions({ telegramUserId }),
    enabled: open,
  })

  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messages?.length) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const displayName = username
    ? `@${username}`
    : firstName || `User ${telegramUserId}`

  const messageDays = groupByDay(messages ?? [])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            {displayName}
          </SheetTitle>
          <SheetDescription>
            {messages?.length
              ? `${messages.length} messages`
              : 'Conversation history'}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-4 py-4">
          {isLoading ? (
            <p className="text-center text-sm text-muted-foreground">
              Loading messages...
            </p>
          ) : !messages?.length ? (
            <p className="text-center text-sm text-muted-foreground">
              No messages yet
            </p>
          ) : (
            messageDays.map((day) => (
              <div key={day.label} className="flex flex-col gap-2">
                <div className="sticky top-0 z-10 flex items-center gap-3 py-1">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-[10px] font-medium text-muted-foreground">
                    {day.label}
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>
                {day.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      'flex',
                      msg.direction === 'outgoing'
                        ? 'justify-end'
                        : 'justify-start',
                    )}
                  >
                    <div
                      className={cn(
                        'max-w-[80%] rounded-lg px-3 py-2 text-sm',
                        msg.direction === 'outgoing'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground',
                      )}
                    >
                      <p className="break-words whitespace-pre-wrap">
                        {msg.text || '—'}
                      </p>
                      <p
                        className={cn(
                          'mt-1 text-[10px]',
                          msg.direction === 'outgoing'
                            ? 'text-primary-foreground/60'
                            : 'text-muted-foreground',
                        )}
                      >
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>
      </SheetContent>
    </Sheet>
  )
}

function groupByDay(
  messages: Array<{
    id: number
    direction: string
    text: string | null
    createdAt: Date | string
  }>,
) {
  const groups: Array<{
    label: string
    date: string
    messages: typeof messages
  }> = []

  for (const msg of messages) {
    const date = new Date(msg.createdAt)
    const dateKey = date.toISOString().split('T')[0]
    const label = formatDateLabel(date)

    const last = groups.at(-1)
    if (last?.date === dateKey) {
      last.messages.push(msg)
    } else {
      groups.push({ label, date: dateKey, messages: [msg] })
    }
  }

  return groups
}

function formatDateLabel(date: Date) {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const msgDay = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const diffDays = Math.round(
    (today.getTime() - msgDay.getTime()) / (1000 * 60 * 60 * 24),
  )

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  return date.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  })
}
