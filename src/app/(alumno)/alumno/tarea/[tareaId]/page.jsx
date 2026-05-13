'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import RenderizadorPregunta from '@/components/alumno/RenderizadorPregunta.jsx'
import StepperCPA from '@/components/alumno/StepperCPA'
import NavBar from '@/components/layout/NavBar.jsx'
import Boton from '@/components/ui/Boton.jsx'
import MensajeError from '@/components/ui/MensajeError.jsx'
import Spinner from '@/components/ui/Spinner.jsx'
import { useAnthropicAPI } from '@/hooks/useAnthropicAPI.js'
import { useGuardarResultado, useTareasAlumno } from '@/hooks/useTareas.js'
import useAuthStore from '@/store/useAuthStore.js'

/** Check if contenido_cpa is a CPA structure (has concreto/pictorico/abstracto) vs legacy flat array */
function isTareaCPA(contenido) {
  if (!contenido) return false
  // Supabase may return JSONB as string in some configs
  const obj = typeof contenido === 'string' ? JSON.parse(contenido) : contenido
  return obj && !Array.isArray(obj) && obj.concreto != null && obj.pictorico != null
}

/** Score an array of questions against student responses. Returns 0-10. */
function scorearPreguntas(preguntas, respuestas) {
  if (!preguntas || preguntas.length === 0) return 10
  let correctas = 0
  for (let i = 0; i < preguntas.length; i++) {
    const p = preguntas[i]
    const resp = respuestas[i]
    if (resp === undefined || resp === null || String(resp).trim() === '') continue
    const alumno = String(resp).toLowerCase().trim()
    if (p.tipo === 'opcion_multiple' || p.tipo === 'espacios') {
      if (alumno === String(p.respuesta).toLowerCase().trim()) correctas++
    } else if (p.tipo === 'verdadero_falso') {
      const correcta = String(p.respuesta).toLowerCase().trim()
      if (alumno === correcta) correctas++
    } else {
      // calculo / abierta: count as correct if non-empty (AI grading TODO)
      if (alumno.length > 0) correctas++
    }
  }
  return Math.round((correctas / preguntas.length) * 100) / 10
}

