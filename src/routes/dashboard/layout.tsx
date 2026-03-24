import { createFileRoute, Outlet, useLocation } from '@tanstack/react-router'
import { Fragment } from 'react'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
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
import { AuthProvider } from '@/features/auth/auth-provider'

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  const location = useLocation()
  const pathname = location.pathname

  const paths = pathname.split('/')
  const breadcrumb = paths.map((path) => ({
    label: path,
    href: `/${path}`,
  }))
  return (
    <AuthProvider>
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
                        <BreadcrumbLink
                          className="flex items-center gap-2 text-sm capitalize"
                          href={item.href}
                        >
                          {item.label}
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      {index < breadcrumb.length - 1 && index !== 0 && (
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
    </AuthProvider>
  )
}
