import type { NextRequest } from "next/server"
import { ImageResponse } from "@vercel/og"

export const config = {
  runtime: "edge",
}

export default function handler(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    // ?title=<title>
    const hasTitle = searchParams.has("title")
    const title = hasTitle
      ? searchParams.get("title")?.slice(0, 100)
      : "My default title"

    // ?description=<description>
    const hasDescription = searchParams.has("description")
    const description = hasDescription
      ? searchParams.get("description")?.slice(0, 200)
      : "My default description"

    return new ImageResponse(
      (
        <div
          tw="h-full w-full flex items-center justify-center flex-col"
          style={{
            backgroundImage: "linear-gradient(to bottom, #111827, #374151)",
          }}
        >
          <div tw="flex items-center text-3xl justify-center flex-col">
            <div tw="text-white font-bold">PaperChat</div>
          </div>
          <div tw="flex max-w-4xl items-center justify-center flex-col mt-10">
            <div tw="text-5xl font-bold whitespace-pre-wrap tracking-tight leading-tight text-white px-8">
              {title}
            </div>
            <div tw="mt-5 text-3xl text-gray-300 text-center font-normal whitespace-pre-wrap tracking-tight leading-tight px-20">
              {description}
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e) {
    e instanceof Error ? console.log(`${e.message as string}`) : console.log(e)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
