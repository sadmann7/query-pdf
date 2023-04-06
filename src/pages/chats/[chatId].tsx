import type { NextPageWithLayout } from "@/pages/_app"

import { Layout } from "@/components/layouts/layout"

const Chat: NextPageWithLayout = () => {
  return <div>[chatId]</div>
}

export default Chat

Chat.getLayout = (page) => <Layout>{page}</Layout>
