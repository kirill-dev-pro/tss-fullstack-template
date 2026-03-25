'use client'

import { useMutation } from '@tanstack/react-query'
import { Send } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

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

export function BroadcastDialog({ contactCount }: { contactCount: number }) {
  const trpc = useTRPC()
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')

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
    broadcast.mutate({ text: text.trim() })
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
          <DialogDescription>
            Send a message to all non-blocked contacts.
            {contactCount > 0 && (
              <span className="mt-1 block font-medium text-foreground">
                Will send to {contactCount} contact
                {contactCount !== 1 ? 's' : ''}.
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
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
              disabled={!text.trim() || broadcast.isPending}
              type="submit"
            >
              {broadcast.isPending ? 'Sending...' : 'Send Broadcast'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
