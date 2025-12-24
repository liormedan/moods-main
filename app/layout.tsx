import type React from "react"
import type { Metadata, Viewport } from "next"
import { Heebo } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ClerkProvider } from "@clerk/nextjs"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-heebo",
})

export const metadata: Metadata = {
  title: "MOODS - לניהול מצבי רוח",
  description: "עקוב אחרי מצב הרוח שלך באופן יומי",
  generator: "v0.app",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MOODS",
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#40B5AD" },
    { media: "(prefers-color-scheme: dark)", color: "#40B5AD" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="he" dir="rtl">
        <body className={`${heebo.variable} font-sans antialiased`}>
          {children}
          {process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_VERCEL_ENV && (
            <Analytics />
          )}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  )
}
