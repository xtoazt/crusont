import { NextRequest, NextResponse } from 'next/server'
import { getUserFromToken } from '@/lib/auth'
import { zukijourneyAPI } from '@/lib/zukijourney'

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

    const { text, target_language, source_language } = await request.json()

    if (!text || !target_language) {
      return NextResponse.json(
        { error: 'Text and target language are required' },
        { status: 400 }
      )
    }

    // Translate text
    const response = await zukijourneyAPI.translate({
      text,
      target_language,
      source_language,
    })

    return NextResponse.json({
      translated_text: response.translated_text,
      source_language: response.source_language,
      target_language: response.target_language,
    })
  } catch (error) {
    console.error('Translation error:', error)
    return NextResponse.json(
      { error: 'Failed to translate text' },
      { status: 500 }
    )
  }
}
