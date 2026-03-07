"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LockKeyhole, ShieldCheck, Sparkles, UserRound } from "lucide-react"
import { login } from "@/lib/auth"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const success = login(username, password)

    if (success) {
      router.push("/admin/dashboard")
      router.refresh()
      return
    }

    setError("Invalid username or password.")
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#eef8ef_0%,#f4f8fb_45%,#f8fafc_100%)] px-4 py-8 sm:px-6">
      <div className="mx-auto flex min-h-[88vh] max-w-6xl items-center justify-center">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-[36px] border border-white/70 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)] lg:grid-cols-2">
          <div className="hidden bg-[linear-gradient(160deg,#5b5cf0_0%,#6f61ff_50%,#7d66ff_100%)] p-10 text-white lg:block">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
              <Sparkles size={20} />
            </div>

            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.25em] text-indigo-100">
              AtlasAI
            </p>

            <h1 className="mt-5 text-4xl font-bold leading-tight">
              Logistics Intelligence Dashboard
            </h1>

            <p className="mt-4 max-w-md text-sm leading-7 text-indigo-100">
              Secure admin access to the operations dashboard, live network map,
              AI copilot, approvals, scenarios, and safety ledger.
            </p>

            <div className="mt-10 rounded-[26px] border border-white/10 bg-white/10 p-6 backdrop-blur">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} />
                <p className="text-sm font-semibold">Admin Access</p>
              </div>

              <p className="mt-3 text-sm leading-6 text-indigo-100">
                Use the credentials configured in your environment file to
                continue into the control console.
              </p>
              
            </div>
          </div>

          <div className="flex items-center p-8 sm:p-10">
            <div className="mx-auto w-full max-w-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 lg:hidden">
                <Sparkles size={20} />
              </div>

              <p className="mt-5 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                Admin Login
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                Welcome back
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Sign in to access the AtlasAI admin dashboard.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Username
                  </label>
                  <div className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-indigo-400 focus-within:bg-white focus-within:shadow-sm">
                    <UserRound size={16} className="text-slate-400" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter username"
                      className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <div className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-indigo-400 focus-within:bg-white focus-within:shadow-sm">
                    <LockKeyhole size={16} className="text-slate-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {error ? (
                  <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                    {error}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={loading}
                  className="h-12 w-full rounded-2xl bg-indigo-600 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(79,70,229,0.22)] transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Signing in..." : "Login"}
                </button>
              </form>

              <div className="mt-6 rounded-2xl bg-slate-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Secure Access Notice
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  This login is intended for admin dashboard access during demo
                  and evaluation flows.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}