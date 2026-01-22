import './globals.css'
import { Inter } from 'next/font/google'
import { auth } from '@/auth'
import { SessionProvider } from 'next-auth/react'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Chambal Sandesh - Latest News & Updates',
  description: 'Your trusted source for latest news, updates, and stories from the Chambal region',
}

export default async function RootLayout({ children }) {
  const session = await auth()
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  )
}
