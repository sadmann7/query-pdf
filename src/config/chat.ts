import type { NavItem, SidebarNavItem } from "@/types/nav"
import { Icons } from "@/components/icons"

export interface ChatConfig {
  name?: string
  description?: string
  links?: Record<string, string>
  mainNav: NavItem[]
  sidebarNav?: SidebarNavItem[]
}

export const chatConfig = {
  mainNav: [
    {
      title: "Chats",
      href: "/chats",
    },
  ],
  sidebarNav: [
    {
      title: "New Chat",
      icon: Icons.plus,
      href: "/",
    },
  ],
}
