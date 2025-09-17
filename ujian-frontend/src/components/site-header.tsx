"use client"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb"
import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"

function generateBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean)

  const breadcrumbs = [{ label: "Home", href: "/" }]

  // Map of path segments to readable labels
  const pathLabels: Record<string, string> = {
    "berkas-mahasiswa": "Berkas Mahasiswa",
    "pengajuan-judul": "Pengajuan Judul",
    "judul-diterima": "Judul Diterima",
    "judul-ditolak": "Judul Ditolak",
    profile: "Profile Mahasiswa",
    dashboard: "Dashboard",
  }

  const filteredSegments = segments.filter((segment) => segment !== "mahasiswa")

  let currentPath = ""
  filteredSegments.forEach((segment, index) => {
    // Build the actual path including skipped segments for correct navigation
    const originalIndex = segments.indexOf(segment)
    currentPath = "/" + segments.slice(0, originalIndex + 1).join("/")

    const label = pathLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)

    breadcrumbs.push({
      label,
      href: currentPath,
      isLast: index === filteredSegments.length - 1,
    })
  })

  return breadcrumbs
}

export function SiteHeader() {
  const pathname = usePathname()
  const breadcrumbs = generateBreadcrumbs(pathname)

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((breadcrumb, index) => (
              <div key={breadcrumb.href} className="flex items-center">
                <BreadcrumbItem className="hidden md:block">
                  {breadcrumb.isLast ? (
                    <BreadcrumbPage className="font-medium">{breadcrumb.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink
                      href={breadcrumb.href}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {breadcrumb.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 && (
                  <BreadcrumbSeparator className="hidden md:block">
                    <ChevronRight className="h-4 w-4" />
                  </BreadcrumbSeparator>
                )}
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  )
}
