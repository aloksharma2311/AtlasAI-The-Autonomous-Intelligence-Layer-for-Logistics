"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { isAuthenticated } from "@/lib/auth"

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    const authed = isAuthenticated()

    if (!authed && pathname.startsWith("/admin")) {
      router.replace("/login")
      return
    }

    if (authed && pathname === "/login") {
      router.replace("/admin/dashboard")
      return
    }

    setAllowed(true)
  }, [pathname, router])

  if (!allowed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-500">
        Checking session...
      </div>
    )
  }

  return <>{children}</>
}