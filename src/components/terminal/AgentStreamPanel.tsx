"use client"

import { useEffect, useRef } from "react"
import { Bot, Sparkles } from "lucide-react"
import Card from "@/components/ui/Card"
import SectionHeader from "@/components/ui/SectionHeader"
import { useStore } from "@/store/useStore"

function getStatusTone(status: string) {
  const value = status.toLowerCase()

  if (value.includes("scan") || value.includes("analyz")) {
    return "bg-amber-50 text-amber-700"
  }

  if (value.includes("idle")) {
    return "bg-slate-100 text-slate-700"
  }

  return "bg-emerald-50 text-emerald-700"
}

export default function AgentStreamPanel() {
  const text = useStore((state) => state.agentTerminalText)
  const agentStatus = useStore((state) => state.agentStatus)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [text])

  return (
    <Card className="p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <SectionHeader
          title="AI Copilot"
          subtitle="Live reasoning stream from the orchestration layer."
        />

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
          <Bot size={20} />
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusTone(
            agentStatus
          )}`}
        >
          Agent Status: {agentStatus}
        </span>

        <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
          <Sparkles size={13} />
          Realtime reasoning
        </span>
      </div>

      <div
        ref={scrollRef}
        className="h-[560px] overflow-y-auto rounded-[24px] border border-slate-800 bg-[#071120] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
      >
        {text ? (
          <div>
            <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Agent stream live
            </div>

            <pre className="whitespace-pre-wrap font-mono text-sm leading-7 text-emerald-400">
              {text}
            </pre>
          </div>
        ) : (
          <div className="flex h-full flex-col justify-center">
            <p className="font-mono text-lg font-semibold text-emerald-400">
              Waiting for agent stream
            </p>
            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
              The copilot panel will populate as soon as the backend emits
              realtime reasoning events.
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}