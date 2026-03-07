import type { Metadata } from "next"
import "./globals.css"
import AuthGuard from "@/components/auth/AuthGuard"

export const metadata: Metadata = {
  title: "AtlasAI Logistics Dashboard",
  description: "Frontend-only logistics intelligence dashboard",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthGuard>{children}</AuthGuard>
      </body>
    </html>
  )
}