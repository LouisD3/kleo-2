import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import NavBar from '../../components/layout/NavBar.jsx'
import Boton from '../../components/ui/Boton.jsx'
import useTareaStore from '../../store/useTareaStore.js'
import usePerfilStore from '../../store/usePerfilStore.js'

export default function ResultadoTarea() {
  const { tareaId } = useParams()
  const navigate = useNavigate()
  const { perfilActivo, alumnoSeleccionado } = usePerfilStore()
  const { getTareaById } = useTareaStore()
  const [notaVisible, setNotaVisible] = useState(false)

  const tarea = getTareaById(tareaId)
  const resultado = tarea?.resultadosPorAlumno?.[alumnoSeleccionado?.id]

  useEffect(() => {
    if (!perfilActivo || !alumnoSeleccionado) navigate('/')
    if (!tarea || !resultado) navigate('/alumno')
    const t = setTimeout(() => setNotaVisible(true), 200)
    return () => clearTimeout(t)
  }, [perfilActivo, alumnoSeleccionado, tarea, resultado, navigate])

  if (!tarea || !resultado) return null

  const { calificacion, retroalimentacion, areas_de_mejora } = resultado
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
    ? '¡Desempeño sobresaliente! Dominaste el tema completamente. ¡Sigue así!'
    : calificacion >= 8
    ? '¡Excelente trabajo! Tienes una comprensión muy sólida del tema.'
    : calificacion >= 7
    ? '¡Buen trabajo! Con un poco más de práctica llegarás al 10.'
    : aprobado
    ? 'Pasaste, pero hay áreas donde puedes mejorar. ¡No te rindas!'
    : 'Esta vez no fue suficiente, pero cada error es una oportunidad de aprender. ¡Tú puedes!'

  const correctas = retroalimentacion?.filter((r) => r.correcta).length ?? 0
  const total = retroalimentacion?.length ?? 0

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar titulo={`Resultado — ${tarea.nombre}`} volver="/alumno" />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
        {/* Tarjeta de resultado */}
        <div className={`card bg-gradient-to-br ${colores.fondo} p-8 text-center mb-8`}>
          <p className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-widest">Tu calificación</p>
          <div
            className={`text-8xl font-black mb-1 ${colores.nota} ${notaVisible ? 'nota-animada' : 'opacity-0'}`}
          >
            {calificacion}
          </div>
          <p className="text-2xl text-gray-400 font-light">/10</p>
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
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
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
                <div key={i} className={`px-6 py-4 ${fb.correcta ? 'hover:bg-green-50/50' : 'hover:bg-red-50/50'} transition-colors`}>
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
                          <span className="font-medium">Tu respuesta:</span>{' '}
                          {String(respAlumno)}
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

        <Boton
          variante="primario"
          size="lg"
          onClick={() => navigate('/alumno')}
          className="w-full"
        >
          Volver a mis tareas
        </Boton>
      </main>
    </div>
  )
}
