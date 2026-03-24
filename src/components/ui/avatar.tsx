import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { Facehash } from 'facehash'
import * as React from 'react'

import { cn } from '@/lib/utils'

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
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback> & {
  name?: string
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
      {name ? <Facehash name={name} size="100%" /> : props.children}
    </AvatarPrimitive.Fallback>
  )
}

export { Avatar, AvatarImage, AvatarFallback }
