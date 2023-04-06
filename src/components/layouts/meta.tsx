import Head from "next/head"

type MetaProps = {
  title?: string
  description?: string
  image?: string
  keywords?: string
}

const Meta = ({
  title = "PaperChat",
  description = "Chat with PDFs and Docs in real-time",
  image = "https://paperchat.vercel.app/api/og?title=PaperChat&description=Chat%20with%20PDFs%20and%20Docs%20in%20real-time",
  keywords = "Chat, PDF, Docs, Real-time, PaperChat",
}: MetaProps) => {
  return (
    <Head>
      <meta name="description" content={description} />
      <meta property="og:site_name" content={title} />
      <meta property="og:description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow" />
      <meta property="og:title" content={title} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  )
}

export default Meta
