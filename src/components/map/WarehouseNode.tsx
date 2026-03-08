import type { Warehouse } from "@/types/contract";

type WarehouseNodeProps = {
  warehouse: Warehouse;
  isAlerted?: boolean;
};

export default function WarehouseNode({
  warehouse,
  isAlerted = false,
}: WarehouseNodeProps) {
  return (
    <div
      className={[
        "min-w-[190px] rounded-[20px] border bg-white px-4 py-3 shadow-sm transition",
        warehouse.is_congested
          ? "border-rose-300 bg-rose-50 ring-2 ring-rose-100"
          : "border-slate-200",
        isAlerted ? "ring-2 ring-amber-200" : "",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="line-clamp-2 text-sm font-bold leading-5 text-slate-800">
            {warehouse.name}
          </p>
          <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.15em] text-slate-400">
            {warehouse.id}
          </p>
        </div>

        <span
          className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
            warehouse.is_congested ? "bg-rose-500" : "bg-emerald-500"
          }`}
        />
      </div>

      <div className="mt-4">
        <div className="mb-1 flex items-center justify-between text-[11px] font-medium text-slate-500">
          <span>Throughput</span>
          <span>{warehouse.throughput_pct}%</span>
        </div>

        <div className="h-2 rounded-full bg-slate-100">
          <div
            className={`h-2 rounded-full ${
              warehouse.is_congested ? "bg-rose-500" : "bg-emerald-500"
            }`}
            style={{ width: `${Math.max(6, warehouse.throughput_pct)}%` }}
          />
        </div>
      </div>

      <div className="mt-3">
        <div className="mb-1 flex items-center justify-between text-[11px] font-medium text-slate-500">
          <span>Inventory</span>
          <span>{warehouse.inventory_level_pct}%</span>
        </div>

        <div className="h-2 rounded-full bg-slate-100">
          <div
            className="h-2 rounded-full bg-indigo-500"
            style={{ width: `${Math.max(6, warehouse.inventory_level_pct)}%` }}
          />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
            warehouse.is_congested
              ? "bg-rose-100 text-rose-700"
              : "bg-emerald-100 text-emerald-700"
          }`}
        >
          {warehouse.is_congested ? "Congested" : "Healthy"}
        </span>

        {isAlerted ? (
          <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
            Alerted
          </span>
        ) : null}
      </div>
    </div>
  );
}
