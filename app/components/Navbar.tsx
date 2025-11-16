
'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'

function NavLink({
  href,
  label,
}: {
  href: string
  label: string
}) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={`text-sm px-3 py-2 rounded-md transition ${
        isActive
          ? 'bg-blue-600 text-white'
          : 'text-slate-700 hover:bg-slate-100'
      }`}
    >
      {label}
    </Link>
  )
}

export default function Navbar() {
  const { data: session, status } = useSession()
  const router = useRouter()

  async function handleLogout() {
    await signOut({ callbackUrl: '/auth/login' })
  }


  if (status === 'loading') {
    return (
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="font-semibold text-gray-900">Clocking</div>
          <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
        </div>
      </nav>
    )
  }


  if (!session?.user) {
    return null
  }

  const role = session.user.role

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">

        <div className="flex items-center gap-6">
          <p
      
            className="text-base font-semibold text-gray-900"
          >
            Clocking
          </p>

          <div className="flex items-center gap-1">

            <NavLink href="/employee/attendance" label="ลงเวลา" />

            {role === 'ADMIN' && (
              <>
                <NavLink
                  href="/admin/attendance"
                  label="เช็คการลงเวลา"
                />
                <NavLink
                  href="/admin/locations"
                  label="ตั้งค่า"
                />
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-medium text-gray-900">
              {session.user.name}
            </span>
            <span className="text-xs text-slate-500">
              {session.user.email}
            </span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="text-xs sm:text-sm px-3 py-1.5 rounded-md bg-red-500 text-white hover:bg-red-600 font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
