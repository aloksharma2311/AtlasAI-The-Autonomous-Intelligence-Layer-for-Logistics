"use client"

import { useEffect } from "react"
import { io, type Socket } from "socket.io-client"
import { useStore } from "@/store/useStore"
import {
  isActionExecutedPayload,
  isAgentStreamPayload,
  isApprovalRequiredPayload,
  isSyncStateResponse,
} from "@/lib/guards"

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:8000"

export function useSocket() {
  const {
    setSyncState,
    appendTerminalText,
    addPendingApproval,
    setConnectionStatus,
    setActiveAlert,
    addLedgerEntry,
    setAgentStatus,
  } = useStore()

  useEffect(() => {
    let socket: Socket | null = null

    try {
      setConnectionStatus("connecting")

      socket = io(SOCKET_URL, {
        path: "/socket.io",
        withCredentials: false,
      })

      socket.on("connect", () => {
        console.log("Socket connected:", socket?.id)

        setConnectionStatus("connected")

        addLedgerEntry({
          id: crypto.randomUUID(),
          type: "system",
          message: "Socket connection established.",
          timestamp: new Date().toISOString(),
        })
      })

      socket.on("disconnect", (reason) => {
        console.warn("Socket disconnected:", reason)

        setConnectionStatus("disconnected")

        addLedgerEntry({
          id: crypto.randomUUID(),
          type: "system",
          message: `Socket disconnected: ${reason}`,
          timestamp: new Date().toISOString(),
        })
      })

      socket.on("connect_error", (error) => {
        console.error("Socket connect_error:", error)

        setConnectionStatus("error")

        addLedgerEntry({
          id: crypto.randomUUID(),
          type: "system",
          message: `Socket connection failed: ${error.message}`,
          timestamp: new Date().toISOString(),
        })
      })

      socket.on("error", (error) => {
        console.error("Socket error:", error)
      })

      socket.on("sync_state", (payload: unknown) => {
        if (!isSyncStateResponse(payload)) return
        setSyncState(payload)
      })

      socket.on("watchtower_alert", (payload: unknown) => {
        const alert =
          payload && typeof payload === "object"
            ? (payload as Record<string, unknown>)
            : null

        setActiveAlert(alert ?? null)

        addLedgerEntry({
          id: crypto.randomUUID(),
          type: "alert",
          message:
            typeof alert?.message === "string"
              ? alert.message
              : "Watchtower alert received.",
          timestamp: new Date().toISOString(),
        })
      })

      socket.on("agent_status", (data: unknown) => {
        if (
          data &&
          typeof data === "object" &&
          "status" in data &&
          typeof (data as { status: unknown }).status === "string"
        ) {
          const status = (data as { status: string }).status

          console.log("Agent is currently:", status)

          setAgentStatus(status)

          addLedgerEntry({
            id: crypto.randomUUID(),
            type: "system",
            message: `Agent status: ${status}`,
            timestamp: new Date().toISOString(),
          })
        }
      })

      socket.on("agent_stream", (payload: unknown) => {
        if (!isAgentStreamPayload(payload)) return
        appendTerminalText(payload.chunk)
      })

      socket.on("approval_required", (payload: unknown) => {
        if (!isApprovalRequiredPayload(payload)) return

        addPendingApproval(payload)

        addLedgerEntry({
          id: crypto.randomUUID(),
          type: "approval",
          message: `Approval required for audit ${payload.audit_id}.`,
          timestamp: new Date().toISOString(),
        })
      })

      socket.on("action_executed", (payload: unknown) => {
        if (!isActionExecutedPayload(payload)) return

        addLedgerEntry({
          id: crypto.randomUUID(),
          type: "action",
          message: payload.message,
          timestamp: new Date().toISOString(),
        })
      })
    } catch (error) {
      console.error("Socket setup failed:", error)

      setConnectionStatus("error")

      addLedgerEntry({
        id: crypto.randomUUID(),
        type: "system",
        message: "Socket setup failed before connection.",
        timestamp: new Date().toISOString(),
      })
    }

    return () => {
      socket?.disconnect()
    }
  }, [
    addLedgerEntry,
    addPendingApproval,
    appendTerminalText,
    setActiveAlert,
    setAgentStatus,
    setConnectionStatus,
    setSyncState,
  ])
}