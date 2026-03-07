"use client"

import { useState } from "react"
import { CloudRain, Play, ShieldAlert } from "lucide-react"
import Card from "@/components/ui/Card"
import SectionHeader from "@/components/ui/SectionHeader"
import { injectChaos } from "@/lib/api"
import { useStore } from "@/store/useStore"

const scenarios = [
  {
    id: "mumbai-monsoon",
    label: "Simulate Mumbai Monsoon",
    description: "Trigger a supply disruption event at Mumbai warehouse.",
    severity: "High Risk",
    payload: {
      target_id: "WH_MUM",
      event: "monsoon_drop",
      severity_pct: 30,
    },
  },
]

export default function ScenarioPanel() {
  const [loadingScenarioId, setLoadingScenarioId] = useState<string | null>(null)
  const addLedgerEntry = useStore((state) => state.addLedgerEntry)

  async function handleTrigger(
    payload: (typeof scenarios)[number]["payload"],
    scenarioId: string,
    scenarioLabel: string
  ) {
    try {
      setLoadingScenarioId(scenarioId)

      await injectChaos(payload)

      addLedgerEntry({
        id: crypto.randomUUID(),
        type: "system",
        message: `${scenarioLabel} triggered successfully.`,
        timestamp: new Date().toISOString(),
      })
    } catch {
      addLedgerEntry({
        id: crypto.randomUUID(),
        type: "system",
        message: `${scenarioLabel} failed to trigger.`,
        timestamp: new Date().toISOString(),
      })
    } finally {
      setLoadingScenarioId(null)
    }
  }

  return (
    <Card className="border-sky-100 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <SectionHeader
          title="Scenario Controls"
          subtitle="Run controlled operational simulations using exact backend payloads."
        />

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
          <CloudRain size={20} />
        </div>
      </div>

      <div className="space-y-4">
        {scenarios.map((scenario) => (
          <div
            key={scenario.id}
            className="rounded-[24px] border border-sky-100 bg-[linear-gradient(180deg,#ffffff_0%,#f7fbff_100%)] p-5 shadow-sm"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                  <ShieldAlert size={13} />
                  {scenario.severity}
                </div>

                <h3 className="mt-3 text-lg font-bold text-slate-900">
                  {scenario.label}
                </h3>

                <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                  {scenario.description}
                </p>
              </div>

              <button
                onClick={() =>
                  handleTrigger(
                    scenario.payload,
                    scenario.id,
                    scenario.label
                  )
                }
                disabled={loadingScenarioId === scenario.id}
                className="inline-flex h-11 items-center gap-2 rounded-2xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(79,70,229,0.22)] transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Play size={15} />
                {loadingScenarioId === scenario.id ? "Triggering..." : "Run Simulation"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}