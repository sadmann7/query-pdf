import type { NextApiRequest, NextApiResponse } from "next"
import { OpenAIEmbeddings } from "langchain/embeddings"
import { PineconeStore } from "langchain/vectorstores"

import { makeChain } from "@/lib/make-chain"
import { createPineconeIndex } from "@/lib/pinecone"

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    question: string
    chatHistory: string[]
  }
}

export default async function handler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse
) {
  const { question, chatHistory } = req.body
  console.log({
    question,
    chatHistory,
  })

  if (!question) {
    return res.status(400).json({ message: "No question in the request" })
  }
  // OpenAI recommends replacing newlines with spaces for best results
  const sanitizedQuestion = question.trim().replaceAll("\n", " ")

  const pineconeIndex = await createPineconeIndex({
    pineconeApiKey: process.env.PINECONE_API_KEY ?? "",
    pineconeEnvironment: process.env.PINECONE_ENVIRONMENT ?? "",
    pineconeIndexName: process.env.PINECONE_INDEX_NAME ?? "",
  })

  // Create vectorstore
  const vectorStore = await PineconeStore.fromExistingIndex(
    new OpenAIEmbeddings(),
    {
      pineconeIndex,
      textKey: "text",
      namespace: process.env.PINECONE_NAMESPACE ?? "",
    }
  )

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
  })

  const sendData = (data: string) => {
    res.write(`data: ${data}\n\n`)
  }

  sendData(JSON.stringify({ data: "" }))

  //create chain
  const chain = makeChain(vectorStore, (token: string) => {
    sendData(JSON.stringify({ data: token }))
  })

  try {
    //Ask a question
    const response = await chain.call({
      question: sanitizedQuestion,
      chat_history: chatHistory ?? [],
    })

    console.log("response", response)
    sendData(JSON.stringify({ sourceDocs: response.sourceDocuments }))
  } catch (error) {
    console.log("error", error)
  } finally {
    sendData("[DONE]")
    res.end()
  }
}
