import { useQueryClient } from '@tanstack/react-query'
import {
  Ban,
  CheckCircle,
  RefreshCw,
  Shield,
  UserCheck,
  UserPlus,
  Users,
} from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'

import type { InfiniteQueryMeta } from '@/lib/data-table'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import {
  type AdminUserRow,
  AdminUsersDataTable,
  AdminUsersExportButton,
  adminUsersStatsFromMeta,
} from '@/features/admin/admin-users-data-table'
import { adminUsersTableQueryKeyPrefix } from '@/features/admin/admin-users-table-schema'
import { UserDetailsDrawer } from '@/features/admin/user-details-drawer'
import {
  useBanUser,
  useCreateUser,
  useDeleteUser,
  useImpersonateUser,
  useRevokeUserSessions,
  useSetUserRole,
  useUnbanUser,
} from '@/features/user/user-hooks'
import { authClient } from '@/lib/auth/auth-client'
import {
  canBanUsers,
  canCreateUsers,
  canDeleteUsers,
  canImpersonateUsers,
  canManageUsers,
  canSetUserRoles,
  type UserRole,
} from '@/lib/auth/permissions'

interface DrawerUser {
  id: string
  name: string
  email: string
  role: string
  emailVerified: boolean
  banned: boolean
  createdAt: Date
  image?: string
}

function toDrawerUser(row: AdminUserRow): DrawerUser {
  return {
    id: row.id,
    name: row.name || 'Unknown',
    email: row.email,
    role: row.role || 'user',
    emailVerified: row.emailVerified,
    banned: row.banned ?? false,
    createdAt:
      row.createdAt instanceof Date ? row.createdAt : new Date(row.createdAt),
    image: row.image ?? undefined,
  }
}

function CreateUserDialog() {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<{
    name: string
    email: string
    password: string
    role: UserRole
  }>({
    name: '',
    email: '',
    password: '',
    role: 'user',
  })

  const { mutate: createUser, isPending } = useCreateUser()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createUser(
      {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      },
      {
        onSuccess: () => {
          setOpen(false)
          setFormData({
            name: '',
            email: '',
            password: '',
            role: 'user',
          })
        },
      },
    )
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size="sm" type="button">
          <UserPlus className="mr-2 h-4 w-4" />
          Create User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            Create a new user account with the specified details.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              value={formData.name}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              type="email"
              value={formData.email}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              type="password"
              value={formData.password}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  role: value as UserRole,
                })
              }
              value={formData.role}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="superadmin">Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              onClick={() => setOpen(false)}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button disabled={isPending} type="submit">
              {isPending ? 'Creating...' : 'Create User'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function AdminUsersPage() {
  const { data: session } = authClient.useSession()
  const [tableMeta, setTableMeta] = useState<InfiniteQueryMeta | undefined>()
  const [selectedUser, setSelectedUser] = useState<DrawerUser | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const { mutate: banUser } = useBanUser()
  const { mutate: unbanUser } = useUnbanUser()
  const { mutate: deleteUser } = useDeleteUser()
  const { mutate: setUserRole } = useSetUserRole()
  const { mutate: impersonateUser } = useImpersonateUser()
  const { mutate: revokeUserSessions } = useRevokeUserSessions()

  const currentUserRole = (session?.user?.role as UserRole) || 'user'

  const stats = useMemo(() => adminUsersStatsFromMeta(tableMeta), [tableMeta])

  const handleUserAction = useCallback(
    (action: string, userId: string, userRole?: string) => {
      switch (action) {
        case 'ban': {
          if (canBanUsers(currentUserRole)) {
            banUser({ userId })
          }
          break
        }
        case 'unban': {
          if (canBanUsers(currentUserRole)) {
            unbanUser({ userId })
          }
          break
        }
        case 'delete': {
          if (canDeleteUsers(currentUserRole)) {
            deleteUser({ userId })
          }
          break
        }
        case 'setRole': {
          if (canSetUserRoles(currentUserRole) && userRole) {
            setUserRole({ userId, role: userRole as UserRole })
          }
          break
        }
        case 'impersonate': {
          if (canImpersonateUsers(currentUserRole)) {
            impersonateUser({ userId })
          }
          break
        }
        case 'revokeSession': {
          if (canManageUsers(currentUserRole)) {
            revokeUserSessions({ userId })
          }
          break
        }
      }
    },
    [
      banUser,
      currentUserRole,
      deleteUser,
      impersonateUser,
      revokeUserSessions,
      setUserRole,
      unbanUser,
    ],
  )

  const onViewUser = useCallback((row: AdminUserRow) => {
    setSelectedUser(toDrawerUser(row))
    setDrawerOpen(true)
  }, [])

  if (!canManageUsers(currentUserRole)) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <Shield className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-muted-foreground">
            Access Denied
          </h3>
          <p className="text-sm text-muted-foreground">
            You don&apos;t have permission to access admin features.
          </p>
        </div>
      </div>
    )
  }

  const activeApprox = Math.max(0, stats.verified - stats.banned)

  return (
    <div className="w-full max-w-full min-w-0 space-y-6 py-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage users, roles, and permissions
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {activeApprox}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <UserCheck className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {stats.pending}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Banned</CardTitle>
            <Ban className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.banned}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Shield className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {stats.admins}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="min-w-0 p-0">
        <AdminUsersDataTable
          currentUserRole={currentUserRole}
          onTableMetaChange={setTableMeta}
          onUserAction={handleUserAction}
          onViewUser={onViewUser}
          toolbarActions={
            <div className="flex items-center gap-2">
              <ToolbarRefresh />
              <AdminUsersExportButton />
              {canCreateUsers(currentUserRole) && <CreateUserDialog />}
            </div>
          }
        />
      </Card>

      <UserDetailsDrawer
        currentUserRole={currentUserRole}
        onOpenChange={setDrawerOpen}
        open={drawerOpen}
        user={selectedUser}
      />
    </div>
  )
}

function ToolbarRefresh() {
  const queryClient = useQueryClient()
  return (
    <Button
      onClick={() => {
        void queryClient.invalidateQueries({
          queryKey: [adminUsersTableQueryKeyPrefix],
        })
      }}
      size="sm"
      type="button"
      variant="outline"
    >
      <RefreshCw className="mr-2 h-4 w-4" />
      Refresh
    </Button>
  )
}
