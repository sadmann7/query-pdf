import { Document } from "langchain/document"

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>

export type Message = {
  type: "apiMessage" | "userMessage"
  message: string
  isStreaming?: boolean
  sourceDocs?: Document[]
}

export type IngestResponse = {
  message: string
  chatId: string
}
