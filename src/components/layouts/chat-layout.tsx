import * as React from "react"
import { useMounted } from "@/hooks/use-mouted"
import { useChatStore } from "@/stores/chat"

import type { NavItem } from "@/types/nav"
import { chatConfig } from "@/config/chat"
import { Icons } from "@/components/icons"
import Meta from "@/components/layouts/meta"
import { SidebarNav } from "@/components/layouts/sidebar-nav"
import { SiteFooter } from "@/components/layouts/site-footer"
import { SiteHeader } from "@/components/layouts/site-header"
import { ScrollArea } from "@/components/ui/scroll-area"

interface LayoutProps {
  children: React.ReactNode
}

export function ChatLayout({ children }: LayoutProps) {
  // check if the page is mounted
  const isMounted = useMounted()

  // create sidebar nav items from chats
  const { chats } = useChatStore()

  const sidebarNavItems: NavItem[] = [
    {
      title: "New Chat",
      href: "/",
      icon: Icons.plus,
    },
    {
      title: chats[chats.length - 1]?.name,
      href: `/chats/${chats[chats.length - 1]?.id}`,
      icon: Icons.message,
    },
  ]

  return (
    <>
      <Meta />
      {isMounted ? (
        <div className="flex h-screen w-full flex-col overflow-hidden">
          <SiteHeader config={chatConfig} />
          <main className="container relative flex h-full w-full flex-1 flex-col items-stretch overflow-hidden md:grid md:grid-cols-[220px_minmax(0,1fr)] md:items-start lg:grid-cols-[240px_minmax(0,1fr)]">
            <aside className="fixed top-0 z-30 hidden h-full w-full shrink-0 overflow-y-auto border-r border-r-slate-400 dark:border-r-slate-600 md:sticky md:block md:pt-7 lg:pt-0">
              <ScrollArea className="h-full pr-6 lg:py-7">
                <SidebarNav items={sidebarNavItems} />
              </ScrollArea>
            </aside>
            <ScrollArea className="h-full">{children}</ScrollArea>
          </main>
          <SiteFooter />
        </div>
      ) : null}
    </>
  )
}
