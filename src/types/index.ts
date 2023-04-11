import type { Document } from "langchain/document"

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>

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
