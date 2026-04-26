import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import NavBar from '../../components/layout/NavBar.jsx'
import RenderizadorPregunta from '../../components/alumno/RenderizadorPregunta.jsx'
import Boton from '../../components/ui/Boton.jsx'
import Spinner from '../../components/ui/Spinner.jsx'
import MensajeError from '../../components/ui/MensajeError.jsx'
import useTareaStore from '../../store/useTareaStore.js'
import useAuthStore from '../../store/useAuthStore.js'
import { useAnthropicAPI } from '../../hooks/useAnthropicAPI.js'

export default function RealizarTarea() {
  const { tareaId } = useParams()
  const navigate = useNavigate()
  const { alumno } = useAuthStore()
  const { getTareaById, guardarResultado } = useTareaStore()
  const { corregirTarea, cargando, error, setError } = useAnthropicAPI()

  const tarea = getTareaById(tareaId)
  const [respuestas, setRespuestas] = useState({})
  const [confirmando, setConfirmando] = useState(false)

  useEffect(() => {
    if (!tarea) navigate('/alumno')
  }, [tarea, navigate])

  if (!tarea || !alumno) return null

  const totalPreguntas = tarea.preguntas?.length ?? 0
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
      const saved = await guardarResultado(tareaId, alumno.id, {
        respuestas,
        calificacion: resultado.calificacion,
        retroalimentacion: resultado.retroalimentacion,
        areas_de_mejora: resultado.areas_de_mejora ?? [],
      })
      if (saved) {
        navigate(`/alumno/resultado/${tareaId}`)
      }
    }
  }

  const porcentaje = totalPreguntas > 0 ? Math.round((respondidas / totalPreguntas) * 100) : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar titulo={tarea.nombre} volver="/alumno" />

      {/* Barra de progreso */}
      <div className="sticky top-14 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3">
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
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900 mb-1">{tarea.nombre}</h1>
          <p className="text-sm text-gray-500">
            {tarea.materia} · {tarea.dificultad} · {totalPreguntas} preguntas
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {tarea.preguntas?.map((pregunta, i) => (
            <RenderizadorPregunta
              key={i}
              pregunta={pregunta}
              indice={i}
              respuesta={respuestas[i]}
              onChange={(valor) => actualizarRespuesta(i, valor)}
            />
          ))}
        </div>

        <MensajeError mensaje={error} onCerrar={() => setError(null)} />

        {confirmando && (
          <div className="card p-5 mb-4 border-orange-200 bg-orange-50 animate-slide-up">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-semibold text-orange-800">
                  Tienes {totalPreguntas - respondidas} pregunta{totalPreguntas - respondidas > 1 ? 's' : ''} sin responder.
                </p>
                <p className="text-sm text-orange-700 mt-1">
                  ¿Quieres entregar tu tarea de todas formas? Las preguntas sin respuesta se marcarán como incorrectas.
                </p>
                <div className="flex gap-3 mt-3">
                  <Boton variante="peligro" size="sm" onClick={enviarTarea}>
                    Sí, entregar así
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
            <>
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              ENTREGAR TAREA
            </>
          )}
        </Boton>
      </main>
    </div>
  )
}
