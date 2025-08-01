import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "OpenImagination - AI-Powered Creative Studio",
    template: "%s | OpenImagination"
  },
  description: "Generate stunning images and videos with AI using Google Gemini, Imagen, and Veo. Open-source creative studio with film strip navigation and download capabilities.",
  keywords: ["AI", "image generation", "video generation", "Google Gemini", "Imagen", "Veo", "creative studio", "open source"],
  authors: [{ name: "ovielma" }],
  creator: "ovielma",
  publisher: "OpenImagination",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://open-imagination.vercel.app",
    title: "OpenImagination - AI-Powered Creative Studio",
    description: "Generate stunning images and videos with AI using Google Gemini, Imagen, and Veo. Open-source creative studio with film strip navigation.",
    siteName: "OpenImagination",
    images: [
      {
        url: "/OpenImagination-logo.png",
        width: 1200,
        height: 630,
        alt: "OpenImagination - AI Creative Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OpenImagination - AI-Powered Creative Studio",
    description: "Generate stunning images and videos with AI using Google Gemini, Imagen, and Veo.",
    images: ["/OpenImagination-logo.png"],
    creator: "@ovielma",
  },
  alternates: {
    canonical: "https://open-imagination.vercel.app",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="dark" storageKey="openimaginationtheme">
          {children}
          <Analytics />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
