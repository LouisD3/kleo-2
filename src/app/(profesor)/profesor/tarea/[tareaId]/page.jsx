'use client'

import { pdf } from '@react-pdf/renderer'
import { useParams, useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import NavBar from '@/components/layout/NavBar.jsx'
import GoogleClassroomActions from '@/components/profesor/GoogleClassroomActions.jsx'
import TablaResultadosAlumnos from '@/components/profesor/TablaResultadosAlumnos.jsx'
import TareaPDF from '@/components/profesor/TareaPDF.jsx'
import Badge from '@/components/ui/Badge.jsx'
import Boton from '@/components/ui/Boton.jsx'
import Modal from '@/components/ui/Modal.jsx'
import Spinner from '@/components/ui/Spinner.jsx'
import { useGCExportDoc, useGCStatus } from '@/hooks/useGoogleClassroom.js'
import {
  calcularPromedio,
  useAlumnos,
  useDarPuntos,
  useDuplicarTarea,
  useEliminarTarea,
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
  const eliminarTareaMut = useEliminarTarea()
  const duplicarTareaMut = useDuplicarTarea()
  const guardarCalificacionManualMut = useGuardarCalificacionManual()
  const darPuntosMut = useDarPuntos()
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false)

  const claseNombre = useMemo(() => {
    if (!tarea) return ''
    const c = clases.find((c) => c.id === tarea.clase_id)
    return c ? `${c.nombre} · ${c.grado}` : ''
  }, [tarea, clases])

  const resultadosPorAlumno = resultados[tareaId] ?? {}
  const promedio = calcularPromedio(resultadosPorAlumno)
  const [descargandoPDF, setDescargandoPDF] = useState(null)
  const [editandoNota, setEditandoNota] = useState(null)
  const [notaManual, setNotaManual] = useState('')
  const [menuAbierto, setMenuAbierto] = useState(false)
  const { data: gcStatus } = useGCStatus(profesor?.id)
  const gcExportDoc = useGCExportDoc()

  // Per-question analytics
  const statsPreguntas = useMemo(() => {
    const allResults = Object.values(resultadosPorAlumno)
    if (allResults.length === 0 || !tarea?.preguntas) return null

    return tarea.preguntas.map((_, idx) => {
      let correctas = 0
      let total = 0
      let conRemediacion = 0

      for (const r of allResults) {
        if (!r.parcours) continue
        const steps = r.parcours.filter((s) => s.pregunta_index === idx)
        if (steps.length === 0) continue
        total++
        const original = steps.find((s) => s.tipo === 'original')
        if (original?.es_correcta) {
          correctas++
        }
        if (steps.some((s) => s.tipo === 'remediacion')) {
          conRemediacion++
        }
      }

      return { correctas, total, conRemediacion }
    })
  }, [resultadosPorAlumno, tarea])

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

  async function handleDescargarPDF(conRespuestas) {
    const key = conRespuestas ? 'corrige' : 'examen'
    setDescargandoPDF(key)
    try {
      const blob = await pdf(
        <TareaPDF tarea={tarea} claseNombre={claseNombre} showAnswers={conRespuestas} />,
      ).toBlob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const suffix = conRespuestas ? 'respuestas' : 'examen'
      a.download = `${tarea.nombre.replace(/[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ ]/g, '')}_${suffix}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setDescargandoPDF(null)
    }
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
        {/* Google Classroom actions */}
        <GoogleClassroomActions profesorId={profesor?.id} tarea={tarea} />

        {/* Header de la tarea */}
        <div className="card p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
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
            {promedio !== null && (
              <div className="text-center flex-shrink-0">
                <p className="text-3xl font-bold text-gray-900">
                  {promedio}
                  <span className="text-lg text-gray-400">/10</span>
                </p>
                <p className="text-xs text-gray-400">Promedio del grupo</p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
            {tarea.estado === 'borrador' && (
              <>
                <Boton
                  variante="secundario"
                  size="sm"
                  onClick={() => router.push(`/profesor/generar/tarea?tarea=${tarea.id}`)}
                >
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Editar
                </Boton>
                <Boton
                  variante="primario"
                  size="sm"
                  onClick={() => publicarTareaMut.mutate(tarea.id)}
                >
                  Publicar tarea
                </Boton>
              </>
            )}

            <div className="relative ml-auto">
              <button
                type="button"
                onClick={() => setMenuAbierto(!menuAbierto)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
                Opciones
              </button>

              {menuAbierto && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuAbierto(false)} />
                  <div className="absolute right-0 top-full mt-1 z-20 w-52 bg-white rounded-xl border border-gray-200 shadow-lg py-1">
                    <button
                      type="button"
                      onClick={() => {
                        setMenuAbierto(false)
                        handleDescargarPDF(false)
                      }}
                      disabled={descargandoPDF === 'examen'}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 disabled:opacity-50"
                    >
                      <svg
                        className="w-4 h-4 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Examen PDF
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMenuAbierto(false)
                        handleDescargarPDF(true)
                      }}
                      disabled={descargandoPDF === 'corrige'}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 disabled:opacity-50"
                    >
                      <svg
                        className="w-4 h-4 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Respuestas PDF
                    </button>
                    {gcStatus?.connected && (
                      <>
                        <button
                          type="button"
                          disabled={gcExportDoc.isPending}
                          onClick={async () => {
                            setMenuAbierto(false)
                            const res = await gcExportDoc.mutateAsync({
                              tareaId: tarea.id,
                              conRespuestas: false,
                            })
                            if (res?.url) window.open(res.url, '_blank')
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 disabled:opacity-50"
                        >
                          <svg
                            className="w-4 h-4 text-blue-500"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M14.727 6.727H14V0H4.91c-.905 0-1.637.732-1.637 1.636v20.728c0 .904.732 1.636 1.636 1.636h14.182c.904 0 1.636-.732 1.636-1.636V6.727h-6.727zM7.091 3.273h5.454v1.091H7.091V3.273zm9.818 17.454H7.091v-1.091h9.818v1.091zm0-2.727H7.091v-1.091h9.818V18zm0-2.727H7.091v-1.091h9.818v1.091zm0-2.727H7.091v-1.091h9.818v1.091z" />
                          </svg>
                          Examen Google Docs
                        </button>
                        <button
                          type="button"
                          disabled={gcExportDoc.isPending}
                          onClick={async () => {
                            setMenuAbierto(false)
                            const res = await gcExportDoc.mutateAsync({
                              tareaId: tarea.id,
                              conRespuestas: true,
                            })
                            if (res?.url) window.open(res.url, '_blank')
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 disabled:opacity-50"
                        >
                          <svg
                            className="w-4 h-4 text-blue-500"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M14.727 6.727H14V0H4.91c-.905 0-1.637.732-1.637 1.636v20.728c0 .904.732 1.636 1.636 1.636h14.182c.904 0 1.636-.732 1.636-1.636V6.727h-6.727zM7.091 3.273h5.454v1.091H7.091V3.273zm9.818 17.454H7.091v-1.091h9.818v1.091zm0-2.727H7.091v-1.091h9.818V18zm0-2.727H7.091v-1.091h9.818v1.091zm0-2.727H7.091v-1.091h9.818v1.091z" />
                          </svg>
                          Respuestas Google Docs
                        </button>
                      </>
                    )}
                    {Object.keys(resultadosPorAlumno).length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setMenuAbierto(false)
                          handleExportCSV()
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                      >
                        <svg
                          className="w-4 h-4 text-gray-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Exportar CSV
                      </button>
                    )}
                    <div className="border-t border-gray-100 my-1" />
                    <button
                      type="button"
                      disabled={duplicarTareaMut.isPending}
                      onClick={async () => {
                        setMenuAbierto(false)
                        const copia = await duplicarTareaMut.mutateAsync(tarea)
                        router.push(`/profesor/generar/tarea?tarea=${copia.id}`)
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 disabled:opacity-50"
                    >
                      <svg
                        className="w-4 h-4 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
                        <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" />
                      </svg>
                      Duplicar
                    </button>
                    <div className="border-t border-gray-100 my-1" />
                    <button
                      type="button"
                      onClick={() => {
                        setMenuAbierto(false)
                        setMostrarModalEliminar(true)
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Eliminar
                    </button>
                  </div>
                </>
              )}
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

        {/* Analytics por pregunta */}
        {statsPreguntas?.some((s) => s.total > 0) && (
          <div className="card p-0 overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Rendimiento por pregunta</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Porcentaje de respuestas correctas al primer intento
              </p>
            </div>
            <div className="px-6 py-4 space-y-3">
              {statsPreguntas.map((stat, i) => {
                if (stat.total === 0) return null
                const pct = Math.round((stat.correctas / stat.total) * 100)
                const color =
                  pct >= 80
                    ? 'bg-green-500'
                    : pct >= 60
                      ? 'bg-blue-500'
                      : pct >= 40
                        ? 'bg-orange-400'
                        : 'bg-red-500'
                return (
                  <div key={i} className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-8 text-xs font-bold text-gray-500 text-right">
                      P{i + 1}
                    </span>
                    <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden relative">
                      <div
                        className={`h-full ${color} rounded-full transition-all duration-500`}
                        style={{ width: `${pct}%` }}
                      />
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700">
                        {pct}%
                      </span>
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-2 text-xs text-gray-400 w-28">
                      <span>
                        {stat.correctas}/{stat.total}
                      </span>
                      {stat.conRemediacion > 0 && (
                        <span className="text-blue-500" title="Necesitaron remediación">
                          {stat.conRemediacion} rem.
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

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
              preguntas={tarea.preguntas ?? []}
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
              onDarPuntos={(alumnoId, cantidad) =>
                darPuntosMut.mutate({
                  alumnoId,
                  profesorId: profesor.id,
                  tareaId,
                  cantidad,
                  motivo: 'Buen trabajo',
                })
              }
            />
          </div>
        </div>
      </main>

      <Modal
        abierto={mostrarModalEliminar}
        onCerrar={() => setMostrarModalEliminar(false)}
        titulo="Eliminar tarea"
      >
        <p className="text-sm text-gray-600 mb-6">
          ¿Estás seguro de que deseas eliminar{' '}
          <span className="font-semibold text-gray-900">{tarea.nombre}</span>? Los resultados de los
          alumnos asociados también serán eliminados. Esta acción no se puede deshacer.
        </p>
        <div className="flex justify-end gap-3">
          <Boton variante="secundario" size="sm" onClick={() => setMostrarModalEliminar(false)}>
            Cancelar
          </Boton>
          <Boton
            variante="primario"
            size="sm"
            className="!bg-red-600 hover:!bg-red-700"
            disabled={eliminarTareaMut.isPending}
            onClick={async () => {
              await eliminarTareaMut.mutateAsync(tarea.id)
              router.push('/profesor')
            }}
          >
            {eliminarTareaMut.isPending ? 'Eliminando...' : 'Eliminar'}
          </Boton>
        </div>
      </Modal>
    </div>
  )
}
