import type { Carrier, Shipment, Warehouse } from "@/types/contract"

export function getTotalShipments(shipments: Shipment[]) {
  return shipments.length
}

export function getCongestedWarehousesCount(warehouses: Warehouse[]) {
  return warehouses.filter((warehouse) => warehouse.is_congested).length
}

export function getActiveCarriersCount(carriers: Carrier[]) {
  return carriers.length
}

export function getPendingApprovalsCount(
  pendingApprovals: { audit_id: string }[]
) {
  return pendingApprovals.length
}

export function getDelayedShipmentsCount(shipments: Shipment[]) {
  return shipments.filter((shipment) => {
    const promised = new Date(shipment.promised_eta).getTime()
    const current = new Date(shipment.current_eta).getTime()

    return (
      Number.isFinite(promised) &&
      Number.isFinite(current) &&
      current > promised
    )
  }).length
}

export function getHighPriorityShipmentsCount(shipments: Shipment[]) {
  return shipments.filter((shipment) => shipment.priority === "High").length
}

export function getInTransitShipmentsCount(shipments: Shipment[]) {
  return shipments.filter((shipment) => shipment.status === "in_transit").length
}

export function getOnTimeShipmentsCount(shipments: Shipment[]) {
  return shipments.filter((shipment) => {
    const promised = new Date(shipment.promised_eta).getTime()
    const current = new Date(shipment.current_eta).getTime()

    return (
      Number.isFinite(promised) &&
      Number.isFinite(current) &&
      current <= promised
    )
  }).length
}

export function getAverageCarrierSuccessRate(carriers: Carrier[]) {
  if (carriers.length === 0) return 0

  const total = carriers.reduce(
    (sum, carrier) => sum + carrier.success_rate_pct,
    0
  )

  return total / carriers.length
}

export function getBestCarrier(carriers: Carrier[]) {
  if (carriers.length === 0) return null

  return [...carriers].sort(
    (a, b) => b.success_rate_pct - a.success_rate_pct
  )[0]
}

export function getCheapestCarrier(carriers: Carrier[]) {
  if (carriers.length === 0) return null

  return [...carriers].sort(
    (a, b) => a.cost_multiplier - b.cost_multiplier
  )[0]
}

export function getFastestCarrier(carriers: Carrier[]) {
  if (carriers.length === 0) return null

  return [...carriers].sort(
    (a, b) => a.avg_delay_mins - b.avg_delay_mins
  )[0]
}

export function getCongestedWarehouseNames(warehouses: Warehouse[]) {
  return warehouses
    .filter((warehouse) => warehouse.is_congested)
    .map((warehouse) => warehouse.name)
}