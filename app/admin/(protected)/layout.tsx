import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, Package, Truck, LogOut, Globe } from "lucide-react"
import ChatWidget from "@/components/ChatWidget"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/admin/login")
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-brand-900 text-brand-100/80 flex flex-col border-r border-brand-700">
        <div className="p-6">
          <div className="font-bold text-xl text-white tracking-tight flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white text-xs">GF</span>
            Admin Panel
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 mb-4 rounded-lg bg-brand-500/20 text-brand-100 hover:bg-brand-500/40 hover:text-white transition-colors font-medium border border-brand-500/30"
          >
            <Globe size={20} />
            Ver sitio web
          </Link>
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-brand-700 hover:text-white transition-colors"
          >
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link
            href="/admin/stock"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-brand-700 hover:text-white transition-colors"
          >
            <Package size={20} />
            Stock
          </Link>
          <Link
            href="/admin/proveedores"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-brand-700 hover:text-white transition-colors"
          >
            <Truck size={20} />
            Proveedores
          </Link>
        </nav>

        <div className="p-4 border-t border-brand-700">
          <div className="text-sm px-4 py-2 mb-2 text-brand-100/60 break-all">
            {user.email}
          </div>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
            >
              <LogOut size={18} />
              Cerrar Sesión
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
      
      {/* AI Chat Widget */}
      <ChatWidget />
    </div>
  )
}
