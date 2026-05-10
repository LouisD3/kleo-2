'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import NavBar from '@/components/layout/NavBar.jsx'
import Boton from '@/components/ui/Boton.jsx'
import { useTareasAlumno } from '@/hooks/useTareas.js'
import useAuthStore from '@/store/useAuthStore.js'

export default function ResultadoTarea() {
  const { tareaId } = useParams()
  const router = useRouter()
  const { alumno } = useAuthStore()
  const { data } = useTareasAlumno(alumno?.clase_id)
  const [notaVisible, setNotaVisible] = useState(false)

  const { isLoading } = useTareasAlumno(alumno?.clase_id)
  const tarea = (data?.tareas ?? []).find((t) => t.id === tareaId)
  const resultados = data?.resultados?.[tareaId] ?? {}
  const resultado = resultados?.[alumno?.id]

  useEffect(() => {
    if (!isLoading && (!tarea || !resultado)) router.push('/alumno')
    if (tarea && resultado) {
      const t = setTimeout(() => setNotaVisible(true), 200)
      return () => clearTimeout(t)
    }
  }, [isLoading, tarea, resultado, router])

  if (isLoading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="h-10 w-10 border-[3px] rounded-full border-gray-200 border-t-gray-700 animate-spin" role="status" aria-label="Cargando..." /></div>
  if (!tarea || !resultado) return null

  const calificacion = resultado.calificacion_manual ?? resultado.calificacion
  const retroalimentacion = resultado.retroalimentacion
  const areas_de_mejora = resultado.areas_de_mejora
  const aprobado = calificacion >= 6
  const excelente = calificacion >= 9

  const colores = {
    nota: excelente
      ? 'text-green-600'
      : calificacion >= 7
        ? 'text-blue-600'
        : aprobado
          ? 'text-orange-500'
          : 'text-red-500',
    fondo: excelente
      ? 'from-green-50 to-emerald-50'
      : calificacion >= 7
        ? 'from-blue-50 to-indigo-50'
        : aprobado
          ? 'from-orange-50 to-yellow-50'
          : 'from-red-50 to-pink-50',
  }

  const mensajeMotivacion = excelente
    ? 'Desempeño sobresaliente. Dominaste el tema completamente.'
    : calificacion >= 8
      ? 'Excelente trabajo. Tienes una comprensión muy sólida del tema.'
      : calificacion >= 7
        ? 'Buen trabajo. Con un poco más de práctica llegarás al 10.'
        : aprobado
          ? 'Pasaste, pero hay áreas donde puedes mejorar.'
          : 'Esta vez no fue suficiente, pero cada error es una oportunidad de aprender.'

  const correctas = retroalimentacion?.filter((r) => r.correcta).length ?? 0
  const total = retroalimentacion?.length ?? 0

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar titulo={`Resultado — ${tarea.nombre}`} volver="/alumno" />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
        {/* Tarjeta de resultado */}
        <div className={`card bg-gradient-to-br ${colores.fondo} p-8 text-center mb-8`}>
          <p className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-widest">
            Tu calificación
          </p>
          <div
            className={`text-8xl font-black mb-1 ${colores.nota} ${notaVisible ? 'nota-animada' : 'opacity-0'}`}
          >
            {calificacion}
          </div>
          <p className="text-2xl text-gray-400 font-light">/10</p>
          {resultado.calificacion_manual != null && (
            <p className="text-xs text-gray-400 mt-1">(Calificación ajustada por tu profesor)</p>
          )}
          <p className="text-base text-gray-600 mt-4 max-w-sm mx-auto font-medium">
            {mensajeMotivacion}
          </p>
          <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-white/60">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{correctas}</p>
              <p className="text-xs text-gray-500">Correctas</p>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div className="text-center">
              <p className="text-2xl font-bold text-red-500">{total - correctas}</p>
              <p className="text-xs text-gray-500">Incorrectas</p>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-700">{total}</p>
              <p className="text-xs text-gray-500">Total</p>
            </div>
          </div>
        </div>

        {/* Áreas de mejora */}
        {areas_de_mejora?.length > 0 && (
          <div className="card p-6 mb-6">
            <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                  clipRule="evenodd"
                />
              </svg>
              Áreas de mejora
            </h2>
            <div className="flex flex-wrap gap-2">
              {areas_de_mejora.map((area, i) => (
                <span
                  key={i}
                  className="text-sm text-orange-700 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-full"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Retroalimentación pregunta a pregunta */}
        <div className="card p-0 overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Retroalimentación por pregunta</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {retroalimentacion?.map((fb, i) => {
              const pregunta = tarea.preguntas?.[fb.indice_pregunta]
              const respAlumno = resultado.respuestas?.[fb.indice_pregunta]
              return (
                <div
                  key={i}
                  className={`px-6 py-4 ${fb.correcta ? 'hover:bg-green-50/50' : 'hover:bg-red-50/50'} transition-colors`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        fb.correcta ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {fb.correcta ? '✓' : '✗'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 mb-1">
                        {pregunta?.pregunta ?? `Pregunta ${fb.indice_pregunta + 1}`}
                      </p>
                      {respAlumno && (
                        <p className="text-xs text-gray-500 mb-1">
                          <span className="font-medium">Tu respuesta:</span> {String(respAlumno)}
                        </p>
                      )}
                      <p className={`text-sm ${fb.correcta ? 'text-green-700' : 'text-red-700'}`}>
                        {fb.comentario}
                      </p>
                      {/* Parcours de remédiation pour cette question */}
                      {resultado.parcours?.filter((p) => p.pregunta_index === fb.indice_pregunta && p.tipo === 'remediacion').length > 0 && (
                        <div className="mt-2 pl-3 border-l-2 border-amber-200 space-y-1.5">
                          <p className="text-xs font-semibold text-amber-600">Remediación:</p>
                          {resultado.parcours
                            .filter((p) => p.pregunta_index === fb.indice_pregunta && p.tipo === 'remediacion')
                            .map((p, ri) => (
                              <div key={ri} className="text-xs text-gray-500">
                                <span className={p.es_correcta ? 'text-green-600' : 'text-red-500'}>
                                  {p.es_correcta ? '✓' : '✗'}
                                </span>{' '}
                                {p.pregunta_remediation?.pregunta && (
                                  <span className="text-gray-600">{p.pregunta_remediation.pregunta}</span>
                                )}
                                {p.diagnostico && !p.es_correcta && (
                                  <span className="block text-gray-400 mt-0.5">{p.diagnostico}</span>
                                )}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <Boton
          variante="primario"
          size="lg"
          onClick={() => router.push('/alumno')}
          className="w-full"
        >
          Volver a mis tareas
        </Boton>
      </main>
    </div>
  )
}
