'use client'

import { pdf } from '@react-pdf/renderer'
import {
  ArrowLeft,
  BookOpen,
  Download,
  Eye,
  FileText,
  Play,
  Presentation,
  Type,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
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
import { DiapositivasPDF, GuiaPDF, LibroPDF } from '@/components/profesor/RecursoPDF'
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
  const [toastMsg, setToastMsg] = useState('Tarea asignada correctamente')
  const [recurso, setRecurso] = useState<'libro' | 'video' | 'guia' | 'diapositivas' | null>(null)
  const [modoTexto, setModoTexto] = useState(false)

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
      setToastMsg('Tarea asignada correctamente')
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
  const secTitulo = sec ? `Secuencia ${id} — ${sec.titulo}` : ''

  const downloadPdf = useCallback(async () => {
    if (!sec || !recurso) return
    let doc: any = null
    let filename = ''
    if (recurso === 'libro') {
      doc = <LibroPDF libro={sec.libro} secTitulo={secTitulo} />
      filename = `Libro_Sec${id}.pdf`
    } else if (recurso === 'guia') {
      doc = <GuiaPDF orientacion={sec.orientacion} secTitulo={secTitulo} />
      filename = `Guia_Sec${id}.pdf`
    } else if (recurso === 'diapositivas') {
      doc = <DiapositivasPDF slides={sec.diapositiva} secTitulo={secTitulo} />
      filename = `Diapositivas_Sec${id}.pdf`
    }
    if (!doc) return
    const blob = await pdf(doc).toBlob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }, [sec, recurso, id, secTitulo])

  const exportGoogleDocs = useCallback(async () => {
    if (!sec || !recurso) return
    let html = ''
    if (recurso === 'libro') html = libroToHtml(sec.libro, secTitulo)
    else if (recurso === 'guia') html = guiaToHtml(sec.orientacion, secTitulo)
    else if (recurso === 'diapositivas') html = diapositivasToHtml(sec.diapositiva, secTitulo)
    if (!html) return
    // Copy rich HTML to clipboard so the prof can paste into the new doc
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': new Blob([html], { type: 'text/html' }),
          'text/plain': new Blob([
            recurso === 'libro' ? libroToText(sec.libro)
              : recurso === 'guia' ? guiaToText(sec.orientacion)
              : diapositivasToText(sec.diapositiva),
          ], { type: 'text/plain' }),
        }),
      ])
    } catch {
      // Fallback: just open the doc without clipboard
    }
    window.open('https://docs.google.com/document/create', '_blank')
    setToast(true)
    setToastMsg('Contenido copiado. Pega (Ctrl+V) en el documento.')
  }, [sec, recurso, secTitulo])

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
            <p className="text-sm">Esta secuencia aun no tiene tareas CPA disponibles.</p>
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
                      onClick={() => openPreview(i)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Vista previa
                    </button>
                    <Boton variante="primario" size="sm" onClick={() => { openPreview(i); setShowAsignar(true) }}>
                      Asignar a una clase
                    </Boton>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Recursos */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Recursos</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {([
            { key: 'libro' as const, icon: BookOpen, label: 'Libro alumno' },
            // { key: 'video' as const, icon: Play, label: 'Video' },
            { key: 'guia' as const, icon: FileText, label: 'Guia profe' },
            { key: 'diapositivas' as const, icon: Presentation, label: 'Diapositivas' },
          ]).map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setRecurso(key)}
              className="card p-4 flex flex-col items-center gap-2 text-center hover:shadow-md hover:border-amarillo transition-all cursor-pointer"
            >
              <Icon className="w-6 h-6 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Generate custom */}
      <div className="card p-6 bg-amarillo-soft border-amarillo/30">
        <h3 className="font-semibold text-gray-900 mb-1">Necesitas algo distinto?</h3>
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

      {/* Preview modal */}
      <Dialog open={previewIdx !== null} onOpenChange={(open) => !open && closePreview()}>
        <DialogContent
          className="fixed top-1/2 left-1/2 z-50 w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white text-sm ring-1 ring-black/5 shadow-xl sm:max-w-3xl max-h-[85vh] flex flex-col p-0 duration-100 outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
          showCloseButton={false}
        >
          {previewTarea && (
            <>
              {/* Header */}
              <DialogHeader className="px-6 pt-5 pb-4 border-b border-gray-100 shrink-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <DialogTitle className="text-lg font-bold text-gray-900">
                      {previewTarea.concepto_clave ?? `Tarea ${(previewIdx ?? 0) + 1}`}
                    </DialogTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      {previewTarea.concreto.manipulable.tipo_concreto.replaceAll('_', ' ')}
                      {' · '}{previewTarea.pictorico.preguntas.length + previewTarea.abstracto.preguntas.length} preguntas
                    </p>
                  </div>
                  <button
                    onClick={closePreview}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
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
                <div className="flex gap-1 mt-4 bg-gray-100 rounded-lg p-1">
                  {STEPS.map((step, i) => (
                    <button
                      key={step}
                      onClick={() => setStepIdx(i)}
                      className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                        stepIdx === i
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
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
              <div className="shrink-0 border-t border-gray-100 px-6 py-4">
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
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        Clase{clases.length > 1 ? 's' : ''}
                      </label>
                      {clases.length === 0 ? (
                        <p className="text-sm text-gray-500">
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
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        Fecha limite <span className="text-gray-400 font-normal">(opcional)</span>
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
                        className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
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

      {/* Recurso modal */}
      <Dialog open={recurso !== null} onOpenChange={(open) => { if (!open) { setRecurso(null); setModoTexto(false) } }}>
        <DialogContent
          className="fixed top-1/2 left-1/2 z-50 w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white text-sm ring-1 ring-black/5 shadow-xl sm:max-w-3xl max-h-[85vh] flex flex-col p-0 duration-100 outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
          showCloseButton={false}
        >
          <DialogHeader className="px-6 pt-5 pb-4 border-b border-gray-100 shrink-0">
            <div className="flex items-start justify-between gap-4">
              <DialogTitle className="text-lg font-bold text-gray-900">
                {recurso === 'libro' && 'Libro alumno'}
                {recurso === 'video' && 'Guion de video'}
                {recurso === 'guia' && 'Guia del profesor'}
                {recurso === 'diapositivas' && 'Diapositivas'}
              </DialogTitle>
              <button
                onClick={() => { setRecurso(null); setModoTexto(false) }}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Toolbar */}
            {recurso !== 'video' && (
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={() => setModoTexto(!modoTexto)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    modoTexto
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <Type className="w-3.5 h-3.5" />
                  Texto
                </button>
                <button
                  onClick={downloadPdf}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  PDF
                </button>
                {/* TODO: Google Docs export */}
              </div>
            )}
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {modoTexto && recurso !== 'video' ? (
              <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 leading-relaxed">
                {recurso === 'libro' && libroToText(sec.libro)}
                {recurso === 'guia' && guiaToText(sec.orientacion)}
                {recurso === 'diapositivas' && diapositivasToText(sec.diapositiva)}
              </pre>
            ) : (
              <>
                {recurso === 'libro' && <RecursoLibro libro={sec.libro} />}
                {recurso === 'video' && <RecursoVideo script={sec.video_script} />}
                {recurso === 'guia' && <RecursoGuia orientacion={sec.orientacion} />}
                {recurso === 'diapositivas' && <RecursoDiapositivas slides={sec.diapositiva} />}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Toast
        mensaje={toastMsg}
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
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
        Manipulable: {spec.tipo_concreto.replaceAll('_', ' ')}
      </p>
      {tarea.contexto?.transiciones?.concreto && (
        <p className="text-sm text-gray-600 mb-4 italic">
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
        <p className="text-sm text-gray-600 mb-4 italic">
          {tarea.contexto.transiciones.pictorico}
        </p>
      )}
      <RepresentacionPreview pictorico={tarea.pictorico} />
      <div className="space-y-2 mt-4">
        {tarea.pictorico.preguntas.map((p: any, i: number) => (
          <div key={i} className="text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2.5">
            <span className="font-medium text-gray-500 mr-1.5">{i + 1}.</span>
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
        <p className="text-sm text-gray-600 mb-4 italic">
          {tarea.contexto.transiciones.abstracto}
        </p>
      )}
      <div className="space-y-2">
        {tarea.abstracto.preguntas.map((p: any, i: number) => (
          <div key={i} className="text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2.5">
            <span className="font-medium text-gray-500 mr-1.5">{i + 1}.</span>
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

// ── Recurso renderers ─────────────────────────────────────────────

function RecursoLibro({ libro }: { libro: any }) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-700 leading-relaxed">{libro.introduccion}</p>
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 text-sm mb-3">Conceptos</h3>
        <div className="space-y-3">
          {libro.conceptos.map((c: any, i: number) => (
            <div key={i} className="rounded-xl border border-gray-100 p-4">
              <h4 className="font-semibold text-gray-900 text-sm mb-1">{c.titulo}</h4>
              <p className="text-sm text-gray-700 leading-relaxed">{c.contenido}</p>
              {c.definicion && (
                <p className="text-xs text-purple-700 bg-purple-50 rounded-lg px-3 py-2 mt-2">
                  {c.definicion}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 text-sm mb-3">Ejemplos</h3>
        <div className="space-y-3">
          {libro.ejemplos.map((e: any, i: number) => (
            <div key={i} className="rounded-xl border border-gray-100 p-4">
              <h4 className="font-semibold text-gray-900 text-sm mb-1">{e.titulo}</h4>
              <p className="text-sm text-gray-600 mb-2">{e.enunciado}</p>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700 mb-2">
                {e.pasos.map((p: string, j: number) => (
                  <li key={j}>{p}</li>
                ))}
              </ol>
              <p className="text-sm font-semibold text-green-700 bg-green-50 rounded-lg px-3 py-2">
                {e.resultado}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 text-sm mb-3">Datos curiosos</h3>
        <p className="text-sm text-gray-700 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 leading-relaxed">
          {libro.datos_curiosos}
        </p>
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 text-sm mb-3">Ejercicios</h3>
        <div className="space-y-2">
          {libro.ejercicios.map((e: any) => (
            <div key={e.numero} className="rounded-xl border border-gray-100 p-3">
              <p className="text-sm text-gray-800">
                <span className="font-bold text-gray-500 mr-2">{e.numero}.</span>
                {e.enunciado}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 text-sm mb-3">Puntos clave</h3>
        <ul className="space-y-1">
          {libro.puntos_clave.map((p: string, i: number) => (
            <li key={i} className="text-sm text-gray-700 flex gap-2">
              <span className="text-green-500 flex-shrink-0 font-bold">&#10003;</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function RecursoVideo({ script }: { script: string }) {
  return (
    <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line leading-relaxed">
      {script}
    </div>
  )
}

function RecursoGuia({ orientacion }: { orientacion: any }) {
  const o = orientacion
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-gray-900 text-sm mb-3">Contenidos especificos</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
          {o.contenidos_especificos.map((c: string, i: number) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 text-sm mb-3">Actividad de inicio</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
          {o.actividad_inicio.map((a: string, i: number) => (
            <li key={i} className="leading-relaxed">{a}</li>
          ))}
        </ol>
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 text-sm mb-3">Desarrollo</h3>
        <div className="space-y-3">
          {o.desarrollo.map((d: any, i: number) => (
            <div key={i} className="rounded-xl border border-gray-100 p-4">
              <h4 className="font-semibold text-gray-900 text-sm mb-1">{d.titulo}</h4>
              {d.diapositiva && (
                <p className="text-[11px] text-gray-400 mb-2">
                  Diapositivas {d.diapositiva}
                  {d.libro && ` · ${d.libro}`}
                  {d.video && ` · ${d.video}`}
                </p>
              )}
              <p className="text-sm text-gray-700 leading-relaxed">{d.descripcion}</p>
              {d.tip && (
                <p className="text-xs text-blue-600 bg-blue-50 rounded-lg px-3 py-2 mt-3">
                  Tip: {d.tip}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 text-sm mb-3">Cierre individual</h3>
        <p className="text-sm text-gray-700 italic mb-3">{o.cierre_individual.reflexiona}</p>
        {o.cierre_individual.profundiza.map((p: any, i: number) => (
          <div key={i} className="rounded-xl border border-gray-100 p-4 mb-3">
            <p className="text-sm text-gray-800 font-medium mb-2">{p.pregunta}</p>
            <details className="text-sm text-gray-500">
              <summary className="cursor-pointer text-blue-600 hover:text-blue-800 text-xs font-medium">
                Mostrar respuesta modelo
              </summary>
              <p className="mt-2 text-gray-600 leading-relaxed">{p.respuesta_modelo}</p>
            </details>
          </div>
        ))}
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 text-sm mb-3">Cierre grupal</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
          {o.cierre_grupal.map((c: string, i: number) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 text-sm mb-3">Preguntas de comprension</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
          {o.preguntas_comprension.map((p: string, i: number) => (
            <li key={i} className="leading-relaxed">{p}</li>
          ))}
        </ol>
      </div>
    </div>
  )
}

function RecursoDiapositivas({ slides }: { slides: any[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {slides.map((s, i) => (
        <div key={i} className="rounded-xl border border-gray-100 p-4 relative">
          <span className="absolute top-3 right-3 text-xs font-bold text-gray-300">
            {i + 1}/{slides.length}
          </span>
          <h4 className="font-semibold text-gray-900 text-sm mb-3">{s.titulo}</h4>
          <ul className="space-y-1 mb-3">
            {s.puntos.map((p: string, j: number) => (
              <li key={j} className="text-sm text-gray-700 flex gap-2">
                <span className="text-gray-300 flex-shrink-0">&bull;</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
          {s.ejemplo && (
            <div className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
              <span className="font-semibold">Ejemplo:</span> {s.ejemplo}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ── Plain text generators ─────────────────────────────────────────

function libroToText(libro: any): string {
  let t = `${libro.introduccion}\n\n`
  t += '--- CONCEPTOS ---\n\n'
  for (const c of libro.conceptos) {
    t += `${c.titulo}\n${c.contenido}\n`
    if (c.definicion) t += `Definicion: ${c.definicion}\n`
    t += '\n'
  }
  t += '--- EJEMPLOS ---\n\n'
  for (const e of libro.ejemplos) {
    t += `${e.titulo}\n${e.enunciado}\n`
    e.pasos.forEach((p: string, i: number) => { t += `  ${i + 1}. ${p}\n` })
    t += `Resultado: ${e.resultado}\n\n`
  }
  t += '--- DATOS CURIOSOS ---\n\n'
  t += `${libro.datos_curiosos}\n\n`
  t += '--- EJERCICIOS ---\n\n'
  for (const e of libro.ejercicios) t += `${e.numero}. ${e.enunciado}\n`
  t += '\n--- PUNTOS CLAVE ---\n\n'
  for (const p of libro.puntos_clave) t += `- ${p}\n`
  return t
}

function guiaToText(o: any): string {
  let t = '--- CONTENIDOS ESPECIFICOS ---\n\n'
  for (const c of o.contenidos_especificos) t += `- ${c}\n`
  t += '\n--- ACTIVIDAD DE INICIO ---\n\n'
  o.actividad_inicio.forEach((a: string, i: number) => { t += `${i + 1}. ${a}\n` })
  t += '\n--- DESARROLLO ---\n\n'
  for (const d of o.desarrollo) {
    t += `${d.titulo}\n`
    if (d.diapositiva) t += `  (Diap. ${d.diapositiva})\n`
    t += `${d.descripcion}\n`
    if (d.tip) t += `  Tip: ${d.tip}\n`
    t += '\n'
  }
  t += '--- CIERRE INDIVIDUAL ---\n\n'
  t += `${o.cierre_individual.reflexiona}\n\n`
  for (const p of o.cierre_individual.profundiza) {
    t += `Pregunta: ${p.pregunta}\nRespuesta: ${p.respuesta_modelo}\n\n`
  }
  t += '--- CIERRE GRUPAL ---\n\n'
  for (const c of o.cierre_grupal) t += `- ${c}\n`
  t += '\n--- PREGUNTAS DE COMPRENSION ---\n\n'
  o.preguntas_comprension.forEach((p: string, i: number) => { t += `${i + 1}. ${p}\n` })
  return t
}

function diapositivasToText(slides: any[]): string {
  let t = ''
  for (const [i, sl] of slides.entries()) {
    t += `--- DIAPOSITIVA ${i + 1}/${slides.length}: ${sl.titulo} ---\n\n`
    for (const p of sl.puntos) t += `- ${p}\n`
    if (sl.ejemplo) t += `\nEjemplo: ${sl.ejemplo}\n`
    t += '\n'
  }
  return t
}

// ── HTML generators (for Google Docs import) ──────────────────────

const htmlWrap = (title: string, body: string) =>
  `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title>
<style>body{font-family:Arial,sans-serif;max-width:700px;margin:40px auto;color:#1f2937;line-height:1.6}
h1{font-size:24px;border-bottom:3px solid #FFD700;padding-bottom:8px}
h2{font-size:18px;margin-top:28px;color:#374151}
h3{font-size:14px;margin-top:16px}
.card{background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px;margin:8px 0}
.tip{background:#eff6ff;border:1px solid #bfdbfe;border-radius:6px;padding:8px;margin-top:8px;color:#2563eb;font-size:13px}
.def{background:#f5f3ff;border-radius:6px;padding:8px;margin-top:6px;color:#7c3aed;font-size:13px}
.result{background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;padding:8px;margin-top:6px;color:#15803d;font-weight:600}
.curios{background:#fefce8;border:1px solid #fde68a;border-radius:6px;padding:10px}
ul,ol{padding-left:20px}li{margin:4px 0}</style></head><body>${body}</body></html>`

function libroToHtml(libro: any, titulo: string): string {
  let b = `<h1>${titulo} — Libro alumno</h1>`
  b += `<p>${libro.introduccion}</p>`
  b += '<h2>Conceptos</h2>'
  for (const c of libro.conceptos) {
    b += `<div class="card"><h3>${c.titulo}</h3><p>${c.contenido}</p>`
    if (c.definicion) b += `<div class="def">${c.definicion}</div>`
    b += '</div>'
  }
  b += '<h2>Ejemplos</h2>'
  for (const e of libro.ejemplos) {
    b += `<div class="card"><h3>${e.titulo}</h3><p>${e.enunciado}</p><ol>`
    for (const p of e.pasos) b += `<li>${p}</li>`
    b += `</ol><div class="result">${e.resultado}</div></div>`
  }
  b += `<h2>Datos curiosos</h2><div class="curios">${libro.datos_curiosos}</div>`
  b += '<h2>Ejercicios</h2><ol>'
  for (const e of libro.ejercicios) b += `<li>${e.enunciado}</li>`
  b += '</ol><h2>Puntos clave</h2><ul>'
  for (const p of libro.puntos_clave) b += `<li>${p}</li>`
  b += '</ul>'
  return htmlWrap(`${titulo} — Libro`, b)
}

function guiaToHtml(o: any, titulo: string): string {
  let b = `<h1>${titulo} — Guia del profesor</h1>`
  b += '<h2>Contenidos especificos</h2><ul>'
  for (const c of o.contenidos_especificos) b += `<li>${c}</li>`
  b += '</ul><h2>Actividad de inicio</h2><ol>'
  for (const a of o.actividad_inicio) b += `<li>${a}</li>`
  b += '</ol><h2>Desarrollo</h2>'
  for (const d of o.desarrollo) {
    b += `<div class="card"><h3>${d.titulo}</h3>`
    if (d.diapositiva) b += `<p style="color:#9ca3af;font-size:12px">Diap. ${d.diapositiva}</p>`
    b += `<p>${d.descripcion}</p>`
    if (d.tip) b += `<div class="tip">Tip: ${d.tip}</div>`
    b += '</div>'
  }
  b += `<h2>Cierre individual</h2><p><em>${o.cierre_individual.reflexiona}</em></p>`
  for (const p of o.cierre_individual.profundiza) {
    b += `<div class="card"><p><strong>${p.pregunta}</strong></p><div class="result">${p.respuesta_modelo}</div></div>`
  }
  b += '<h2>Cierre grupal</h2><ul>'
  for (const c of o.cierre_grupal) b += `<li>${c}</li>`
  b += '</ul><h2>Preguntas de comprension</h2><ol>'
  for (const p of o.preguntas_comprension) b += `<li>${p}</li>`
  b += '</ol>'
  return htmlWrap(`${titulo} — Guia`, b)
}

function diapositivasToHtml(slides: any[], titulo: string): string {
  let b = `<h1>${titulo} — Diapositivas</h1>`
  for (const [i, sl] of slides.entries()) {
    b += `<div class="card"><p style="color:#9ca3af;font-size:12px;font-weight:700">${i + 1}/${slides.length}</p>`
    b += `<h3>${sl.titulo}</h3><ul>`
    for (const p of sl.puntos) b += `<li>${p}</li>`
    b += '</ul>'
    if (sl.ejemplo) b += `<p style="color:#6b7280;font-size:13px"><strong>Ejemplo:</strong> ${sl.ejemplo}</p>`
    b += '</div>'
  }
  return htmlWrap(`${titulo} — Diapositivas`, b)
}
