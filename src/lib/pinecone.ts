import { PineconeClient } from "@pinecone-database/pinecone"

if (!process.env.PINECONE_ENVIRONMENT || !process.env.PINECONE_API_KEY) {
  throw new Error("Pinecone environment or api key vars missing")
}

type CreatePineconeIndex = {
  pineconeApiKey: string
  pineconeEnvironment: string
  pineconeIndexName: string
}

const createPineconeIndex = async ({
  pineconeApiKey,
  pineconeEnvironment,
  pineconeIndexName,
}: CreatePineconeIndex) => {
  try {
    const pinecone = new PineconeClient()

    await pinecone.init({
      environment: pineconeEnvironment,
      apiKey: pineconeApiKey,
    })

    return pinecone.Index(pineconeIndexName)
  } catch (error) {
    console.log("error", error)
    throw new Error("Failed to create Pinecone index")
  }
}

export { createPineconeIndex }
