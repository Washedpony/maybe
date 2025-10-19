import { type NextRequest, NextResponse } from "next/server"
import { generateAIResponse, type ChatMessage } from "@/lib/ai-service"

export async function POST(request: NextRequest) {
  try {
    const { messages, userMessage } = await request.json()

    if (!userMessage || typeof userMessage !== "string") {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 })
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000)

    try {
      const response = await generateAIResponse(messages as ChatMessage[], userMessage)
      clearTimeout(timeoutId)

      return NextResponse.json(response)
    } catch (error) {
      clearTimeout(timeoutId)
      throw error
    }
  } catch (error) {
    console.error("[v0] Chat API Error:", error)
    return NextResponse.json(
      {
        response:
          "I'm having trouble connecting to the AI service right now. Please try again in a moment, or use the navigation menu to explore our services.",
        action: undefined,
      },
      { status: 200 },
    )
  }
}
