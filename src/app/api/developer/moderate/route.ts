import { NextRequest, NextResponse } from 'next/server'
import { getUserFromToken } from '@/lib/auth'
import { zukijourneyAPI, ModerationRequest } from '@/lib/zukijourney'

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

    const { text } = await request.json()

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      )
    }

    // Moderate text
    const response = await zukijourneyAPI.moderate({
      text,
    })

    return NextResponse.json({
      flagged: response.flagged,
      categories: response.categories,
      category_scores: response.category_scores,
    })
  } catch (error) {
    console.error('Moderation error:', error)
    return NextResponse.json(
      { error: 'Failed to moderate text' },
      { status: 500 }
    )
  }
}
