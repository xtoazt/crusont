'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/lib/auth-context'
import Navigation from '@/components/Navigation'
import { Zap, Send, Brain, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface SuperQuery {
  id: string
  query: string
  response: string
  models: string[]
  confidence: number
  reasoning: string
  createdAt: string
}

export default function SuperPage() {
  const { user, token } = useAuth()
  const [queries, setQueries] = useState<SuperQuery[]>([])
  const [inputQuery, setInputQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentResponse, setCurrentResponse] = useState<{
    response: string
    models: string[]
    confidence: number
    reasoning: string
  } | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (user && token) {
      fetchQueries()
    }
  }, [user, token])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [currentResponse])

  const fetchQueries = async () => {
    try {
      const response = await fetch('/api/super', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setQueries(data.queries)
      }
    } catch (error) {
      console.error('Failed to fetch queries:', error)
    }
  }

  const sendQuery = async () => {
    if (!inputQuery.trim() || loading) return

    setLoading(true)
    setCurrentResponse(null)

    try {
      const response = await fetch('/api/super', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: inputQuery,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setCurrentResponse({
          response: data.response,
          models: data.models,
          confidence: data.confidence,
          reasoning: data.reasoning,
        })
        setInputQuery('')
        fetchQueries() // Refresh queries list
      } else {
        toast.error('Failed to process query')
      }
    } catch (error) {
      toast.error('Failed to process query')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendQuery()
    }
  }

  const loadQuery = (query: SuperQuery) => {
    setCurrentResponse({
      response: query.response,
      models: query.models,
      confidence: query.confidence,
      reasoning: query.reasoning,
    })
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Please sign in to access Super
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              You need to be logged in to use the super-powered AI features.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Query History
                </h3>
              </div>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {queries.map((query) => (
                  <div
                    key={query.id}
                    onClick={() => loadQuery(query)}
                    className="p-3 rounded-lg cursor-pointer transition-colors bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2">
                      {query.query}
                    </h4>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {query.models.length} models
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(query.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center mt-1">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-1">
                        <div
                          className="bg-green-500 h-1 rounded-full"
                          style={{ width: `${query.confidence * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                        {Math.round(query.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 h-[calc(100vh-200px)] flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Super AI
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Get the best answers using multiple AI models combined
                    </p>
                  </div>
                </div>
              </div>

              {/* Response Area */}
              <div className="flex-1 overflow-y-auto p-6">
                {!currentResponse && !loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Zap className="w-8 h-8 text-purple-600" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Ask a Super Question
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 max-w-md">
                        Get the most comprehensive answers by combining insights from multiple AI models.
                        Perfect for complex questions that need thorough analysis.
                      </p>
                    </div>
                  </div>
                ) : loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Processing with Multiple Models
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Combining insights from multiple AI models for the best answer...
                      </p>
                    </div>
                  </div>
                ) : currentResponse ? (
                  <div className="space-y-6">
                    {/* Models Used */}
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Brain className="w-5 h-5 text-purple-600" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Models Used:
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        {currentResponse.models.map((model, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-xs rounded-full"
                          >
                            {model}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Confidence Score */}
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Confidence:
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${currentResponse.confidence * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {Math.round(currentResponse.confidence * 100)}%
                        </span>
                      </div>
                    </div>

                    {/* Reasoning */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertCircle className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                          Reasoning
                        </span>
                      </div>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        {currentResponse.reasoning}
                      </p>
                    </div>

                    {/* Response */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Super Response
                      </h4>
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                          {currentResponse.response}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <textarea
                      value={inputQuery}
                      onChange={(e) => setInputQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask a complex question that needs multiple AI models to answer..."
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                      rows={3}
                      disabled={loading}
                    />
                  </div>
                  <button
                    onClick={sendQuery}
                    disabled={!inputQuery.trim() || loading}
                    className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Press Enter to send, Shift+Enter for new line
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
