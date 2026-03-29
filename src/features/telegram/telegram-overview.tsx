'use client'

import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { MessagesSquare, MessageSquare, Send, Users } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { TelegramMiniAppPreview } from '@/features/telegram/telegram-mini-app-preview'
import { useTRPC } from '@/lib/trpc/react'

export function TelegramOverview() {
  const trpc = useTRPC()
  const { data: stats, isLoading } = useQuery(
    trpc.telegram.getStats.queryOptions(),
  )

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
              {isLoading ? '...' : (stats?.totalContacts ?? 0)}
            </div>
            <CardDescription>Unique users who messaged the bot</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Chats</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : (stats?.totalChats ?? 0)}
            </div>
            <CardDescription>Private and group conversations</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Messages Today
            </CardTitle>
            <MessagesSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : (stats?.messagesToday ?? 0)}
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
              {isLoading ? '...' : (stats?.messagesThisWeek ?? 0)}
            </div>
            <CardDescription>Messages since start of week</CardDescription>
          </CardContent>
        </Card>
      </div>

      <TelegramMiniAppPreview />

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Chats
            </CardTitle>
            <CardDescription>
              View all conversations including group chats
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/dashboard/telegram/chats">
              <Button variant="outline">Open Chats Table</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Contacts
            </CardTitle>
            <CardDescription>
              Manage individual contacts and broadcast messages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/dashboard/telegram/contacts">
              <Button variant="outline">Open Contacts Table</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
