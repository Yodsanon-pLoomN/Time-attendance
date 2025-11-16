// components/SessionProvider.tsx
'use client'

import { SessionProvider } from 'next-auth/react'
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export default function AppSessionProvider({ children }: Props) {
  // ไม่ต้องส่ง session จาก server ก็ได้ ปล่อยให้ next-auth ดึงเองจาก /api/auth/session
  return <SessionProvider>{children}</SessionProvider>
}
