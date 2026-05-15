'use client'

import { ArrowLeft, BookOpen, FileText, Presentation, Video } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import ManipulableDispatcher from '@/components/manipulables/ManipulableDispatcher'
import DiagramaGeometrico from '@/components/pictorico/DiagramaGeometrico'
import ModeloBarras from '@/components/pictorico/ModeloBarras'
import TablaPictorica from '@/components/pictorico/TablaPictorica'
import Boton from '@/components/ui/Boton.jsx'
import Modal from '@/components/ui/Modal.jsx'
import Toast from '@/components/ui/Toast.jsx'
import { getSecuenciaById } from '@/content/biblioteca/matematicas-1'
import { getTareasReferencia } from '@/data/tareas-referencia'
import { useAgregarTarea } from '@/hooks/useTareas.js'
import useAuthStore from '@/store/useAuthStore.js'

export default function SecuenciaDetalle() {
  const { secuencia } = useParams<{ secuencia: string }>()
  const router = useRouter()
  const id = Number(secuencia)
  const sec = getSecuenciaById(id)
  const tareasCPA = getTareasReferencia(id)
  const { profesor, clases } = useAuthStore()
  const agregarTarea = useAgregarTarea()

  const [modalAsignar, setModalAsignar] = useState<number | null>(null)
  const [clasesSeleccionadas, setClasesSeleccionadas] = useState<string[]>(
    clases?.[0]?.id ? [clases[0].id] : [],
  )
  const [fechaLimite, setFechaLimite] = useState('')
  const [asignando, setAsignando] = useState(false)
  const [toast, setToast] = useState(false)
  const [previewIdx, setPreviewIdx] = useState<number | null>(null)

  if (!sec) {
    router.push('/profesor/programa')
    return null
  }

  async function handleAsignar() {
    if (clasesSeleccionadas.length === 0 || !profesor || modalAsignar === null || !sec) return
    const tareaCPA = tareasCPA[modalAsignar]
    setAsignando(true)
    try {
      for (const cId of clasesSeleccionadas) {
        await (agregarTarea as any).mutateAsync({
          profesor_id: profesor.id,
          clase_id: cId,
          nombre: `${sec.titulo} — Sec ${sec.secuencia} (${modalAsignar + 1}/${tareasCPA.length})`,
          dificultad: 'Media',
          contenido_cpa: tareaCPA,
          fecha_limite: fechaLimite || null,
          secuencia_ref: sec.secuencia,
          estado_override: 'en_curso',
        })
      }
      setModalAsignar(null)
      setToast(true)
    } catch {
      // handled by mutation
    } finally {
      setAsignando(false)
    }
  }

  function toggleClase(cId: string) {
    setClasesSeleccionadas((prev) =>
      prev.includes(cId) ? prev.filter((id) => id !== cId) : [...prev, cId],
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 animate-fade-in">
      {/* Back */}
      <Link
        href="/profesor/programa"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Programa
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Secuencia {id} — {sec.titulo}
        </h1>
        <p className="text-lg text-gray-600 mt-1">{sec.contenido}</p>
        <p className="text-sm text-gray-400 mt-2">{sec.pda}</p>
      </div>

      {/* Tareas disponibles */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Tareas disponibles ({tareasCPA.length})
        </h2>
        {tareasCPA.length === 0 ? (
          <div className="card p-8 text-center text-gray-400">
            <p className="text-sm">Esta secuencia aún no tiene tareas CPA disponibles.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tareasCPA.map((tarea, i) => {
              const label = tarea.concepto_clave
                ? `${sec.secuencia}${String.fromCharCode(97 + i)} · ${tarea.concepto_clave}`
                : `${sec.secuencia}${String.fromCharCode(97 + i)} · Tarea ${i + 1}`
              return (
                <div
                  key={i}
                  className="card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <h3 className="font-semibold text-gray-900">{label}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Concreto: {tarea.concreto.manipulable.tipo_concreto.replaceAll('_', ' ')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPreviewIdx(previewIdx === i ? null : i)}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      {previewIdx === i ? 'Ocultar' : 'Vista previa'}
                    </button>
                    <Boton variante="primario" size="sm" onClick={() => setModalAsignar(i)}>
                      Asignar a una clase
                    </Boton>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Inline preview */}
      {previewIdx !== null && tareasCPA[previewIdx] && (
        <div className="mb-8 space-y-4">
          <TareaPreview tarea={tareasCPA[previewIdx]} />
        </div>
      )}

      {/* Recursos */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Recursos</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            href={`/profesor/biblioteca/${id}`}
            className="card p-4 flex flex-col items-center gap-2 text-center hover:shadow-md hover:border-amarillo transition-all"
          >
            <BookOpen className="w-6 h-6 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Libro alumno</span>
          </Link>
          <Link
            href={`/profesor/biblioteca/${id}`}
            className="card p-4 flex flex-col items-center gap-2 text-center hover:shadow-md hover:border-amarillo transition-all"
          >
            <Video className="w-6 h-6 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Video</span>
          </Link>
          <Link
            href={`/profesor/biblioteca/${id}`}
            className="card p-4 flex flex-col items-center gap-2 text-center hover:shadow-md hover:border-amarillo transition-all"
          >
            <FileText className="w-6 h-6 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Guía profe</span>
          </Link>
          <Link
            href={`/profesor/biblioteca/${id}`}
            className="card p-4 flex flex-col items-center gap-2 text-center hover:shadow-md hover:border-amarillo transition-all"
          >
            <Presentation className="w-6 h-6 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Diapositivas</span>
          </Link>
        </div>
      </div>

      {/* Generate custom */}
      <div className="card p-6 bg-amarillo-soft border-amarillo/30">
        <h3 className="font-semibold text-gray-900 mb-1">¿Necesitas algo distinto?</h3>
        <p className="text-sm text-gray-600 mb-3">
          Genera una tarea personalizada con IA para esta secuencia.
        </p>
        <Link
          href={`/profesor/generar?secuencia=${id}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-gray-900 hover:text-amarillo-hover transition-colors"
        >
          + Generar tarea personalizada con IA
        </Link>
      </div>

      {/* Modal asignar */}
      <Modal
        abierto={modalAsignar !== null}
        onCerrar={() => setModalAsignar(null)}
        titulo="Asignar tarea Singapur"
      >
        <div className="space-y-4">
          <div>
            <label className="label-base">Clase{clases.length > 1 ? 's' : ''}</label>
            {clases.length === 0 ? (
              <p className="text-sm text-gray-500">
                No tienes clases. Ve a "Mis clases" para crear una.
              </p>
            ) : (
              <div className="space-y-2">
                {clases.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setClasesSeleccionadas(
                        clasesSeleccionadas.length === clases.length
                          ? []
                          : clases.map((c: { id: string }) => c.id),
                      )
                    }
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    {clasesSeleccionadas.length === clases.length
                      ? 'Deseleccionar todas'
                      : 'Seleccionar todas'}
                  </button>
                )}
                {clases.map((c: { id: string; nombre: string; grado: string }) => (
                  <label
                    key={c.id}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={clasesSeleccionadas.includes(c.id)}
                      onChange={() => toggleClase(c.id)}
                      className="w-4 h-4 rounded border-gray-300 text-amarillo focus:ring-amarillo"
                    />
                    <span className="text-sm text-gray-700">
                      {c.nombre} · {c.grado}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="label-base">
              Fecha límite <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <input
              type="datetime-local"
              value={fechaLimite}
              onChange={(e) => setFechaLimite(e.target.value)}
              className="input-base"
            />
          </div>
          <Boton
            variante="primario"
            size="md"
            onClick={handleAsignar}
            disabled={asignando || clasesSeleccionadas.length === 0}
            className="w-full"
          >
            {asignando
              ? 'Asignando...'
              : clasesSeleccionadas.length > 1
                ? `Asignar a ${clasesSeleccionadas.length} clases`
                : 'Asignar'}
          </Boton>
        </div>
      </Modal>

      <Toast
        mensaje="Tarea asignada correctamente"
        visible={toast}
        onCerrar={() => setToast(false)}
      />
    </div>
  )
}

// ── Tarea preview ────────────────────────────────────────────────

function TareaPreview({ tarea }: { tarea: any }) {
  const spec = tarea.concreto.manipulable
  return (
    <div className="space-y-4">
      <div className="card p-5">
        <h3 className="font-semibold text-gray-900 text-sm mb-3">
          1. Concreto — {spec.tipo_concreto.replaceAll('_', ' ')}
        </h3>
        <ManipulableDispatcher bloque={tarea.concreto} onValidado={() => {}} />
      </div>
      <div className="card p-5">
        <h3 className="font-semibold text-gray-900 text-sm mb-3">2. Pictorico</h3>
        <RepresentacionPreview pictorico={tarea.pictorico} />
        <div className="space-y-2 mt-3">
          {tarea.pictorico.preguntas.map((p: any, i: number) => (
            <div key={i} className="text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2">
              {i + 1}. {p.pregunta}
            </div>
          ))}
        </div>
      </div>
      <div className="card p-5">
        <h3 className="font-semibold text-gray-900 text-sm mb-3">
          3. Abstracto — {tarea.abstracto.preguntas.length} preguntas
        </h3>
        <div className="space-y-2">
          {tarea.abstracto.preguntas.map((p: any, i: number) => (
            <div key={i} className="text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2">
              {i + 1}. {p.pregunta}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function RepresentacionPreview({ pictorico }: { pictorico: any }) {
  const rep =
    pictorico.representacion ??
    (pictorico.modelo_barras
      ? { ...pictorico.modelo_barras, tipo_representacion: 'modelo_barras' }
      : null)
  if (!rep) return null

  switch (rep.tipo_representacion) {
    case 'modelo_barras':
      return <ModeloBarras spec={rep} className="mb-3" />
    case 'diagrama_geometrico':
      return <DiagramaGeometrico spec={rep} className="mb-3" />
    case 'tabla':
      return <TablaPictorica spec={rep} className="mb-3" />
    default:
      return null
  }
}
