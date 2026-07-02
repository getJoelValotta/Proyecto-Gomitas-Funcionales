"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Plus, Edit2, Trash2, Loader2, Save, X } from "lucide-react"

type StockItem = {
  id: string
  lote: string
  cantidad: number
}

const formSchema = z.object({
  lote: z.string().min(1, "El lote es requerido"),
  cantidad: z.number().min(0, "La cantidad debe ser 0 o mayor"),
})

type FormValues = z.infer<typeof formSchema>

export default function StockManager({ initialStock }: { initialStock: StockItem[] }) {
  const [stock, setStock] = useState<StockItem[]>(initialStock)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClient()

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lote: "",
      cantidad: 0,
    },
  })

  const onSubmit = async (data: FormValues) => {
    setLoading(true)
    setError(null)
    
    try {
      if (editingId) {
        // Update
        const { error: updateError } = await supabase
          .from("stock")
          .update({ lote: data.lote, cantidad: data.cantidad })
          .eq("id", editingId)
          
        if (updateError) throw updateError
        
        setStock(stock.map(item => item.id === editingId ? { ...item, ...data } : item))
        setEditingId(null)
      } else {
        // Create
        // Generating a dummy UUID for the insert, Supabase will generate one but we need it for optimistic UI if we don't return it
        // Better to select the created item.
        const { data: newItems, error: insertError } = await supabase
          .from("stock")
          .insert([{ lote: data.lote, cantidad: data.cantidad }])
          .select()
          
        if (insertError) throw insertError
        
        if (newItems && newItems.length > 0) {
          setStock([...stock, newItems[0]])
        }
        setIsAdding(false)
      }
      reset()
    } catch (err: any) {
      setError(err.message || "Error al guardar")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este registro?")) return
    
    setLoading(true)
    try {
      const { error: deleteError } = await supabase
        .from("stock")
        .delete()
        .eq("id", id)
        
      if (deleteError) throw deleteError
      
      setStock(stock.filter(item => item.id !== id))
    } catch (err: any) {
      setError(err.message || "Error al eliminar")
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (item: StockItem) => {
    setEditingId(item.id)
    setIsAdding(false)
    setValue("lote", item.lote)
    setValue("cantidad", item.cantidad)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setIsAdding(false)
    reset()
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 rounded-xl bg-red-50 text-red-600 border border-red-200">
          {error}
        </div>
      )}

      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-800">Inventario Actual</h2>
        {!isAdding && !editingId && (
          <button
            onClick={() => { setIsAdding(true); reset() }}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus size={18} />
            Nuevo Registro
          </button>
        )}
      </div>

      {/* Form (Add / Edit) */}
      {(isAdding || editingId) && (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 animate-in fade-in slide-in-from-top-4">
          <h3 className="text-lg font-medium text-slate-800 mb-4">
            {editingId ? "Editar Registro" : "Nuevo Registro"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Lote</label>
              <input
                {...register("lote")}
                className="w-full px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="Ej. LOTE-001"
              />
              {errors.lote && <p className="text-red-500 text-xs mt-1">{errors.lote.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Cantidad</label>
              <input
                type="number"
                {...register("cantidad", { valueAsNumber: true })}
                className="w-full px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="0"
              />
              {errors.cantidad && <p className="text-red-500 text-xs mt-1">{errors.cantidad.message}</p>}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={cancelEdit}
              className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              Guardar
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm">
              <th className="py-3 px-6 font-medium">Lote</th>
              <th className="py-3 px-6 font-medium">Cantidad</th>
              <th className="py-3 px-6 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {stock.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-8 text-center text-slate-500">
                  No hay registros de stock.
                </td>
              </tr>
            ) : (
              stock.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-6 font-medium text-slate-800">{item.lote}</td>
                  <td className="py-3 px-6">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      item.cantidad < 10 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {item.cantidad} unidades
                    </span>
                  </td>
                  <td className="py-3 px-6 flex justify-end gap-2">
                    <button
                      onClick={() => startEdit(item)}
                      disabled={loading}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Editar"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={loading}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Eliminar"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
