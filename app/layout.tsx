
import type { Metadata } from 'next'
import './globals.css'
import AppSessionProvider from '@/app/components/SessionProvider'
import Navbar from './components/Navbar'

export const metadata: Metadata = {
  title: 'Clocking App',
  description: 'Clock in/out with face + location and authentication',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <body className=''>
        
        <AppSessionProvider><Navbar />{children}</AppSessionProvider>
      </body>
    </html>
  )
}
