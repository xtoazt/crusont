'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/lib/auth-context'
import Navigation from '@/components/Navigation'
import { Code, Play, Save, FileText, Copy, Download, Share2, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import dynamic from 'next/dynamic'

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

interface CodeProject {
  id: string
  title: string
  description: string | null
  code: string
  language: string
  createdAt: string
  updatedAt: string
}

export default function CodePage() {
  const { user, token } = useAuth()
  const [projects, setProjects] = useState<CodeProject[]>([])
  const [currentProject, setCurrentProject] = useState<CodeProject | null>(null)
  const [prompt, setPrompt] = useState('')
  const [language, setLanguage] = useState('javascript')
  const [framework] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [code, setCode] = useState('// Start coding here...\nconsole.log("Hello, World!");')
  const [showShareModal, setShowShareModal] = useState(false)
  const [shareUrl, setShareUrl] = useState('')

  const fetchProjects = useCallback(async () => {
    try {
      const response = await fetch('/api/code', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setProjects(data.projects)
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    }
  }, [token])

  useEffect(() => {
    if (user && token) {
      fetchProjects()
    }
  }, [user, token, fetchProjects])

  const generateCode = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          prompt,
          language,
          framework,
          title: title || `Code Project - ${new Date().toLocaleDateString()}`,
          description,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setCode(data.code)
        setTitle(data.projectId ? `Project ${data.projectId}` : title)
        toast.success('Code generated successfully!')
        fetchProjects() // Refresh projects list
      } else {
        toast.error('Failed to generate code')
      }
    } catch {
      toast.error('Failed to generate code')
    } finally {
      setLoading(false)
    }
  }

  const saveProject = async () => {
    if (!title.trim()) {
      toast.error('Please enter a project title')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          prompt: `Save project: ${title}`,
          language,
          framework,
          title,
          description,
          code,
        }),
      })

      if (response.ok) {
        toast.success('Project saved successfully!')
        fetchProjects()
      } else {
        toast.error('Failed to save project')
      }
    } catch {
      toast.error('Failed to save project')
    } finally {
      setLoading(false)
    }
  }

  const loadProject = (project: CodeProject) => {
    setCurrentProject(project)
    setCode(project.code)
    setTitle(project.title)
    setDescription(project.description || '')
    setLanguage(project.language)
  }

  const newProject = () => {
    setCurrentProject(null)
    setCode('// Start coding here...\nconsole.log("Hello, World!");')
    setTitle('')
    setDescription('')
    setPrompt('')
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code)
      toast.success('Code copied to clipboard!')
    } catch {
      toast.error('Failed to copy code')
    }
  }

  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title || 'code'}.${language}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Code downloaded!')
  }

  const shareProject = () => {
    if (currentProject) {
      const url = `${window.location.origin}/code?share=${currentProject.id}`
      setShareUrl(url)
      setShowShareModal(true)
    } else {
      toast.error('Please save the project first')
    }
  }

  const deleteProject = async (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        const response = await fetch(`/api/code?id=${projectId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })

        if (response.ok) {
          toast.success('Project deleted successfully!')
          fetchProjects()
          if (currentProject?.id === projectId) {
            newProject()
          }
        } else {
          toast.error('Failed to delete project')
        }
      } catch {
        toast.error('Failed to delete project')
      }
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Please sign in to access Code
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              You need to be logged in to use the code generation features.
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
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Projects
                </h3>
                <button
                  onClick={newProject}
                  className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  title="New Project"
                >
                  <FileText className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className={`group p-3 rounded-lg transition-all duration-200 ${
                      currentProject?.id === project.id
                        ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                        : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    <div 
                      onClick={() => loadProject(project)}
                      className="cursor-pointer"
                    >
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                        {project.title}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {project.language} • {new Date(project.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center justify-end mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => deleteProject(project.id)}
                        className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                        title="Delete project"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              {/* Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Code className="w-6 h-6 text-blue-600" />
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Code Generator
                    </h1>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={copyCode}
                      className="flex items-center space-x-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
                      title="Copy code"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={downloadCode}
                      className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                      title="Download code"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={shareProject}
                      className="flex items-center space-x-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
                      title="Share project"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={saveProject}
                      disabled={loading}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save</span>
                    </button>
                  </div>
                </div>

                {/* Project Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Project Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter project title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Language
                    </label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="javascript">JavaScript</option>
                      <option value="typescript">TypeScript</option>
                      <option value="python">Python</option>
                      <option value="java">Java</option>
                      <option value="cpp">C++</option>
                      <option value="html">HTML</option>
                      <option value="css">CSS</option>
                      <option value="sql">SQL</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter project description"
                  />
                </div>
              </div>

              {/* Prompt Section */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  AI Prompt
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe what you want to build..."
                  />
                  <button
                    onClick={generateCode}
                    disabled={loading}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50"
                  >
                    <Play className="w-4 h-4" />
                    <span>{loading ? 'Generating...' : 'Generate'}</span>
                  </button>
                </div>
              </div>

              {/* Code Editor */}
              <div className="h-96">
                <MonacoEditor
                  height="100%"
                  language={language}
                  value={code}
                  onChange={(value) => setCode(value || '')}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Share Project
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Share URL
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(shareUrl)
                      toast.success('URL copied to clipboard!')
                    }}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-r-md transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
