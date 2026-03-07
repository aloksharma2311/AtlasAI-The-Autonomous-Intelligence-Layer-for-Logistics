import type { SyncStateResponse } from "@/types/contract"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${input}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

export async function fetchInitialState(): Promise<SyncStateResponse> {
  return request<SyncStateResponse>("/api/state")
}

export async function injectChaos(payload: {
  target_id: string
  event: string
  severity_pct: number
}) {
  return request<unknown>("/api/chaos/inject", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export async function approveAction(payload: {
  audit_id: string
  approved: boolean
}) {
  return request<unknown>("/api/action/approve", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}