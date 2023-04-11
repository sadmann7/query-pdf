import type { GlobalConfig } from "@/types"

import { Icons } from "@/components/icons"

export const chatConfig: GlobalConfig = {
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
