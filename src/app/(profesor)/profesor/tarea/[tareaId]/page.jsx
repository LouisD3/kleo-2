'use client'

import { useParams, useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import NavBar from '@/components/layout/NavBar.jsx'
import TablaResultadosAlumnos from '@/components/profesor/TablaResultadosAlumnos.jsx'
import Badge from '@/components/ui/Badge.jsx'
import Boton from '@/components/ui/Boton.jsx'
import Spinner from '@/components/ui/Spinner.jsx'
import {
  calcularPromedio,
  useAlumnos,
  useGuardarCalificacionManual,
  usePublicarTarea,
  useTareasProfesor,
} from '@/hooks/useTareas.js'
import useAuthStore from '@/store/useAuthStore.js'

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
  const router = useRouter()
  const { profesor, clases } = useAuthStore()

  const { data, isLoading } = useTareasProfesor(profesor?.id)
  const tareas = data?.tareas ?? []
  const resultados = data?.resultados ?? {}
  const tarea = tareas.find((t) => t.id === tareaId)

  const { data: alumnos = [] } = useAlumnos(tarea?.clase_id)
  const publicarTareaMut = usePublicarTarea()
  const guardarCalificacionManualMut = useGuardarCalificacionManual()

  const claseNombre = useMemo(() => {
    if (!tarea) return ''
    const c = clases.find((c) => c.id === tarea.clase_id)
    return c ? `${c.nombre} · ${c.grado}` : ''
  }, [tarea, clases])

  const resultadosPorAlumno = resultados[tareaId] ?? {}
  const promedio = calcularPromedio(resultadosPorAlumno)
  const [editandoNota, setEditandoNota] = useState(null)
  const [notaManual, setNotaManual] = useState('')

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!tarea) {
    router.push('/profesor')
    return null
  }

  const fechaLimite = tarea.fecha_limite
    ? new Date(tarea.fecha_limite).toLocaleDateString('es-MX', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null

  const vencida = tarea.fecha_limite && new Date(tarea.fecha_limite) < new Date()

  function handleExportCSV() {
    const headers = [
      'Alumno',
      'Calificación IA',
      'Calificación Manual',
      'Calificación Final',
      'Áreas de Mejora',
      'Fecha Entrega',
    ]
    const rows = alumnos.map((a) => {
      const r = resultadosPorAlumno[a.id]
      const final = r ? (r.calificacion_manual ?? r.calificacion) : ''
      return [
        a.nombre,
        r?.calificacion ?? '',
        r?.calificacion_manual ?? '',
        final,
        r?.areas_de_mejora?.join('; ') ?? '',
        r?.submitted_at ? new Date(r.submitted_at).toLocaleDateString('es-MX') : '',
      ]
    })

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n')
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${tarea.nombre.replace(/[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ ]/g, '')}_calificaciones.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function handleGuardarNota(resultadoId) {
    const nota = parseFloat(notaManual)
    if (Number.isNaN(nota) || nota < 0 || nota > 10) return
    await guardarCalificacionManualMut.mutateAsync({ resultadoId, calificacion: nota })
    setEditandoNota(null)
    setNotaManual('')
  }

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
                {vencida && (
                  <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                    Vencida
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                {claseNombre && <span className="font-medium text-gray-700">{claseNombre}</span>}
                <span>{tarea.materia}</span>
                <span>{tarea.dificultad}</span>
                <span>{tarea.metodologia}</span>
                <span>{tarea.preguntas?.length ?? 0} preguntas</span>
                <span>{new Date(tarea.created_at).toLocaleDateString('es-MX')}</span>
                {fechaLimite && (
                  <span className={vencida ? 'text-red-500 font-medium' : ''}>
                    Límite: {fechaLimite}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              {promedio !== null && (
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">
                    {promedio}
                    <span className="text-lg text-gray-400">/10</span>
                  </p>
                  <p className="text-xs text-gray-400">Promedio del grupo</p>
                </div>
              )}
              <div className="flex gap-2">
                {tarea.estado === 'borrador' && (
                  <Boton variante="primario" onClick={() => publicarTareaMut.mutate(tarea.id)}>
                    Publicar tarea
                  </Boton>
                )}
                {Object.keys(resultadosPorAlumno).length > 0 && (
                  <Boton variante="secundario" size="sm" onClick={handleExportCSV}>
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Exportar CSV
                  </Boton>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tipos de ejercicio */}
        {tarea.tipos?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {tarea.tipos.map((tipo) => (
              <span
                key={tipo}
                className="text-xs font-medium text-gray-600 bg-white border border-gray-200 px-3 py-1 rounded-full shadow-sm"
              >
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
                        {p.respuesta ? 'Verdadero' : 'Falso'}
                      </span>
                    )}
                    {p.tipo === 'espacios' && p.respuesta && (
                      <span className="mt-2 inline-block text-xs font-medium px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded-lg">
                        {p.respuesta}
                      </span>
                    )}
                    {(p.tipo === 'abierta' || p.tipo === 'calculo') && p.respuesta && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-xs font-semibold text-green-700 mb-1">
                          Respuesta modelo
                        </p>
                        <p className="text-sm text-green-900 whitespace-pre-line">{p.respuesta}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resultados por alumno */}
        <div className="card p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Resultados por alumno</h2>
            {Object.keys(resultadosPorAlumno).length > 0 && (
              <span className="text-xs text-gray-400">
                {Object.keys(resultadosPorAlumno).length}/{alumnos.length} entregados
              </span>
            )}
          </div>
          <div className="p-4">
            <TablaResultadosAlumnos
              resultadosPorAlumno={resultadosPorAlumno}
              alumnos={alumnos}
              editandoNota={editandoNota}
              notaManual={notaManual}
              onEditarNota={(alumnoId, nota) => {
                setEditandoNota(alumnoId)
                setNotaManual(String(nota ?? ''))
              }}
              onCambiarNota={setNotaManual}
              onGuardarNota={handleGuardarNota}
              onCancelarEdicion={() => {
                setEditandoNota(null)
                setNotaManual('')
              }}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
