import "@/styles/globals.css"
import type { ReactElement, ReactNode } from "react"
import type { NextPage } from "next"
import type { AppProps, AppType } from "next/app"
import { Inter as FontSans } from "next/font/google"
import Head from "next/head"
import { api } from "@/utils/api"
import { type Session } from "next-auth"
import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "next-themes"

import { Layout } from "@/components/layouts/layout"
import "@/styles/globals.css"

export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<
  P,
  IP
> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps<{
  session: Session | null
}> & {
  Component: NextPageWithLayout
}

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>)

  return (
    <>
      <style jsx global>{`
        :root {
          --font-sans: ${fontSans.style.fontFamily};
        }
      `}</style>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <SessionProvider session={session}>
          <Head>
            <title>Chat with PDF</title>
          </Head>
          {getLayout(<Component {...pageProps} />)}
        </SessionProvider>
      </ThemeProvider>
    </>
  )
}

export default api.withTRPC(MyApp)
