type SectionHeaderProps = {
  title: string
  subtitle?: string
}

export default function SectionHeader({
  title,
  subtitle,
}: SectionHeaderProps) {
  return (
    <div className="mb-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
        Dashboard Section
      </p>
      <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-1 text-sm leading-6 text-slate-500">{subtitle}</p>
      ) : null}
    </div>
  )
}