import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ts-monorepo-boilerplate',
  description: 'TypeScript Monorepo Boilerplate Application',
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
