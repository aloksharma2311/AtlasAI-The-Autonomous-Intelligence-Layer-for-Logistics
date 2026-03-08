import { Bot, Route, ShieldCheck } from "lucide-react"
import Card from "@/components/ui/Card"

export default function DashboardInfoStrip() {
  return (
    <Card className="mt-5 p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
            <Route size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Live warehouse state
            </p>
            <p className="mt-1 text-xs leading-6 text-slate-500">
              Warehouses, shipments, and carriers are loaded directly from the backend state contract.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
            <Bot size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Realtime AI reasoning
            </p>
            <p className="mt-1 text-xs leading-6 text-slate-500">
              Agent status and reasoning stream arrive through socket events when available.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
            <ShieldCheck size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Human approval workflow
            </p>
            <p className="mt-1 text-xs leading-6 text-slate-500">
              Risky or important agent actions are surfaced for manual approval before execution.
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}