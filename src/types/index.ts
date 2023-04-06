import * as React from "react"
import { Document } from "langchain/document"

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>

export type Message = {
  type: "apiMessage" | "userMessage"
  message: string
  isStreaming?: boolean
  sourceDoc?: Document
}
