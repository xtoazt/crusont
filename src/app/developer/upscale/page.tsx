'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import Navigation from '@/components/Navigation'
import { Image, Upload, Download, RotateCcw, ZoomIn } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ImageUpscalePage() {
  const { user, token } = useAuth()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [upscaledUrl, setUpscaledUrl] = useState<string | null>(null)
  const [scale, setScale] = useState(2)
  const [loading, setLoading] = useState(false)
  const [originalSize, setOriginalSize] = useState<{ width: number; height: number } | null>(null)
  const [upscaledSize, setUpscaledSize] = useState<{ width: number; height: number } | null>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('File size must be less than 10MB')
        return
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file')
        return
      }

      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      
      // Get image dimensions
      const img = new window.Image()
      img.alt = 'Preview image'
      img.onload = () => {
        setOriginalSize({ width: img.width, height: img.height })
      }
      img.src = url
    }
  }

  const upscaleImage = async () => {
    if (!selectedFile) {
      toast.error('Please select an image first')
      return
    }

    setLoading(true)
    try {
      // Convert file to base64
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onload = () => {
          const result = reader.result as string
          resolve(result.split(',')[1]) // Remove data:image/...;base64, prefix
        }
        reader.readAsDataURL(selectedFile)
      })

      const response = await fetch('/api/developer/upscale', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          image: base64,
          scale,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setUpscaledUrl(`data:image/png;base64,${data.image}`)
        setUpscaledSize(data.upscaled_size)
        toast.success('Image upscaled successfully!')
      } else {
        toast.error('Failed to upscale image')
      }
    } catch {
      toast.error('Failed to upscale image')
    } finally {
      setLoading(false)
    }
  }

  const downloadUpscaledImage = () => {
    if (upscaledUrl) {
      const link = document.createElement('a')
      link.href = upscaledUrl
      link.download = `upscaled-${selectedFile?.name || 'image'}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success('Image downloaded!')
    }
  }

  const resetImage = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setUpscaledUrl(null)
    setOriginalSize(null)
    setUpscaledSize(null)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Please sign in to access Image Upscaling
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              You need to be logged in to use the image upscaling features.
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
              You need a developer account to access image upscaling features.
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
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Image className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Image Upscaling
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Enhance image quality using AI-powered upscaling
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Image
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Click to upload or drag and drop
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </span>
                </label>
              </div>
            </div>

            {/* Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Scale Factor: {scale}x
                </label>
                <input
                  type="range"
                  min="2"
                  max="4"
                  step="1"
                  value={scale}
                  onChange={(e) => setScale(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>2x</span>
                  <span>3x</span>
                  <span>4x</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={upscaleImage}
                  disabled={loading || !selectedFile}
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Upscaling...</span>
                    </>
                  ) : (
                    <>
                      <ZoomIn className="w-4 h-4" />
                      <span>Upscale Image</span>
                    </>
                  )}
                </button>

                <button
                  onClick={resetImage}
                  className="flex items-center space-x-2 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Image Comparison */}
            {(previewUrl || upscaledUrl) && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Original Image */}
                {previewUrl && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Original Image
                    </h3>
                    <div className="relative">
                      <img
                        src={previewUrl}
                        alt="Original image"
                        className="w-full h-auto rounded-lg shadow-lg"
                      />
                      {originalSize && (
                        <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                          {originalSize.width} × {originalSize.height}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Upscaled Image */}
                {upscaledUrl && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Upscaled Image ({scale}x)
                      </h3>
                      <button
                        onClick={downloadUpscaledImage}
                        className="flex items-center space-x-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </button>
                    </div>
                    <div className="relative">
                      <img
                        src={upscaledUrl}
                        alt="Upscaled image"
                        className="w-full h-auto rounded-lg shadow-lg"
                      />
                      {upscaledSize && (
                        <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                          {upscaledSize.width} × {upscaledSize.height}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Info */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Image className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    Image Upscaling Features
                  </h4>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 mt-2 space-y-1">
                    <li>• AI-powered image enhancement up to 4x resolution</li>
                    <li>• Support for PNG, JPG, and GIF formats</li>
                    <li>• Preserves image quality and details</li>
                    <li>• Batch processing capabilities</li>
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
