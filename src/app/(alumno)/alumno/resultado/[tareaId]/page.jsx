'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import NavBar from '@/components/layout/NavBar.jsx'
import Boton from '@/components/ui/Boton.jsx'
import { useTareasAlumno } from '@/hooks/useTareas.js'
import useAuthStore from '@/store/useAuthStore.js'

function hasCPAScores(resultado) {
  return resultado?.scores_cpa?.concreto != null
}

export default function ResultadoTarea() {
  const { tareaId } = useParams()
  const router = useRouter()
  const { alumno } = useAuthStore()
  const { data } = useTareasAlumno(alumno?.clase_id)
  const [notaVisible, setNotaVisible] = useState(false)

  const tarea = (data?.tareas ?? []).find((t) => t.id === tareaId)
  const resultados = data?.resultados?.[tareaId] ?? {}
  const resultado = resultados?.[alumno?.id]

  useEffect(() => {
    if (!tarea || !resultado) router.push('/alumno')
    const t = setTimeout(() => setNotaVisible(true), 200)
    return () => clearTimeout(t)
  }, [tarea, resultado, router])

  if (!tarea || !resultado) return null

  const calificacion = resultado.calificacion_manual ?? resultado.calificacion
  const esCPA = hasCPAScores(resultado)

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
    ? 'Desempeno sobresaliente. Dominaste el tema completamente.'
    : calificacion >= 8
      ? 'Excelente trabajo. Tienes una comprension muy solida del tema.'
      : calificacion >= 7
        ? 'Buen trabajo. Con un poco mas de practica llegaras al 10.'
        : aprobado
          ? 'Pasaste, pero hay areas donde puedes mejorar.'
          : 'Esta vez no fue suficiente, pero cada error es una oportunidad de aprender.'

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar titulo={`Resultado — ${tarea.nombre}`} volver="/alumno" />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
        {/* Grade card */}
        <div className={`card bg-gradient-to-br ${colores.fondo} p-8 text-center mb-8`}>
          <p className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-widest">
            Tu calificacion
          </p>
          <div
            className={`text-8xl font-black mb-1 ${colores.nota} ${notaVisible ? 'nota-animada' : 'opacity-0'}`}
          >
            {calificacion}
          </div>
          <p className="text-2xl text-gray-400 font-light">/10</p>
          {resultado.calificacion_manual != null && (
            <p className="text-xs text-gray-400 mt-1">(Calificacion ajustada por tu profesor)</p>
          )}
          <p className="text-base text-gray-600 mt-4 max-w-sm mx-auto font-medium">
            {mensajeMotivacion}
          </p>
        </div>

        {/* CPA breakdown */}
        {esCPA && <CPABreakdown scores={resultado.scores_cpa} />}

        {/* Legacy: areas de mejora */}
        {!esCPA && resultado.areas_de_mejora?.length > 0 && (
          <div className="card p-6 mb-6">
            <h2 className="font-semibold text-gray-900 mb-3">Areas de mejora</h2>
            <div className="flex flex-wrap gap-2">
              {resultado.areas_de_mejora.map((area, i) => (
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

        {/* Legacy: retroalimentacion per question */}
        {!esCPA && resultado.retroalimentacion?.length > 0 && (
          <LegacyRetroalimentacion
            retroalimentacion={resultado.retroalimentacion}
            tarea={tarea}
            resultado={resultado}
          />
        )}

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

// ── CPA Breakdown ────────────────────────────────────────────────

function CPABreakdown({ scores }) {
  const etapas = [
    {
      key: 'concreto',
      label: 'Concreto',
      desc: 'Manipulacion de objetos',
      peso: '20%',
      icon: '🧩',
    },
    { key: 'pictorico', label: 'Pictorico', desc: 'Modelo de barras', peso: '30%', icon: '📊' },
    {
      key: 'abstracto',
      label: 'Abstracto',
      desc: 'Preguntas matematicas',
      peso: '50%',
      icon: '🔢',
    },
  ]

  return (
    <div className="card p-0 overflow-hidden mb-8">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="font-semibold text-gray-900">Desglose por etapa CPA</h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Global = Concreto (20%) + Pictorico (30%) + Abstracto (50%)
        </p>
      </div>
      <div className="divide-y divide-gray-50">
        {etapas.map(({ key, label, desc, peso, icon }) => {
          const score = scores[key]
          if (!score) return null
          const nota = score.nota
          const colorNota =
            nota >= 8 ? 'text-green-600' : nota >= 6 ? 'text-orange-500' : 'text-red-500'
          const bgBar = nota >= 8 ? 'bg-green-400' : nota >= 6 ? 'bg-orange-400' : 'bg-red-400'

          return (
            <div key={key} className="px-6 py-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{label}</p>
                    <p className="text-xs text-gray-400">{desc}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-2xl font-bold ${colorNota}`}>{nota}</span>
                  <span className="text-sm text-gray-400">/10</span>
                  <p className="text-[10px] text-gray-400">{peso}</p>
                </div>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${bgBar}`}
                  style={{ width: `${nota * 10}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Legacy retroalimentacion ─────────────────────────────────────

function LegacyRetroalimentacion({ retroalimentacion, tarea, resultado }) {
  const correctas = retroalimentacion.filter((r) => r.correcta).length
  const total = retroalimentacion.length

  return (
    <>
      <div className="card p-6 mb-6">
        <div className="flex items-center justify-center gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{correctas}</p>
            <p className="text-xs text-gray-500">Correctas</p>
          </div>
          <div className="w-px h-8 bg-gray-200" />
          <div className="text-center">
            <p className="text-2xl font-bold text-red-500">{total - correctas}</p>
            <p className="text-xs text-gray-500">Incorrectas</p>
          </div>
        </div>
      </div>

      <div className="card p-0 overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Retroalimentacion por pregunta</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {retroalimentacion.map((fb, i) => {
            const pregunta = tarea.contenido_cpa?.[fb.indice_pregunta]
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
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
