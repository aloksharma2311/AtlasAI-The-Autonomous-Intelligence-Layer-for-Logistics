"use client"

import { useMemo, useRef, useState } from "react"
import dagre from "dagre"
import ReactFlow, {
  Background,
  MarkerType,
  Position,
  ReactFlowProvider,
  useReactFlow,
  type Edge,
  type Node,
} from "reactflow"
import "reactflow/dist/style.css"
import {
  Expand,
  LocateFixed,
  Minus,
  Plus,
  Route,
  Shrink,
  Warehouse,
} from "lucide-react"

import Card from "@/components/ui/Card"
import SectionHeader from "@/components/ui/SectionHeader"
import { useStore } from "@/store/useStore"
import WarehouseNode from "@/components/map/WarehouseNode"
import type { Shipment, Warehouse as WarehouseType } from "@/types/contract"

const NODE_WIDTH = 240
const NODE_HEIGHT = 210
const MAX_VISIBLE_EDGES = 35

function getShipmentPriorityScore(shipment: Shipment) {
  const promised = new Date(shipment.promised_eta).getTime()
  const current = new Date(shipment.current_eta).getTime()

  const isDelayed =
    Number.isFinite(promised) &&
    Number.isFinite(current) &&
    current > promised

  const priorityScore =
    shipment.priority === "High"
      ? 3
      : shipment.priority === "Medium"
      ? 2
      : 1

  return {
    isDelayed,
    score: (isDelayed ? 100 : 0) + priorityScore,
  }
}

function getVisibleShipments(shipments: Shipment[]) {
  return [...shipments]
    .sort((a, b) => {
      const aMeta = getShipmentPriorityScore(a)
      const bMeta = getShipmentPriorityScore(b)
      return bMeta.score - aMeta.score
    })
    .slice(0, MAX_VISIBLE_EDGES)
}

function buildLayoutNodes(
  warehouses: WarehouseType[],
  activeAlertNodeId?: string
) {
  return warehouses.map((warehouse) => ({
    id: warehouse.id,
    data: {
      label: (
        <WarehouseNode
          warehouse={warehouse}
          isAlerted={activeAlertNodeId === warehouse.id}
        />
      ),
    },
    position: { x: 0, y: 0 },
    draggable: false,
    selectable: true,
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  }))
}

function applyDagreLayout(nodes: Node[], edges: Edge[]) {
  const graph = new dagre.graphlib.Graph()
  graph.setDefaultEdgeLabel(() => ({}))
  graph.setGraph({
    rankdir: "LR",
    nodesep: 90,
    ranksep: 170,
    marginx: 50,
    marginy: 50,
  })

  nodes.forEach((node) => {
    graph.setNode(node.id, {
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
    })
  })

  edges.forEach((edge) => {
    graph.setEdge(edge.source, edge.target)
  })

  dagre.layout(graph)

  return nodes.map((node) => {
    const position = graph.node(node.id)

    return {
      ...node,
      position: {
        x: position.x - NODE_WIDTH / 2,
        y: position.y - NODE_HEIGHT / 2,
      },
    }
  })
}

type MapControlsProps = {
  isFullscreen: boolean
  onToggleFullscreen: () => void
}

function MapControls({
  isFullscreen,
  onToggleFullscreen,
}: MapControlsProps) {
  const { zoomIn, zoomOut, fitView } = useReactFlow()

  return (
    <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
      <button
        onClick={() => zoomIn()}
        className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
        title="Zoom in"
      >
        <Plus size={16} />
      </button>

      <button
        onClick={() => zoomOut()}
        className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
        title="Zoom out"
      >
        <Minus size={16} />
      </button>

      <button
        onClick={() => fitView({ padding: 0.24 })}
        className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
        title="Fit view"
      >
        <LocateFixed size={16} />
      </button>

      <button
        onClick={onToggleFullscreen}
        className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
        title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      >
        {isFullscreen ? <Shrink size={16} /> : <Expand size={16} />}
      </button>
    </div>
  )
}

