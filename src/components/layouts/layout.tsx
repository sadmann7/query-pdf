import Meta from "@/components/layouts/meta"
import { SiteFooter } from "@/components/layouts/site-footer"
import { SiteHeader } from "@/components/layouts/site-header"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <>
      <Meta />
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="container flex-1">{children}</main>
        <SiteFooter />
      </div>
    </>
  )
}
