import { chatConfig } from "@/config/chat"
import { Layout } from "@/components/layouts/layout"
import { SidebarNav } from "@/components/layouts/sidebar-nav"
import { ScrollArea } from "@/components/ui/scroll-area"

interface LayoutProps {
  children: React.ReactNode
}

export function ChatLayout({ children }: LayoutProps) {
  return (
    <Layout>
      <div className="flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <aside className="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r border-r-slate-100 dark:border-r-slate-700 md:sticky md:block">
          <ScrollArea className="pr-6 lg:py-7">
            <SidebarNav items={chatConfig.sidebarNav} />
          </ScrollArea>
        </aside>
        {children}
      </div>
    </Layout>
  )
}
