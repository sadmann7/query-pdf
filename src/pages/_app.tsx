import type { AppProps } from "next/app"
import { Inter as FontSans } from "@next/font/google"
import { ThemeProvider } from "next-themes"

import { Layout } from "@/components/layouts/layout"
import ToastWrapper from "@/components/ui/toast-wrapper"
import "@/styles/globals.css"
import { ReactElement, type ReactNode } from "react"
import type { NextPage } from "next"
import Head from "next/head"

export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<
  P,
  IP
> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>)

  return (
    <>
      <style jsx global>{`
        :root {
          --font-sans: ${fontSans.style.fontFamily};
        }
      `}</style>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Head>
          <title>Chat with PDF</title>
        </Head>
        {getLayout(<Component {...pageProps} />)}
        <ToastWrapper />
      </ThemeProvider>
    </>
  )
}
