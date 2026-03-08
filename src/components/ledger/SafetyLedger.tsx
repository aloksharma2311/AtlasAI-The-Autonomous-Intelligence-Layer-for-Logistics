"use client"

import { AlertTriangle, CheckCircle2, Shield, Sparkles } from "lucide-react"
import Card from "@/components/ui/Card"
import SectionHeader from "@/components/ui/SectionHeader"
import EmptyState from "@/components/ui/EmptyState"
import { useStore } from "@/store/useStore"

function getToneClasses(type: "alert" | "approval" | "action" | "system") {
  switch (type) {
    case "alert":
      return "bg-rose-50 text-rose-700"
    case "approval":
      return "bg-amber-50 text-amber-700"
    case "action":
      return "bg-emerald-50 text-emerald-700"
    case "system":
    default:
      return "bg-slate-100 text-slate-700"
  }
}

function getTypeLabel(type: "alert" | "approval" | "action" | "system") {
  switch (type) {
    case "alert":
      return "Alert"
    case "approval":
      return "Approval Required"
    case "action":
      return "Action"
    case "system":
    default:
      return "System Event"
  }
}

function getTypeIcon(type: "alert" | "approval" | "action" | "system") {
  switch (type) {
    case "alert":
      return <AlertTriangle size={16} />
    case "approval":
      return <Shield size={16} />
    case "action":
      return <CheckCircle2 size={16} />
    case "system":
    default:
      return <Sparkles size={16} />
  }
}

export default function SafetyLedger() {
  const entries = useStore((state) => state.sessionLedger)

  return (
    <Card className="border-slate-100 bg-[linear-gradient(180deg,#ffffff_0%,#fcfdff_100%)] p-5">
      <SectionHeader
        title="Safety Ledger"
        subtitle="Session activity, alerts, approvals, and executed actions."
      />

      {entries.length === 0 ? (
        <EmptyState
          title="No session activity"
          description="Ledger items will appear as the frontend receives alerts, status updates, approvals, and actions."
        />
      ) : (
        <div className="max-h-[540px] space-y-3 overflow-y-auto pr-1">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="rounded-[22px] border border-slate-100 bg-white p-4 shadow-sm"
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex min-w-0 gap-3">
                  <div
                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl ${getToneClasses(
                      entry.type
                    )}`}
                  >
                    {getTypeIcon(entry.type)}
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-6 text-slate-900">
                      {entry.message}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{entry.timestamp}</p>
                  </div>
                </div>

                <div
                  className={`inline-flex shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${getToneClasses(
                    entry.type
                  )}`}
                >
                  {getTypeLabel(entry.type)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}