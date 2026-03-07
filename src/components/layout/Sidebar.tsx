"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Bot,
  Zap,
  ClipboardList,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react"

const items = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Copilot",
    href: "/admin/copilot",
    icon: Bot,
  },
  {
    label: "Scenarios",
    href: "/admin/scenarios",
    icon: Zap,
  },
  {
    label: "Actions",
    href: "/admin/actions",
    icon: ClipboardList,
  },
  {
    label: "Settings",
    href: "#",
    icon: Settings,
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-[250px] shrink-0 rounded-[30px] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)] xl:block">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-sm">
          <Sparkles size={18} />
        </div>

        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            AtlasAI
          </h1>
          <p className="text-xs text-slate-500">Logistics Console</p>
        </div>
      </div>

      <nav className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition duration-200 ${
                isActive
                  ? "bg-indigo-600 text-white shadow-[0_10px_24px_rgba(79,70,229,0.24)]"
                  : "text-slate-500 hover:-translate-y-0.5 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="mt-10 rounded-[26px] bg-[linear-gradient(160deg,#5b5cf0_0%,#6f61ff_50%,#7d66ff_100%)] p-5 text-white shadow-[0_18px_32px_rgba(91,92,240,0.28)]">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15">
          <Sparkles size={18} />
        </div>

        <h3 className="mt-4 text-lg font-bold">AtlasAI Pro</h3>
        <p className="mt-2 text-sm leading-6 text-indigo-100">
          Realtime logistics intelligence, approvals, routing visibility, and
          AI copilot support.
        </p>

        <button className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50">
          <LogOut size={14} />
          Explore
        </button>
      </div>
    </aside>
  )
}