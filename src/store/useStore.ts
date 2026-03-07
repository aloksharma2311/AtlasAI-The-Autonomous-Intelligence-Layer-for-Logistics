import { create } from "zustand"
import type {
  Warehouse,
  Shipment,
  Carrier,
  SyncStateResponse,
  ApprovalRequiredPayload,
  WatchtowerAlertPayload,
} from "@/types/contract"

export type ConnectionStatus =
  | "connecting"
  | "connected"
  | "disconnected"
  | "error"

export type LedgerEntry = {
  id: string
  type: "alert" | "approval" | "action" | "system"
  message: string
  timestamp: string
}

type AppState = {
  warehouses: Warehouse[]
  shipments: Shipment[]
  carriers: Carrier[]
  agentTerminalText: string
  agentStatus: string
  pendingApprovals: ApprovalRequiredPayload[]
  connectionStatus: ConnectionStatus
  lastSyncAt: string | null
  activeAlert: WatchtowerAlertPayload | null
  sessionLedger: LedgerEntry[]
  selectedWarehouseId: string | null

  setSyncState: (data: SyncStateResponse) => void
  appendTerminalText: (chunk: string) => void
  resetTerminal: () => void
  setAgentStatus: (status: string) => void
  addPendingApproval: (payload: ApprovalRequiredPayload) => void
  removePendingApproval: (auditId: string) => void
  setConnectionStatus: (status: ConnectionStatus) => void
  setActiveAlert: (alert: WatchtowerAlertPayload | null) => void
  addLedgerEntry: (entry: LedgerEntry) => void
  setSelectedWarehouseId: (id: string | null) => void
}

export const useStore = create<AppState>((set) => ({
  warehouses: [],
  shipments: [],
  carriers: [],
  agentTerminalText: "",
  agentStatus: "Idle",
  pendingApprovals: [],
  connectionStatus: "connecting",
  lastSyncAt: null,
  activeAlert: null,
  sessionLedger: [],
  selectedWarehouseId: null,

  setSyncState: (data) =>
    set({
      warehouses: data.warehouses,
      shipments: data.shipments,
      carriers: data.carriers,
      lastSyncAt: new Date().toISOString(),
    }),

  appendTerminalText: (chunk) =>
    set((state) => ({
      agentTerminalText: state.agentTerminalText + chunk,
    })),

  resetTerminal: () =>
    set({
      agentTerminalText: "",
    }),

  setAgentStatus: (status) =>
    set({
      agentStatus: status,
    }),

  addPendingApproval: (payload) =>
    set((state) => ({
      pendingApprovals: [...state.pendingApprovals, payload],
    })),

  removePendingApproval: (auditId) =>
    set((state) => ({
      pendingApprovals: state.pendingApprovals.filter(
        (item) => item.audit_id !== auditId
      ),
    })),

  setConnectionStatus: (status) =>
    set({
      connectionStatus: status,
    }),

  setActiveAlert: (alert) =>
    set({
      activeAlert: alert,
    }),

  addLedgerEntry: (entry) =>
    set((state) => ({
      sessionLedger: [entry, ...state.sessionLedger],
    })),

  setSelectedWarehouseId: (id) =>
    set({
      selectedWarehouseId: id,
    }),
}))