import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "Moi l'aigle - Blog",
  description: "A modern blog platform with the latest tech and Bitcoin news",
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

