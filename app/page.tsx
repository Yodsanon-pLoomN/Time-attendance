// app/page.tsx
import { auth } from '@/libs/auth'
import { redirect } from 'next/navigation'

export default async function Home() {
  const session = await auth()

  // ยังไม่ล็อกอิน → ไปหน้า Login
  if (!session?.user) {
    redirect('/auth/login')
  }

  const role = session.user.role

  // ถ้าเป็นแอดมิน → ไปหน้าเช็คการลงเวลา
  if (role === 'ADMIN') {
    redirect('/admin/attendance')
  }

  // อย่างอื่น (เช่น EMPLOYEE) → ไปหน้า employee attendance
  redirect('/employee/attendance')
}
