import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="w-full h-full min-h-[50vh] flex flex-col items-center justify-center text-brand-500">
      <Loader2 className="w-12 h-12 animate-spin mb-4" />
      <p className="text-lg font-medium text-brand-700 animate-pulse">Cargando datos...</p>
    </div>
  )
}
