import {
  Activity,
  BadgeDollarSign,
  ShieldCheck,
  TimerReset,
} from "lucide-react"
import Card from "@/components/ui/Card"
import SectionHeader from "@/components/ui/SectionHeader"
import { useStore } from "@/store/useStore"
import {
  getAverageCarrierSuccessRate,
  getBestCarrier,
  getCheapestCarrier,
  getCongestedWarehouseNames,
  getDelayedShipmentsCount,
  getFastestCarrier,
  getHighPriorityShipmentsCount,
  getInTransitShipmentsCount,
  getOnTimeShipmentsCount,
} from "@/lib/selectors"

function SummaryStat({
  label,
  value,
  tone = "neutral",
  icon,
}: {
  label: string
  value: string | number
  tone?: "neutral" | "success" | "warning" | "danger"
  icon: React.ReactNode
}) {
  const toneClasses = {
    neutral: "bg-slate-50 text-slate-700",
    success: "bg-emerald-50 text-emerald-700",
    warning: "bg-amber-50 text-amber-700",
    danger: "bg-rose-50 text-rose-700",
  }

  return (
    <div className={`rounded-2xl p-4 ${toneClasses[tone]}`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] opacity-70">
          {label}
        </p>
        <div>{icon}</div>
      </div>
      <p className="mt-3 text-2xl font-bold">{value}</p>
    </div>
  )
}

export default function ShipmentSummaryPanel() {
  const shipments = useStore((state) => state.shipments)
  const carriers = useStore((state) => state.carriers)
  const warehouses = useStore((state) => state.warehouses)

  const delayedShipments = getDelayedShipmentsCount(shipments)
  const highPriorityShipments = getHighPriorityShipmentsCount(shipments)
  const inTransitShipments = getInTransitShipmentsCount(shipments)
  const onTimeShipments = getOnTimeShipmentsCount(shipments)
  const avgCarrierSuccessRate = getAverageCarrierSuccessRate(carriers)
  const bestCarrier = getBestCarrier(carriers)
  const cheapestCarrier = getCheapestCarrier(carriers)
  const fastestCarrier = getFastestCarrier(carriers)
  const congestedNames = getCongestedWarehouseNames(warehouses)

  return (
    <Card className="border-violet-100 bg-[linear-gradient(180deg,#ffffff_0%,#faf9ff_100%)] p-5">
      <SectionHeader
        title="Shipment Summary"
        subtitle="Operational highlights derived from shipments, carriers, and warehouse state."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryStat
          label="Delayed"
          value={delayedShipments}
          tone={delayedShipments > 0 ? "danger" : "success"}
          icon={<TimerReset size={16} />}
        />
        <SummaryStat
          label="High Priority"
          value={highPriorityShipments}
          tone="warning"
          icon={<Activity size={16} />}
        />
        <SummaryStat
          label="In Transit"
          value={inTransitShipments}
          tone="neutral"
          icon={<ShieldCheck size={16} />}
        />
        <SummaryStat
          label="On Time"
          value={onTimeShipments}
          tone="success"
          icon={<ShieldCheck size={16} />}
        />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="rounded-[22px] border border-violet-100 bg-violet-50/40 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            Best Carrier
          </p>
          <p className="mt-3 text-lg font-bold text-slate-900">
            {bestCarrier?.name ?? "N/A"}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Success Rate:{" "}
            {bestCarrier ? `${bestCarrier.success_rate_pct.toFixed(1)}%` : "N/A"}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Tier: {bestCarrier?.tier ?? "N/A"}
          </p>
        </div>

        <div className="rounded-[22px] border border-emerald-100 bg-emerald-50/40 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            Cheapest Carrier
          </p>
          <p className="mt-3 flex items-center gap-2 text-lg font-bold text-slate-900">
            <BadgeDollarSign size={17} className="text-emerald-600" />
            {cheapestCarrier?.name ?? "N/A"}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Cost Multiplier:{" "}
            {cheapestCarrier ? cheapestCarrier.cost_multiplier.toFixed(1) : "N/A"}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Tier: {cheapestCarrier?.tier ?? "N/A"}
          </p>
        </div>

        <div className="rounded-[22px] border border-sky-100 bg-sky-50/40 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            Fastest Carrier
          </p>
          <p className="mt-3 text-lg font-bold text-slate-900">
            {fastestCarrier?.name ?? "N/A"}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Avg Delay:{" "}
            {fastestCarrier ? `${fastestCarrier.avg_delay_mins} mins` : "N/A"}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Average Success Rate: {avgCarrierSuccessRate.toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-[22px] border border-slate-100 bg-white p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
          Congested Warehouses
        </p>

        {congestedNames.length === 0 ? (
          <p className="mt-3 text-sm font-medium text-emerald-600">
            No congested warehouses right now.
          </p>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2">
            {congestedNames.map((name) => (
              <span
                key={name}
                className="inline-flex rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700"
              >
                {name}
              </span>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}