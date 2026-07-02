import { createClient } from "@/lib/supabase/server"
import StockManager from "@/components/admin/StockManager"

export default async function StockPage() {
  const supabase = await createClient()

  // Carga inicial de datos (Server Side)
  const { data: stock, error } = await supabase
    .from("stock")
    .select("*")
    .order("lote", { ascending: true })

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200">
        Error al cargar el stock: {error.message}
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Gestión de Stock</h1>
      <StockManager initialStock={stock || []} />
    </div>
  )
}
