import { NextRequest, NextResponse } from 'next/server'
import { createUser } from '@/lib/auth'
import { AccountType } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const { username, password, accountType, apiKey } = await request.json()

    // Validate required fields
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    // Generate internal email
    const email = `${username}@crusont.internal`

    // Validate account type
    if (accountType && !Object.values(AccountType).includes(accountType)) {
      return NextResponse.json(
        { error: 'Invalid account type' },
        { status: 400 }
      )
    }

    // If developer account, API key is required
    if (accountType === 'DEVELOPER' && !apiKey) {
      return NextResponse.json(
        { error: 'API key is required for developer accounts' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    const result = await createUser(email, username, password, accountType || 'USER', apiKey)

    return NextResponse.json({
      message: 'User created successfully',
      user: result.user,
      token: result.token,
    })
  } catch (error: unknown) {
    console.error('Registration error:', error)
    
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Email or username already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
