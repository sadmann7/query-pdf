import type { PageConfig } from "next"
import { NextRequest, NextResponse } from "next/server"
import { CallbackManager } from "langchain/callbacks"
import { ChatVectorDBQAChain, VectorDBQAChain } from "langchain/chains"
import { ChatOpenAI } from "langchain/chat_models/openai"
import { OpenAIEmbeddings } from "langchain/embeddings/openai"
import { PineconeStore } from "langchain/vectorstores/pinecone"

import { makeChain } from "@/lib/make-chain"
import { createPineconeIndex } from "@/lib/pinecone"

interface ExtendedNextRequest extends NextRequest {
  json: () => Promise<{
    chatId: string
    question: string
    history: string[]
  }>
}

export const config: PageConfig = {
  runtime: "edge",
}

export default async function handler(req: ExtendedNextRequest) {
  try {
    const { chatId, question, history } = await req.json()
    console.log({
      chatId,
      question,
      history,
    })

    if (!question) {
      return new Response("No question provided", { status: 400 })
    }
    // openai recommends replacing newlines with spaces for best results
    const sanitizedQuestion = question.trim().replaceAll("\n", " ")

    const pineconeIndex = await createPineconeIndex({
      pineconeApiKey: process.env.PINECONE_API_KEY ?? "",
      pineconeEnvironment: process.env.PINECONE_ENVIRONMENT ?? "",
      pineconeIndexName: process.env.PINECONE_INDEX_NAME ?? "",
    })

    // create vectorstore
    const vectorstore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings(),
      {
        pineconeIndex,
        textKey: "text",
        namespace: chatId,
      }
    )
    // Call LLM and stream output
    const encoder = new TextEncoder()
    const stream = new TransformStream()
    const writer = stream.writable.getWriter()

    const llm = new ChatOpenAI({
      temperature: 0,
      modelName: "gpt-3.5-turbo",
      streaming: true,
      callbackManager: CallbackManager.fromHandlers({
        handleLLMNewToken: async (token) => {
          await writer.ready
          await writer.write(encoder.encode(`data: ${token}\n\n`))
        },
        handleLLMEnd: async () => {
          await writer.ready
          await writer.close()
        },
        handleLLMError: async (e) => {
          await writer.ready
          await writer.abort(e)
        },
      }),
    })

    // create chain
    const chain = makeChain(llm, vectorstore)
    // const chain = ChatVectorDBQAChain.fromLLM(llm, vectorstore, {
    //   returnSourceDocuments: false,
    //   k: 2,
    // })

    // We don't need to await the result of the chain.run() call because
    // the LLM will invoke the callbackManager's handleLLMEnd() method
    chain
      .call({
        question: sanitizedQuestion,
        chat_history: [],
      })
      .catch(console.error)

    return new Response(stream.readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
      },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
