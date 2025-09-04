import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from './db'
import { AccountType } from '@prisma/client'

export interface User {
  id: string
  email: string
  username: string
  accountType: AccountType
  isActive: boolean
}

export interface AuthResult {
  user: User
  token: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '7d' })
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
  } catch {
    return null
  }
}

export async function createUser(
  email: string,
  username: string,
  password: string,
  accountType: AccountType = 'USER',
  apiKey?: string
): Promise<AuthResult> {
  const hashedPassword = await hashPassword(password)
  
  const user = await prisma.user.create({
    data: {
      email,
      username,
      password: hashedPassword,
      accountType,
    },
  })

  // If it's a developer account and API key is provided, store it
  if (accountType === 'DEVELOPER' && apiKey) {
    await prisma.apiKey.create({
      data: {
        userId: user.id,
        key: apiKey,
      },
    })
  }

  const token = generateToken(user.id)

  // Create session
  await prisma.session.create({
    data: {
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  })

  return {
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      accountType: user.accountType,
      isActive: user.isActive,
    },
    token,
  }
}

export async function authenticateUser(email: string, password: string): Promise<AuthResult | null> {
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user || !user.isActive) {
    return null
  }

  const isValidPassword = await verifyPassword(password, user.password)
  if (!isValidPassword) {
    return null
  }

  const token = generateToken(user.id)

  // Create session
  await prisma.session.create({
    data: {
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  })

  return {
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      accountType: user.accountType,
      isActive: user.isActive,
    },
    token,
  }
}

export async function getUserFromToken(token: string): Promise<User | null> {
  const payload = verifyToken(token)
  if (!payload) {
    return null
  }

  const session = await prisma.session.findFirst({
    where: {
      token,
      expiresAt: {
        gt: new Date(),
      },
    },
    include: {
      user: true,
    },
  })

  if (!session || !session.user.isActive) {
    return null
  }

  return {
    id: session.user.id,
    email: session.user.email,
    username: session.user.username,
    accountType: session.user.accountType,
    isActive: session.user.isActive,
  }
}

export async function logoutUser(token: string): Promise<void> {
  await prisma.session.deleteMany({
    where: { token },
  })
}

export async function getAvailableApiKey(): Promise<string | null> {
  // First try to get an unused developer API key
  const unusedKey = await prisma.apiKey.findFirst({
    where: {
      isActive: true,
      isInUse: false,
    },
    orderBy: {
      lastUsedAt: 'asc',
    },
  })

  if (unusedKey) {
    // Mark as in use
    await prisma.apiKey.update({
      where: { id: unusedKey.id },
      data: {
        isInUse: true,
        lastUsedAt: new Date(),
      },
    })
    return unusedKey.key
  }

  // Fall back to default API key
  return process.env.ZUKIJOURNEY_DEFAULT_API_KEY || null
}

export async function releaseApiKey(apiKey: string): Promise<void> {
  await prisma.apiKey.updateMany({
    where: { key: apiKey },
    data: {
      isInUse: false,
    },
  })
}
