'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import Navigation from '@/components/Navigation'
import { Code, Play, Save, FileText, Download, Upload } from 'lucide-react'
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
  const [framework, setFramework] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [code, setCode] = useState('// Start coding here...\nconsole.log("Hello, World!");')

  useEffect(() => {
    if (user && token) {
      fetchProjects()
    }
  }, [user, token])

  const fetchProjects = async () => {
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
  }

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
    } catch (error) {
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
    } catch (error) {
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
                    onClick={() => loadProject(project)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      currentProject?.id === project.id
                        ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                        : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                      {project.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {project.language} • {new Date(project.updatedAt).toLocaleDateString()}
                    </p>
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
    </div>
  )
}
