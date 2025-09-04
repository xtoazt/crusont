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
      description: 'Generate and edit code with AI assistance',
      icon: Code,
      href: '/code',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      name: 'Chat',
      description: 'Have intelligent conversations with AI',
      icon: MessageSquare,
      href: '/chat',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      name: 'Super',
      description: 'Multi-model AI for the best responses',
      icon: Zap,
      href: '/super',
      gradient: 'from-purple-500 to-pink-500',
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
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur opacity-30"></div>
            </div>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Crusont
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            The ultimate AI-powered development platform. Generate code, chat with AI, and supercharge your projects.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/register"
              className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center px-8 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white font-semibold rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Sign In
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">10K+</div>
              <div className="text-gray-600 dark:text-gray-400">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">1M+</div>
              <div className="text-gray-600 dark:text-gray-400">Lines Generated</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">99.9%</div>
              <div className="text-gray-600 dark:text-gray-400">Uptime</div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Everything you need to{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                build
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Powerful AI tools designed for modern developers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Link
                key={feature.name}
                href={feature.href}
                className="group relative p-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {feature.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  {feature.description}
                </p>
                <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium group-hover:translate-x-2 transition-transform duration-300">
                  Try it out
                  <ArrowRight className="ml-2 w-4 h-4" />
                </div>
                <div className="absolute top-4 right-4 text-2xl font-bold text-gray-200 dark:text-gray-700">
                  {String(index + 1).padStart(2, '0')}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Developer Features */}
        {user?.accountType === 'DEVELOPER' && (
          <div className="py-24 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Developer{' '}
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Tools
                </span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Advanced features for professional developers
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Text to Speech', href: '/developer/tts', icon: '🎤' },
                { name: 'Translation', href: '/developer/translate', icon: '🌍' },
                { name: 'Image Upscaling', href: '/developer/upscale', icon: '🖼️' },
                { name: 'Content Moderation', href: '/developer/moderate', icon: '🛡️' },
                { name: 'Embeddings', href: '/developer/embeddings', icon: '🧠' },
              ].map((tool) => (
                <Link
                  key={tool.name}
                  href={tool.href}
                  className="group p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="text-3xl mb-4">{tool.icon}</div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Advanced AI capabilities
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="py-24 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Ready to{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                supercharge
              </span>{' '}
              your development?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
              Join thousands of developers who are already building the future with AI
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Play className="mr-2 w-5 h-5" />
                Start Building Now
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/code"
                className="inline-flex items-center px-8 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white font-semibold rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Code className="mr-2 w-5 h-5" />
                Try Code Generator
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}