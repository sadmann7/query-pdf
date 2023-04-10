import Head from "next/head"
import { NextPageWithLayout } from "@/pages/_app"

import { Layout } from "@/components/layouts/layout"

const Chats: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Chats | Chat with PDF</title>
      </Head>
      <section className="container grid items-center gap-14 pb-8 pt-6 md:py-10">
        <div className="mx-auto grid w-full max-w-[980px] place-items-center gap-4">
          <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]">
            Your chats
          </h1>
          <p className="max-w-[750px] text-lg text-slate-700 dark:text-slate-400 sm:text-xl">
            All your chats will be listed here
          </p>
        </div>
      </section>
    </>
  )
}

export default Chats

Chats.getLayout = (page) => <Layout>{page}</Layout>
