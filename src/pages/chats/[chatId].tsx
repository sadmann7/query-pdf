import { useEffect, useRef, useState } from "react"
import Head from "next/head"
import { NextPageWithLayout } from "@/pages/_app"
import { zodResolver } from "@hookform/resolvers/zod"
import { Document } from "langchain/document"
import { ArrowRight, X } from "lucide-react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { z } from "zod"

import { Message } from "@/types/"
import { cn } from "@/lib/utils"
import { ChatLayout } from "@/components/layouts/chat-layout"
import { Layout } from "@/components/layouts/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

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
        <div className="relative mx-auto w-full max-w-[980px]">
          <div className=" top-24">
            <div className="flex items-center gap-2 overflow-x-auto"></div>
            <h1 className="text-center text-base font-bold leading-tight tracking-normal sm:text-lg md:text-xl lg:text-2xl">
              Chat with your PDF
            </h1>
          </div>
          <div className="mx-auto mt-5 w-full max-w-3xl">
            <div
              ref={chatRef}
              className="my-5 flex h-[480px] w-full flex-col gap-2 overflow-y-auto"
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
                  <div
                    key={i}
                    className="flex items-center justify-end gap-2.5"
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
            </div>
            <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
              <fieldset className="relative grid w-full gap-2.5">
                <label htmlFor="query" className="sr-only">
                  Type your question here
                </label>
                <Input
                  id="query"
                  name="query"
                  placeholder="Type your question here"
                  className={cn(
                    "border-slate-700 py-5 placeholder:text-slate-600 dark:border-slate-400 dark:placeholder:text-slate-400",
                    formState.errors.query && "border-red-500"
                  )}
                  onKeyDown={(e) => {
                    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                      handleSubmit(onSubmit)()
                    }
                  }}
                  {...register("query", { required: true })}
                />
                <div className="absolute right-2.5 top-1/2 flex -translate-y-1/2 items-center gap-2">
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
                        <X className="h-3.5 w-3.5 text-slate-800 dark:text-slate-200" />
                      </Button>
                      <span className="mr-1 h-5 w-px bg-slate-400 dark:bg-slate-600" />
                    </>
                  )}
                  <Button
                    aria-label="Chat"
                    className="h-auto rounded-full bg-blue-500 p-1 hover:bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-600"
                    disabled={isLoading}
                  >
                    <ArrowRight className="h-4 w-4 text-white" />
                  </Button>
                </div>
              </fieldset>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}

export default Chat

Chat.getLayout = (page) => <ChatLayout>{page}</ChatLayout>
