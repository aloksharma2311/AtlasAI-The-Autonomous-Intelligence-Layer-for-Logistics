export type Warehouse = {
  id: string
  name: string
  throughput_pct: number
  is_congested: boolean
  inventory_level_pct: number // NEW
}

export type Carrier = {
  id: string
  name: string
  success_rate_pct: number
  avg_delay_mins: number
  cost_multiplier: number
  tier: string
  reliability_score: number // NEW
  vehicle_capacity_pct: number // NEW
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

  risk_score: number // NEW
  predicted_delay: number // NEW
  weather_signal: string // NEW
  traffic_delay_mins: number // NEW
  pickup_delay_mins: number // NEW
}

export type SyncStateResponse = {
  warehouses: Warehouse[]
  shipments: Shipment[]
  carriers: Carrier[]
}

export type CostBreakdown = {
  reroute_cost: number
  delay_penalty: number
  sla_risk: number
  total: number
}

export type AgentDecision = {
  reasoning: string[]
  action_type: string
  target_shipment_id: string
  new_carrier_id: string
  cost_breakdown: CostBreakdown
  estimated_cost: number
  confidence: number
  requires_approval: boolean
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