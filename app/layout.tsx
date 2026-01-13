import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sales System - Admin Dashboard',
  description: 'Internal admin dashboard for sales outreach and order management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
