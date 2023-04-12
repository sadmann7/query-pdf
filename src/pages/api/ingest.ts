import type { NextApiRequest, NextApiResponse, PageConfig } from "next"
import type { IngestResponse } from "@/types"
import formidable from "formidable"
import { Document } from "langchain/document"
import { OpenAIEmbeddings } from "langchain/embeddings/openai"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import { PineconeStore } from "langchain/vectorstores"

import { fileConsumer, formidablePromise } from "@/lib/formidable"
import { getTextContentFromPDF } from "@/lib/pdf"
import { createPineconeIndex } from "@/lib/pinecone"

const formidableConfig = {
  keepExtensions: true,
  maxFileSize: 10_000_000,
  maxFieldsSize: 10_000_000,
  maxFields: 7,
  allowEmptyFiles: false,
  multiples: true,
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IngestResponse>
) {
  try {
    // store the file buffers in memory
    const endBuffers: {
      [filename: string]: Buffer
    } = {}

    // parse the request
    const { fields, files } = await formidablePromise(req, {
      ...formidableConfig,
      // consume this, otherwise formidable tries to save the file to disk
      fileWriteStreamHandler: (file) => fileConsumer(file, endBuffers),
    })

    const chatId = fields.chatId as string

    // get the text from the files
    const docs = await Promise.all(
      Object.values(files).map(async (fileObj: formidable.file) => {
        let fileText = ""
        const fileData = endBuffers[fileObj.newFilename]
        switch (fileObj.mimetype) {
          case "text/plain":
            fileText = fileData.toString()
            break
          case "application/pdf":
            fileText = await getTextContentFromPDF(fileData)
            break
          case "application/octet-stream":
            fileText = fileData.toString()
            break
          default:
            throw new Error("Unsupported file type.")
        }

        // split text into chunks
        const rawDocs = new Document({ pageContent: fileText })
        const textSplitter = new RecursiveCharacterTextSplitter({
          chunkSize: 1000,
          chunkOverlap: 200,
        })
        return await textSplitter.splitDocuments([rawDocs])
      })
    )
    // flatten the docs array
    const flatDocs = docs.flat()

    console.log("creating vector store...")
    // create and store the embeddings in the vectorStore
    const embeddings = new OpenAIEmbeddings()
    // change to your own index name
    const pineconeIndex = await createPineconeIndex({
      pineconeApiKey: process.env.PINECONE_API_KEY ?? "",
      pineconeEnvironment: process.env.PINECONE_ENVIRONMENT ?? "",
      pineconeIndexName: process.env.PINECONE_INDEX_NAME ?? "",
    })

    // embed the PDF documents
    await PineconeStore.fromDocuments(flatDocs, embeddings, {
      pineconeIndex,
      textKey: "text",
      namespace: chatId,
    })

    res.status(200).json({
      message: "✅ Successfully ingested your data",
      chatId: chatId,
    })
  } catch (error) {
    console.log("error", error)
    throw new Error("❌ Failed to ingest your data")
  }
}

export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
}
