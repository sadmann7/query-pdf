import type { Chat, Message } from "@/types"
import { create } from "zustand"
import { createJSONStorage, devtools, persist } from "zustand/middleware"

type ChatState = {
  chats: Chat[]
  addChat: (id: string, name: string, messages: Message[]) => void
  editChat: (id: string, name: string) => void
  removeChat: (id: string) => void
  messages: Message[]
  addMessage: (message: Message) => void
  removeMessage: (message: string) => void
  removeMessages: (messages: string[]) => void
}

export const useChatStore = create<ChatState>()(
  devtools(
    persist(
      (set) => ({
        chats: [],
        addChat: (id, name, messages) =>
          set((state) => ({
            chats: state.chats.some((chat) => chat.chatId === id)
              ? state.chats
              : [
                  ...state.chats,
                  { chatId: id, chatName: name, messages: messages },
                ],
          })),
        editChat: (id, name) =>
          set((state) => ({
            chats: state.chats.map((chat) =>
              chat.chatId === id ? { ...chat, chatName: name } : chat
            ),
          })),
        removeChat: (id) =>
          set((state) => ({
            chats: state.chats.filter((chat) => chat.chatId !== id),
          })),
        messages: [],
        addMessage: (message) =>
          set((state) => ({ messages: [...state.messages, message] })),
        removeMessage: (message) =>
          set((state) => ({
            messages: state.messages.filter((m) => m.message !== message),
          })),
        removeMessages: (messages) =>
          set((state) => ({
            messages: state.messages.filter(
              (m) => !messages.includes(m.message)
            ),
          })),
      }),
      {
        name: "chat",
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
)
