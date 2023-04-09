import type { Document } from "langchain/document"

import type { NavItem, SidebarNavItem } from "@/types/nav"

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>

export interface Config {
  name?: string
  description?: string
  links?: Record<string, string>
  mainNav: NavItem[]
  sidebarNav?: SidebarNavItem[]
}

export type Message = {
  type: "bot" | "user"
  message: string
  isStreaming?: boolean
  sourceDocs?: Document[]
}

export type MessageState = {
  messages: Message[]
  pending?: string
  history: [string, string][]
  pendingSourceDocs?: Document[]
}

export type IngestResponse = {
  message: string
  chatId: string
}
