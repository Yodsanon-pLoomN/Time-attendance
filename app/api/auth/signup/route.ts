
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import type { SignUpRequest } from '@/libs/types'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as SignUpRequest

    const { email, password, fullName, descriptor } = body

    if (!email || !password || !fullName || !descriptor) {
      return Response.json(
        { error: 'ข้อมูลไม่ครบ (email, password, fullName, descriptor)' },
        { status: 400 }
      )
    }

    const existing = await prisma.user.findUnique({
      where: { email },
    })

    if (existing) {
      return Response.json(
        { error: 'อีเมลนี้ถูกใช้ไปแล้ว' },
        { status: 409 }
      )
    }


    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          passwordHash: hashedPassword,
          fullName,
        },
      })

      await tx.faceTemplate.create({
        data: {
          userId: newUser.id,
          faceData: descriptor, // VECTOR 128D
        },
      })

      return newUser
    })

    return Response.json(
      {
        message: 'User created with face data',
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
        },
      },
      { status: 201 }
    )
  } catch (error: unknown) {
    console.error('Signup error:', error)
    return Response.json(
      { error: 'User could not be created' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
