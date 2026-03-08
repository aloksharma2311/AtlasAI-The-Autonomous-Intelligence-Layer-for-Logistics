"use client"

import { useEffect, useState } from "react"
import Topbar from "@/components/layout/Topbar"
import KpiCard from "@/components/dashboard/KpiCard"
import NetworkMap from "@/components/map/NetworkMap"
import AgentStreamPanel from "@/components/terminal/AgentStreamPanel"
import ScenarioPanel from "@/components/scenarios/ScenarioPanel"
import ApprovalQueuePanel from "@/components/approvals/ApprovalQueuePanel"
import SafetyLedger from "@/components/ledger/SafetyLedger"
import LoadingState from "@/components/ui/LoadingState"
import { useSocket } from "@/hooks/useSocket"
import { fetchInitialState } from "@/lib/api"
import ShipmentSummaryPanel from "@/components/dashboard/ShipmentSummaryPanel"
import SystemStatusBanner from "@/components/dashboard/SystemStatusBanner"
import DashboardInfoStrip from "@/components/dashboard/DashboardInfoStrip"
import { useStore } from "@/store/useStore"
import {
  getActiveCarriersCount,
  getCongestedWarehousesCount,
  getPendingApprovalsCount,
  getTotalShipments,
} from "@/lib/selectors"

export default function DashboardPage() {
  useSocket()

  const [loading, setLoading] = useState(true)

  const warehouses = useStore((state) => state.warehouses)
  const shipments = useStore((state) => state.shipments)
  const carriers = useStore((state) => state.carriers)
  const pendingApprovals = useStore((state) => state.pendingApprovals)
  const setSyncState = useStore((state) => state.setSyncState)
  const addLedgerEntry = useStore((state) => state.addLedgerEntry)

  useEffect(() => {
    async function loadInitialState() {
      try {
        const data = await fetchInitialState()
        setSyncState(data)

        addLedgerEntry({
          id: crypto.randomUUID(),
          type: "system",
          message: "Initial state loaded successfully.",
          timestamp: new Date().toISOString(),
        })
      } catch (error) {
        console.error("Initial state fetch failed:", error)

        addLedgerEntry({
          id: crypto.randomUUID(),
          type: "system",
          message:
            error instanceof Error
              ? `Initial state fetch failed: ${error.message}`
              : "Initial state fetch failed.",
          timestamp: new Date().toISOString(),
        })
      } finally {
        setLoading(false)
      }
    }

    loadInitialState()
  }, [addLedgerEntry, setSyncState])

  return (
    <div>
      <Topbar title="Dashboard" />
      <SystemStatusBanner />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-4">
        <KpiCard
          title="Total Shipments"
          value={getTotalShipments(shipments)}
          hint="Live from shared shipment state"
        />
        <KpiCard
          title="Congested Warehouses"
          value={getCongestedWarehousesCount(warehouses)}
          hint="Derived from is_congested"
        />
        <KpiCard
          title="Active Carriers"
          value={getActiveCarriersCount(carriers)}
          hint="Carrier count from backend state"
        />
        <KpiCard
          title="Pending Approvals"
          value={getPendingApprovalsCount(pendingApprovals)}
          hint="Human-in-the-loop actions waiting"
        />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2">
          {loading ? <LoadingState /> : <NetworkMap />}
        </div>
        <AgentStreamPanel />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <ScenarioPanel />
        <ApprovalQueuePanel />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <SafetyLedger />
        <ShipmentSummaryPanel />
      </div>

      <DashboardInfoStrip />
    </div>
  )
}