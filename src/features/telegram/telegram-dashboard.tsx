'use client'

import { useQuery } from '@tanstack/react-query'
import { MessageCircle, MessagesSquare, Send, Users } from 'lucide-react'
import { useState } from 'react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useTRPC } from '@/lib/trpc/react'

import { ChatHistoryDrawer } from './chat-history-drawer'

export function TelegramDashboard() {
  const trpc = useTRPC()
  const { data: stats, isLoading: statsLoading } = useQuery(
    trpc.telegram.getStats.queryOptions(),
  )
  const { data: contacts, isLoading: contactsLoading } = useQuery(
    trpc.telegram.getContacts.queryOptions(),
  )

  const [selectedUser, setSelectedUser] = useState<{
    telegramUserId: number
    username: string | null
    firstName: string | null
  } | null>(null)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Telegram Bot Dashboard
        </h1>
        <p className="text-muted-foreground">
          Monitor bot conversations and engagement
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Contacts
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? '...' : (stats?.totalContacts ?? 0)}
            </div>
            <CardDescription>Unique users who messaged the bot</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Messages
            </CardTitle>
            <MessagesSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? '...' : (stats?.totalMessages ?? 0)}
            </div>
            <CardDescription>All messages sent and received</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Messages Today
            </CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? '...' : (stats?.messagesToday ?? 0)}
            </div>
            <CardDescription>Messages in the last 24 hours</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Messages This Week
            </CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? '...' : (stats?.messagesThisWeek ?? 0)}
            </div>
            <CardDescription>Messages since start of week</CardDescription>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contacts</CardTitle>
          <CardDescription>
            Click a row to view conversation history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Sent</TableHead>
                <TableHead className="text-right">Received</TableHead>
                <TableHead>Last Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contactsLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : !contacts?.length ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground"
                  >
                    No contacts yet
                  </TableCell>
                </TableRow>
              ) : (
                contacts.map((contact) => (
                  <TableRow
                    key={contact.id}
                    className="cursor-pointer"
                    onClick={() =>
                      setSelectedUser({
                        telegramUserId: contact.telegramUserId,
                        username: contact.username,
                        firstName: contact.firstName,
                      })
                    }
                  >
                    <TableCell className="font-medium">
                      {contact.username
                        ? `@${contact.username}`
                        : contact.telegramUserId}
                    </TableCell>
                    <TableCell>
                      {[contact.firstName, contact.lastName]
                        .filter(Boolean)
                        .join(' ') || '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      {contact.messagesSent}
                    </TableCell>
                    <TableCell className="text-right">
                      {contact.messagesReceived}
                    </TableCell>
                    <TableCell>
                      {new Date(contact.lastMessageAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedUser && (
        <ChatHistoryDrawer
          open={!!selectedUser}
          onOpenChange={(open: boolean) => {
            if (!open) setSelectedUser(null)
          }}
          telegramUserId={selectedUser.telegramUserId}
          username={selectedUser.username}
          firstName={selectedUser.firstName}
        />
      )}
    </div>
  )
}
