"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Send, CheckCircle, AlertCircle } from "lucide-react"

const formSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Debe ser un correo electrónico válido"),
  mensaje: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
})

type FormValues = z.infer<typeof formSchema>

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      email: "",
      mensaje: "",
    },
  })

  const onSubmit = async (data: FormValues) => {
    setStatus("loading")
    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await res.json()

      if (!res.ok || result.error) {
        throw new Error(result.error || "Ocurrió un error al enviar el mensaje")
      }

      setStatus("success")
      reset()
    } catch (err: any) {
      setStatus("error")
      setErrorMessage(err.message)
    }
  }

  return (
    <div className="w-full max-w-md p-8 rounded-2xl bg-white/80 backdrop-blur-md shadow-xl border border-white/20">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Send className="text-brand-500" size={24} />
        Contáctanos
      </h3>

      {status === "success" && (
        <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 flex items-start gap-3 text-green-700 animate-in fade-in slide-in-from-top-2">
          <CheckCircle className="shrink-0 mt-0.5" size={20} />
          <div>
            <p className="font-semibold">¡Mensaje enviado!</p>
            <p className="text-sm mt-1">Nos pondremos en contacto contigo a la brevedad.</p>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="shrink-0 mt-0.5" size={20} />
          <div>
            <p className="font-semibold">Error al enviar</p>
            <p className="text-sm mt-1">{errorMessage}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre
          </label>
          <input
            {...register("nombre")}
            id="nombre"
            className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all duration-200"
            placeholder="Tu nombre"
          />
          {errors.nombre && (
            <p className="text-red-500 text-xs mt-1 font-medium">{errors.nombre.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            {...register("email")}
            id="email"
            type="email"
            className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all duration-200"
            placeholder="tu@email.com"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1 font-medium">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700 mb-1">
            Mensaje
          </label>
          <textarea
            {...register("mensaje")}
            id="mensaje"
            rows={4}
            className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all duration-200 resize-none"
            placeholder="¿En qué podemos ayudarte?"
          />
          {errors.mensaje && (
            <p className="text-red-500 text-xs mt-1 font-medium">{errors.mensaje.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full py-3 px-4 flex justify-center items-center gap-2 rounded-lg text-white font-medium bg-brand-500 hover:bg-brand-700 focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-brand-500/30"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Enviando...
            </>
          ) : (
            "Enviar Mensaje"
          )}
        </button>
      </form>
    </div>
  )
}
