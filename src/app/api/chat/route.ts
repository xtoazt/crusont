import { NextRequest, NextResponse } from 'next/server'
import { getUserFromToken } from '@/lib/auth'
import { zukijourneyAPI, ChatMessage } from '@/lib/zukijourney'
import { prisma } from '@/lib/db'

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

    const { message, history = [] } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Build conversation history
    const messages: ChatMessage[] = [
      { role: 'system', content: 'You are a helpful AI assistant. Provide clear, accurate, and helpful responses.' },
      ...history,
      { role: 'user', content: message }
    ]

    // Get AI response
    const response = await zukijourneyAPI.chat(messages)

    // Save messages to database
    await prisma.chatMessage.createMany({
      data: [
        {
          userId: user.id,
          content: message,
          role: 'USER',
        },
        {
          userId: user.id,
          content: response.content,
          role: 'ASSISTANT',
        },
      ],
    })

    return NextResponse.json({
      response: response.content,
      model: response.model,
      usage: response.usage,
    })
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    )
  }
}
