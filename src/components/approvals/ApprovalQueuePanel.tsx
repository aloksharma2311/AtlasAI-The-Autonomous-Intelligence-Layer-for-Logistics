"use client"

import { useState } from "react"
import { CheckCircle2, ShieldCheck, XCircle } from "lucide-react"
import Card from "@/components/ui/Card"
import SectionHeader from "@/components/ui/SectionHeader"
import EmptyState from "@/components/ui/EmptyState"
import { useStore } from "@/store/useStore"
import { approveAction } from "@/lib/api"

function getDecisionText(decision: Record<string, unknown>) {
  const actionType =
    typeof decision.action_type === "string"
      ? decision.action_type
      : "unknown_action"

  const shipmentId =
    typeof decision.target_shipment_id === "string"
      ? decision.target_shipment_id
      : "Unknown"

  const carrierId =
    typeof decision.new_carrier_id === "string"
      ? decision.new_carrier_id
      : "Unknown"

  const estimatedCost =
    typeof decision.estimated_cost === "number"
      ? `$${decision.estimated_cost.toFixed(2)}`
      : "N/A"

  const confidence =
    typeof decision.confidence === "number"
      ? `${(decision.confidence * 100).toFixed(1)}%`
      : "N/A"

  const reasoning =
    Array.isArray(decision.reasoning)
      ? (decision.reasoning as string[])
      : []

  const costBreakdown =
    typeof decision.cost_breakdown === "object" && decision.cost_breakdown !== null
      ? (decision.cost_breakdown as Record<string, number>)
      : null

  return {
    actionType,
    shipmentId,
    carrierId,
    estimatedCost,
    confidence,
    reasoning,
    costBreakdown,
  }
}

export default function ApprovalQueuePanel() {
  const pendingApprovals = useStore((state) => state.pendingApprovals)
  const removePendingApproval = useStore((state) => state.removePendingApproval)
  const addLedgerEntry = useStore((state) => state.addLedgerEntry)
  const [submittingId, setSubmittingId] = useState<string | null>(null)

  async function handleDecision(auditId: string, approved: boolean) {
    try {
      setSubmittingId(auditId)

      await approveAction({
        audit_id: auditId,
        approved,
      })

      removePendingApproval(auditId)

      addLedgerEntry({
        id: crypto.randomUUID(),
        type: "action",
        message: `Approval ${approved ? "accepted" : "rejected"} for ${auditId}.`,
        timestamp: new Date().toISOString(),
      })
    } catch {
      addLedgerEntry({
        id: crypto.randomUUID(),
        type: "system",
        message: `Approval request failed for ${auditId}.`,
        timestamp: new Date().toISOString(),
      })
    } finally {
      setSubmittingId(null)
    }
  }

  return (
    <Card className="border-amber-100 bg-[linear-gradient(180deg,#ffffff_0%,#fffdf7_100%)] p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <SectionHeader
          title="Pending Approvals"
          subtitle="Human-in-the-loop decisions requiring explicit operator confirmation."
        />

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
          <ShieldCheck size={20} />
        </div>
      </div>

      {pendingApprovals.length === 0 ? (
        <EmptyState
          title="No pending approvals"
          description="Approval requests will appear here when the backend emits approval_required."
        />
      ) : (
        <div className="space-y-4">
          {pendingApprovals.map((item) => {
            const decision =
              item.decision && typeof item.decision === "object"
                ? (item.decision as Record<string, unknown>)
                : {}

            const {
              actionType,
              shipmentId,
              carrierId,
              estimatedCost,
              confidence,
              reasoning,
              costBreakdown,
            } = getDecisionText(decision)

            return (
              <div
                key={item.audit_id}
                className="rounded-[24px] border border-amber-100 bg-[linear-gradient(180deg,#ffffff_0%,#fffdf8_100%)] p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="inline-flex rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                      Approval Required
                    </div>

                    <h3 className="mt-3 text-lg font-bold capitalize text-slate-900">
                      {actionType.replaceAll("_", " ")}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Audit ID: {item.audit_id}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                    <div className="rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-100">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                        Shipment
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-800">
                        {shipmentId}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-100">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                        Carrier
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-800">
                        {carrierId}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-100">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                        Estimated Cost
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-800">
                        {estimatedCost}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-100">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                        Confidence
                      </p>
                      <p className="mt-2 text-sm font-semibold text-indigo-600">
                        {confidence}
                      </p>
                    </div>
                  </div>
                </div>

                {reasoning.length > 0 && (
                  <div className="mt-4 rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase text-slate-400">
                      AI Reasoning
                    </p>

                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                      {reasoning.map((r, index) => (
                        <li key={index}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {costBreakdown && (
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-xl bg-white p-3 ring-1 ring-slate-100">
                      <p className="text-xs text-slate-400">Reroute Cost</p>
                      <p className="font-semibold">${costBreakdown.reroute_cost}</p>
                    </div>

                    <div className="rounded-xl bg-white p-3 ring-1 ring-slate-100">
                      <p className="text-xs text-slate-400">Delay Penalty</p>
                      <p className="font-semibold">${costBreakdown.delay_penalty}</p>
                    </div>

                    <div className="rounded-xl bg-white p-3 ring-1 ring-slate-100">
                      <p className="text-xs text-slate-400">SLA Risk</p>
                      <p className="font-semibold">${costBreakdown.sla_risk}</p>
                    </div>

                    <div className="rounded-xl bg-white p-3 ring-1 ring-slate-100">
                      <p className="text-xs text-slate-400">Total Cost</p>
                      <p className="font-semibold">${costBreakdown.total}</p>
                    </div>
                  </div>
                )}

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    onClick={() => handleDecision(item.audit_id, true)}
                    disabled={submittingId === item.audit_id}
                    className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(5,150,105,0.18)] transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <CheckCircle2 size={16} />
                    {submittingId === item.audit_id ? "Processing..." : "Approve"}
                  </button>

                  <button
                    onClick={() => handleDecision(item.audit_id, false)}
                    disabled={submittingId === item.audit_id}
                    className="inline-flex items-center gap-2 rounded-2xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(225,29,72,0.16)] transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <XCircle size={16} />
                    {submittingId === item.audit_id ? "Processing..." : "Reject"}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}