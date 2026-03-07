import type { ReactNode } from "react"

type CardProps = {
  children: ReactNode
  className?: string
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-[28px] border border-slate-100 bg-[linear-gradient(180deg,#ffffff_0%,#fcfdff_100%)] shadow-[0_10px_28px_rgba(15,23,42,0.05)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(15,23,42,0.07)] ${className}`}
    >
      {children}
    </div>
  )
}