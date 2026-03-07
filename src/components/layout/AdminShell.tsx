import type { ReactNode } from "react"
import Sidebar from "@/components/layout/Sidebar"

type AdminShellProps = {
  children: ReactNode
}

export default function AdminShell({ children }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#eef8ef_0%,#f4f8fb_45%,#f8fafc_100%)] p-3 sm:p-4 md:p-6">
      <div className="mx-auto flex max-w-[1520px] gap-4 md:gap-6">
        <Sidebar />

        <main className="min-h-[calc(100vh-24px)] flex-1 rounded-[28px] border border-white/70 bg-white/85 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur sm:min-h-[calc(100vh-32px)] sm:p-5 md:min-h-[calc(100vh-48px)] md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}