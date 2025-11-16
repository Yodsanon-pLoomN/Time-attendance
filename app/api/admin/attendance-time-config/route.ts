
import { NextResponse } from 'next/server'
import { PrismaClient, AttendanceEventType } from '@prisma/client'
import { auth } from '@/libs/auth'

const prisma = new PrismaClient()

type TimeConfigPayload = {
  eventType: AttendanceEventType
  startMinute: number
  endMinute: number
}[]

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await req.json()) as TimeConfigPayload

    if (!Array.isArray(body) || body.length === 0) {
      return NextResponse.json(
        { error: 'ข้อมูลไม่ถูกต้อง' },
        { status: 400 }
      )
    }

    for (const item of body) {
      if (
        !Object.values(AttendanceEventType).includes(item.eventType) ||
        typeof item.startMinute !== 'number' ||
        typeof item.endMinute !== 'number' ||
        item.startMinute < 0 ||
        item.startMinute >= 24 * 60 ||
        item.endMinute < 0 ||
        item.endMinute >= 24 * 60 ||
        item.startMinute > item.endMinute
      ) {
        return NextResponse.json(
          { error: 'รูปแบบเวลาไม่ถูกต้อง' },
          { status: 400 }
        )
      }
    }

    await prisma.$transaction(async (tx) => {
      for (const item of body) {
        await tx.attendanceTimeConfig.upsert({
          where: { eventType: item.eventType },
          update: {
            startMinute: item.startMinute,
            endMinute: item.endMinute,
          },
          create: {
            eventType: item.eventType,
            startMinute: item.startMinute,
            endMinute: item.endMinute,
          },
        })
      }
    })

    return NextResponse.json({ message: 'บันทึกเวลาเข้างานสำเร็จ' })
  } catch (error) {
    console.error('AttendanceTimeConfig error:', error)
    return NextResponse.json(
      { error: 'ไม่สามารถบันทึกเวลาได้' },
      { status: 500 }
    )
  }
}
