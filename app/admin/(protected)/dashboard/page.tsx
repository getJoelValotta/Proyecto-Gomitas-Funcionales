import { createClient } from "@/lib/supabase/server"
import { Package, Truck, AlertTriangle } from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()

  // Fetch metrics
  const { data: stockData, error: stockError } = await supabase.from("stock").select("*")
  const { data: proveedoresData, error: provError } = await supabase.from("proveedores").select("*")

  const totalProductos = stockData ? stockData.length : 0
  const stockBajoCount = stockData ? stockData.filter(item => item.cantidad < 10).length : 0
  const totalProveedores = proveedoresData ? proveedoresData.length : 0

  return (
    <div>
      <h1 className="text-3xl font-bold text-brand-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric 1: Total Productos */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-100 flex items-start gap-4">
          <div className="p-3 bg-brand-100 text-brand-500 rounded-xl">
            <Package size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-brand-700/70">Productos en Stock</p>
            <p className="text-3xl font-bold text-brand-900 mt-1">{totalProductos}</p>
          </div>
        </div>

        {/* Metric 2: Proveedores */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-100 flex items-start gap-4">
          <div className="p-3 bg-brand-100 text-brand-300 rounded-xl">
            <Truck size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-brand-700/70">Total Proveedores</p>
            <p className="text-3xl font-bold text-brand-900 mt-1">{totalProveedores}</p>
          </div>
        </div>

        {/* Metric 3: Stock Bajo */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-100 flex items-start gap-4">
          <div className="p-3 bg-brand-500/20 text-brand-500 rounded-xl">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-brand-700/70">Alertas de Stock</p>
            <p className="text-3xl font-bold text-brand-900 mt-1">{stockBajoCount}</p>
            <p className="text-xs text-brand-700/60 mt-1">Productos con menos de 10 u.</p>
          </div>
        </div>
      </div>
      
      {/* Resumen */}
      <div className="mt-8 bg-white p-8 rounded-2xl shadow-sm border border-brand-100">
        <h2 className="text-xl font-bold text-brand-900 mb-4">Bienvenido al Panel de Control</h2>
        <p className="text-brand-700/80">
          Desde aquí puedes gestionar el inventario de gomitas funcionales y los proveedores asociados. 
          Utiliza el menú lateral para navegar a las distintas secciones. 
          También cuentas con un asistente de Inteligencia Artificial en la esquina inferior derecha 
          que puede responder tus dudas sobre el estado actual de tu negocio.
        </p>
      </div>
    </div>
  )
}
