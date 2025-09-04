'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import Navigation from '@/components/Navigation'
import { Shield, AlertTriangle, CheckCircle, XCircle, Copy, RotateCcw } from 'lucide-react'
import toast from 'react-hot-toast'

interface ModerationResult {
  flagged: boolean
  categories: {
    hate: boolean
    hate_threatening: boolean
    self_harm: boolean
    sexual: boolean
    sexual_minors: boolean
    violence: boolean
    violence_graphic: boolean
  }
  category_scores: {
    hate: number
    hate_threatening: number
    self_harm: number
    sexual: number
    sexual_minors: number
    violence: number
    violence_graphic: number
  }
}

export default function ModeratePage() {
  const { user, token } = useAuth()
  const [text, setText] = useState('')
  const [result, setResult] = useState<ModerationResult | null>(null)
  const [loading, setLoading] = useState(false)

  const moderateText = async () => {
    if (!text.trim()) {
      toast.error('Please enter text to moderate')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/developer/moderate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          text,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setResult(data)
        toast.success('Text moderation completed!')
      } else {
        toast.error('Failed to moderate text')
      }
    } catch {
      toast.error('Failed to moderate text')
    } finally {
      setLoading(false)
    }
  }

  const copyText = async (textToCopy: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy)
      toast.success('Text copied to clipboard!')
    } catch {
      toast.error('Failed to copy text')
    }
  }

  const resetModeration = () => {
    setText('')
    setResult(null)
  }

  const getScoreColor = (score: number) => {
    if (score < 0.3) return 'text-green-600 dark:text-green-400'
    if (score < 0.7) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }


  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Please sign in to access Content Moderation
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              You need to be logged in to use the moderation features.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (user.accountType !== 'DEVELOPER') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Developer Account Required
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              You need a developer account to access content moderation features.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Content Moderation
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Analyze and moderate text content for safety and compliance
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Text Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Text to Moderate
              </label>
              <div className="relative">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter text to analyze for content moderation..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={6}
                />
                <button
                  onClick={() => copyText(text)}
                  className="absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  title="Copy text"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {text.length} characters
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={moderateText}
                disabled={loading || !text.trim()}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    <span>Moderate Content</span>
                  </>
                )}
              </button>

              <button
                onClick={resetModeration}
                className="flex items-center space-x-2 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>

            {/* Results */}
            {result && (
              <div className="space-y-6">
                {/* Overall Result */}
                <div className={`p-4 rounded-lg border-2 ${
                  result.flagged 
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' 
                    : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                }`}>
                  <div className="flex items-center space-x-3">
                    {result.flagged ? (
                      <XCircle className="w-6 h-6 text-red-600" />
                    ) : (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    )}
                    <div>
                      <h3 className={`text-lg font-semibold ${
                        result.flagged ? 'text-red-800 dark:text-red-200' : 'text-green-800 dark:text-green-200'
                      }`}>
                        {result.flagged ? 'Content Flagged' : 'Content Safe'}
                      </h3>
                      <p className={`text-sm ${
                        result.flagged ? 'text-red-700 dark:text-red-300' : 'text-green-700 dark:text-green-300'
                      }`}>
                        {result.flagged 
                          ? 'This content may violate community guidelines' 
                          : 'This content appears to be safe and appropriate'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Category Analysis */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Category Analysis
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(result.categories).map(([category, flagged]) => {
                      const score = result.category_scores[category as keyof typeof result.category_scores]
                      const categoryName = category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
                      
                      return (
                        <div
                          key={category}
                          className={`p-4 rounded-lg border ${
                            flagged 
                              ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' 
                              : 'bg-gray-50 dark:bg-gray-600 border-gray-200 dark:border-gray-500'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900 dark:text-white">
                              {categoryName}
                            </span>
                            {flagged ? (
                              <AlertTriangle className="w-4 h-4 text-red-600" />
                            ) : (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-gray-200 dark:bg-gray-500 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all duration-300 ${
                                  score < 0.3 ? 'bg-green-500' : score < 0.7 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${score * 100}%` }}
                              ></div>
                            </div>
                            <span className={`text-sm font-medium ${getScoreColor(score)}`}>
                              {Math.round(score * 100)}%
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Info */}
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-red-800 dark:text-red-200">
                    Content Moderation Features
                  </h4>
                  <ul className="text-sm text-red-700 dark:text-red-300 mt-2 space-y-1">
                    <li>• AI-powered content analysis for multiple categories</li>
                    <li>• Detailed scoring for hate speech, violence, and inappropriate content</li>
                    <li>• Real-time moderation with confidence scores</li>
                    <li>• Helps maintain safe and compliant content environments</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
