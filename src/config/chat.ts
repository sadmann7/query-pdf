import type { Config } from "@/types"

import { Icons } from "@/components/icons"

export const chatConfig: Config = {
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
