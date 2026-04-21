import { useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import NavBar from '../../components/layout/NavBar.jsx'
import TablaResultadosAlumnos from '../../components/profesor/TablaResultadosAlumnos.jsx'
import Badge from '../../components/ui/Badge.jsx'
import Boton from '../../components/ui/Boton.jsx'
import useTareaStore from '../../store/useTareaStore.js'
import usePerfilStore from '../../store/usePerfilStore.js'

function etiquetaTipo(tipo) {
  const mapa = {
    opcion_multiple: 'Opción múltiple',
    verdadero_falso: 'Verdadero / Falso',
    abierta: 'Pregunta abierta',
    espacios: 'Completar espacios',
    calculo: 'Cálculo',
  }
  return mapa[tipo] ?? tipo
}

export default function DetalleTarea() {
  const { tareaId } = useParams()
  const navigate = useNavigate()
  const { getTareaById, publicarTarea, getPromedioGrupo } = useTareaStore()
  const { perfilActivo } = usePerfilStore()
  const tarea = getTareaById(tareaId)
  const promedio = getPromedioGrupo(tareaId)

  useEffect(() => {
    if (!perfilActivo) navigate('/')
    if (!tarea) navigate('/profesor')
  }, [perfilActivo, tarea, navigate])

  if (!tarea) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar titulo={tarea.nombre} volver="/profesor" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
        {/* Header de la tarea */}
        <div className="card p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{tarea.nombre}</h1>
                <Badge valor={tarea.estado} />
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <span>📚 {tarea.materia}</span>
                <span>⚡ {tarea.dificultad}</span>
                <span>🎯 {tarea.metodologia}</span>
                <span>📝 {tarea.preguntas?.length ?? 0} preguntas</span>
                <span>📅 {tarea.fechaCreacion}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              {promedio !== null && (
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">{promedio}<span className="text-lg text-gray-400">/10</span></p>
                  <p className="text-xs text-gray-400">Promedio del grupo</p>
                </div>
              )}
              {tarea.estado === 'borrador' && (
                <Boton variante="primario" onClick={() => publicarTarea(tarea.id)}>
                  Publicar tarea
                </Boton>
              )}
            </div>
          </div>
        </div>

        {/* Tipos de ejercicio */}
        {tarea.tipos?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {tarea.tipos.map((tipo) => (
              <span key={tipo} className="text-xs font-medium text-gray-600 bg-white border border-gray-200 px-3 py-1 rounded-full shadow-sm">
                {tipo}
              </span>
            ))}
          </div>
        )}

        {/* Preguntas */}
        <div className="card p-0 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Preguntas</h2>
            <span className="text-sm text-gray-400">{tarea.preguntas?.length ?? 0} en total</span>
          </div>
          <div className="divide-y divide-gray-50">
            {tarea.preguntas?.map((p, i) => (
              <div key={i} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4">
                  <span className="flex-shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-xs font-bold text-gray-600">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                        {etiquetaTipo(p.tipo)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-800">{p.pregunta}</p>
                    {p.opciones && (
                      <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1">
                        {p.opciones.map((op, j) => (
                          <li
                            key={j}
                            className={`text-xs px-2.5 py-1.5 rounded-lg ${
                              op.startsWith(p.respuesta)
                                ? 'bg-green-50 text-green-700 font-semibold border border-green-200'
                                : 'text-gray-500 bg-gray-50'
                            }`}
                          >
                            {op}
                          </li>
                        ))}
                      </ul>
                    )}
                    {p.tipo === 'verdadero_falso' && (
                      <span className="mt-2 inline-block text-xs font-medium px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded-lg">
                        ✓ {p.respuesta ? 'Verdadero' : 'Falso'}
                      </span>
                    )}
                    {p.tipo === 'espacios' && p.respuesta && (
                      <span className="mt-2 inline-block text-xs font-medium px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded-lg">
                        ✓ {p.respuesta}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resultados por alumno */}
        <div className="card p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Resultados por alumno</h2>
          </div>
          <div className="p-4">
            <TablaResultadosAlumnos resultadosPorAlumno={tarea.resultadosPorAlumno ?? {}} />
          </div>
        </div>
      </main>
    </div>
  )
}
