import { useEffect, useRef, useState } from "react"
import Head from "next/head"
import { NextPageWithLayout } from "@/pages/_app"
import { zodResolver } from "@hookform/resolvers/zod"
import { Document } from "langchain/document"
import { Send, X } from "lucide-react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { z } from "zod"

import { Message } from "@/types/"
import { cn } from "@/lib/utils"
import { ChatLayout } from "@/components/layouts/chat-layout"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"

const schema = z.object({
  query: z.string().min(1),
})
type Inputs = z.infer<typeof schema>

const Chat: NextPageWithLayout = () => {
  const [sourceDocs, setSourceDocs] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [messageState, setMessageState] = useState<{
    messages: Message[]
    pending?: string
    history: [string, string][]
    pendingSourceDocs?: Document[]
  }>({
    messages: [
      {
        message: "Hi, what would you like to learn about this PDF?",
        type: "apiMessage",
      },
    ],
    history: [],
    pendingSourceDocs: [],
  })

  const { messages, pending, history, pendingSourceDocs } = messageState

  // react-hook-form
  const { register, handleSubmit, formState, watch, reset } = useForm<Inputs>({
    resolver: zodResolver(schema),
  })
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data)

    setMessageState({
      ...messageState,
      messages: [
        ...messages,
        {
          message: data.query,
          type: "userMessage",
        },
      ],
      pending: data.query,
    })
    reset()
  }

  // Scroll to bottom of chat
  const chatRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!chatRef.current) return
    chatRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [messages])

  return (
    <>
      <Head>
        <title>Chat | Chat with PDF</title>
      </Head>
      <ScrollArea className="h-full">
        <div className="container h-full w-full max-w-3xl flex-1 overflow-y-auto overflow-x-hidden">
          <h1 className="absolute left-1/2 top-0 w-full -translate-x-1/2 bg-white py-5 text-center text-base font-bold leading-tight tracking-normal dark:bg-zinc-900 sm:text-lg md:text-xl lg:text-2xl">
            Chat with your PDF
          </h1>
          <div className="mb-24 mt-20">
            {messages.map((message, i) =>
              message.type === "apiMessage" ? (
                <div
                  key={i}
                  className="mb-2 w-fit rounded-md border border-slate-300 bg-zinc-200/25 px-2.5 py-1.5 text-sm text-slate-950 dark:border-slate-500 dark:bg-zinc-700/75 dark:text-slate-50"
                >
                  {message.message}
                </div>
              ) : (
                <div
                  key={i}
                  className="mt-1.5 flex items-center justify-end gap-2.5"
                >
                  <div className="flex flex-col items-end gap-1.5">
                    <div className="flex items-center gap-2.5">
                      <div className="rounded-md border border-slate-300 bg-blue-500 px-2.5 py-1.5 text-sm text-slate-50 dark:border-slate-500 dark:bg-blue-600">
                        {message.message}
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
            <div ref={chatRef} />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 mt-2.5 w-full bg-white dark:bg-zinc-900">
          <form
            className="container mx-auto mb-5 flex max-w-3xl flex-row gap-3"
            onSubmit={handleSubmit(onSubmit)}
          >
            <fieldset className="relative flex w-full flex-col gap-2.5">
              <label htmlFor="query" className="sr-only">
                Type your question here
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
                  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                    handleSubmit(onSubmit)()
                  }
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleSubmit(onSubmit)()
                  }
                }}
                {...register("query", { required: true })}
              />
              <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
                {watch("query") && (
                  <>
                    <Button
                      type="button"
                      aria-label="Clear query"
                      variant="ghost"
                      className="h-auto rounded-full p-1"
                      onClick={() => {
                        reset()
                      }}
                    >
                      <X
                        className="h-4 w-4 text-slate-700 dark:text-slate-400"
                        aria-hidden="true"
                      />
                      <span className="sr-only">Clear query</span>
                    </Button>
                    <span className="h-5 w-px bg-slate-400 dark:bg-slate-600" />
                  </>
                )}
                <Button
                  aria-label="Chat"
                  variant="ghost"
                  className="h-auto rounded-full p-1"
                  disabled={isLoading}
                >
                  <Send
                    className="h-5 w-5 text-slate-600 dark:text-slate-500"
                    aria-hidden="true"
                  />
                  <span className="sr-only">Chat</span>
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
