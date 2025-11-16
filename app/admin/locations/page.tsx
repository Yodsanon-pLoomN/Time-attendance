
import { auth } from '@/libs/auth'
import { PrismaClient } from '@prisma/client'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { UnauthorizedCard } from '@/app/components/admin/UnauthorizedCard'
import { LocationSummary } from '@/app/components/admin/LocationSummary'
import { LocationForm } from '@/app/components/admin/LocationForm'
import AttendanceTimeEditor from '@/app/components/admin/AttendanceTimeEditor'

const prisma = new PrismaClient()
export const dynamic = 'force-dynamic'

async function saveWorkLocation(formData: FormData) {
  'use server'

  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }

  const name = formData.get('name')?.toString().trim() || 'สถานที่ทำงานหลัก'
  const latStr = formData.get('latitude')?.toString() ?? ''
  const lngStr = formData.get('longitude')?.toString() ?? ''
  const radiusStr = formData.get('radiusM')?.toString() ?? '200'

  const latitude = Number(latStr)
  const longitude = Number(lngStr)
  const radiusM = Number(radiusStr)

  if (
    Number.isNaN(latitude) ||
    Number.isNaN(longitude) ||
    Number.isNaN(radiusM)
  ) {
    throw new Error('ข้อมูลพิกัดหรือรัศมีไม่ถูกต้อง')
  }

  // หา Location ตัวแรก (ถือว่าเป็นสถานที่ทำงานหลัก)
  const existing = await prisma.location.findFirst({
    orderBy: { createdAt: 'asc' },
  })

  if (existing) {
    await prisma.location.update({
      where: { id: existing.id },
      data: {
        name,
        latitude,
        longitude,
        radiusM,
      },
    })
  } else {
    await prisma.location.create({
      data: {
        name,
        latitude,
        longitude,
        radiusM,
      },
    })
  }

  // refresh หน้านี้
  revalidatePath('/admin/locations')
}

export default async function AdminLocationsPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/auth/login')
  }

  if (session.user.role !== 'ADMIN') {
    return <UnauthorizedCard />
  }

  // อ่านสถานที่ทำงานหลัก (เอา record แรกสุด)
  const mainLocation = await prisma.location.findFirst({
    orderBy: { createdAt: 'asc' },
  })
  const timeConfigs = await prisma.attendanceTimeConfig.findMany()
  return (
    <div className="min-h-screen bg-slate-50 flex justify-center py-8">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-md p-6 md:p-8 space-y-6">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold">ตั้งค่าสถานที่ทำงาน</h1>
          </div>
          <div className="text-xs text-slate-500">
            Admin: {session.user.name || session.user.email}
          </div>
        </header>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-700">
            สถานที่ทำงานปัจจุบัน
          </h2>
          <LocationSummary mainLocation={mainLocation} />
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-700">
            แก้ไข / ตั้งค่าสถานที่ทำงาน
          </h2>

          <LocationForm mainLocation={mainLocation} action={saveWorkLocation} />
        </section>
<section className="space-y-3">
  <h1 className="text-2xl font-bold">ตั้งค่าเวลาเข้างาน</h1>
        <AttendanceTimeEditor initialConfigs={timeConfigs} />
        </section>
      </div>
    </div>
  )
}
