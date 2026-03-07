"use client"

import Topbar from "@/components/layout/Topbar"
import ApprovalQueuePanel from "@/components/approvals/ApprovalQueuePanel"
import SafetyLedger from "@/components/ledger/SafetyLedger"

export default function ActionsPage() {
  return (
    <div>
      <Topbar title="Actions" />
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <ApprovalQueuePanel />
        <SafetyLedger />
      </div>
    </div>
  )
}