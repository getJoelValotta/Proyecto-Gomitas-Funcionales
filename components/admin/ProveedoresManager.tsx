"use client"

import { useState, useMemo } from "react"
import { createClient } from "@/lib/supabase/client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Plus, Edit2, Trash2, Loader2, Save, MapPin, Search } from "lucide-react"

type Proveedor = {
  id: string
  nombre: string
  provincia: string
}

const formSchema = z.object({
  nombre: z.string().min(2, "El nombre es requerido y debe tener al menos 2 caracteres"),
  provincia: z.string().min(2, "La provincia es requerida"),
})

type FormValues = z.infer<typeof formSchema>

export default function ProveedoresManager({ initialProveedores }: { initialProveedores: Proveedor[] }) {
  const [proveedores, setProveedores] = useState<Proveedor[]>(initialProveedores)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filtroProvincia, setFiltroProvincia] = useState<string>("Todas")
  
  const supabase = createClient()

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      provincia: "",
    },
  })

  // Obtener provincias únicas para el filtro
  const provinciasUnicas = useMemo(() => {
    const provs = new Set(proveedores.map(p => p.provincia))
    return ["Todas", ...Array.from(provs).sort()]
  }, [proveedores])

  const proveedoresFiltrados = useMemo(() => {
    if (filtroProvincia === "Todas") return proveedores
    return proveedores.filter(p => p.provincia === filtroProvincia)
  }, [proveedores, filtroProvincia])

  const onSubmit = async (data: FormValues) => {
    setLoading(true)
    setError(null)
    
    try {
      if (editingId) {
        // Update
        const { error: updateError } = await supabase
          .from("proveedores")
          .update({ nombre: data.nombre, provincia: data.provincia })
          .eq("id", editingId)
          
        if (updateError) throw updateError
        
        setProveedores(proveedores.map(item => item.id === editingId ? { ...item, ...data } : item))
        setEditingId(null)
      } else {
        // Create
        const { data: newItems, error: insertError } = await supabase
          .from("proveedores")
          .insert([{ nombre: data.nombre, provincia: data.provincia }])
          .select()
          
        if (insertError) throw insertError
        
        if (newItems && newItems.length > 0) {
          setProveedores([...proveedores, newItems[0]])
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
    if (!confirm("¿Estás seguro de eliminar este proveedor?")) return
    
    setLoading(true)
    try {
      const { error: deleteError } = await supabase
        .from("proveedores")
        .delete()
        .eq("id", id)
        
      if (deleteError) throw deleteError
      
      setProveedores(proveedores.filter(item => item.id !== id))
    } catch (err: any) {
      setError(err.message || "Error al eliminar")
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (item: Proveedor) => {
    setEditingId(item.id)
    setIsAdding(false)
    setValue("nombre", item.nombre)
    setValue("provincia", item.provincia)
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

      {/* Header Actions & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-brand-100">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-700/50" size={18} />
            <select
              value={filtroProvincia}
              onChange={(e) => setFiltroProvincia(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-brand-100/10 border border-brand-100 focus:outline-none focus:ring-2 focus:ring-brand-500 appearance-none text-brand-900"
            >
              {provinciasUnicas.map(prov => (
                <option key={prov} value={prov}>{prov}</option>
              ))}
            </select>
          </div>
        </div>

        {!isAdding && !editingId && (
          <button
            onClick={() => { setIsAdding(true); reset() }}
            className="flex items-center gap-2 bg-brand-500 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors shadow-sm w-full md:w-auto justify-center"
          >
            <Plus size={18} />
            Nuevo Proveedor
          </button>
        )}
      </div>

      {/* Form (Add / Edit) */}
      {(isAdding || editingId) && (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-2xl shadow-sm border border-brand-100 animate-in fade-in slide-in-from-top-4">
          <h3 className="text-lg font-medium text-brand-900 mb-4">
            {editingId ? "Editar Proveedor" : "Nuevo Proveedor"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-brand-900 mb-1">Nombre</label>
              <input
                {...register("nombre")}
                className="w-full px-4 py-2 rounded-lg bg-brand-100/10 border border-brand-100 text-brand-900 placeholder-brand-700/50 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                placeholder="Ej. Insumos Naturales S.A."
              />
              {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-900 mb-1">Provincia</label>
              <input
                {...register("provincia")}
                className="w-full px-4 py-2 rounded-lg bg-brand-100/10 border border-brand-100 text-brand-900 placeholder-brand-700/50 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                placeholder="Ej. Buenos Aires"
              />
              {errors.provincia && <p className="text-red-500 text-xs mt-1">{errors.provincia.message}</p>}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={cancelEdit}
              className="px-4 py-2 rounded-lg text-brand-700/80 hover:bg-brand-100/20 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-brand-500 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              Guardar
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-brand-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-brand-100/10 border-b border-brand-100 text-brand-700/80 text-sm">
              <th className="py-3 px-6 font-medium">Nombre</th>
              <th className="py-3 px-6 font-medium">Provincia</th>
              <th className="py-3 px-6 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {proveedoresFiltrados.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-8 text-center text-brand-700/60">
                  No se encontraron proveedores.
                </td>
              </tr>
            ) : (
              proveedoresFiltrados.map((item) => (
                <tr key={item.id} className="border-b border-brand-100/50 hover:bg-brand-100/10 transition-colors">
                  <td className="py-3 px-6 font-medium text-brand-900">{item.nombre}</td>
                  <td className="py-3 px-6 text-brand-700/80 flex items-center gap-1">
                    <MapPin size={14} className="text-brand-700/50" />
                    {item.provincia}
                  </td>
                  <td className="py-3 px-6 flex justify-end gap-2">
                    <button
                      onClick={() => startEdit(item)}
                      disabled={loading}
                      className="p-2 text-brand-700/50 hover:text-brand-500 hover:bg-brand-100/20 rounded-lg transition-colors disabled:opacity-50"
                      title="Editar"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={loading}
                      className="p-2 text-brand-700/50 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
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