export default function RealizarTarea() {
  const { tareaId } = useParams()
  const router = useRouter()
  const { alumno } = useAuthStore()
  const { data } = useTareasAlumno(alumno?.clase_id)
  const guardarResultadoMut = useGuardarResultado()
  const { corregirTarea, cargando, error, setError } = useAnthropicAPI()

  const tarea = (data?.tareas ?? []).find((t) => t.id === tareaId)
  const [respuestas, setRespuestas] = useState({})
  const [confirmando, setConfirmando] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!tarea) router.push('/alumno')
  }, [tarea, router])

  if (!tarea || !alumno) return null

  const esCPA = isTareaCPA(tarea.contenido_cpa)
  // Ensure parsed object (Supabase may return JSONB as string)
  const contenidoCPA = esCPA
    ? typeof tarea.contenido_cpa === 'string'
      ? JSON.parse(tarea.contenido_cpa)
      : tarea.contenido_cpa
    : null

  // ── CPA submission handler ────────────────────────────────────

  async function handleCPASubmit(datos) {
    setSubmitting(true)
    try {
      const cpa = contenidoCPA
      const picPreguntas = cpa.pictorico?.preguntas ?? []
      const absPreguntas = cpa.abstracto?.preguntas ?? []

      // Build flat responses map
      const allResp = {}
      picPreguntas.forEach((_, i) => {
        allResp[`pic_${i}`] = datos.pictorico.respuestas[i] ?? null
      })
      absPreguntas.forEach((_, i) => {
        allResp[`abs_${i}`] = datos.abstracto.respuestas[i] ?? null
      })

      // Score Concreto: max(10 - (intentos-1)*2, 2)
      const scoreConcreto = Math.max(10 - (datos.concreto.intentos - 1) * 2, 2)

      // Score Pictorico: (correct/total) * 10
      const scorePictorico = scorearPreguntas(picPreguntas, datos.pictorico.respuestas)

      // Score Abstracto: use AI retroalimentacion if available, else client-side
      let scoreAbstracto
      let retroalimentacion = []
      let areas_de_mejora = []
      if (datos.abstracto.retroIA && datos.abstracto.retroIA.length > 0) {
        const retro = datos.abstracto.retroIA
        const correctas = retro.filter((r) => r.correcta).length
        scoreAbstracto = absPreguntas.length > 0
          ? Math.round((correctas / absPreguntas.length) * 100) / 10
          : 10
        retroalimentacion = retro
      } else {
        scoreAbstracto = scorearPreguntas(absPreguntas, datos.abstracto.respuestas)
      }

      // Global: 20% concreto + 30% pictorico + 50% abstracto
      const global =
        Math.round((scoreConcreto * 0.2 + scorePictorico * 0.3 + scoreAbstracto * 0.5) * 10) / 10

      const scores_cpa = {
        concreto: { nota: scoreConcreto, completada: true },
        pictorico: { nota: scorePictorico, completada: true },
        abstracto: { nota: scoreAbstracto, completada: true },
        global,
      }

      await guardarResultadoMut.mutateAsync({
        tareaId,
        alumnoId: alumno.id,
        resultado: {
          respuestas: allResp,
          calificacion: global,
          retroalimentacion,
          areas_de_mejora,
          scores_cpa,
        },
      })
      router.push(`/alumno/resultado/${tareaId}`)
    } catch {
      setError('No se pudo guardar tu resultado. Intenta de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Legacy flat tarea flow ────────────────────────────────────

  const contenidoFlat = !esCPA ? tarea.contenido_cpa : null // legacy: flat array
  const totalPreguntas = contenidoFlat?.length ?? 0
  const respondidas = Object.keys(respuestas).filter((k) => {
    const r = respuestas[k]
    return r !== null && r !== undefined && String(r).trim() !== ''
  }).length

  function actualizarRespuesta(indice, valor) {
    setRespuestas((prev) => ({ ...prev, [indice]: valor }))
  }

  async function handleEntregar() {
    if (respondidas < totalPreguntas) {
      setConfirmando(true)
      return
    }
    await enviarTarea()
  }

  async function enviarTarea() {
    setConfirmando(false)
    const resultado = await corregirTarea({ tarea, respuestasAlumno: respuestas })
    if (resultado) {
      try {
        await guardarResultadoMut.mutateAsync({
          tareaId,
          alumnoId: alumno.id,
          resultado: {
            respuestas,
            calificacion: resultado.calificacion,
            retroalimentacion: resultado.retroalimentacion,
            areas_de_mejora: resultado.areas_de_mejora ?? [],
          },
        })
        router.push(`/alumno/resultado/${tareaId}`)
      } catch {
        setError('No se pudo guardar tu resultado. Intenta de nuevo.')
      }
    }
  }

  const porcentaje = totalPreguntas > 0 ? Math.round((respondidas / totalPreguntas) * 100) : 0

  // ── Render ────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar titulo={tarea.nombre} volver="/alumno" />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900 mb-1">{tarea.nombre}</h1>
          <p className="text-sm text-gray-500">
            Matematicas · {tarea.dificultad}
            {esCPA ? ' · Metodo Singapur' : ` · ${totalPreguntas} preguntas`}
          </p>
        </div>

        <MensajeError mensaje={error} onCerrar={() => setError(null)} />

        {esCPA ? (
          <StepperCPA
            tareaCPA={contenidoCPA}
            tareaId={tareaId}
            alumnoId={alumno.id}
            onSubmit={handleCPASubmit}
            submitting={submitting}
          />
        ) : (
          <>
            {/* Legacy progress bar */}
            <div className="mb-6 bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-medium text-gray-700">
                  {respondidas} de {totalPreguntas} respondidas
                </span>
                <span className="text-gray-400">{porcentaje}%</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amarillo rounded-full transition-all duration-300"
                  style={{ width: `${porcentaje}%` }}
                />
              </div>
            </div>

            <div className="space-y-4 mb-8">
              {contenidoFlat?.map((pregunta, i) => (
                <RenderizadorPregunta
                  key={i}
                  pregunta={pregunta}
                  indice={i}
                  respuesta={respuestas[i]}
                  onChange={(valor) => actualizarRespuesta(i, valor)}
                />
              ))}
            </div>

            {confirmando && (
              <div className="card p-5 mb-4 border-orange-200 bg-orange-50 animate-slide-up">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-orange-800">
                      Tienes {totalPreguntas - respondidas} pregunta
                      {totalPreguntas - respondidas > 1 ? 's' : ''} sin responder.
                    </p>
                    <p className="text-sm text-orange-700 mt-1">
                      ¿Quieres entregar tu tarea de todas formas?
                    </p>
                    <div className="flex gap-3 mt-3">
                      <Boton variante="peligro" size="sm" onClick={enviarTarea}>
                        Si, entregar asi
                      </Boton>
                      <Boton variante="secundario" size="sm" onClick={() => setConfirmando(false)}>
                        Seguir respondiendo
                      </Boton>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Boton
              variante="primario"
              size="lg"
              onClick={handleEntregar}
              disabled={cargando}
              className="w-full"
            >
              {cargando ? (
                <>
                  <Spinner size="sm" />
                  Corrigiendo con IA...
                </>
              ) : (
                'ENTREGAR TAREA'
              )}
            </Boton>
          </>
        )}
      </main>
    </div>
  )
}
