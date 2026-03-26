'use client'

import { useMutation } from '@tanstack/react-query'
import { Filter, Send, Users } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useTRPC } from '@/lib/trpc/react'

interface BroadcastDialogProps {
  /** Total non-blocked contacts (unfiltered baseline). */
  totalNonBlocked: number
  /** Count of contacts matching the current table filters. 0 until first data load. */
  filterRowCount: number
  /** Serialized filter search string from the data table. */
  filterSearchString: string
}

function hasActiveFilters(filterSearchString: string): boolean {
  if (!filterSearchString) return false
  const params = new URLSearchParams(filterSearchString)
  const systemKeys = new Set(['size', 'cursor', 'direction', 'sort', 'live', 'uuid'])
  for (const key of params.keys()) {
    if (!systemKeys.has(key)) return true
  }
  return false
}

export function BroadcastDialog({
  totalNonBlocked,
  filterRowCount,
  filterSearchString,
}: BroadcastDialogProps) {
  const trpc = useTRPC()
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')

  const filtersActive = hasActiveFilters(filterSearchString)
  const recipientCount = filtersActive ? filterRowCount : totalNonBlocked

  const broadcast = useMutation(
    trpc.telegram.broadcastMessage.mutationOptions({
      onSuccess: (result) => {
        toast.success(
          `Broadcast complete: ${result.sent} sent, ${result.blocked} blocked, ${result.failed} failed`,
        )
        setOpen(false)
        setText('')
      },
      onError: () => {
        toast.error('Broadcast failed')
      },
    }),
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    broadcast.mutate({
      text: text.trim(),
      filterSearchString: filtersActive ? filterSearchString : undefined,
    })
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size="sm" type="button" variant="default">
          <Send className="mr-2 h-4 w-4" />
          Broadcast
          {filtersActive && (
            <Badge className="ml-2 h-4 px-1 text-[10px]" variant="secondary">
              <Filter className="mr-0.5 h-2.5 w-2.5" />
              filtered
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Broadcast Message</DialogTitle>
          <DialogDescription>
            Send a message to your Telegram contacts via the bot.
          </DialogDescription>
        </DialogHeader>

        {/* Recipients summary */}
        <div className="flex items-start gap-3 rounded-lg border bg-muted/40 p-3">
          <Users className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <div className="min-w-0 flex-1 text-sm">
            <div className="font-medium">
              {recipientCount > 0
                ? `${recipientCount} recipient${recipientCount !== 1 ? 's' : ''}`
                : 'No recipients'}
            </div>
            {filtersActive ? (
              <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Filter className="h-3 w-3" />
                <span>Matching your current table filters</span>
                <span className="text-muted-foreground/60">
                  ({totalNonBlocked} total non-blocked)
                </span>
              </div>
            ) : (
              <div className="mt-0.5 text-xs text-muted-foreground">
                All non-blocked contacts
              </div>
            )}
          </div>
          {filtersActive && (
            <Badge className="shrink-0" variant="outline">
              <Filter className="mr-1 h-3 w-3" />
              Filtered
            </Badge>
          )}
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="broadcast-text">Message</Label>
            <Textarea
              id="broadcast-text"
              onChange={(e) => setText(e.target.value)}
              placeholder="Type your broadcast message..."
              rows={4}
              value={text}
            />
          </div>
          <DialogFooter>
            <Button
              onClick={() => setOpen(false)}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              disabled={!text.trim() || recipientCount === 0 || broadcast.isPending}
              type="submit"
            >
              {broadcast.isPending
                ? 'Sending...'
                : `Send to ${recipientCount} contact${recipientCount !== 1 ? 's' : ''}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
