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
      <div className="flex h-full w-full overflow-hidden">
        <div className="flex h-screen max-w-full flex-1 flex-col">
          <SiteHeader config={chatConfig} />
          <main className="relative flex h-full w-full flex-1 flex-col items-stretch overflow-hidden md:grid md:grid-cols-[220px_minmax(0,1fr)] md:items-start lg:grid-cols-[240px_minmax(0,1fr)]">
            <aside className="fixed top-0 z-30 hidden h-full w-full shrink-0 overflow-y-auto border-r border-r-slate-400 dark:border-r-slate-600 md:sticky md:block md:pt-7 lg:pt-0">
              <ScrollArea className="h-full pr-6 lg:py-7">
                <div role="presentation" className="container">
                  <SidebarNav items={chatConfig.sidebarNav} />
                </div>
              </ScrollArea>
            </aside>
            {children}
          </main>
          <SiteFooter />
        </div>
      </div>
    </>
  )
}
