/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth, { type DefaultSession, type NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

// ---- Type Augmentation (เหมือนงานเก่า) ----
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      role: string
    }
  }

  interface User {
    id: string
    role: string
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    id?: string
    role?: string
  }
}

// ---- Auth Config ----
const authConfig: NextAuthConfig = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'john@doe.com',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined
        const password = credentials?.password as string | undefined

        if (!email || !password) {
          throw new Error('กรุณากรอกอีเมลและรหัสผ่าน')
        }

        const user = await prisma.user.findUnique({
          where: { email },
        })

        if (!user) {
          throw new Error('ไม่พบบัญชีผู้ใช้')
        }

        const isValid = await bcrypt.compare(password, user.passwordHash)

        if (!isValid) {
          throw new Error('อีเมลหรือรหัสผ่านไม่ถูกต้อง')
        }

        return {
          id: user.id,
          name: user.fullName,
          email: user.email,
          role: user.role,
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {

        token.id = (user as any).id

        ;(token as any).role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token as any).id as string
        session.user.role = ((token as any).role || 'EMPLOYEE') as string
      }
      return session
    },
  },
}

// 🔥 สำคัญ: export แบบนี้ ถึงจะมี `handlers` ให้ route ไปดึงใช้ได้
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
