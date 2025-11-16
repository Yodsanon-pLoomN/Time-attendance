
'use client'

import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function LoginPage() {
  const router = useRouter()
  const { data: session, status } = useSession()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/employee/attendance')
    }
  }, [status, router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (!res || res.error) {
      setError(res?.error || 'เข้าสู่ระบบไม่สำเร็จ')
      return
    }

    router.push('/employee/attendance')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm space-y-4"
      >
        <h1 className="text-xl font-bold text-center">เข้าสู่ระบบ</h1>

        <div>
          <label className="block text-sm mb-1">อีเมล</label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2 text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">รหัสผ่าน</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2 text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm font-medium"
        >
          เข้าสู่ระบบ
        </button>

        <button className="text-xs text-center text-slate-500 mt-2   hover:text-black " onClick={() => router.push('/auth/signup')}>
          Sign Up
        </button>
      </form>
    </div>
  )
}
