import { Link, useLocation } from '@tanstack/react-router'
import { Folder, Forward, type LucideIcon, Trash2 } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

function normalizePathname(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1)
  }
  return pathname
}

/** Picks the most specific nav href for the current path (exact or longest prefix). */
function getLongestMatchingNavUrl(
  pathname: string,
  navUrls: readonly string[],
): string | null {
  const path = normalizePathname(pathname)
  const matches = navUrls.filter((url) => {
    const u = normalizePathname(url)
    if (path === u) {
      return true
    }
    return path.startsWith(`${u}/`)
  })
  if (matches.length === 0) {
    return null
  }
  return matches.reduce((a, b) =>
    normalizePathname(a).length >= normalizePathname(b).length ? a : b,
  )
}

export function NavItems({
  items,
  label,
}: {
  items: {
    name: string
    url: string
    icon: LucideIcon
  }[]
  label: string
}) {
  const { isMobile } = useSidebar()
  const pathname = useLocation({ select: (loc) => loc.pathname })
  const navUrls = items.map((item) => item.url)
  const activeUrl = getLongestMatchingNavUrl(pathname, navUrls)

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton
              asChild
              isActive={item.url === activeUrl}
              tooltip={item.name}
            >
              <Link to={item.url}>
                <item.icon />
                <span className="truncate group-data-[collapsible=icon]:sr-only">
                  {item.name}
                </span>
              </Link>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuContent
                align={isMobile ? 'end' : 'start'}
                className="w-48 rounded-lg"
                side={isMobile ? 'bottom' : 'right'}
              >
                <DropdownMenuItem>
                  <Folder className="text-muted-foreground" />
                  <span>View Project</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Forward className="text-muted-foreground" />
                  <span>Share Project</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Trash2 className="text-muted-foreground" />
                  <span>Delete Project</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
