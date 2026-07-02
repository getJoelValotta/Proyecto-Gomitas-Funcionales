import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = await createClient()

  // Cerrar la sesión en Supabase
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error("Error al cerrar sesión:", error.message)
  }

  // Redirigir al usuario al login
  return NextResponse.redirect(new URL('/admin/login', request.url), {
    status: 302,
  })
}
