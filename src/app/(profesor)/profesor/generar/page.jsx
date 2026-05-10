'use client'

import { useRouter } from 'next/navigation'
import NavBar from '@/components/layout/NavBar.jsx'

const TIPOS = [
  {
    id: 'tarea',
    nombre: 'Tarea',
    descripcion: 'Genera ejercicios con IA: opcion multiple, abierta, calculo y mas.',
    href: '/profesor/generar/tarea',
    icono: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
      </svg>
    ),
    color: 'bg-blue-50 text-blue-600 border-blue-200 hover:border-blue-400',
  },
  {
    id: 'examen',
    nombre: 'Examen',
    descripcion: 'Crea un examen formal con preguntas variadas, listo para imprimir o asignar.',
    href: '/profesor/generar/examen',
    icono: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    ),
    color: 'bg-purple-50 text-purple-600 border-purple-200 hover:border-purple-400',
  },
  {
    id: 'proyecto',
    nombre: 'Proyecto NEM',
    descripcion: 'Genera un proyecto interdisciplinario alineado al programa NEM con etapas y rubrica.',
    href: '/profesor/generar/proyecto',
    icono: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
      </svg>
    ),
    color: 'bg-green-50 text-green-600 border-green-200 hover:border-green-400',
  },
  {
    id: 'plan',
    nombre: 'Plan de clase',
    descripcion: 'Genera una secuencia didactica completa: inicio, desarrollo, cierre y evaluacion.',
    href: '/profesor/generar/plan',
    icono: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    color: 'bg-orange-50 text-orange-600 border-orange-200 hover:border-orange-400',
  },
]

export default function HubGenerar() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar titulo="Generar con IA" volver="/profesor" />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Crear contenido con IA</h1>
          <p className="text-sm text-gray-500">
            Selecciona el tipo de contenido que quieres generar.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TIPOS.map((tipo) => (
            <button
              key={tipo.id}
              type="button"
              onClick={() => router.push(tipo.href)}
              className={`card p-6 text-left border-2 transition-all hover:shadow-md ${tipo.color}`}
            >
              <div className="mb-4">{tipo.icono}</div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">{tipo.nombre}</h2>
              <p className="text-sm text-gray-500 leading-relaxed">{tipo.descripcion}</p>
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}
