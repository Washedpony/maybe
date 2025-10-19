"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, UserIcon, Phone, Mail, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"

export default function SupportPage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm Sync AI. How can I assist you today? You can ask me about jobs, applications, or connect with a live support agent.",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage = {
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages([...messages, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I can help you with that! Let me find the information you need.",
        "That's a great question. Based on our database, here's what I found...",
        "I understand your concern. Would you like me to connect you with a live support agent?",
        "I've found several resources that might help. Would you like me to share them?",
      ]

      const aiMessage = {
        role: "assistant",
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
  }

  const connectToAgent = () => {
    const agentMessage = {
      role: "assistant",
      content: "Connecting you to a live support agent. Please wait a moment...",
      timestamp: new Date(),
    }
    setMessages([...messages, agentMessage])

    setTimeout(() => {
      const connectedMessage = {
        role: "system",
        content: "You are now connected with Agent Sarah from the Job Sync Support Team. How can I help you today?",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, connectedMessage])
    }, 2000)
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Support Center</h1>
              <p className="text-xl text-muted-foreground">Chat with Sync AI or connect with our support team</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Chat Interface */}
              <Card className="md:col-span-2 flex flex-col h-[600px]">
                <CardHeader className="border-b">
                  <CardTitle className="text-2xl">Live Chat</CardTitle>
                  <CardDescription className="text-base">Chat with Sync AI or request a live agent</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      {msg.role !== "user" && (
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                          <Bot className="h-5 w-5 text-primary-foreground" />
                        </div>
                      )}
                      <div
                        className={`max-w-[70%] rounded-2xl p-4 ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : msg.role === "system"
                              ? "bg-accent text-accent-foreground border-2 border-primary"
                              : "bg-muted text-foreground"
                        }`}
                      >
                        <p className="text-base leading-relaxed">{msg.content}</p>
                        <p className="text-xs opacity-70 mt-2">
                          {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                      {msg.role === "user" && (
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                          <UserIcon className="h-5 w-5 text-accent-foreground" />
                        </div>
                      )}
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex gap-3 justify-start">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                        <Bot className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div className="bg-muted rounded-2xl p-4">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce [animation-delay:0.2s]" />
                          <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </CardContent>
                <div className="p-4 border-t">
                  <div className="flex gap-2 mb-3">
                    <Button onClick={connectToAgent} variant="outline" className="text-base bg-transparent">
                      Connect to Live Agent
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      placeholder="Type your message..."
                      className="text-base"
                    />
                    <Button onClick={handleSend} size="icon" className="shrink-0 h-10 w-10">
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Contact Information */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Contact Us</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <p className="font-medium text-base">Phone</p>
                        <p className="text-muted-foreground">1-876-555-SYNC</p>
                        <p className="text-muted-foreground">Mon-Fri, 8am-6pm</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <p className="font-medium text-base">Email</p>
                        <p className="text-muted-foreground">support@jobsync.gov.jm</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <p className="font-medium text-base">Office</p>
                        <p className="text-muted-foreground">12 Ocean Boulevard</p>
                        <p className="text-muted-foreground">Kingston, Jamaica</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Quick Help</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start text-base bg-transparent">
                      How to apply for jobs
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-base bg-transparent">
                      Track my application
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-base bg-transparent">
                      Update my profile
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-base bg-transparent">
                      Report an issue
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
