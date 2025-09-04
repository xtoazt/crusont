import { NextRequest, NextResponse } from 'next/server'
import { getUserFromToken } from '@/lib/auth'
import { zukijourneyAPI, CodeGenerationRequest } from '@/lib/zukijourney'
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

    const { prompt, language, framework, title, description } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    // Generate code
    const response = await zukijourneyAPI.generateCode({
      prompt,
      language,
      framework,
    })

    // Save code project to database
    const codeProject = await prisma.codeProject.create({
      data: {
        userId: user.id,
        title: title || `Code Project - ${new Date().toLocaleDateString()}`,
        description: description || response.explanation,
        code: response.code,
        language: response.language,
      },
    })

    return NextResponse.json({
      code: response.code,
      explanation: response.explanation,
      language: response.language,
      projectId: codeProject.id,
    })
  } catch (error) {
    console.error('Code generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate code' },
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
    const projectId = searchParams.get('id')

    if (projectId) {
      // Get specific project
      const project = await prisma.codeProject.findFirst({
        where: {
          id: projectId,
          userId: user.id,
        },
      })

      if (!project) {
        return NextResponse.json(
          { error: 'Project not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({ project })
    } else {
      // Get all user's projects
      const projects = await prisma.codeProject.findMany({
        where: {
          userId: user.id,
        },
        orderBy: {
          updatedAt: 'desc',
        },
      })

      return NextResponse.json({ projects })
    }
  } catch (error) {
    console.error('Get code projects error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch code projects' },
      { status: 500 }
    )
  }
}
