import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Customer Support Agent',
  description: 'Intelligent customer support chatbot with analytics',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
