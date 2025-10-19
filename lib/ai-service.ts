import { generateText } from "ai"

export interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

export interface AIResponse {
  response: string
  action?: string
  data?: Record<string, unknown>
}

const systemPrompt = `You are Sync AI, a helpful government services assistant for the Joust Inc platform in Jamaica. You help citizens find jobs, report infrastructure issues, and access government services.

You can help with:
1. Job searches - Help users find jobs by parish, skills, or salary range
2. Issue reporting - Help users report potholes, safety concerns, and infrastructure problems
3. Micro-gigs - Explain available gig opportunities
4. Applications - Help track job applications
5. General questions about the platform

When users ask about jobs, respond with job recommendations and ask clarifying questions about their location and skills.
When users report issues, acknowledge the issue and provide next steps.
Be friendly, professional, and helpful. Keep responses concise and actionable.`

const fallbackResponses: Record<string, string> = {
  job: "I can help you find jobs! We have positions available in Technology, Education, Healthcare, Engineering, and more across all parishes. You can search for jobs by parish, skills, or salary range. Would you like me to show you available jobs? Just visit the Jobs page to explore opportunities, or tell me what kind of work you're looking for!",
  issue:
    "Thank you for wanting to report an issue! I can help you report infrastructure problems like potholes, broken streetlights, sanitation concerns, or safety hazards. Please visit the Community page to submit a detailed report with location information. Your reports help improve our communities!",
  gig: "We have several micro-gig opportunities available! These are short-term tasks like data entry, surveys, document verification, and community outreach that you can complete for extra income. Payments range from $500 to $4,500 JMD. Visit the Micro-Gigs page to see what's available and accept gigs instantly!",
  application:
    "You can track all your job applications in your Profile. Visit the Profile page to see the status of your applications, view interview schedules, and manage your account information. I can also help you prepare for applications if you'd like!",
  support:
    "I'm here to help with any questions! You can ask me about finding jobs, reporting community issues, exploring micro-gig opportunities, tracking applications, or general questions about our services. What would you like help with?",
  greeting:
    "Hello! I'm Sync AI, your Joust Inc assistant. I'm here to help you navigate government services, find job opportunities, report community issues, and access micro-gigs. How can I assist you today?",
  default:
    "I'm here to help! You can ask me about jobs, report issues, explore gig opportunities, track your applications, or get information about our services. What would you like to do?",
}

function getFallbackResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase()

  if (
    lowerMessage.includes("hello") ||
    lowerMessage.includes("hi") ||
    lowerMessage.includes("hey") ||
    lowerMessage.includes("good morning") ||
    lowerMessage.includes("good afternoon")
  ) {
    return fallbackResponses.greeting
  }

  if (lowerMessage.includes("job") || lowerMessage.includes("work") || lowerMessage.includes("employment")) {
    return fallbackResponses.job
  }
  if (
    lowerMessage.includes("issue") ||
    lowerMessage.includes("pothole") ||
    lowerMessage.includes("report") ||
    lowerMessage.includes("problem") ||
    lowerMessage.includes("broken")
  ) {
    return fallbackResponses.issue
  }
  if (lowerMessage.includes("gig") || lowerMessage.includes("micro-gig") || lowerMessage.includes("task")) {
    return fallbackResponses.gig
  }
  if (lowerMessage.includes("application") || lowerMessage.includes("applied") || lowerMessage.includes("status")) {
    return fallbackResponses.application
  }
  if (lowerMessage.includes("help") || lowerMessage.includes("support") || lowerMessage.includes("assist")) {
    return fallbackResponses.support
  }

  return fallbackResponses.default
}

export async function generateAIResponse(messages: ChatMessage[], userMessage: string): Promise<AIResponse> {
  try {
    const conversationHistory = messages
      .map((msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
      .join("\n")

    const prompt = `${conversationHistory}\nUser: ${userMessage}\n\nAssistant:`

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    try {
      const { text } = await generateText({
        model: "openai/gpt-4-mini",
        system: systemPrompt,
        prompt: prompt,
        temperature: 0.7,
        maxTokens: 500,
      })

      clearTimeout(timeoutId)

      const action = parseAction(userMessage, text)

      return {
        response: text,
        action,
      }
    } catch (aiError) {
      clearTimeout(timeoutId)
      console.error("[v0] AI SDK Error:", aiError)

      const fallbackResponse = getFallbackResponse(userMessage)
      const action = parseAction(userMessage, fallbackResponse)

      return {
        response: fallbackResponse,
        action,
      }
    }
  } catch (error) {
    console.error("[v0] AI Service Error:", error)

    return {
      response: getFallbackResponse(userMessage),
      action: parseAction(userMessage, ""),
    }
  }
}

function parseAction(userMessage: string, response: string): string | undefined {
  const lowerMessage = userMessage.toLowerCase()

  if (
    lowerMessage.includes("find job") ||
    lowerMessage.includes("search job") ||
    lowerMessage.includes("job in") ||
    lowerMessage.includes("looking for work") ||
    lowerMessage.includes("employment")
  ) {
    return "search_jobs"
  }

  if (
    lowerMessage.includes("report") ||
    lowerMessage.includes("pothole") ||
    lowerMessage.includes("issue") ||
    lowerMessage.includes("problem") ||
    lowerMessage.includes("broken") ||
    lowerMessage.includes("fix")
  ) {
    return "report_issue"
  }

  if (
    lowerMessage.includes("gig") ||
    lowerMessage.includes("micro-gig") ||
    lowerMessage.includes("available work") ||
    lowerMessage.includes("quick task") ||
    lowerMessage.includes("extra income")
  ) {
    return "view_gigs"
  }

  if (
    lowerMessage.includes("application") ||
    lowerMessage.includes("applied") ||
    lowerMessage.includes("my jobs") ||
    lowerMessage.includes("track") ||
    lowerMessage.includes("status")
  ) {
    return "view_applications"
  }

  return undefined
}
