import ContactForm from "@/components/ContactForm"
import { ArrowRight, Leaf, Shield, Zap } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 selection:bg-indigo-200">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50" />
        
        {/* Navigation */}
        <nav className="relative z-10 flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <div className="font-bold text-2xl tracking-tighter text-indigo-950 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm">GF</span>
            Gomitas Funcionales
          </div>
          <Link
            href="/admin/login"
            className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
          >
            Panel de Control
          </Link>
        </nav>

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 sm:pt-32 sm:pb-40 lg:pt-40 lg:pb-48">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl text-balance">
              El futuro de tu bienestar, en una <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">gomita</span>.
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Descubre nuestras gomitas funcionales. Diseñadas científicamente con ingredientes naturales para darte la energía, concentración y calma que necesitas cada día.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="#contacto"
                className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 transition-all flex items-center gap-2"
              >
                Hacer un pedido <ArrowRight size={16} />
              </a>
              <a href="#sobre-nosotros" className="text-sm font-semibold leading-6 text-slate-900 hover:text-indigo-600 transition-colors">
                Saber más <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
        
        {/* Decoraciones de fondo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl opacity-50 pointer-events-none" />
      </section>

      {/* Características */}
      <section className="py-24 sm:py-32 bg-slate-50" id="sobre-nosotros">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">Sobre nosotros</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl text-balance">
              Ingredientes puros, resultados reales
            </p>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Somos pioneros en la creación de suplementos funcionales en formato de gomitas. Nuestro objetivo es hacer que cuidar tu salud sea no solo efectivo, sino también delicioso.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-slate-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white">
                    <Leaf size={24} />
                  </div>
                  100% Naturales
                </dt>
                <dd className="mt-2 text-base leading-7 text-slate-600">
                  Utilizamos extractos botánicos de la más alta calidad, sin conservantes ni colorantes artificiales.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-slate-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white">
                    <Zap size={24} />
                  </div>
                  Acción Rápida
                </dt>
                <dd className="mt-2 text-base leading-7 text-slate-600">
                  Nuestra fórmula patentada asegura una absorción un 30% más rápida que las cápsulas tradicionales.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-slate-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white">
                    <Shield size={24} />
                  </div>
                  Calidad Certificada
                </dt>
                <dd className="mt-2 text-base leading-7 text-slate-600">
                  Cada lote es testeado en laboratorios independientes para garantizar su pureza y potencia.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section id="contacto" className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-slate-900" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=2000&auto=format&fit=crop')] opacity-10 bg-cover bg-center mix-blend-overlay" />
        
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16">
          <div className="max-w-xl lg:w-1/2">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl text-balance">
              ¿Listo para mejorar tu rutina?
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              Déjanos tus datos y nos pondremos en contacto contigo para asesorarte sobre cuáles son las gomitas funcionales ideales para ti o para realizar un pedido mayorista.
            </p>
          </div>
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <ContactForm />
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-slate-950 py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center text-slate-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Gomitas Funcionales. Todos los derechos reservados.</p>
        </div>
      </footer>
    </main>
  )
}
