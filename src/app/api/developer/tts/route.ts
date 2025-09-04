import { NextRequest, NextResponse } from 'next/server'
import { getUserFromToken } from '@/lib/auth'
import { zukijourneyAPI, TextToSpeechRequest } from '@/lib/zukijourney'

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

    const { text, voice, speed } = await request.json()

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      )
    }

    // Generate speech
    const audioBuffer = await zukijourneyAPI.textToSpeech({
      text,
      voice,
      speed,
    })

    // Convert to base64
    const base64Audio = Buffer.from(audioBuffer).toString('base64')

    return NextResponse.json({
      audio: base64Audio,
      format: 'mp3',
    })
  } catch (error) {
    console.error('Text-to-speech error:', error)
    return NextResponse.json(
      { error: 'Failed to generate speech' },
      { status: 500 }
    )
  }
}
