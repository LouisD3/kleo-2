'use client'

import {
  ArrowLeft,
  BookOpen,
  Expand,
  FileText,
  Presentation,
  Send,
  Sparkles,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import ManipulableDispatcher from '@/components/manipulables/ManipulableDispatcher'
import DiagramaGeometrico from '@/components/pictorico/DiagramaGeometrico'
import ModeloBarras from '@/components/pictorico/ModeloBarras'
import TablaPictorica from '@/components/pictorico/TablaPictorica'
import Boton from '@/components/ui/Boton.jsx'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import Toast from '@/components/ui/Toast.jsx'
import { getSecuenciaById } from '@/content/biblioteca/matematicas-1'
import { getTareasReferencia } from '@/data/tareas-referencia'
import { useAgregarTarea } from '@/hooks/useTareas.js'
import VisorContenido from '@/components/profesor/biblioteca/VisorContenido'
import useAuthStore from '@/store/useAuthStore.js'

const STEPS = ['Concreto', 'Pictorico', 'Abstracto'] as const

export default function SecuenciaDetalle() {
  const { secuencia } = useParams<{ secuencia: string }>()
  const router = useRouter()
  const id = Number(secuencia)
  const sec = getSecuenciaById(id)
  const tareasCPA = getTareasReferencia(id)
  const { profesor, clases } = useAuthStore()
  const agregarTarea = useAgregarTarea()

  const [previewIdx, setPreviewIdx] = useState<number | null>(null)
  const [stepIdx, setStepIdx] = useState(0)
  const [showAsignar, setShowAsignar] = useState(false)
  const [clasesSeleccionadas, setClasesSeleccionadas] = useState<string[]>(
    clases?.[0]?.id ? [clases[0].id] : [],
  )
  const [fechaLimite, setFechaLimite] = useState('')
  const [asignando, setAsignando] = useState(false)
  const [toast, setToast] = useState(false)
  const [recurso, setRecurso] = useState<'libro' | 'guia' | 'diapositivas' | null>(null)

  if (!sec) {
    router.push('/profesor/programa')
    return null
  }

  function openPreview(i: number) {
    setPreviewIdx(i)
    setStepIdx(0)
    setShowAsignar(false)
  }

  function closePreview() {
    setPreviewIdx(null)
    setShowAsignar(false)
  }

  async function handleAsignar() {
    if (clasesSeleccionadas.length === 0 || !profesor || previewIdx === null || !sec) return
    const tareaCPA = tareasCPA[previewIdx]
    setAsignando(true)
    try {
      for (const cId of clasesSeleccionadas) {
        await (agregarTarea as any).mutateAsync({
          profesor_id: profesor.id,
          clase_id: cId,
          nombre: `${sec.titulo} — Sec ${sec.secuencia} (${previewIdx + 1}/${tareasCPA.length})`,
          dificultad: 'Media',
          contenido_cpa: tareaCPA,
          fecha_limite: fechaLimite || null,
          secuencia_ref: sec.secuencia,
          estado_override: 'en_curso',
        })
      }
      closePreview()
      setToast(true)
    } catch {
      // handled by mutation
    } finally {
      setAsignando(false)
    }
  }

  function toggleClase(cId: string) {
    setClasesSeleccionadas((prev) =>
      prev.includes(cId) ? prev.filter((x) => x !== cId) : [...prev, cId],
    )
  }

  const previewTarea = previewIdx !== null ? tareasCPA[previewIdx] : null

  return (
    <div className="px-4 sm:px-6 md:px-8 py-10 animate-fade-in">
      {/* Header card */}
      <div className="card px-6 py-5 mb-6">
        <Link
          href="/profesor/programa"
          className="inline-flex items-center gap-1 text-sm text-tinta-400 hover:text-tinta-600 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Programa
        </Link>
        <h1 className="text-3xl font-bold text-tinta tracking-tight">
          Secuencia {id} — {sec.titulo}
        </h1>
        <p className="text-sm text-tinta-400 mt-1">{sec.contenido}</p>
        <p className="text-xs text-tinta-400 mt-1">{sec.pda}</p>
      </div>

      {/* Tareas + Recursos side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 mb-6">
        {/* Tareas disponibles */}
        <div className="card px-6 py-5">
          <h2 className="text-base font-semibold text-tinta mb-4">
            Tareas disponibles ({tareasCPA.length})
          </h2>
          {tareasCPA.length === 0 ? (
            <div className="p-8 text-center text-tinta-400">
              <p className="text-sm">Esta secuencia aun no tiene tareas CPA disponibles.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {tareasCPA.map((tarea, i) => {
                const code = `${sec.secuencia}${String.fromCharCode(97 + i)}`
                const label = tarea.concepto_clave ?? `Tarea ${i + 1}`
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => openPreview(i)}
                    className="group/card bg-white rounded-xl overflow-hidden border border-crema-100 hover:border-tinta-400/30 hover:shadow-sm transition-all text-left flex flex-col"
                  >
                    {/* Concreto miniature */}
                    <div className="relative h-36 overflow-hidden bg-crema-50">
                      <div className="absolute inset-0 origin-top-left scale-[0.4] w-[250%] pointer-events-none p-4">
                        <StepConcreto tarea={tarea} />
                      </div>
                      <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white to-transparent" />
                      <Expand className="absolute top-2 right-2 w-4 h-4 text-tinta-400/0 group-hover/card:text-tinta-400 transition-colors" />
                    </div>

                    {/* Info */}
                    <div className="px-4 py-3 flex flex-col gap-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-tinta-400 bg-crema-100 px-2 py-0.5 rounded-full">
                          {code}
                        </span>
                        <span className="text-[11px] text-tinta-400 capitalize truncate">
                          {tarea.concreto.manipulable.tipo_concreto.replaceAll('_', ' ')}
                        </span>
                      </div>
                      <h3 className="font-semibold text-tinta text-sm leading-snug line-clamp-2">{label}</h3>
                    </div>

                    {/* Footer */}
                    <div className="px-4 pb-3 mt-auto">
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => { e.stopPropagation(); openPreview(i); setShowAsignar(true) }}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); openPreview(i); setShowAsignar(true) } }}
                        className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-tinta text-tinta-50 hover:bg-tinta-600 transition-colors"
                      >
                        <Send className="w-3 h-3" />
                        Asignar a una clase
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Sidebar: Recursos + Generar */}
        <div className="space-y-6">
          <div className="card px-6 py-5">
            <h2 className="text-base font-semibold text-tinta mb-4">Recursos</h2>
            <div className="space-y-2">
              {([
                { key: 'libro' as const, icon: BookOpen, label: 'Libro alumno', color: 'bg-sky-100 text-sky-600' },
                { key: 'guia' as const, icon: FileText, label: 'Guia profe', color: 'bg-emerald-100 text-emerald-600' },
                { key: 'diapositivas' as const, icon: Presentation, label: 'Diapositivas', color: 'bg-violet-100 text-violet-600' },
              ]).map(({ key, icon: Icon, label, color }) => (
                <button
                  key={key}
                  onClick={() => setRecurso(key)}
                  className="w-full rounded-xl p-3 flex items-center gap-3 text-left hover:bg-crema-50 transition-all cursor-pointer"
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-sm font-medium text-tinta-600">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="card px-6 py-5 bg-gradient-to-br from-amber-50 to-orange-50 border-amarillo/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-amarillo/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-4.5 h-4.5 text-amber-600" />
              </div>
              <h3 className="font-semibold text-tinta">Generar con IA</h3>
            </div>
            <p className="text-sm text-tinta-400 mb-4">
              Crea una tarea CPA personalizada para esta secuencia.
            </p>
            <Link
              href={`/profesor/generar?secuencia=${id}`}
              className="block w-full text-center px-4 py-2.5 rounded-xl bg-tinta text-tinta-50 text-sm font-medium hover:bg-tinta-600 transition-colors"
            >
              + Nueva tarea con IA
            </Link>
          </div>
        </div>
      </div>

      {/* Preview modal */}
      <Dialog open={previewIdx !== null} onOpenChange={(open) => !open && closePreview()}>
        <DialogContent
          className="fixed top-1/2 left-1/2 z-50 w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white text-sm ring-1 ring-black/5 shadow-xl sm:max-w-3xl max-h-[85vh] flex flex-col p-0 duration-100 outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
          showCloseButton={false}
        >
          {previewTarea && (
            <>
              {/* Header */}
              <DialogHeader className="px-6 pt-5 pb-4 border-b border-crema-100 shrink-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <DialogTitle className="text-lg font-bold text-tinta">
                      {previewTarea.concepto_clave ?? `Tarea ${(previewIdx ?? 0) + 1}`}
                    </DialogTitle>
                    <p className="text-sm text-tinta-400 mt-1">
                      {previewTarea.concreto.manipulable.tipo_concreto.replaceAll('_', ' ')}
                      {' · '}{previewTarea.pictorico.preguntas.length + previewTarea.abstracto.preguntas.length} preguntas
                    </p>
                  </div>
                  <button
                    onClick={closePreview}
                    className="p-1.5 rounded-lg text-tinta-400 hover:text-tinta-600 hover:bg-crema-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Contexto banner */}
                {previewTarea.contexto?.narrativa && (
                  <div className="mt-3 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200/60 text-sm text-amber-800">
                    {previewTarea.contexto.narrativa}
                  </div>
                )}

                {/* Mini-stepper */}
                <div className="flex gap-1 mt-4 bg-crema-100 rounded-lg p-1">
                  {STEPS.map((step, i) => (
                    <button
                      key={step}
                      onClick={() => setStepIdx(i)}
                      className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                        stepIdx === i
                          ? 'bg-white text-tinta shadow-sm'
                          : 'text-tinta-400 hover:text-tinta-600'
                      }`}
                    >
                      {i + 1}. {step}
                    </button>
                  ))}
                </div>
              </DialogHeader>

              {/* Step content */}
              <div className="flex-1 overflow-y-auto px-6 py-5">
                {stepIdx === 0 && <StepConcreto tarea={previewTarea} />}
                {stepIdx === 1 && <StepPictorico tarea={previewTarea} />}
                {stepIdx === 2 && <StepAbstracto tarea={previewTarea} />}
              </div>

              {/* Footer — Asignar */}
              <div className="shrink-0 border-t border-crema-100 px-6 py-4">
                {!showAsignar ? (
                  <Boton
                    variante="primario"
                    size="md"
                    className="w-full"
                    onClick={() => setShowAsignar(true)}
                  >
                    Asignar a una clase
                  </Boton>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-tinta-600 mb-1.5 block">
                        Clase{clases.length > 1 ? 's' : ''}
                      </label>
                      {clases.length === 0 ? (
                        <p className="text-sm text-tinta-400">
                          No tienes clases. Ve a &quot;Mis clases&quot; para crear una.
                        </p>
                      ) : (
                        <div className="space-y-1.5">
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
                              className="text-xs text-amarillo-hover hover:text-amarillo"
                            >
                              {clasesSeleccionadas.length === clases.length
                                ? 'Deseleccionar todas'
                                : 'Seleccionar todas'}
                            </button>
                          )}
                          {clases.map((c: { id: string; nombre: string; grado: string }) => (
                            <label
                              key={c.id}
                              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-crema-50 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={clasesSeleccionadas.includes(c.id)}
                                onChange={() => toggleClase(c.id)}
                                className="w-4 h-4 rounded border-crema-200 text-amarillo focus:ring-amarillo"
                              />
                              <span className="text-sm text-tinta-600">
                                {c.nombre} · {c.grado}
                              </span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-tinta-600 mb-1.5 block">
                        Fecha limite <span className="text-tinta-400 font-normal">(opcional)</span>
                      </label>
                      <input
                        type="datetime-local"
                        value={fechaLimite}
                        onChange={(e) => setFechaLimite(e.target.value)}
                        className="input-base"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowAsignar(false)}
                        className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-tinta-600 border border-crema-200 hover:bg-crema-50 transition-colors"
                      >
                        Cancelar
                      </button>
                      <Boton
                        variante="primario"
                        size="md"
                        onClick={handleAsignar}
                        disabled={asignando || clasesSeleccionadas.length === 0}
                        className="flex-1"
                      >
                        {asignando
                          ? 'Asignando...'
                          : clasesSeleccionadas.length > 1
                            ? `Asignar a ${clasesSeleccionadas.length} clases`
                            : 'Asignar'}
                      </Boton>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Recurso modal — uses restored VisorContenido with PDF preview + download */}
      {recurso !== null && (
        <VisorContenido
          semana={sec}
          tipo={recurso === 'guia' ? 'orientacion' : recurso === 'diapositivas' ? 'diapositiva' : recurso}
          contenido={
            recurso === 'libro' ? sec.libro
              : recurso === 'guia' ? sec.orientacion
              : sec.diapositiva
          }
          onCerrar={() => setRecurso(null)}
        />
      )}

      <Toast
        mensaje="Tarea asignada correctamente"
        visible={toast}
        onCerrar={() => setToast(false)}
      />
    </div>
  )
}

// ── Step renderers ────────────────────────────────────────────────

function StepConcreto({ tarea }: { tarea: any }) {
  const spec = tarea.concreto.manipulable
  return (
    <div>
      <p className="text-xs font-medium text-tinta-400 uppercase tracking-wide mb-3">
        Manipulable: {spec.tipo_concreto.replaceAll('_', ' ')}
      </p>
      {tarea.contexto?.transiciones?.concreto && (
        <p className="text-sm text-tinta-400 mb-4 italic">
          {tarea.contexto.transiciones.concreto}
        </p>
      )}
      <ManipulableDispatcher bloque={tarea.concreto} onValidado={() => {}} />
    </div>
  )
}

function StepPictorico({ tarea }: { tarea: any }) {
  return (
    <div>
      {tarea.contexto?.transiciones?.pictorico && (
        <p className="text-sm text-tinta-400 mb-4 italic">
          {tarea.contexto.transiciones.pictorico}
        </p>
      )}
      <RepresentacionPreview pictorico={tarea.pictorico} />
      <div className="space-y-2 mt-4">
        {tarea.pictorico.preguntas.map((p: any, i: number) => (
          <div key={i} className="text-sm text-tinta-600 bg-crema-50 rounded-lg px-3 py-2.5">
            <span className="font-medium text-tinta-400 mr-1.5">{i + 1}.</span>
            {p.pregunta}
          </div>
        ))}
      </div>
    </div>
  )
}

function StepAbstracto({ tarea }: { tarea: any }) {
  return (
    <div>
      {tarea.contexto?.transiciones?.abstracto && (
        <p className="text-sm text-tinta-400 mb-4 italic">
          {tarea.contexto.transiciones.abstracto}
        </p>
      )}
      <div className="space-y-2">
        {tarea.abstracto.preguntas.map((p: any, i: number) => (
          <div key={i} className="text-sm text-tinta-600 bg-crema-50 rounded-lg px-3 py-2.5">
            <span className="font-medium text-tinta-400 mr-1.5">{i + 1}.</span>
            {p.pregunta}
          </div>
        ))}
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

