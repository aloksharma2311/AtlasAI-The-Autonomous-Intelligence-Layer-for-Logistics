import {
  Boxes,
  Truck,
  AlertTriangle,
  ClipboardList,
  type LucideIcon,
} from "lucide-react"
import Card from "@/components/ui/Card"

type KpiCardProps = {
  title: string
  value: string | number
  hint: string
}

type ThemeConfig = {
  cardClass: string
  iconWrapClass: string
  iconClass: string
  Icon: LucideIcon
}

function getTheme(title: string): ThemeConfig {
  const normalized = title.toLowerCase()

  if (normalized.includes("shipment")) {
    return {
      cardClass: "bg-rose-50 border-rose-100",
      iconWrapClass: "bg-rose-100",
      iconClass: "text-rose-600",
      Icon: Boxes,
    }
  }

  if (normalized.includes("congested")) {
    return {
      cardClass: "bg-amber-50 border-amber-100",
      iconWrapClass: "bg-amber-100",
      iconClass: "text-amber-600",
      Icon: AlertTriangle,
    }
  }

  if (normalized.includes("carrier")) {
    return {
      cardClass: "bg-emerald-50 border-emerald-100",
      iconWrapClass: "bg-emerald-100",
      iconClass: "text-emerald-600",
      Icon: Truck,
    }
  }

  return {
    cardClass: "bg-violet-50 border-violet-100",
    iconWrapClass: "bg-violet-100",
    iconClass: "text-violet-600",
    Icon: ClipboardList,
  }
}

export default function KpiCard({ title, value, hint }: KpiCardProps) {
  const theme = getTheme(title)
  const Icon = theme.Icon

  return (
    <Card className={`p-5 transition hover:-translate-y-0.5 ${theme.cardClass}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <div className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
            {value}
          </div>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl ${theme.iconWrapClass}`}
        >
          <Icon className={theme.iconClass} size={20} />
        </div>
      </div>

      <p className="mt-4 text-xs font-medium text-slate-400">{hint}</p>
    </Card>
  )
}