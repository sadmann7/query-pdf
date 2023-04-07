import { NextApiRequest, NextApiResponse } from "next"
import { PDFLoader } from "langchain/document_loaders"
import { OpenAIEmbeddings } from "langchain/embeddings"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import { PineconeStore } from "langchain/vectorstores"

import { createPineconeIndex } from "@/lib/pinecone"

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    file: string
  }
}

export default async function handler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse
) {
  try {
    const { file } = req.body
    console.log(file)

    /*load raw docs from the all files in the directory */
    const pdfLoader = new PDFLoader(file, {
      splitPages: true,
    })
    console.log(pdfLoader)

    // // const loader = new PDFLoader(filePath);
    // const rawDocs = await pdfLoader.load()

    // /* Split text into chunks */
    // const textSplitter = new RecursiveCharacterTextSplitter({
    //   chunkSize: 1000,
    //   chunkOverlap: 200,
    // })

    // const docs = await textSplitter.splitDocuments(rawDocs)
    // console.log("split docs", docs)

    // console.log("creating vector store...")
    // /*create and store the embeddings in the vectorStore*/
    // const embeddings = new OpenAIEmbeddings()
    // //change to your own index name
    // const pineconeIndex = await createPineconeIndex({
    //   pineconeApiKey: process.env.PINECONE_API_KEY ?? "",
    //   pineconeEnvironment: process.env.PINECONE_ENVIRONMENT ?? "",
    //   pineconeIndexName: process.env.PINECONE_INDEX_NAME ?? "",
    // })

    // //embed the PDF documents
    // await PineconeStore.fromDocuments(docs, embeddings, {
    //   pineconeIndex,
    //   namespace: process.env.PINECONE_NAMESPACE ?? "",
    //   textKey: "text",
    // })

    res.status(200).json({
      message: "✅ Successfully ingested your data",
    })
  } catch (error) {
    console.log("error", error)
    throw new Error("❌ Failed to ingest your data")
  }
}
