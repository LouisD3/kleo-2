'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import PreguntaConRemediacion from '@/components/alumno/PreguntaConRemediacion.jsx'
import NavBar from '@/components/layout/NavBar.jsx'
import Boton from '@/components/ui/Boton.jsx'
import MensajeError from '@/components/ui/MensajeError.jsx'
import Spinner from '@/components/ui/Spinner.jsx'
import { useAnthropicAPI } from '@/hooks/useAnthropicAPI.js'
import { useGuardarResultado, useTareasAlumno } from '@/hooks/useTareas.js'
import useAuthStore from '@/store/useAuthStore.js'

export default function RealizarTarea() {
  const { tareaId } = useParams()
  const router = useRouter()
  const { alumno } = useAuthStore()
  const { data } = useTareasAlumno(alumno?.clase_id)
  const guardarResultadoMut = useGuardarResultado()
  const { corregirTarea, diagnosticarYRemediar, error, setError } = useAnthropicAPI()

  const tarea = (data?.tareas ?? []).find((t) => t.id === tareaId)

  // State: question-by-question flow
  const [indicePreguntaActual, setIndicePreguntaActual] = useState(0)
  const [respuestas, setRespuestas] = useState({})
  const [parcours, setParcours] = useState([])
  const [diagnosticando, setDiagnosticando] = useState(false)
  const [remediacionActual, setRemediacionActual] = useState(null)
  const [intentoRemediacion, setIntentoRemediacion] = useState(0)
  const [diagnosticandoRemediacion, setDiagnosticandoRemediacion] = useState(false)
  const [terminado, setTerminado] = useState(false)
  const [calificando, setCalificando] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const { isLoading } = useTareasAlumno(alumno?.clase_id)

  // Save progress to sessionStorage on every change
  useEffect(() => {
    if (!tareaId || Object.keys(respuestas).length === 0) return
    sessionStorage.setItem(`kleo_progress_${tareaId}`, JSON.stringify({
      respuestas, parcours, indicePreguntaActual, terminado,
    }))
  }, [respuestas, parcours, indicePreguntaActual, terminado, tareaId])

  // Restore progress on mount
  useEffect(() => {
    const saved = sessionStorage.getItem(`kleo_progress_${tareaId}`)
    if (saved) {
      try {
        const { respuestas: r, parcours: p, indicePreguntaActual: i, terminado: t } = JSON.parse(saved)
        if (r) setRespuestas(r)
        if (p) setParcours(p)
        if (typeof i === 'number') setIndicePreguntaActual(i)
        if (t) setTerminado(t)
      } catch {}
    }
  }, [tareaId])

  // Warn before leaving with unsaved work
  useEffect(() => {
    if (Object.keys(respuestas).length === 0) return
    const handler = (e) => { e.preventDefault() }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [respuestas])

  // Redirect only after loading is done and tarea not found
  useEffect(() => {
    if (!isLoading && !tarea) router.push('/alumno')
  }, [isLoading, tarea, router])

  if (isLoading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><Spinner size="lg" /></div>
  if (!tarea || !alumno) return null

  const totalPreguntas = tarea.preguntas?.length ?? 0
  const preguntaActual = tarea.preguntas?.[indicePreguntaActual]

  function avanzarSiguientePregunta() {
    setRemediacionActual(null)
    setIntentoRemediacion(0)
    if (indicePreguntaActual + 1 >= totalPreguntas) {
      setTerminado(true)
    } else {
      setIndicePreguntaActual((prev) => prev + 1)
    }
  }

  async function handleResponder(respuesta) {
    setRespuestas((prev) => ({ ...prev, [indicePreguntaActual]: respuesta }))
    setDiagnosticando(true)

    const aprendizaje = tarea.pda
      ? Array.isArray(tarea.pda)
        ? tarea.pda.map((p) => p.pda).join(', ')
        : tarea.pda.pda || tarea.materia
      : tarea.materia

    const resultado = await diagnosticarYRemediar({
      aprendizaje,
      pregunta_original: preguntaActual,
      respuesta_alumno: String(respuesta),
      contexto_devoir: {
        materia: tarea.materia,
        dificultad: tarea.dificultad,
        metodologia: tarea.metodologia || '',
      },
      intento_remediation_n: 0,
    })

    setDiagnosticando(false)

    // Record step in parcours
    const step = {
      pregunta_index: indicePreguntaActual,
      tipo: 'original',
      respuesta_alumno: String(respuesta),
      es_correcta: resultado?.es_correcta ?? false,
      diagnostico: resultado?.diagnostico ?? '',
      timestamp: new Date().toISOString(),
    }
    setParcours((prev) => [...prev, step])

    if (resultado?.es_correcta) {
      avanzarSiguientePregunta()
    } else if (resultado?.pregunta_remediation) {
      setRemediacionActual(resultado)
      setIntentoRemediacion(1)
    } else {
      // No remediation available (intento >= 2 or no question generated)
      avanzarSiguientePregunta()
    }
  }

  async function handleResponderRemediacion(respuesta) {
    setDiagnosticandoRemediacion(true)

    const aprendizaje = tarea.pda
      ? Array.isArray(tarea.pda)
        ? tarea.pda.map((p) => p.pda).join(', ')
        : tarea.pda.pda || tarea.materia
      : tarea.materia

    const resultado = await diagnosticarYRemediar({
      aprendizaje,
      pregunta_original: remediacionActual.pregunta_remediation,
      respuesta_alumno: String(respuesta),
      contexto_devoir: {
        materia: tarea.materia,
        dificultad: tarea.dificultad,
        metodologia: tarea.metodologia || '',
      },
      intento_remediation_n: intentoRemediacion,
    })

    setDiagnosticandoRemediacion(false)

    // Record remediation step
    const step = {
      pregunta_index: indicePreguntaActual,
      tipo: 'remediacion',
      intento: intentoRemediacion,
      pregunta_remediation: remediacionActual.pregunta_remediation,
      respuesta_alumno: String(respuesta),
      es_correcta: resultado?.es_correcta ?? false,
      diagnostico: resultado?.diagnostico ?? '',
      timestamp: new Date().toISOString(),
    }
    setParcours((prev) => [...prev, step])

    if (resultado?.es_correcta || intentoRemediacion >= 2) {
      // Student got it right or max attempts reached — move on
      avanzarSiguientePregunta()
    } else if (resultado?.pregunta_remediation) {
      // Second remediation attempt
      setRemediacionActual(resultado)
      setIntentoRemediacion(2)
    } else {
      avanzarSiguientePregunta()
    }
  }

  async function handleTerminar() {
    if (submitting) return
    setSubmitting(true)
    setCalificando(true)
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
            parcours,
          },
        })
        sessionStorage.removeItem(`kleo_progress_${tareaId}`)
        router.push(`/alumno/resultado/${tareaId}`)
      } catch {
        setError('No se pudo guardar tu resultado. Intenta de nuevo.')
        setCalificando(false)
        setSubmitting(false)
      }
    } else {
      setCalificando(false)
      setSubmitting(false)
    }
  }

  const porcentaje =
    totalPreguntas > 0
      ? Math.round(((indicePreguntaActual + (terminado ? 1 : 0)) / totalPreguntas) * 100)
      : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar titulo={tarea.nombre} volver="/alumno" />

      {/* Barra de progreso */}
      <div className="sticky top-14 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-medium text-gray-700">
              Pregunta {Math.min(indicePreguntaActual + 1, totalPreguntas)} de {totalPreguntas}
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
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900 mb-1">{tarea.nombre}</h1>
          <p className="text-sm text-gray-500">
            {tarea.materia} · {tarea.dificultad} · {totalPreguntas} preguntas
          </p>
        </div>

        <MensajeError mensaje={error} onCerrar={() => setError(null)} />

        {!terminado && preguntaActual && (
          <PreguntaConRemediacion
            key={indicePreguntaActual}
            pregunta={preguntaActual}
            indice={indicePreguntaActual}
            onResponder={handleResponder}
            diagnosticando={diagnosticando}
            remediacion={remediacionActual}
            onResponderRemediacion={handleResponderRemediacion}
            diagnosticandoRemediacion={diagnosticandoRemediacion}
          />
        )}

        {terminado && (
          <div className="space-y-6 animate-slide-up">
            <div className="card p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">
                ¡Terminaste todas las preguntas!
              </h2>
              <p className="text-sm text-gray-500">
                Respondiste {totalPreguntas} preguntas. Ahora la IA calificará tu tarea.
              </p>
            </div>

            <Boton
              variante="primario"
              size="lg"
              onClick={handleTerminar}
              disabled={calificando}
              className="w-full"
            >
              {calificando ? (
                <>
                  <Spinner size="sm" />
                  Calificando con IA...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  ENTREGAR TAREA
                </>
              )}
            </Boton>
          </div>
        )}
      </main>
    </div>
  )
}
