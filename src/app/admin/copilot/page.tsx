"use client"

import Topbar from "@/components/layout/Topbar"
import AgentStreamPanel from "@/components/terminal/AgentStreamPanel"

export default function CopilotPage() {
  return (
    <div>
      <Topbar title="Copilot" />
      <AgentStreamPanel />
    </div>
  )
}