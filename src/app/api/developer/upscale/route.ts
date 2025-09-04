import { NextRequest, NextResponse } from 'next/server'
import { getUserFromToken } from '@/lib/auth'
import { zukijourneyAPI, ImageUpscaleRequest } from '@/lib/zukijourney'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const user = await getUserFromToken(token)

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // Check if user is a developer
    if (user.accountType !== 'DEVELOPER') {
      return NextResponse.json(
        { error: 'Developer account required' },
        { status: 403 }
      )
    }

    const { image, scale } = await request.json()

    if (!image) {
      return NextResponse.json(
        { error: 'Image is required' },
        { status: 400 }
      )
    }

    // Upscale image
    const response = await zukijourneyAPI.upscaleImage({
      image,
      scale,
    })

    return NextResponse.json({
      image: response.image,
      original_size: response.original_size,
      upscaled_size: response.upscaled_size,
    })
  } catch (error) {
    console.error('Image upscaling error:', error)
    return NextResponse.json(
      { error: 'Failed to upscale image' },
      { status: 500 }
    )
  }
}
