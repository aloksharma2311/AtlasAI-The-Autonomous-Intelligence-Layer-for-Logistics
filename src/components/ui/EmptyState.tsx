type EmptyStateProps = {
  title: string
  description: string
}

export default function EmptyState({
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[160px] flex-col items-center justify-center rounded-[24px] border border-dashed border-slate-200 bg-slate-50 px-6 text-center">
      <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
      <p className="mt-2 max-w-sm text-xs leading-6 text-slate-500">
        {description}
      </p>
    </div>
  )
}