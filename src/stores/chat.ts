import type { Chat, Message, MessageState, SetState } from "@/types"
import { create } from "zustand"
import { createJSONStorage, devtools, persist } from "zustand/middleware"

type ChatState = {
  chats: Chat[]
  addChat: (id: string, name: string, messages: Message[]) => void
  updateChat: (id: string, messages: Message[]) => void
  removeChat: (id: string) => void
  messageState: MessageState
  setMessageState: (fn: (state: MessageState) => MessageState) => void
}

export const useChatStore = create<ChatState>()(
  devtools(
    persist(
      (set) => ({
        chats: [],
        addChat: (id, name, messages) =>
          set((state) => ({
            chats: state.chats.some((chat) => chat.id === id)
              ? state.chats
              : [...state.chats, { id, name, messages }],
          })),
        updateChat: (id, messages) =>
          set((state) => ({
            //  find the chat with the id and update the messages
            chats: state.chats.map((chat) =>
              chat.id === id ? { ...chat, messages } : chat
            ),
          })),
        removeChat: (id) =>
          set((state) => ({
            chats: state.chats.filter((chat) => chat.id !== id),
          })),
        messageState: {
          messages: [
            {
              type: "bot",
              message: "Hi, what would you like to learn about this PDF?",
            },
          ],
          history: [],
          pendingSourceDocs: [],
        },
        setMessageState: (fn) =>
          set((state) => ({
            messageState: fn(state.messageState),
          })),
      }),
      {
        name: "chat-store",
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
)
