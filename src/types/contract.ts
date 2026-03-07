export type Warehouse = {
  id: string
  name: string
  throughput_pct: number
  is_congested: boolean
}

export type Carrier = {
  id: string
  name: string
  success_rate_pct: number
  avg_delay_mins: number
  cost_multiplier: number
  tier: string
}

export type Shipment = {
  id: string
  origin_id: string
  destination_id: string
  carrier_id: string
  priority: string
  status: string
  promised_eta: string
  current_eta: string
}

export type SyncStateResponse = {
  warehouses: Warehouse[]
  shipments: Shipment[]
  carriers: Carrier[]
}

export type AgentDecision = {
  [key: string]: unknown
}

export type ApprovalRequiredPayload = {
  audit_id: string
  decision: AgentDecision
}

export type AgentStreamPayload = {
  chunk: string
}

export type WatchtowerAlertPayload = {
  node_id?: string
  message?: string
  severity?: string
  [key: string]: unknown
}

export type ActionExecutedPayload = {
  message: string
  [key: string]: unknown
}