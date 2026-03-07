export default function LoadingState() {
  return (
    <div className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
      <div className="animate-pulse">
        <div className="mb-4 h-5 w-40 rounded bg-slate-200" />
        <div className="h-[420px] rounded-[24px] bg-slate-100" />
      </div>
    </div>
  )
}