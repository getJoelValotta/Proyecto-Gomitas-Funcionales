"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Loader2, LogIn, Lock, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push("/admin/dashboard")
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-900 relative">
      <Link 
        href="/"
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-sm font-medium"
      >
        <ArrowLeft size={16} />
        Volver a inicio
      </Link>
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop')] opacity-20 bg-cover bg-center mix-blend-overlay" />
      
      <div className="relative z-10 w-full max-w-md p-8 rounded-2xl bg-white/10 backdrop-blur-xl shadow-2xl border border-white/20">
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-brand-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-brand-500/30">
            <Lock className="text-white" size={24} />
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Panel de Control</h2>
          <p className="text-brand-100/80 mt-2 text-sm">Gomitas Funcionales</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm text-center animate-in fade-in zoom-in-95">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-brand-100 mb-1" htmlFor="email">
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black/30 border border-brand-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
              placeholder="admin@ejemplo.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-100 mb-1" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black/30 border border-brand-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 flex justify-center items-center gap-2 rounded-xl text-white font-semibold bg-brand-500 hover:bg-brand-700 focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-900 focus:ring-brand-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-500/20"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <LogIn size={20} />
                Ingresar
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
