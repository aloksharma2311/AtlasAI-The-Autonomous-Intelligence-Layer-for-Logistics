"use client"

import Topbar from "@/components/layout/Topbar"
import ScenarioPanel from "@/components/scenarios/ScenarioPanel"

export default function ScenariosPage() {
  return (
    <div>
      <Topbar title="Scenarios" />
      <ScenarioPanel />
    </div>
  )
}