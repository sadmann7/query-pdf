import { OpenAI } from "langchain/llms"

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OpenAI Credentials")
}

export const model = new OpenAI({
  temperature: 0,
  modelName: "gpt-3.5-turbo",
  openAIApiKey: process.env.OPENAI_API_KEY ?? "",
})
