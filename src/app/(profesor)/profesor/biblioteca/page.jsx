'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, BookOpen, Presentation, Play, ClipboardCheck, ChevronDown } from 'lucide-react'
import NavBar from '@/components/layout/NavBar.jsx'
import VisorContenido from '@/components/profesor/biblioteca/VisorContenido.jsx'
import { PDAS_MATEMATICAS_1 } from '@/mock/pdas/matematicas_1.js'
import contenidoGenerado from '@/content/biblioteca/matematicas-1.json'

const TIPOS_RECURSO = [
  { key: 'orientacion', label: 'Orientacion didactica', icon: FileText },
  { key: 'libro', label: 'Libro del alumno', icon: BookOpen },
  { key: 'diapositiva', label: 'Diapositivas', icon: Presentation },
  { key: 'video_script', label: 'Video leccion', icon: Play },
  { key: 'evaluacion', label: 'Evaluacion', icon: ClipboardCheck },
]

function getContenidoSemana(secuencia) {
  return contenidoGenerado.find((c) => c.secuencia === secuencia) ?? null
}

export default function Biblioteca() {
  const router = useRouter()
  const [semanaAbierta, setSemanaAbierta] = useState(null)
  const [visor, setVisor] = useState(null) // { semana, tipo, contenido }

  function handleToggleSemana(secuencia) {
    setSemanaAbierta(semanaAbierta === secuencia ? null : secuencia)
  }

  function handleAbrirRecurso(pda, tipo) {
    const contenido = getContenidoSemana(pda.secuencia)
    if (!contenido || !contenido[tipo]) return
    setVisor({ semana: pda, tipo, contenido: contenido[tipo] })
  }

  function handleEnviarAlumnos(preguntas) {
    if (!visor) return
    sessionStorage.setItem(
      'kleo_evaluacion_enviar',
      JSON.stringify({
        nombre: `Evaluacion — ${visor.semana.titulo}`,
        materia: 'Matemáticas',
        preguntas,
      }),
    )
    router.push('/profesor/generar/examen?desde=biblioteca')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar titulo="Biblioteca" volver="/profesor" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900">Matematicas</h1>
          <p className="text-sm text-gray-500 mt-1">
            1° Secundaria &middot; 36 semanas &middot; Programa NEM
          </p>
        </div>

        <div className="space-y-2">
          {PDAS_MATEMATICAS_1.map((pda) => {
            const contenido = getContenidoSemana(pda.secuencia)
            const isOpen = semanaAbierta === pda.secuencia
            const tieneContenido = contenido !== null

            return (
              <div
                key={pda.secuencia}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
              >
                {/* Week header */}
                <button
                  type="button"
                  onClick={() => handleToggleSemana(pda.secuencia)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                    {pda.secuencia}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {pda.titulo}
                    </p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">
                      {pda.contenido}
                    </p>
                  </div>
                  {tieneContenido && (
                    <span className="flex-shrink-0 w-2 h-2 rounded-full bg-green-400" title="Contenido disponible" />
                  )}
                  <ChevronDown
                    className={`flex-shrink-0 w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Expanded: resources */}
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                      <span className="font-medium">PDA:</span> {pda.pda}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {TIPOS_RECURSO.map(({ key, label, icon: Icon }) => {
                        const disponible = contenido?.[key] != null
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => handleAbrirRecurso(pda, key)}
                            disabled={!disponible}
                            className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border transition-colors ${
                              disponible
                                ? 'bg-white border-gray-200 text-gray-700 hover:border-amarillo hover:bg-amber-50'
                                : 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                            {label}
                          </button>
                        )
                      })}
                    </div>
                    {!tieneContenido && (
                      <p className="text-xs text-gray-400 mt-2 italic">
                        Contenido no generado aun. Ejecuta el script de generacion.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </main>

      {/* Content viewer */}
      {visor && (
        <VisorContenido
          semana={visor.semana}
          tipo={visor.tipo}
          contenido={visor.contenido}
          onCerrar={() => setVisor(null)}
          onEnviar={visor.tipo === 'evaluacion' ? handleEnviarAlumnos : undefined}
        />
      )}
    </div>
  )
}
