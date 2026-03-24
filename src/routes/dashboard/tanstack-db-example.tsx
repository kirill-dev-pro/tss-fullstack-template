import { eq } from '@tanstack/db'
import { queryCollectionOptions } from '@tanstack/query-db-collection'
import { createCollection, useLiveQuery } from '@tanstack/react-db'
import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { useTRPC } from '@/lib/trpc/react'
import { trpcClient } from '@/lib/trpc/root-provider'

export const Route = createFileRoute('/dashboard/tanstack-db-example')({
  component: TanStackDBExample,
})

interface Todo {
  id: number
  text: string
  completed: boolean
}

function TanStackDBExample() {
  const [newTodo, setNewTodo] = useState('')
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  // Collection with optimistic update handlers
  const todos = useMemo(
    () =>
      createCollection(
        queryCollectionOptions<Todo>({
          queryKey: ['todos'],
          queryFn: async (): Promise<Todo[]> => {
            const data = await queryClient.fetchQuery(
              trpc.todo.getAll.queryOptions(),
            )
            return (data ?? []) as Todo[]
          },
          queryClient,
          getKey: (item) => item.id,

          // Optimistic insert: item appears in UI immediately
          onInsert: async ({ transaction }) => {
            await Promise.all(
              transaction.mutations.map((m) =>
                trpcClient.todo.create.mutate(m.modified as { text: string }),
              ),
            )
          },

          // Optimistic update: UI updates immediately, rolls back on error
          onUpdate: async ({ transaction }) => {
            await Promise.all(
              transaction.mutations.map((m) => {
                const todo = m.modified as Todo
                return trpcClient.todo.toggle.mutate({
                  id: todo.id,
                  completed: todo.completed,
                })
              }),
            )
          },

          // Optimistic delete: item removed from UI immediately
          onDelete: async ({ transaction }) => {
            await Promise.all(
              transaction.mutations.map((m) =>
                trpcClient.todo.delete.mutate({ id: m.key as number }),
              ),
            )
          },
        }),
      ),
    [queryClient, trpc],
  )

  // Live queries - auto-update with optimistic changes
  const allResult = useLiveQuery((q) => q.from({ t: todos }))
  const pendingResult = useLiveQuery((q) =>
    q.from({ t: todos }).where(({ t }) => eq(t.completed, false)),
  )
  const completedResult = useLiveQuery((q) =>
    q.from({ t: todos }).where(({ t }) => eq(t.completed, true)),
  )

  const isLoading = allResult.isLoading

  // Collection operations - optimistic updates happen automatically
  const handleCreate = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (newTodo.trim()) {
        todos.insert({ text: newTodo, completed: false } as Todo)
        setNewTodo('')
      }
    },
    [newTodo, todos],
  )

  const handleToggle = useCallback(
    (id: number, completed: boolean) => {
      todos.update(id, (todo) => {
        todo.completed = !completed
      })
    },
    [todos],
  )

  const handleDelete = useCallback(
    (id: number) => {
      todos.delete(id)
    },
    [todos],
  )

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 py-10">
      <div>
        <h1 className="text-2xl font-bold">TanStack DB</h1>
        <p className="text-sm text-muted-foreground">
          Optimistic updates — changes appear instantly, rollback on error
        </p>
      </div>

      <form className="flex gap-2" onSubmit={handleCreate}>
        <Input
          className="flex-1"
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="What needs to be done?"
          value={newTodo}
        />
        <Button disabled={!newTodo.trim()} type="submit">
          <Plus className="h-4 w-4" />
        </Button>
      </form>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <TodoList
          empty="No todos yet"
          isLoading={isLoading}
          items={allResult.data}
          onDelete={handleDelete}
          onToggle={handleToggle}
          title={`All (${allResult.data?.length ?? 0})`}
        />
        <TodoList
          empty="All done!"
          isLoading={isLoading}
          items={pendingResult.data}
          onDelete={handleDelete}
          onToggle={handleToggle}
          title={`Pending (${pendingResult.data?.length ?? 0})`}
        />
        <TodoList
          empty="Nothing completed yet"
          isLoading={isLoading}
          items={completedResult.data}
          onDelete={handleDelete}
          onToggle={handleToggle}
          title={`Done (${completedResult.data?.length ?? 0})`}
        />
      </div>
    </div>
  )
}

function TodoList({
  title,
  items,
  empty,
  isLoading,
  onToggle,
  onDelete,
}: {
  title: string
  items: Todo[] | undefined
  empty: string
  isLoading: boolean
  onToggle: (id: number, completed: boolean) => void
  onDelete: (id: number) => void
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : !items?.length ? (
          <p className="py-6 text-center text-xs text-muted-foreground">
            {empty}
          </p>
        ) : (
          <ul className="space-y-1">
            {items.map((todo) => (
              <li
                className="group flex items-center gap-2 rounded px-2 py-1.5 hover:bg-muted/50"
                key={todo.id}
              >
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => onToggle(todo.id, todo.completed)}
                />
                <span
                  className={`flex-1 text-sm ${todo.completed ? 'text-muted-foreground line-through' : ''}`}
                >
                  {todo.text}
                </span>
                <button
                  className="opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
                  onClick={() => onDelete(todo.id)}
                  type="button"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
