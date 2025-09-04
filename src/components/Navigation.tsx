'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { Menu, X, Zap, Code, MessageSquare, Sparkles, ChevronDown, LogOut, User, Star } from 'lucide-react'

export default function Navigation() {
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDeveloperMenuOpen, setIsDeveloperMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setIsMenuOpen(false)
  }

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Crusont
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/code"
              className="group flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Code className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Code</span>
            </Link>
            <Link
              href="/chat"
              className="group flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <MessageSquare className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Chat</span>
            </Link>
            <Link
              href="/super"
              className="group flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Super</span>
            </Link>

            {/* Developer Menu */}
            {user?.accountType === 'DEVELOPER' && (
              <div className="relative">
                <button
                  onClick={() => setIsDeveloperMenuOpen(!isDeveloperMenuOpen)}
                  className="group flex items-center space-x-1 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Star className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Developer</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isDeveloperMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isDeveloperMenuOpen && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                    <div className="py-2">
                      <Link
                        href="/developer/tts"
                        className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        onClick={() => setIsDeveloperMenuOpen(false)}
                      >
                        <span className="text-lg">🎤</span>
                        <span>Text to Speech</span>
                      </Link>
                      <Link
                        href="/developer/translate"
                        className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        onClick={() => setIsDeveloperMenuOpen(false)}
                      >
                        <span className="text-lg">🌍</span>
                        <span>Translation</span>
                      </Link>
                      <Link
                        href="/developer/upscale"
                        className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        onClick={() => setIsDeveloperMenuOpen(false)}
                      >
                        <span className="text-lg">🖼️</span>
                        <span>Image Upscaling</span>
                      </Link>
                      <Link
                        href="/developer/moderate"
                        className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        onClick={() => setIsDeveloperMenuOpen(false)}
                      >
                        <span className="text-lg">🛡️</span>
                        <span>Content Moderation</span>
                      </Link>
                      <Link
                        href="/developer/embeddings"
                        className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        onClick={() => setIsDeveloperMenuOpen(false)}
                      >
                        <span className="text-lg">🧠</span>
                        <span>Embeddings</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Menu */}
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user.username}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md">
            <div className="py-4 space-y-2">
              <Link
                href="/code"
                className="flex items-center space-x-3 px-4 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded-lg mx-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Code className="w-5 h-5" />
                <span className="font-medium">Code</span>
              </Link>
              <Link
                href="/chat"
                className="flex items-center space-x-3 px-4 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded-lg mx-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <MessageSquare className="w-5 h-5" />
                <span className="font-medium">Chat</span>
              </Link>
              <Link
                href="/super"
                className="flex items-center space-x-3 px-4 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded-lg mx-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Sparkles className="w-5 h-5" />
                <span className="font-medium">Super</span>
              </Link>

              {/* Developer Links */}
              {user?.accountType === 'DEVELOPER' && (
                <div className="px-2">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Developer Tools
                  </div>
                  <Link
                    href="/developer/tts"
                    className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="text-lg">🎤</span>
                    <span>Text to Speech</span>
                  </Link>
                  <Link
                    href="/developer/translate"
                    className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="text-lg">🌍</span>
                    <span>Translation</span>
                  </Link>
                  <Link
                    href="/developer/upscale"
                    className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="text-lg">🖼️</span>
                    <span>Image Upscaling</span>
                  </Link>
                  <Link
                    href="/developer/moderate"
                    className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="text-lg">🛡️</span>
                    <span>Content Moderation</span>
                  </Link>
                  <Link
                    href="/developer/embeddings"
                    className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="text-lg">🧠</span>
                    <span>Embeddings</span>
                  </Link>
                </div>
              )}

              {/* User Actions */}
              {user ? (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 mx-2">
                  <div className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">{user.username}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-4 py-3 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors rounded-lg w-full"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 mx-2 space-y-2">
                  <Link
                    href="/login"
                    className="block px-4 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded-lg font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="block px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-center font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}