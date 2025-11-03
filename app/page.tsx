'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Plus, Minimize2, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Message {
  id: string
  type: 'user' | 'agent'
  content: string
  timestamp: Date
  sources?: string[]
  confidence?: number
}

const SUGGESTED_QUESTIONS = [
  'How do I reset my password?',
  'What are your pricing plans?',
  'How can I contact support?',
  'What is your refund policy?'
]

const SAMPLE_CONVERSATIONS = [
  {
    user: 'How do I reset my password?',
    agent: 'To reset your password, follow these steps: 1. Click "Forgot Password" on the login page. 2. Enter your email address. 3. Check your email for a reset link. 4. Click the link and create a new password. 5. Log in with your new credentials. If you don\'t receive the email, check your spam folder.'
  },
  {
    user: 'What are your pricing plans?',
    agent: 'We offer three pricing tiers: Basic ($9/month) - Perfect for getting started with essential features. Pro ($29/month) - Includes advanced analytics and priority support. Enterprise - Custom pricing for large organizations with dedicated account management.'
  },
  {
    user: 'Can I cancel my subscription anytime?',
    agent: 'Yes, you can cancel your subscription at any time without penalties. Simply go to your account settings, select "Billing," and click "Cancel Subscription." Your access will continue until the end of your current billing cycle.'
  }
]

export default function HomePage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSample, setShowSample] = useState(true)
  const [isMinimized, setIsMinimized] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const charCount = input.length
  const maxChars = 2000
  const canSend = input.trim().length > 0 && !loading

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
      }, 0)
    }
  }, [messages, loading])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSend) return

    const userMessage = input.trim()
    const messageId = Date.now().toString()

    // Add user message
    setMessages(prev => [...prev, {
      id: messageId,
      type: 'user',
      content: userMessage,
      timestamp: new Date()
    }])

    setInput('')
    setShowSample(false)
    setLoading(true)

    try {
      // Call the Customer Support Agent API
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          agent_id: '69091afac6e3700d499a2eb9',
          user_id: 'customer_user',
          session_id: 'chat_session'
        })
      })

      const data = await response.json()

      // Extract agent response
      let agentResponse = 'I apologize, but I encountered an error processing your request. Please try again.'
      let sources: string[] = []
      let confidence = 0

      if (data.success && data.response) {
        // Handle both parsed object and string responses
        if (typeof data.response === 'string') {
          agentResponse = data.response
        } else if (typeof data.response === 'object') {
          agentResponse = data.response.response || data.response.answer || JSON.stringify(data.response)
          sources = data.response.sources || []
          confidence = data.response.confidence || 0
        }
      }

      // Add agent response
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: agentResponse,
        timestamp: new Date(),
        sources: sources.length > 0 ? sources : undefined,
        confidence: confidence > 0 ? confidence : undefined
      }])
    } catch (error) {
      console.error('Error calling agent:', error)
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: 'I\'m having trouble connecting to the support system. Please try again in a moment.',
        timestamp: new Date()
      }])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleSuggestedQuestion = (question: string) => {
    setInput(question)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  const handleNewConversation = () => {
    setMessages([])
    setInput('')
    setShowSample(true)
    inputRef.current?.focus()
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6">
        <Button
          onClick={() => setIsMinimized(false)}
          className="rounded-full h-14 w-14 p-0 bg-blue-600 hover:bg-blue-700 shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Chat Container */}
      <div className="flex flex-col w-full max-w-2xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageCircle className="h-6 w-6" />
            <div>
              <h1 className="text-lg font-semibold">Customer Support</h1>
              <p className="text-xs text-blue-100">Always here to help</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleNewConversation}
              variant="ghost"
              size="icon"
              className="hover:bg-blue-500 text-white"
            >
              <Plus className="h-5 w-5" />
            </Button>
            <Button
              onClick={() => setIsMinimized(true)}
              variant="ghost"
              size="icon"
              className="hover:bg-blue-500 text-white"
            >
              <Minimize2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-6" ref={scrollRef}>
          {messages.length === 0 && showSample ? (
            <div className="flex flex-col items-center justify-center h-full space-y-6">
              <div className="text-center space-y-2">
                <MessageCircle className="h-12 w-12 text-blue-600 mx-auto" />
                <h2 className="text-2xl font-bold text-gray-900">How can we help you?</h2>
                <p className="text-gray-600">Ask us anything about our products and services</p>
              </div>

              <div className="w-full space-y-3">
                {SUGGESTED_QUESTIONS.map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestedQuestion(question)}
                    className="w-full p-4 text-left bg-gray-50 hover:bg-blue-50 border border-gray-200 rounded-lg transition-colors"
                  >
                    <p className="text-sm font-medium text-gray-900">{question}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Sample Conversation Preview */}
              {messages.length === 0 && !showSample && (
                <div className="space-y-4 mb-4">
                  {SAMPLE_CONVERSATIONS.map((conv, idx) => (
                    <div key={idx} className="space-y-3">
                      {/* User Message */}
                      <div className="flex justify-end">
                        <div className="max-w-xs bg-blue-600 text-white rounded-lg rounded-tr-none px-4 py-2">
                          <p className="text-sm">{conv.user}</p>
                          <p className="text-xs text-blue-100 mt-1">Sample</p>
                        </div>
                      </div>
                      {/* Agent Message */}
                      <div className="flex justify-start">
                        <div className="max-w-xs bg-gray-100 text-gray-900 rounded-lg rounded-tl-none px-4 py-2">
                          <p className="text-sm">{conv.agent}</p>
                          <p className="text-xs text-gray-500 mt-1">Based on knowledge base</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Actual Messages */}
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white rounded-tr-none'
                          : 'bg-gray-100 text-gray-900 rounded-tl-none'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                      {message.type === 'agent' && message.sources && message.sources.length > 0 && (
                        <>
                          <Separator className={message.type === 'user' ? 'bg-blue-500 my-2' : 'bg-gray-300 my-2'} />
                          <p className={`text-xs ${message.type === 'user' ? 'text-blue-100' : 'text-gray-600'} font-medium mb-1`}>
                            Sources:
                          </p>
                          <ul className="text-xs space-y-1">
                            {message.sources.map((source, idx) => (
                              <li key={idx} className={message.type === 'user' ? 'text-blue-100' : 'text-gray-600'}>
                                • {source}
                              </li>
                            ))}
                          </ul>
                        </>
                      )}

                      <p className={`text-xs mt-2 ${
                        message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>

                      {message.type === 'agent' && message.confidence && (
                        <p className={`text-xs mt-1 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-600'}`}>
                          Confidence: {Math.round(message.confidence * 100)}%
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-900 rounded-lg rounded-tl-none px-4 py-3">
                      <div className="flex gap-1 items-center">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Agent is typing...</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </ScrollArea>

        {/* Input Section */}
        <Separator />
        <form onSubmit={handleSendMessage} className="p-4 bg-white">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                type="text"
                placeholder="Type your question..."
                value={input}
                onChange={(e) => {
                  if (e.target.value.length <= maxChars) {
                    setInput(e.target.value)
                  }
                }}
                disabled={loading}
                className="pr-12 text-sm"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                {charCount}/{maxChars}
              </span>
            </div>
            <Button
              type="submit"
              disabled={!canSend}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
