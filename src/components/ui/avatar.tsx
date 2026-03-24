import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { Facehash } from 'facehash'
import * as React from 'react'

import { cn } from '@/lib/utils'

/** Matches design tokens in `src/styles.css` (@theme + accent/chart colors). */
const facehashColors = [
  'bg-primary',
  'bg-accent-orange',
  'bg-accent-green',
  'bg-accent-red',
  'bg-chart-5',
  'bg-info',
  'bg-warning',
]

function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      className={cn(
        'relative flex size-8 shrink-0 overflow-hidden rounded-full',
        className,
      )}
      data-slot="avatar"
      {...props}
    />
  )
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      className={cn('aspect-square size-full', className)}
      data-slot="avatar-image"
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  name,
  email,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback> & {
  name?: string
  email?: string
}) {
  return (
    <AvatarPrimitive.Fallback
      className={cn(
        'flex size-full items-center justify-center rounded-full bg-muted',
        className,
      )}
      data-slot="avatar-fallback"
      {...props}
    >
      {name ? (
        <Facehash
          colorClasses={facehashColors}
          name={`${name} ${email}`}
          size="100%"
        />
      ) : (
        props.children
      )}
    </AvatarPrimitive.Fallback>
  )
}

function UserAvatar({
  user,
  className,
}: {
  user?: { name: string; email?: string; image?: string | null } | null
  className?: string
}) {
  return (
    <Avatar className={className}>
      <AvatarImage src={user?.image ?? undefined} />
      <AvatarFallback
        className={className}
        name={user?.name || 'Anonymous'}
        email={user?.email}
      />
    </Avatar>
  )
}

export { Avatar, AvatarImage, AvatarFallback, UserAvatar }
