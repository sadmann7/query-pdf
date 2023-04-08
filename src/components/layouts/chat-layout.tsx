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
        <main className="flex h-screen max-w-full flex-1 flex-col">
          <SiteHeader />
          <div className="relative flex h-full w-full flex-1 flex-col items-stretch overflow-hidden md:grid md:grid-cols-[220px_minmax(0,1fr)] md:items-start md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
            <aside className="w-50 fixed left-2.5 z-30 hidden h-full w-52 shrink-0 overflow-y-auto border-r border-r-slate-100 dark:border-r-slate-700 md:sticky md:block">
              <ScrollArea className="h-full pr-6 lg:py-7">
                <SidebarNav items={chatConfig.sidebarNav} />
              </ScrollArea>
            </aside>
            {children}
          </div>
          <SiteFooter />
        </main>
      </div>
    </>
  )
}