function NetworkMapInner() {
  const warehouses = useStore((state) => state.warehouses)
  const shipments = useStore((state) => state.shipments)
  const activeAlert = useStore((state) => state.activeAlert)

  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const visibleShipments = useMemo(
    () => getVisibleShipments(shipments),
    [shipments]
  )

  const delayedVisibleShipments = useMemo(() => {
    return visibleShipments.filter((shipment) => {
      const promised = new Date(shipment.promised_eta).getTime()
      const current = new Date(shipment.current_eta).getTime()
      return (
        Number.isFinite(promised) &&
        Number.isFinite(current) &&
        current > promised
      )
    }).length
  }, [visibleShipments])

  const edges: Edge[] = useMemo(() => {
    return visibleShipments.map((shipment) => {
      const meta = getShipmentPriorityScore(shipment)

      return {
        id: shipment.id,
        source: shipment.origin_id,
        target: shipment.destination_id,
        label: shipment.priority,
        type: "smoothstep",
        animated: shipment.status !== "delivered",
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 18,
          height: 18,
          color: meta.isDelayed ? "#ef4444" : "#6366f1",
        },
        style: {
          stroke: meta.isDelayed ? "#ef4444" : "#818cf8",
          strokeWidth: meta.isDelayed ? 2.5 : 2,
          opacity: 0.75,
        },
        labelStyle: {
          fill: meta.isDelayed ? "#dc2626" : "#64748b",
          fontSize: 10,
          fontWeight: 700,
        },
      }
    })
  }, [visibleShipments])

  const nodes: Node[] = useMemo(() => {
    const baseNodes = buildLayoutNodes(
      warehouses,
      typeof activeAlert?.node_id === "string" ? activeAlert.node_id : undefined
    )

    return applyDagreLayout(baseNodes, edges)
  }, [warehouses, activeAlert?.node_id, edges])

  async function handleToggleFullscreen() {
    if (!containerRef.current) return

    if (!document.fullscreenElement) {
      await containerRef.current.requestFullscreen()
      setIsFullscreen(true)
    } else {
      await document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  return (
    <Card className="p-5">
      <div className="mb-4 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <SectionHeader
          title="Live Network Map"
          subtitle="Operational warehouse graph with prioritized shipment routes."
        />

        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
            <Warehouse size={14} />
            Warehouses: {warehouses.length}
          </span>

          <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
            <Route size={14} />
            Visible Routes: {visibleShipments.length}
          </span>

          <span className="inline-flex rounded-full bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700">
            Delayed: {delayedVisibleShipments}
          </span>
        </div>
      </div>

      <div
        ref={containerRef}
        className={`relative overflow-hidden rounded-[26px] border border-slate-100 bg-[linear-gradient(180deg,#f8fbff_0%,#f8fafc_100%)] ${
          isFullscreen ? "h-screen" : "h-[620px]"
        }`}
      >
        <div className="absolute inset-x-0 top-0 z-[5] h-16 bg-gradient-to-b from-white/70 to-transparent" />

        <MapControls
          isFullscreen={isFullscreen}
          onToggleFullscreen={handleToggleFullscreen}
        />

        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          fitViewOptions={{ padding: 0.24 }}
          minZoom={0.2}
          maxZoom={1.4}
          proOptions={{ hideAttribution: true }}
        >
          <Background gap={24} size={1} color="#dbe4f0" />
        </ReactFlow>
      </div>

      <div className="mt-4 flex flex-wrap gap-3 text-xs font-medium text-slate-500">
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          Healthy warehouse
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
          Congested warehouse
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-0.5 w-6 rounded bg-indigo-400" />
          Active route
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-0.5 w-6 rounded bg-rose-400" />
          Delayed route
        </span>
      </div>
    </Card>
  )
}

export default function NetworkMap() {
  return (
    <ReactFlowProvider>
      <NetworkMapInner />
    </ReactFlowProvider>
  )
}