"use client"

import { useState } from "react"
import {
  CloudRain,
  Gauge,
  Package,
  Truck,
  Map,
  Play,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react"
import Card from "@/components/ui/Card"
import SectionHeader from "@/components/ui/SectionHeader"
import { injectChaos } from "@/lib/api"
import { useStore } from "@/store/useStore"

type ScenarioItem = {
  id: string
  label: string
  description: string
  severity: "High Risk" | "Medium Risk" | "Operational"
  icon: LucideIcon
  payload: {
    target_id: string
    event: string
    severity_pct: number
  }
}

const scenarios: ScenarioItem[] = [
  {
    id: "mumbai-monsoon",
    label: "Simulate Mumbai Monsoon",
    description: "Trigger a supply disruption event at Mumbai warehouse.",
    severity: "High Risk",
    icon: CloudRain,
    payload: {
      target_id: "WH_MUM",
      event: "monsoon_drop",
      severity_pct: 30,
    },
  },
  {
    id: "pickup-delay",
    label: "Simulate Pickup Delay",
    description: "Introduce pickup delay across active shipment initiation flow.",
    severity: "Medium Risk",
    icon: Gauge,
    payload: {
      target_id: "WH_MUM",
      event: "pickup_delay",
      severity_pct: 20,
    },
  },
  {
    id: "inventory-levels",
    label: "Simulate Inventory Levels Stress",
    description: "Create inventory pressure and mismatch risk at warehouse nodes.",
    severity: "Operational",
    icon: Package,
    payload: {
      target_id: "WH_MUM",
      event: "inventory_levels",
      severity_pct: 25,
    },
  },
  {
    id: "vehicle-capacity",
    label: "Simulate Vehicle Capacity Constraint",
    description: "Reduce fleet carrying headroom and increase fulfillment pressure.",
    severity: "Medium Risk",
    icon: Truck,
    payload: {
      target_id: "WH_MUM",
      event: "vehicle_capacity",
      severity_pct: 22,
    },
  },
  {
    id: "traffic-delay",
    label: "Simulate Traffic Delay",
    description: "Introduce route-level traffic congestion and ETA drift.",
    severity: "Medium Risk",
    icon: Map,
    payload: {
      target_id: "WH_MUM",
      event: "traffic_delay",
      severity_pct: 18,
    },
  },
  {
    id: "weather-signal",
    label: "Simulate Weather Signal",
    description: "Inject adverse weather impact into route and warehouse operations.",
    severity: "High Risk",
    icon: CloudRain,
    payload: {
      target_id: "WH_MUM",
      event: "weather_signal",
      severity_pct: 28,
    },
  },
]

function getSeverityClasses(severity: ScenarioItem["severity"]) {
  if (severity === "High Risk") {
    return "bg-amber-50 text-amber-700"
  }

  if (severity === "Medium Risk") {
    return "bg-sky-50 text-sky-700"
  }

  return "bg-emerald-50 text-emerald-700"
}

export default function ScenarioPanel() {
  const [loadingScenarioId, setLoadingScenarioId] = useState<string | null>(null)
  const addLedgerEntry = useStore((state) => state.addLedgerEntry)

  async function handleTrigger(
    payload: ScenarioItem["payload"],
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
    } catch (error) {
      addLedgerEntry({
        id: crypto.randomUUID(),
        type: "system",
        message:
          error instanceof Error
            ? `${scenarioLabel} failed: ${error.message}`
            : `${scenarioLabel} failed to trigger.`,
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
        {scenarios.map((scenario) => {
          const Icon = scenario.icon

          return (
            <div
              key={scenario.id}
              className="rounded-[24px] border border-sky-100 bg-[linear-gradient(180deg,#ffffff_0%,#f7fbff_100%)] p-5 shadow-sm"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                    <Icon size={20} />
                  </div>

                  <div>
                    <div
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${getSeverityClasses(
                        scenario.severity
                      )}`}
                    >
                      <ShieldAlert size={13} />
                      {scenario.severity}
                    </div>

                    <h3 className="mt-3 text-lg font-bold text-slate-900">
                      {scenario.label}
                    </h3>

                    <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                      {scenario.description}
                    </p>
                  </div>
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
                  className="inline-flex h-11 shrink-0 items-center gap-2 rounded-2xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(79,70,229,0.22)] transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Play size={15} />
                  {loadingScenarioId === scenario.id
                    ? "Triggering..."
                    : "Run Simulation"}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}