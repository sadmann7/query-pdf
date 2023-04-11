import { useCallback, useEffect, useState } from "react"
import Head from "next/head"
import Router from "next/router"
import type { NextPageWithLayout } from "@/pages/_app"
import { useChatStore } from "@/stores/chat"
import type { IngestResponse } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { nanoid } from "nanoid"
import { useForm, type SubmitHandler } from "react-hook-form"
import { toast } from "react-hot-toast"
import { z } from "zod"

import { Layout } from "@/components/layouts/layout"
import { Button } from "@/components/ui/button"
import FileInput from "@/components/ui/form/file-input"
import { Input } from "@/components/ui/input"

const schema = z
  .object({
    file: z.unknown().refine((value) => value instanceof File, {
      message: "Upload a PDF file",
    }),
    url: z.string(),
  })
  .partial()
  .refine((data) => data.file || data.url, {
    message: "Eiter select a file or enter a URL",
  })
type Inputs = z.infer<typeof schema>

const Home: NextPageWithLayout = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // chat store
  const chatStore = useChatStore((state) => ({
    chats: state.chats,
    addChat: state.addChat,
    updateChat: state.updateChat,
    removeChat: state.removeChat,
  }))

  // react-hook-form
  const { register, handleSubmit, formState, setValue, watch } =
    useForm<Inputs>({
      resolver: zodResolver(schema),
    })
  const onSubmit: SubmitHandler<Inputs> = useCallback(
    async (data) => {
      console.log(data)

      if (!data.file && !data.url) {
        toast.error("Please select a file or enter a URL")
        return
      }

      if (data.file && !(data.file instanceof File)) {
        toast.error("Upload a PDF file")
        return
      }

      setIsLoading(true)

      try {
        const formData = new FormData()
        data.file &&
          data.file instanceof File &&
          formData.append("file", data.file)
        formData.append("chatId", nanoid())

        const response = await fetch("/api/ingest", {
          method: "POST",
          body: formData,
        })
        const responseData = (await response.json()) as IngestResponse

        // create a new chat for the chat id
        chatStore.addChat(
          responseData.chatId,
          data.file && data.file instanceof File
            ? data.file.name
            : responseData.chatId,
          []
        )
        setIsLoading(false)
        await Router.push(`/chats/${responseData.chatId}`)
      } catch (error: unknown) {
        setIsLoading(false)
        error instanceof Error
          ? toast.error(error.message)
          : toast.error("Something went wrong, please try again")
      }
    },
    [chatStore]
  )

  //  auto submit form when file is selected
  useEffect(() => {
    const subscription = watch(() => handleSubmit(onSubmit)())
    return () => subscription.unsubscribe()
  }, [handleSubmit, onSubmit, watch])

  return (
    <>
      <Head>
        <title>Chat with PDF</title>
      </Head>
      <section className="container grid items-center gap-14 pb-8 pt-6 md:py-10">
        <div className="mx-auto grid w-full max-w-[980px] place-items-center gap-4">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]">
            Chat with your PDF in real time
          </h1>
          <p className="max-w-[750px] text-center text-lg text-slate-700 dark:text-slate-400 sm:text-xl">
            Simply upload your PDF or enter a link to your PDF and start
            chatting
          </p>
        </div>
        <form
          className="mx-auto grid w-full max-w-xl place-items-center gap-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <fieldset className="relative grid w-full gap-2.5">
            <label htmlFor="file" className="sr-only">
              Upload your PDF
            </label>
            <FileInput
              name="file"
              setValue={setValue}
              maxSize={8 * 1024 * 1024}
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              previewType="name"
              accept={{
                ["application/pdf"]: [".pdf"],
              }}
              isUploading={isLoading}
              disabled={
                !!watch("url")?.match(
                  /^(https?:\/\/)?www\.([\da-z\.-]+)\.([a-z\.]{2,6})\/[\w \.-]+?\.pdf$/
                ) || isLoading
              }
            />
          </fieldset>
          {/* <div className="bg-gradient-to-r from-slate-400 to-slate-500 bg-clip-text text-xl font-extrabold text-transparent md:text-2xl">
            or
          </div>
          // todo: add chat with url feature
          <fieldset className="relative grid w-full gap-2.5">
            <label htmlFor="url" className="sr-only">
              Enter a link to your PDF
            </label>
            <Input
              name="url"
              type="text"
              placeholder="Enter a link to your PDF"
              {...register("url")}
              disabled={!!watch("file") || isLoading}
            />
            {formState.errors.url?.message && (
              <p className="text-sm font-medium text-red-500">
                {formState.errors.url.message}
              </p>
            )}
          </fieldset> */}
        </form>
      </section>
    </>
  )
}

export default Home

Home.getLayout = (page) => <Layout>{page}</Layout>
