'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import Navigation from '@/components/Navigation'
import { Languages, Copy, Volume2, RotateCcw } from 'lucide-react'
import toast from 'react-hot-toast'

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
]

export default function TranslatePage() {
  const { user, token } = useAuth()
  const [text, setText] = useState('')
  const [translatedText, setTranslatedText] = useState('')
  const [sourceLanguage, setSourceLanguage] = useState('auto')
  const [targetLanguage, setTargetLanguage] = useState('es')
  const [loading, setLoading] = useState(false)
  const [detectedLanguage, setDetectedLanguage] = useState('')

  const translateText = async () => {
    if (!text.trim()) {
      toast.error('Please enter text to translate')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/developer/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          text,
          target_language: targetLanguage,
          source_language: sourceLanguage === 'auto' ? undefined : sourceLanguage,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setTranslatedText(data.translated_text)
        setDetectedLanguage(data.source_language)
        toast.success('Text translated successfully!')
      } else {
        toast.error('Failed to translate text')
      }
    } catch {
      toast.error('Failed to translate text')
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

  const speakText = (textToSpeak: string, language: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(textToSpeak)
      utterance.lang = language
      speechSynthesis.speak(utterance)
    } else {
      toast.error('Speech synthesis not supported')
    }
  }

  const swapLanguages = () => {
    if (sourceLanguage !== 'auto') {
      const temp = sourceLanguage
      setSourceLanguage(targetLanguage)
      setTargetLanguage(temp)
      
      // Swap texts
      const tempText = text
      setText(translatedText)
      setTranslatedText(tempText)
    }
  }

  const resetTranslation = () => {
    setText('')
    setTranslatedText('')
    setDetectedLanguage('')
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Please sign in to access Translation
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              You need to be logged in to use the translation features.
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
              You need a developer account to access translation features.
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
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <Languages className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Text Translation
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Translate text between multiple languages using AI
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Language Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  From
                </label>
                <select
                  value={sourceLanguage}
                  onChange={(e) => setSourceLanguage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="auto">Auto-detect</option>
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={swapLanguages}
                  className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  title="Swap languages"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  To
                </label>
                <select
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Translation Areas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Source Text */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Source Text
                  </label>
                  {detectedLanguage && (
                    <span className="text-xs text-blue-600 dark:text-blue-400">
                      Detected: {languages.find(l => l.code === detectedLanguage)?.name || detectedLanguage}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter text to translate..."
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={8}
                  />
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <button
                      onClick={() => copyText(text)}
                      className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                      title="Copy text"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => speakText(text, sourceLanguage === 'auto' ? 'en' : sourceLanguage)}
                      className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                      title="Speak text"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {text.length} characters
                </p>
              </div>

              {/* Translated Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Translated Text
                </label>
                <div className="relative">
                  <textarea
                    value={translatedText}
                    readOnly
                    placeholder="Translation will appear here..."
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                    rows={8}
                  />
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <button
                      onClick={() => copyText(translatedText)}
                      className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                      title="Copy translation"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => speakText(translatedText, targetLanguage)}
                      className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                      title="Speak translation"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {translatedText.length} characters
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={translateText}
                disabled={loading || !text.trim()}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Translating...</span>
                  </>
                ) : (
                  <>
                    <Languages className="w-4 h-4" />
                    <span>Translate</span>
                  </>
                )}
              </button>

              <button
                onClick={resetTranslation}
                className="flex items-center space-x-2 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>

            {/* Info */}
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Languages className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-orange-800 dark:text-orange-200">
                    Translation Features
                  </h4>
                  <ul className="text-sm text-orange-700 dark:text-orange-300 mt-2 space-y-1">
                    <li>• Support for 12+ languages with auto-detection</li>
                    <li>• High-quality AI-powered translations</li>
                    <li>• Text-to-speech for both source and translated text</li>
                    <li>• Copy functionality for easy sharing</li>
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
