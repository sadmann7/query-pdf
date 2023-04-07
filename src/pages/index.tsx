import { useCallback, useEffect, useState } from "react"
import Head from "next/head"
import Router from "next/router"
import { NextPageWithLayout } from "@/pages/_app"
import { IngestResponse } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type SubmitHandler } from "react-hook-form"
import { z } from "zod"

import { Layout } from "@/components/layouts/layout"
import FileInput from "@/components/ui/form/file-input"

const schema = z.object({
  file: z.unknown().refine((value) => value instanceof File, {
    message: "Must be a file",
  }),
})
type Inputs = z.infer<typeof schema>

const Home: NextPageWithLayout = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // react-hook-form
  const { handleSubmit, formState, setValue, watch, reset } = useForm<Inputs>({
    resolver: zodResolver(schema),
  })
  const onSubmit: SubmitHandler<Inputs> = useCallback(async (data) => {
    console.log(data)

    if (!(data.file instanceof File)) {
      setError("Must be a file")
      return
    }
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/ingest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
      const responseData = (await response.json()) satisfies IngestResponse
      setIsLoading(false)
      await Router.push(`/chats/${responseData.chatId}`)
    } catch (error) {
      setError(error.message)
      setIsLoading(false)
    }
  }, [])

  //  auto submit form when file is selected
  useEffect(() => {
    if (formState.isValid) {
      handleSubmit(onSubmit)()
    }
  }, [formState.isValid, selectedFile, handleSubmit, onSubmit])

  return (
    <>
      <Head>
        <title>Chat with PDF</title>
      </Head>
      <section className="container grid items-center gap-14 pb-8 pt-6 md:py-10">
        <div className="mx-auto grid w-full max-w-[980px] place-items-center gap-5">
          <h1 className="text-center text-3xl font-bold leading-tight tracking-normal sm:text-3xl md:text-5xl lg:text-6xl">
            Chat with your PDF in real time
          </h1>
          <p className="text-center text-base font-medium text-slate-500 sm:text-lg md:text-xl">
            Simply upload your PDF and start chatting with it
          </p>
        </div>
        <form
          className="mx-auto w-full max-w-2xl"
          onSubmit={handleSubmit(onSubmit)}
        >
          <fieldset className="relative grid w-full gap-2.5">
            <label htmlFor="file" className="sr-only">
              Upload your PDF
            </label>
            <FileInput
              name="file"
              setValue={setValue}
              maxSize={10 * 1024 * 1024}
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              previewType="name"
              accept={{
                ["application/pdf"]: [".pdf"],
              }}
              isUploading={isLoading}
              disabled={isLoading}
            />
            {formState.errors.file?.message && (
              <p className="-mt-1 text-sm font-medium text-red-500">
                {formState.errors.file.message}
              </p>
            )}
          </fieldset>
        </form>
      </section>
    </>
  )
}

export default Home

Home.getLayout = (page) => <Layout>{page}</Layout>
