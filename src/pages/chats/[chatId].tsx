import { useEffect, useRef, useState } from "react"
import Head from "next/head"
import { NextPageWithLayout } from "@/pages/_app"
import { zodResolver } from "@hookform/resolvers/zod"
import { Document } from "langchain/document"
import { ArrowRight, Plane, Send, X } from "lucide-react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { z } from "zod"

import { Message } from "@/types/"
import { cn } from "@/lib/utils"
import { Layout } from "@/components/layouts/layout"
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
    chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [messages])

  return (
    <>
      <Head>
        <title>Chat | Chat with PDF</title>
      </Head>
      <section className="container grid items-center gap-14 pb-8 pt-6 md:pb-16 md:pt-8">
        <div className="relative mx-auto w-full max-w-3xl">
          <div
            ref={chatRef}
            className="flex h-[480px] w-full flex-col gap-2 overflow-y-auto p-5"
          >
            {messages.map((message, i) =>
              message.type === "apiMessage" ? (
                <div
                  key={i}
                  className="w-fit rounded-md border border-slate-300 bg-zinc-200/25 px-2.5 py-1.5 text-sm text-slate-950 dark:border-slate-500 dark:bg-zinc-700/75 dark:text-slate-50"
                >
                  {message.message}
                </div>
              ) : (
                <div key={i} className="flex items-center justify-end gap-2.5">
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
          </div>
          <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
            <fieldset className="relative grid w-full gap-2.5">
              <label htmlFor="query" className="sr-only">
                Type your question here
              </label>
              <Textarea
                id="query"
                name="query"
                placeholder="Type your question..."
                className={cn(
                  "h-18 resize-none border-slate-700 px-4 py-3 placeholder:text-slate-600 dark:border-slate-400 dark:placeholder:text-slate-400 xxs:h-12",
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
      </section>
    </>
  )
}

export default Chat

Chat.getLayout = (page) => <Layout>{page}</Layout>
