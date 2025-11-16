
import { auth } from '@/libs/auth'
import { PrismaClient } from '@prisma/client'
import { redirect } from 'next/navigation'
import { UnauthorizedCard } from '@/app/components/admin/UnauthorizedCard'
import { AttendanceTable } from '@/app/components/admin/AttendanceTable'

const prisma = new PrismaClient()
export const dynamic = 'force-dynamic'

export default async function AdminAttendancePage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/auth/login')
  }

  if (session.user.role !== 'ADMIN') {
    return <UnauthorizedCard />
  }

  const records = await prisma.attendanceRecord.findMany({
    include: {
      user: true,
      location: true,
    },
    orderBy: {
      timestamp: 'desc',
    },
    take: 200,
  })

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center py-8">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-md p-6 md:p-8 space-y-6">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold">บันทึกการลงเวลาทำงาน</h1>
          </div>
          <div className="text-xs text-slate-500">
            Admin: {session.user.name || session.user.email}
          </div>
        </header>

        <AttendanceTable records={records} />
      </div>
    </div>
  )
}
