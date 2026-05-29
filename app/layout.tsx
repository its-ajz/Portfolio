import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Anjali Zalani — Immersive Experience Designer',
  description: 'I design experiences you can step inside. XR, spatial computing, interactive installations, and creative technology. Student at USC Iovine and Young Academy.',
  openGraph: {
    title: 'Anjali Zalani — Immersive Experience Designer',
    description: 'XR, spatial computing, interactive installations.',
    url: 'https://anjalizalani.com',
    siteName: 'Anjali Zalani',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body>{children}</body>
    </html>
  )
}