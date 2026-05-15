'use client'

import { pdf } from '@react-pdf/renderer'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import TablaResultadosAlumnos from '@/components/profesor/TablaResultadosAlumnos.jsx'
import TareaPDF from '@/components/profesor/TareaPDF.jsx'
import Badge from '@/components/ui/Badge.jsx'
import Boton from '@/components/ui/Boton.jsx'
import Modal from '@/components/ui/Modal.jsx'
import Spinner from '@/components/ui/Spinner.jsx'
import {
  calcularPromedio,
  useAlumnos,
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
  const { claseId, tareaId } = useParams()
  const router = useRouter()
  const { profesor, clases } = useAuthStore()

  const { data, isLoading } = useTareasProfesor(profesor?.id)
  const tareas = data?.tareas ?? []
  const resultados = data?.resultados ?? {}
  const tarea = tareas.find((t) => t.id === tareaId)

  const { data: alumnos = [] } = useAlumnos(tarea?.clase_id)
  const publicarTareaMut = usePublicarTarea()
  const eliminarTareaMut = useEliminarTarea()
  const guardarCalificacionManualMut = useGuardarCalificacionManual()
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!tarea) {
    router.push(`/profesor/clase/${claseId}`)
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
    <div className="px-4 sm:px-6 md:px-8 py-8 animate-fade-in">
      {/* Back */}
      <Link
        href={`/profesor/clase/${claseId}`}
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a la clase
      </Link>

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
              <span>Matemáticas 1° Sec</span>
              <span>{tarea.dificultad}</span>
              <span>Singapur</span>
              <span>{tarea.contenido_cpa?.length ?? 0} preguntas</span>
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
        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
          {tarea.estado === 'borrador' && (
            <>
              <Boton
                variante="secundario"
                size="sm"
                onClick={() => router.push(`/profesor/generar?tarea=${tarea.id}`)}
              >
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
          <Boton
            variante="secundario"
            size="sm"
            disabled={descargandoPDF === 'examen'}
            onClick={() => handleDescargarPDF(false)}
          >
            {descargandoPDF === 'examen' ? 'Generando...' : 'Examen PDF'}
          </Boton>
          <Boton
            variante="secundario"
            size="sm"
            disabled={descargandoPDF === 'corrige'}
            onClick={() => handleDescargarPDF(true)}
          >
            {descargandoPDF === 'corrige' ? 'Generando...' : 'Respuestas PDF'}
          </Boton>
          {Object.keys(resultadosPorAlumno).length > 0 && (
            <Boton variante="secundario" size="sm" onClick={handleExportCSV}>
              Exportar CSV
            </Boton>
          )}
          <Boton
            variante="secundario"
            size="sm"
            className="!text-red-600 hover:!bg-red-50 sm:ml-auto"
            onClick={() => setMostrarModalEliminar(true)}
          >
            Eliminar
          </Boton>
        </div>
      </div>

      {/* Preguntas */}
      <div className="card p-0 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Preguntas</h2>
          <span className="text-sm text-gray-400">{tarea.contenido_cpa?.length ?? 0} en total</span>
        </div>
        <div className="divide-y divide-gray-50">
          {tarea.contenido_cpa?.map((p, i) => (
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
                      <p className="text-xs font-semibold text-green-700 mb-1">Respuesta modelo</p>
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
              router.push(`/profesor/clase/${claseId}`)
            }}
          >
            {eliminarTareaMut.isPending ? 'Eliminando...' : 'Eliminar'}
          </Boton>
        </div>
      </Modal>
    </div>
  )
}
