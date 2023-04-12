import { CallbackManager } from "langchain/callbacks"
import { ChatVectorDBQAChain, LLMChain, loadQAChain } from "langchain/chains"
import { ChatOpenAI } from "langchain/chat_models/openai"
import { PromptTemplate } from "langchain/prompts"
import { PineconeStore } from "langchain/vectorstores"

const CONDENSE_PROMPT =
  PromptTemplate.fromTemplate(`Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`)

const QA_PROMPT = PromptTemplate.fromTemplate(
  `You are an AI assistant providing helpful advice. You are given the following extracted parts of a long document and a question. Provide a conversational answer based on the context provided.
If you can't find the answer in the context below, just say "Hmm, I'm not sure." Don't try to make up an answer.
If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context.

Question: {question}
=========
{context}
=========
Answer in Markdown:`
)

export const makeChain = (llm: ChatOpenAI, vectorstore: PineconeStore) => {
  const questionGenerator = new LLMChain({
    llm,
    prompt: CONDENSE_PROMPT,
  })
  const docChain = loadQAChain(llm, { prompt: QA_PROMPT })

  return new ChatVectorDBQAChain({
    vectorstore,
    combineDocumentsChain: docChain,
    questionGeneratorChain: questionGenerator,
    returnSourceDocuments: false,
    k: 2, //number of source documents to return
  })
}
