import Head from "next/head"
import { NextPageWithLayout } from "@/pages/_app"

import { Layout } from "@/components/layouts/layout"

const Chat: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Chat | Chat with PDF</title>
      </Head>
      <section className="container grid items-center gap-14 pb-8 pt-6 md:py-10">
        <div className="mx-auto grid max-w-[980px] place-items-center gap-5">
          <h1 className="text-center text-3xl font-bold leading-tight tracking-normal sm:text-3xl md:text-5xl lg:text-6xl">
            Your chats
          </h1>
          <p className="text-center text-base font-medium text-slate-500 sm:text-lg md:text-xl">
            All your chats will be listed here
          </p>
        </div>
      </section>
    </>
  )
}

export default Chat

Chat.getLayout = (page) => <Layout>{page}</Layout>
