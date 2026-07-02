import { createClient } from "@/lib/supabase/server"
import ProveedoresManager from "@/components/admin/ProveedoresManager"

export default async function ProveedoresPage() {
  const supabase = await createClient()

  // Carga inicial de datos (Server Side)
  const { data: proveedores, error } = await supabase
    .from("proveedores")
    .select("*")
    .order("nombre", { ascending: true })

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200">
        Error al cargar los proveedores: {error.message}
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-brand-900 mb-8">Gestión de Proveedores</h1>
      <ProveedoresManager initialProveedores={proveedores || []} />
    </div>
  )
}
