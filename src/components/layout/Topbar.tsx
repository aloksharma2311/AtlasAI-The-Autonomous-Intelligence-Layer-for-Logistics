"use client"

import { Bell, ChevronDown, LogOut, Search, Sparkles, Wifi } from "lucide-react"
import { useRouter } from "next/navigation"
import { useStore } from "@/store/useStore"
import { logout } from "@/lib/auth"

type TopbarProps = {
  title: string
}

function getStatusConfig(status: string) {
  if (status === "connected") {
    return {
      label: "Realtime Connected",
      className: "border-emerald-100 bg-emerald-50 text-emerald-700",
      dotClassName: "bg-emerald-500",
    }
  }

  if (status === "connecting") {
    return {
      label: "Realtime Connecting",
      className: "border-amber-100 bg-amber-50 text-amber-700",
      dotClassName: "bg-amber-500",
    }
  }

  if (status === "error") {
    return {
      label: "Realtime Offline",
      className: "border-rose-100 bg-rose-50 text-rose-700",
      dotClassName: "bg-rose-500",
    }
  }

  return {
    label: "Realtime Disconnected",
    className: "border-slate-200 bg-slate-100 text-slate-700",
    dotClassName: "bg-slate-500",
  }
}

export default function Topbar({ title }: TopbarProps) {
  const router = useRouter()
  const connectionStatus = useStore((state) => state.connectionStatus)
  const agentStatus = useStore((state) => state.agentStatus)
  const statusConfig = getStatusConfig(connectionStatus)

  function handleLogout() {
    logout()
    router.push("/login")
    router.refresh()
  }

  return (
    <div className="mb-6 rounded-[26px] border border-slate-100 bg-[linear-gradient(135deg,#ffffff_0%,#fafbff_60%,#f8fbff_100%)] p-4 shadow-[0_10px_28px_rgba(15,23,42,0.04)] sm:p-5">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#eef2ff_0%,#ede9fe_100%)] text-violet-600 shadow-sm">
            <Sparkles size={20} />
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              AtlasAI Workspace
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {title}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Premium operations dashboard for logistics intelligence.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
          <div className="flex h-12 w-full items-center gap-3 rounded-2xl bg-slate-50 px-4 ring-1 ring-slate-100 transition focus-within:bg-white focus-within:ring-violet-200 sm:min-w-[320px] lg:w-auto">
            <Search size={17} className="text-slate-400" />
            <input
              placeholder="Search shipments, carriers, warehouses..."
              className="w-full bg-transparent text-sm text-slate-600 outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${statusConfig.className}`}
            >
              <span className={`h-2 w-2 rounded-full ${statusConfig.dotClassName}`} />
              {statusConfig.label}
            </div>

            <div className="hidden items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700 lg:inline-flex">
              <Wifi size={14} />
              {agentStatus}
            </div>

            <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-sm ring-1 ring-slate-100 transition duration-200 hover:-translate-y-0.5 hover:bg-slate-50">
              <Bell size={18} />
            </button>

            <div className="flex items-center gap-3 rounded-2xl bg-white px-3 py-2 shadow-sm ring-1 ring-slate-100">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,#ddd6fe_0%,#e0e7ff_100%)] text-sm font-bold text-violet-700">
                A
              </div>

              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-slate-900">Admin</p>
                <p className="text-xs text-slate-500">System Administrator</p>
              </div>

              <ChevronDown size={16} className="hidden text-slate-400 sm:block" />
            </div>

            <button
              onClick={handleLogout}
              className="flex h-12 items-center gap-2 rounded-2xl bg-white px-4 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-slate-100 transition duration-200 hover:-translate-y-0.5 hover:bg-slate-50"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}