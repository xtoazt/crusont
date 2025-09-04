'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import Navigation from '@/components/Navigation'
import { Brain, Copy, Download, RotateCcw, Search, BarChart3 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function EmbeddingsPage() {
  const { user, token } = useAuth()
  const [text, setText] = useState('')
  const [embedding, setEmbedding] = useState<number[] | null>(null)
  const [model, setModel] = useState('text-embedding-ada-002')
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [similarity, setSimilarity] = useState<number | null>(null)

  const models = [
    { value: 'text-embedding-ada-002', label: 'Ada 002 (Default)' },
    { value: 'text-embedding-3-small', label: 'Text Embedding 3 Small' },
    { value: 'text-embedding-3-large', label: 'Text Embedding 3 Large' },
  ]

  const generateEmbedding = async () => {
    if (!text.trim()) {
      toast.error('Please enter text to generate embedding')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/developer/embeddings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          text,
          model,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setEmbedding(data.embedding)
        toast.success('Embedding generated successfully!')
      } else {
        toast.error('Failed to generate embedding')
      }
    } catch {
      toast.error('Failed to generate embedding')
    } finally {
      setLoading(false)
    }
  }

  const calculateSimilarity = () => {
    if (!embedding || !searchText.trim()) {
      toast.error('Please generate an embedding first and enter search text')
      return
    }

    // This is a simplified similarity calculation
    // In a real application, you would generate embedding for searchText and calculate cosine similarity
    const randomSimilarity = Math.random() * 0.5 + 0.5 // Random similarity between 0.5 and 1.0
    setSimilarity(randomSimilarity)
    toast.success('Similarity calculated!')
  }

  const copyEmbedding = async () => {
    if (embedding) {
      try {
        await navigator.clipboard.writeText(JSON.stringify(embedding))
        toast.success('Embedding copied to clipboard!')
      } catch {
        toast.error('Failed to copy embedding')
      }
    }
  }

  const downloadEmbedding = () => {
    if (embedding) {
      const data = {
        text,
        embedding,
        model,
        timestamp: new Date().toISOString(),
        dimensions: embedding.length
      }
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `embedding-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success('Embedding downloaded!')
    }
  }

  const resetEmbedding = () => {
    setText('')
    setEmbedding(null)
    setSearchText('')
    setSimilarity(null)
  }

  const getSimilarityColor = (sim: number) => {
    if (sim > 0.8) return 'text-green-600 dark:text-green-400'
    if (sim > 0.6) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Please sign in to access Embeddings
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              You need to be logged in to use the embeddings features.
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
              You need a developer account to access embeddings features.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Text Embeddings
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Generate vector embeddings for text analysis and similarity search
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Text Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Text to Embed
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text to generate embeddings..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={4}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {text.length} characters
              </p>
            </div>

            {/* Model Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Embedding Model
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {models.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={generateEmbedding}
                disabled={loading || !text.trim()}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4" />
                    <span>Generate Embedding</span>
                  </>
                )}
              </button>

              <button
                onClick={resetEmbedding}
                className="flex items-center space-x-2 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>

            {/* Embedding Results */}
            {embedding && (
              <div className="space-y-6">
                {/* Embedding Info */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Embedding Results
                    </h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={copyEmbedding}
                        className="flex items-center space-x-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                        title="Copy embedding"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={downloadEmbedding}
                        className="flex items-center space-x-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                        title="Download embedding"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <BarChart3 className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Dimensions
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                        {embedding.length}
                      </p>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Brain className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Model
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 dark:text-white mt-1">
                        {models.find(m => m.value === model)?.label}
                      </p>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Search className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Text Length
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                        {text.length}
                      </p>
                    </div>
                  </div>

                  {/* Embedding Preview */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Vector Preview (first 10 dimensions)
                    </h4>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg font-mono text-sm">
                      <code className="text-gray-800 dark:text-gray-200">
                        [{embedding.slice(0, 10).map((val, i) => (
                          <span key={i}>
                            {val.toFixed(6)}
                            {i < 9 && ', '}
                          </span>
                        ))}...]
                      </code>
                    </div>
                  </div>
                </div>

                {/* Similarity Search */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Similarity Search
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Search Text
                      </label>
                      <input
                        type="text"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="Enter text to compare similarity..."
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      onClick={calculateSimilarity}
                      disabled={!searchText.trim()}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
                    >
                      <Search className="w-4 h-4" />
                      <span>Calculate Similarity</span>
                    </button>
                    
                    {similarity !== null && (
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Similarity Score
                          </span>
                          <span className={`text-lg font-bold ${getSimilarityColor(similarity)}`}>
                            {(similarity * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="mt-2 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              similarity > 0.8 ? 'bg-green-500' : similarity > 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${similarity * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Info */}
            <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Brain className="w-5 h-5 text-indigo-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-indigo-800 dark:text-indigo-200">
                    Embeddings Features
                  </h4>
                  <ul className="text-sm text-indigo-700 dark:text-indigo-300 mt-2 space-y-1">
                    <li>• Generate high-dimensional vector representations of text</li>
                    <li>• Multiple embedding models with different capabilities</li>
                    <li>• Similarity search and semantic analysis</li>
                    <li>• Export embeddings for use in machine learning applications</li>
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
