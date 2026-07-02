import { NextResponse } from "next/server"
import { Resend } from "resend"

// Initialize Resend with the API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { nombre, email, mensaje } = await request.json()

    if (!nombre || !email || !mensaje) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      )
    }

    const { data, error } = await resend.emails.send({
      from: "Gomitas Funcionales <onboarding@resend.dev>", // Usar el dominio verificado en Resend en producción
      to: ["valottajoel@gmail.com"], // Correo donde se reciben los contactos
      subject: `Nuevo mensaje de contacto de ${nombre}`,
      replyTo: email,
      html: `
        <h2>Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${mensaje}</p>
      `,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error("Error al procesar contacto:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
