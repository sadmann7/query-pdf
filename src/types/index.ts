import type { Document } from "langchain/document"

import type { NavItem, SidebarNavItem } from "@/types/nav"

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>

export interface GlobalConfig {
  name?: string
  description?: string
  links?: Record<string, string>
  mainNav: NavItem[]
  sidebarNav?: SidebarNavItem[]
}

export type IngestResponse = {
  message: string
  chatId: string
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

export type Chat = {
  id: string
  name: string
  messages: Message[]
  sources?: Document[]
}
