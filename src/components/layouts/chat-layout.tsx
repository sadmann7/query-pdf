import { chatConfig } from "@/config/chat"
import Meta from "@/components/layouts/meta"
import { SidebarNav } from "@/components/layouts/sidebar-nav"
import { SiteFooter } from "@/components/layouts/site-footer"
import { SiteHeader } from "@/components/layouts/site-header"
import { ScrollArea } from "@/components/ui/scroll-area"

interface LayoutProps {
  children: React.ReactNode
}

export function ChatLayout({ children }: LayoutProps) {
  return (
    <>
      <Meta />
      <div className="relative flex h-full w-full overflow-hidden">
        <div className="flex h-screen max-w-full flex-1 flex-col">
          <SiteHeader />
          {children}
          <SiteFooter />
        </div>
      </div>
    </>
  )
}
