import { NextRequest, NextResponse } from 'next/server'
import { getUserFromToken } from '@/lib/auth'
import { zukijourneyAPI } from '@/lib/zukijourney'
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

    const { query, context } = await request.json()

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      )
    }

    // Use Super feature with multiple models
    const response = await zukijourneyAPI.superQuery({
      query,
      context,
    })

    // Save super query to database
    const superQuery = await prisma.superQuery.create({
      data: {
        userId: user.id,
        query,
        response: response.response,
        models: response.models,
      },
    })

    return NextResponse.json({
      response: response.response,
      models: response.models,
      confidence: response.confidence,
      reasoning: response.reasoning,
      queryId: superQuery.id,
    })
  } catch (error) {
    console.error('Super query error:', error)
    return NextResponse.json(
      { error: 'Failed to process super query' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const queryId = searchParams.get('id')

    if (queryId) {
      // Get specific query
      const query = await prisma.superQuery.findFirst({
        where: {
          id: queryId,
          userId: user.id,
        },
      })

      if (!query) {
        return NextResponse.json(
          { error: 'Query not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({ query })
    } else {
      // Get all user's super queries
      const queries = await prisma.superQuery.findMany({
        where: {
          userId: user.id,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      return NextResponse.json({ queries })
    }
  } catch (error) {
    console.error('Get super queries error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch super queries' },
      { status: 500 }
    )
  }
}
