import type {
  ActionExecutedPayload,
  AgentStreamPayload,
  ApprovalRequiredPayload,
  SyncStateResponse,
} from "@/types/contract"

export function isSyncStateResponse(
  payload: unknown
): payload is SyncStateResponse {
  if (!payload || typeof payload !== "object") return false

  const data = payload as Record<string, unknown>

  return (
    Array.isArray(data.warehouses) &&
    Array.isArray(data.shipments) &&
    Array.isArray(data.carriers)
  )
}

export function isAgentStreamPayload(
  payload: unknown
): payload is AgentStreamPayload {
  if (!payload || typeof payload !== "object") return false

  const data = payload as Record<string, unknown>
  return typeof data.chunk === "string"
}

export function isApprovalRequiredPayload(
  payload: unknown
): payload is ApprovalRequiredPayload {
  if (!payload || typeof payload !== "object") return false

  const data = payload as Record<string, unknown>
  return typeof data.audit_id === "string" && typeof data.decision === "object"
}

export function isActionExecutedPayload(
  payload: unknown
): payload is ActionExecutedPayload {
  if (!payload || typeof payload !== "object") return false

  const data = payload as Record<string, unknown>
  return typeof data.message === "string"
}