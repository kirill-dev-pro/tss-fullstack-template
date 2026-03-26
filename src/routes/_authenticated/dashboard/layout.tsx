import {
  createFileRoute,
  Link,
  Outlet,
  useLocation,
} from '@tanstack/react-router'
import { Fragment } from 'react'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { AppSidebar } from '@/features/app/app-sidebar'

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  const location = useLocation()
  const pathname = location.pathname

  const segments = pathname
    .split('/')
    .filter(Boolean)
    .filter((s) => s !== '_authenticated')
  const breadcrumb = segments.map((segment, index) => ({
    label: segment,
    href: `/_authenticated/${segments.slice(0, index + 1).join('/')}`,
  }))
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator className="mr-2 h-4" orientation="vertical" />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumb.map((item, index) => (
                  <Fragment key={item.href}>
                    <BreadcrumbItem className="hidden md:block">
                      <Link
                        to={item.href}
                        className="flex items-center gap-2 text-sm capitalize transition-colors hover:text-foreground"
                      >
                        {item.label}
                      </Link>
                    </BreadcrumbItem>
                    {index < breadcrumb.length - 1 && (
                      <BreadcrumbSeparator className="hidden md:block" />
                    )}
                  </Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
