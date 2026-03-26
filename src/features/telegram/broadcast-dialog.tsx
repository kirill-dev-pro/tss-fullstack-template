'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { Send, Users } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useTRPC } from '@/lib/trpc/react'

export function BroadcastDialog() {
  const trpc = useTRPC()
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')

  // Audience filters — independent from the contacts table
  const [nameSearch, setNameSearch] = useState('')
  const [openedMiniAppOnly, setOpenedMiniAppOnly] = useState(false)
  const [lastActiveDays, setLastActiveDays] = useState<number | undefined>()

  const audienceQuery = useQuery(
    trpc.telegram.audienceCount.queryOptions({
      nameSearch: nameSearch || undefined,
      openedMiniAppOnly: openedMiniAppOnly || undefined,
      lastActiveDays,
    }),
  )

  const recipientCount = audienceQuery.data?.total ?? 0

  const broadcast = useMutation(
    trpc.telegram.broadcastMessage.mutationOptions({
      onSuccess: (result) => {
        toast.success(
          `Broadcast complete: ${result.sent} sent, ${result.blocked} blocked, ${result.failed} failed`,
        )
        setOpen(false)
        setText('')
        setNameSearch('')
        setOpenedMiniAppOnly(false)
        setLastActiveDays(undefined)
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
      nameSearch: nameSearch || undefined,
      openedMiniAppOnly: openedMiniAppOnly || undefined,
      lastActiveDays,
    })
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size="sm" type="button" variant="default">
          <Send className="mr-2 h-4 w-4" />
          Broadcast
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Broadcast Message</DialogTitle>
        </DialogHeader>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Audience filters */}
          <div className="space-y-3 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Audience</span>
              <div className="flex items-center gap-1.5 text-sm">
                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                {audienceQuery.isLoading ? (
                  <span className="text-muted-foreground">…</span>
                ) : (
                  <span className="font-medium">
                    {recipientCount} recipient{recipientCount !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="audience-name">Search by name / username</Label>
              <Input
                id="audience-name"
                onChange={(e) => setNameSearch(e.target.value)}
                placeholder="e.g. john"
                value={nameSearch}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="opened-mini-app">Opened Mini App only</Label>
              <Switch
                checked={openedMiniAppOnly}
                id="opened-mini-app"
                onCheckedChange={setOpenedMiniAppOnly}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="last-active">Last active</Label>
              <Select
                onValueChange={(v) =>
                  setLastActiveDays(v === 'all' ? undefined : Number(v))
                }
                value={lastActiveDays?.toString() ?? 'all'}
              >
                <SelectTrigger id="last-active">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All time</SelectItem>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-1">
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
              disabled={
                !text.trim() ||
                recipientCount === 0 ||
                broadcast.isPending ||
                audienceQuery.isLoading
              }
              type="submit"
            >
              {broadcast.isPending
                ? 'Sending…'
                : `Send to ${recipientCount} contact${recipientCount !== 1 ? 's' : ''}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
