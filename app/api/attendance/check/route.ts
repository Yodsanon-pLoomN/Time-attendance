
import { NextResponse } from 'next/server'
import {
  PrismaClient,
  AttendanceEventType,
  AttendanceStatus,
} from '@prisma/client'
import { auth } from '@/libs/auth'

const prisma = new PrismaClient()

function haversineDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3
  const toRad = (deg: number) => (deg * Math.PI) / 180

  const φ1 = toRad(lat1)
  const φ2 = toRad(lat2)
  const Δφ = toRad(lat2 - lat1)
  const Δλ = toRad(lon2 - lon1)

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

function euclideanDistance(a: number[], b: number[]): number {
  if (a.length !== b.length) return Number.POSITIVE_INFINITY
  let sum = 0
  for (let i = 0; i < a.length; i++) {
    const diff = a[i] - b[i]
    sum += diff * diff
  }
  return Math.sqrt(sum)
}

type AttendanceCheckBody = {
  eventType: AttendanceEventType
  latitude: number
  longitude: number
  descriptor: number[]
}

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }


    const body = (await req.json()) as AttendanceCheckBody
    const { eventType, latitude, longitude, descriptor } = body

    if (
      !eventType ||
      typeof latitude !== 'number' ||
      typeof longitude !== 'number' ||
      !Array.isArray(descriptor) ||
      descriptor.length === 0
    ) {
      return NextResponse.json(
        { error: 'ข้อมูลไม่ครบ (eventType, latitude, longitude, descriptor)' },
        { status: 400 }
      )
    }

    if (!Object.values(AttendanceEventType).includes(eventType)) {
      return NextResponse.json(
        { error: 'eventType ไม่ถูกต้อง' },
        { status: 400 }
      )
    }

    const userId = session.user.id


    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        faceTemplates: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'ไม่พบบัญชีผู้ใช้ในระบบ' },
        { status: 404 }
      )
    }

    if (user.faceTemplates.length === 0) {
      return NextResponse.json(
        { error: 'ยังไม่มีการลงทะเบียนใบหน้าในระบบ' },
        { status: 400 }
      )
    }

    const location = await prisma.location.findFirst({
      orderBy: { createdAt: 'asc' },
    })

    if (!location) {
      return NextResponse.json(
        { error: 'ยังไม่ได้ตั้งค่าสถานที่ทำงานในระบบ' },
        { status: 400 }
      )
    }

    const distanceToLocation = haversineDistanceMeters(
      latitude,
      longitude,
      location.latitude,
      location.longitude
    )

    if (distanceToLocation > location.radiusM) {
      return NextResponse.json(
        {
          error:
            'ตำแหน่งปัจจุบันอยู่นอกพื้นที่ที่อนุญาตให้ลงเวลา (เกินระยะรัศมีที่กำหนด)',
          distanceMeters: distanceToLocation,
        },
        { status: 403 }
      )
    }

    const FACE_THRESHOLD = 0.5 

    let bestDistance = Number.POSITIVE_INFINITY

    for (const template of user.faceTemplates) {
      const tplData = template.faceData as unknown as number[]
      const dist = euclideanDistance(descriptor, tplData)
      if (!Number.isNaN(dist) && dist < bestDistance) {
        bestDistance = dist
      }
    }

    if (!Number.isFinite(bestDistance) || bestDistance > FACE_THRESHOLD) {
      return NextResponse.json(
        {
          error:
            'ใบหน้าที่ตรวจพบไม่ตรงกับข้อมูลที่ลงทะเบียนไว้ในระบบ (ระยะห่างมากเกินไป)',
          distance: bestDistance,
        },
        { status: 403 }
      )
    }

    const timeConfig = await prisma.attendanceTimeConfig.findUnique({
      where: { eventType },
    })

    const now = new Date()
    const currentMinutes = now.getHours() * 60 + now.getMinutes()

    let status: AttendanceStatus = 'PASS'

    if (timeConfig) {
      const { startMinute, endMinute } = timeConfig
      if (currentMinutes < startMinute || currentMinutes > endMinute) {
        status = 'FAIL'
      }
    } else {
      status = 'PASS'
    }

    const record = await prisma.attendanceRecord.create({
      data: {
        userId,
        locationId: location.id,
        eventType,
        latitude,
        longitude,
        status,
      },
    })

    return NextResponse.json(
      {
        message: 'ลงเวลาสำเร็จ',
        status,
        distanceLocationMeters: distanceToLocation,
        faceDistance: bestDistance,
        record,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Attendance check error:', error)
    return NextResponse.json(
      { error: 'ไม่สามารถลงเวลาได้ กรุณาลองใหม่อีกครั้ง' },
      { status: 500 }
    )
  }
}
