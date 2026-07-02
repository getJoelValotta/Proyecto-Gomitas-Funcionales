import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { createClient } from "@/lib/supabase/server"

// Initialize Gemini with the API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "")

export async function POST(request: Request) {
  try {
    const { pregunta } = await request.json()

    if (!pregunta) {
      return NextResponse.json(
        { error: "Falta la pregunta" },
        { status: 400 }
      )
    }

    // Initialize Supabase client
    const supabase = await createClient()

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    // Fetch data from Supabase
    // Traemos los datos de stock y proveedores
    const [stockResult, proveedoresResult] = await Promise.all([
      supabase.from("stock").select("*"),
      supabase.from("proveedores").select("*"),
    ])

    if (stockResult.error) {
      console.error("Error fetching stock:", stockResult.error)
    }
    if (proveedoresResult.error) {
      console.error("Error fetching proveedores:", proveedoresResult.error)
    }

    const stock = stockResult.data || []
    const proveedores = proveedoresResult.data || []

    // Build the prompt for Gemini
    const contextPrompt = `
      Eres el asistente virtual del panel de administración de "Gomitas Funcionales".
      Tienes acceso a la siguiente información de la base de datos:
      
      STOCK ACTUAL:
      ${JSON.stringify(stock, null, 2)}
      
      PROVEEDORES:
      ${JSON.stringify(proveedores, null, 2)}
      
      Por favor, responde de manera concisa, amable y profesional a la siguiente pregunta del administrador, 
      basándote ÚNICAMENTE en la información proporcionada arriba. Si la pregunta no está relacionada con el 
      stock o los proveedores, indícalo amablemente.
      
      Pregunta del administrador: "${pregunta}"
    `

    // Call Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    const result = await model.generateContent(contextPrompt)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({ respuesta: text })
  } catch (error: any) {
    console.error("Error en consultar-ia:", error)
    return NextResponse.json(
      { error: error?.message || "Error interno del servidor" },
      { status: 500 }
    )
  }
}
