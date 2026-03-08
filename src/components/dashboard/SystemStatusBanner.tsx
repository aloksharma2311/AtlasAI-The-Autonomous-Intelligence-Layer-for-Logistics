"use client"

import { AlertTriangle, CheckCircle2, WifiOff } from "lucide-react"
import { useStore } from "@/store/useStore"

export default function SystemStatusBanner() {
  const connectionStatus = useStore((state) => state.connectionStatus)
  const warehouses = useStore((state) => state.warehouses)
  const shipments = useStore((state) => state.shipments)
  const carriers = useStore((state) => state.carriers)

  const hasApiData =
    warehouses.length > 0 || shipments.length > 0 || carriers.length > 0

  if (hasApiData && connectionStatus === "connected") {
    return (
      <div className="mb-5 flex items-start gap-3 rounded-[22px] border border-emerald-100 bg-emerald-50 px-4 py-3 text-emerald-700">
        <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold">Backend and realtime connected</p>
          <p className="mt-1 text-xs leading-6">
            Initial state loaded successfully and live socket updates are active.
          </p>
        </div>
      </div>
    )
  }

  if (hasApiData && connectionStatus !== "connected") {
    return (
      <div className="mb-5 flex items-start gap-3 rounded-[22px] border border-amber-100 bg-amber-50 px-4 py-3 text-amber-700">
        <WifiOff size={18} className="mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold">Partial connectivity</p>
          <p className="mt-1 text-xs leading-6">
            Backend data loaded, but realtime socket updates are not fully connected.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-5 flex items-start gap-3 rounded-[22px] border border-rose-100 bg-rose-50 px-4 py-3 text-rose-700">
      <AlertTriangle size={18} className="mt-0.5 shrink-0" />
      <div>
        <p className="text-sm font-semibold">Backend unavailable</p>
        <p className="mt-1 text-xs leading-6">
          No operational data has been loaded yet. Check API access, deployment environment variables, or backend availability.
        </p>
      </div>
    </div>
  )
}