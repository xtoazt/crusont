'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import Navigation from '@/components/Navigation'
import { Code, MessageSquare, Zap, ArrowRight, Sparkles } from 'lucide-react'

export default function Home() {
  const { user } = useAuth()

  const features = [
    {
      name: 'Code',
      description: 'Generate, edit, and collaborate on code with AI assistance',
      icon: Code,
      href: '/code',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      name: 'Chat',
      description: 'Have intelligent conversations with advanced AI models',
      icon: MessageSquare,
      href: '/chat',
      color: 'from-green-500 to-emerald-500',
    },
    {
      name: 'Super',
      description: 'Get the best answers using multiple AI models combined',
      icon: Zap,
      href: '/super',
      color: 'from-purple-500 to-pink-500',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center py-24">
          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl animate-pulse">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur opacity-30 animate-pulse"></div>
            </div>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
              Crusont
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            An AI-powered development platform that combines the best of{' '}
            <span className="font-semibold text-blue-600 dark:text-blue-400">Code generation</span>,{' '}
            <span className="font-semibold text-green-600 dark:text-green-400">intelligent Chat</span>, and{' '}
            <span className="font-semibold text-purple-600 dark:text-purple-400">Super-powered responses</span>{' '}
            using multiple AI models.
          </p>

          {user ? (
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/code"
                className="group inline-flex items-center px-10 py-4 border border-transparent text-lg font-semibold rounded-2xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                Start Coding
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/chat"
                className="group inline-flex items-center px-10 py-4 border-2 border-gray-300 dark:border-gray-600 text-lg font-semibold rounded-2xl text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Start Chatting
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/register"
                className="group inline-flex items-center px-10 py-4 border border-transparent text-lg font-semibold rounded-2xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                Get Started
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="group inline-flex items-center px-10 py-4 border-2 border-gray-300 dark:border-gray-600 text-lg font-semibold rounded-2xl text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="py-24">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Powerful AI Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Choose from our three main features, each powered by advanced AI models and designed for maximum productivity
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Link
                  key={feature.name}
                  href={feature.href}
                  className="group relative bg-white dark:bg-gray-800 rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-200 dark:border-gray-700 hover:border-transparent transform hover:-translate-y-2"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative">
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      {feature.name}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg leading-relaxed">
                      {feature.description}
                    </p>
                    
                    <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold text-lg group-hover:translate-x-3 transition-transform duration-300">
                      Try {feature.name}
                      <ArrowRight className="ml-3 w-5 h-5" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Developer Section */}
        <div className="py-24 bg-gradient-to-r from-white via-blue-50 to-indigo-50 dark:from-gray-800 dark:via-blue-900/20 dark:to-indigo-900/20 rounded-3xl mb-24 shadow-2xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Developer Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Unlock advanced AI capabilities with a developer account and access premium features
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              'Text-to-Speech',
              'Image Upscaling',
              'Text Translation',
              'Content Moderation',
              'Embeddings',
              'Advanced Analytics'
            ].map((feature, index) => (
              <div
                key={feature}
                className="group flex items-center space-x-4 p-6 bg-white dark:bg-gray-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full group-hover:scale-125 transition-transform"></div>
                <span className="text-gray-700 dark:text-gray-300 font-medium text-lg">{feature}</span>
              </div>
            ))}
          </div>

          {!user && (
            <div className="text-center mt-12">
              <Link
                href="/register"
                className="group inline-flex items-center px-10 py-4 border border-transparent text-lg font-semibold rounded-2xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                Create Developer Account
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
