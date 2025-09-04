'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import Navigation from '@/components/Navigation'
import { Code, MessageSquare, Zap, ArrowRight, Sparkles, Play } from 'lucide-react'

export default function Home() {
  const { user } = useAuth()

  const features = [
    {
      name: 'Code',
      description: 'Generate and edit code with AI',
      icon: Code,
      href: '/code',
      color: 'text-blue-600',
    },
    {
      name: 'Chat',
      description: 'Talk to advanced AI models',
      icon: MessageSquare,
      href: '/chat',
      color: 'text-green-600',
    },
    {
      name: 'Super',
      description: 'Multi-model AI responses',
      icon: Zap,
      href: '/super',
      color: 'text-purple-600',
    },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navigation />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center py-32">
          <div className="inline-flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300 mb-8">
            <Sparkles className="w-4 h-4 mr-2 text-blue-500" />
            AI-Powered Development
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Build with{' '}
            <span className="text-blue-600 dark:text-blue-400">
              AI
            </span>
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Generate code, chat with AI, and supercharge your development workflow. No email required.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Started
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Everything you need to build
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Powerful AI tools for modern development
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Link
                key={feature.name}
                href={feature.href}
                className="group p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
              >
                <div className={`w-12 h-12 ${feature.color} mb-4`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {feature.description}
                </p>
                <div className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300">
                  Try it out
                  <ArrowRight className="ml-1 w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Developer Features */}
        {user?.accountType === 'DEVELOPER' && (
          <div className="py-24 border-t border-gray-200 dark:border-gray-800">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Developer Tools
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Advanced features for developers
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link
                href="/developer/tts"
                className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Text to Speech</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Convert text to audio</p>
              </Link>
              <Link
                href="/developer/translate"
                className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Translation</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Multi-language support</p>
              </Link>
              <Link
                href="/developer/upscale"
                className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Image Upscaling</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">AI-powered enhancement</p>
              </Link>
              <Link
                href="/developer/moderate"
                className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Content Moderation</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">AI safety analysis</p>
              </Link>
              <Link
                href="/developer/embeddings"
                className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Embeddings</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Vector representations</p>
              </Link>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="py-24 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Join thousands of developers building with AI
          </p>
          <Link
            href="/register"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Play className="mr-2 w-4 h-4" />
            Start Building
          </Link>
        </div>
      </main>
    </div>
  )
}