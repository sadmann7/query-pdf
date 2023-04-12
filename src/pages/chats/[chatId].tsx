import { useEffect, useMemo, useRef, useState } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import { NextPageWithLayout } from "@/pages/_app"
import { useChatStore } from "@/stores/chat"
import type { Message, MessageState } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { fetchEventSource } from "@microsoft/fetch-event-source"
import { Send, X } from "lucide-react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { toast } from "react-hot-toast"
import ReactMarkdown from "react-markdown"
import { z } from "zod"

import { cn } from "@/lib/utils"
import { ChatLayout } from "@/components/layouts/chat-layout"
import { Button } from "@/components/ui/button"
import LoadingDots from "@/components/ui/loading-dots"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"

const schema = z.object({
  query: z.string().min(1),
})
type Inputs = z.infer<typeof schema>

const Chat: NextPageWithLayout = () => {
  const router = useRouter()
  const { chatId } = router.query as { chatId: string }

  // chat store
  const { chats } = useChatStore()

  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [messageState, setMessageState] = useState<MessageState>({
    messages: [
      {
        type: "bot",
        message: "Hi, what would you like to learn about this PDF?",
      },
    ],
    history: [],
    pendingSourceDocs: [],
  })

  const { messages, pending, history, pendingSourceDocs } = messageState

  // react-hook-form
  const { register, handleSubmit, formState, watch, reset, setFocus } =
    useForm<Inputs>({
      resolver: zodResolver(schema),
    })
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data)

    const question = data.query.trim()
    setQuery(question)

    setMessageState((state) => ({
      ...state,
      messages: [
        ...state.messages,
        {
          type: "user",
          message: question,
        },
      ],
      pending: undefined,
    }))

    setIsLoading(true)
    reset()
    setMessageState((state) => ({ ...state, pending: "" }))

    const ctrl = new AbortController()

    try {
      fetchEventSource("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId,
          question,
          history,
        }),
        signal: ctrl.signal,
        onmessage: (event) => {
          setIsLoading(false)
          setIsStreaming(true)
          if (event.data === "[DONE]") {
            // end the stream
            ctrl.abort()
          } else {
            // stream the messages
            setMessageState((state) => ({
              ...state,
              pending: (state.pending ?? "") + event.data,
            }))
            event.data.length === 0 && setIsStreaming(false)
          }
        },
      })
    } catch (error: unknown) {
      setIsLoading(false)
      error instanceof Error
        ? toast.error(error.message)
        : toast.error("Something went wrong, please try again")
    }
  }

  // update messages if pending is not undefined
  useEffect(() => {
    if (!isStreaming && pending && query) {
      setMessageState((state) => ({
        ...state,
        history: [...state.history, [query, state.pending ?? ""]],
        messages: [
          ...state.messages,
          {
            type: "bot",
            message: state.pending ?? "",
          },
        ],
        pending: undefined,
        pendingSourceDocs: undefined,
      }))
    }
  }, [isStreaming, pending, pendingSourceDocs, query, watch])

  // memoize the messages if pending is not undefined
  const memoedMessages = useMemo(() => {
    // add loading message if isLoading is true and remove it if it's false
    if (isLoading) {
      return [
        ...messages,
        {
          type: "bot",
          message: "Loading...",
        },
      ]
    } else {
      const loadingMessageIndex = messages.findIndex(
        (message) => message.message === "Loading..."
      )
      if (loadingMessageIndex !== -1) {
        messages.splice(loadingMessageIndex, 1)
      }
    }
    if (pending) {
      return [
        ...messages,
        {
          type: "bot",
          message: pending,
          sourceDocs: pendingSourceDocs,
        },
      ]
    }
    return messages
  }, [isLoading, messages, pending, pendingSourceDocs]) satisfies Message[]

  // scroll to bottom of chat
  const endMessageRef = useRef<HTMLDivElement>(null)
  const chatRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!endMessageRef.current) return
    endMessageRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    })
  }, [memoedMessages])

  // auto focus on textarea
  useEffect(() => {
    setFocus("query")
  }, [setFocus, isStreaming])

  console.log({
    isLoading,
    memoedMessages,
    history,
  })

  return (
    <>
      <Head>
        <title>Chat | Chat with PDF</title>
      </Head>
      <ScrollArea className="h-full w-full">
        <div className="container h-full w-full max-w-4xl flex-1 overflow-y-auto overflow-x-hidden">
          <div className="absolute left-1/2 top-0 w-full -translate-x-1/2 bg-white py-5 text-center text-base font-bold leading-tight tracking-normal dark:bg-zinc-900 sm:text-lg md:text-xl lg:text-2xl">
            <h1 className="line-clamp-1">
              Chat with {chats[chats.length - 1]?.name ?? "your PDF"}
            </h1>
          </div>
          <div ref={chatRef} className="mb-24 mt-20">
            {memoedMessages.map((message, i) =>
              message.type === "bot" ? (
                <div
                  key={i}
                  className="my-4 w-fit rounded-md border border-slate-300 bg-zinc-200/25 px-2.5 py-1.5 text-sm text-slate-950 dark:border-slate-500 dark:bg-zinc-700/75 dark:text-slate-50"
                >
                  {isLoading && message.message === "Loading..." ? (
                    <LoadingDots color="#64748b" />
                  ) : (
                    <ReactMarkdown linkTarget="_blank">
                      {message.message}
                    </ReactMarkdown>
                  )}
                </div>
              ) : (
                <div key={i} className="flex items-center justify-end gap-2.5">
                  <div className="flex flex-col items-end gap-1.5">
                    <div className="flex items-center gap-2.5">
                      <div className="rounded-md border border-slate-300 bg-blue-500 px-2.5 py-1.5 text-sm text-slate-50 dark:border-slate-500 dark:bg-blue-600">
                        <ReactMarkdown linkTarget="_blank">
                          {message.message}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
            <div ref={endMessageRef} />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 mt-2.5 w-full bg-white dark:bg-zinc-900">
          <form
            className="container mx-auto mb-5 flex max-w-4xl flex-row gap-3"
            onSubmit={handleSubmit(onSubmit)}
          >
            <fieldset className="relative flex w-full flex-col gap-2.5">
              <label htmlFor="query" className="sr-only">
                Type your question
              </label>
              <Textarea
                id="query"
                name="query"
                placeholder="Type your question..."
                className={cn(
                  "h-18 resize-none border-slate-700 py-3 pl-4 pr-16 placeholder:text-slate-600 dark:border-slate-400 dark:placeholder:text-slate-400 xxs:h-12",
                  "flex w-full grow flex-col rounded-md border bg-white shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:bg-zinc-800 dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]",
                  formState.errors.query && "border-red-500"
                )}
                onKeyDown={(e) => {
                  if (isLoading) return
                  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                    handleSubmit(onSubmit)()
                  }
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleSubmit(onSubmit)()
                  }
                }}
                {...register("query", { required: true })}
                disabled={isLoading || isStreaming}
              />
              <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
                {watch("query") && (
                  <>
                    <Button
                      type="button"
                      aria-label="Clear query"
                      size="sm"
                      variant="ghost"
                      className="h-auto rounded-full p-0 text-slate-600 dark:text-slate-400"
                      onClick={() => {
                        reset()
                      }}
                    >
                      <X className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    <span className="h-5 w-px bg-slate-400 dark:bg-slate-600" />
                  </>
                )}
                <Button
                  aria-label="Chat"
                  variant="ghost"
                  className="h-auto rounded-full p-0.5 text-slate-500 dark:text-slate-500"
                  disabled={isLoading || isStreaming}
                >
                  <Send className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </fieldset>
          </form>
        </div>
      </ScrollArea>
    </>
  )
}

export default Chat

Chat.getLayout = (page) => <ChatLayout>{page}</ChatLayout>
