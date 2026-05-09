'use client'

import { X, FileText, BookOpen, Presentation, Play, ClipboardCheck, ChevronLeft, ChevronRight, Download, Eye } from 'lucide-react'
import { useState, lazy, Suspense } from 'react'

const OrientacionPDF = lazy(() => import('@/components/pdf/OrientacionPDF.jsx'))
const PDFDownloadLinkLazy = lazy(() =>
  import('@react-pdf/renderer').then((mod) => ({ default: mod.PDFDownloadLink })),
)
const BlobProviderLazy = lazy(() =>
  import('@react-pdf/renderer').then((mod) => ({ default: mod.BlobProvider })),
)

const TIPO_CONFIG = {
  orientacion: { label: 'Orientacion didactica', icon: FileText },
  libro: { label: 'Libro del alumno', icon: BookOpen },
  diapositiva: { label: 'Diapositivas', icon: Presentation },
  video_script: { label: 'Video leccion (script)', icon: Play },
  evaluacion: { label: 'Evaluacion', icon: ClipboardCheck },
}

function renderMarkdown(text) {
  if (!text) return null
  const lines = text.split('\n')
  const elements = []
  let listItems = []

  function flushList() {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="list-disc list-inside space-y-1 mb-3">
          {listItems.map((item, i) => (
            <li key={i} className="text-sm text-gray-700">{item}</li>
          ))}
        </ul>
      )
      listItems = []
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (line.startsWith('### ')) {
      flushList()
      elements.push(<h4 key={i} className="text-sm font-semibold text-gray-900 mt-4 mb-2">{line.slice(4)}</h4>)
    } else if (line.startsWith('## ')) {
      flushList()
      elements.push(<h3 key={i} className="text-base font-semibold text-gray-900 mt-5 mb-2">{line.slice(3)}</h3>)
    } else if (line.startsWith('# ')) {
      flushList()
      elements.push(<h2 key={i} className="text-lg font-bold text-gray-900 mt-5 mb-2">{line.slice(2)}</h2>)
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      listItems.push(line.slice(2))
    } else if (line.match(/^\d+\.\s/)) {
      listItems.push(line)
    } else if (line.trim() === '') {
      flushList()
    } else {
      flushList()
      const formatted = line
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\[VISUAL:\s*(.+?)\]/g, '<em class="text-blue-600">[VISUAL: $1]</em>')
      elements.push(
        <p key={i} className="text-sm text-gray-700 mb-2" dangerouslySetInnerHTML={{ __html: formatted }} />
      )
    }
  }
  flushList()

  return elements
}

function VisorMarkdown({ contenido }) {
  return <div className="prose-sm max-w-none">{renderMarkdown(contenido)}</div>
}

function VisorDiapositivas({ slides }) {
  const [actual, setActual] = useState(0)
  if (!Array.isArray(slides) || slides.length === 0) return <p className="text-sm text-gray-400">Sin diapositivas</p>

  const slide = slides[actual]

  return (
    <div>
      {/* Slide content */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 min-h-[300px] flex flex-col">
        <p className="text-xs text-gray-400 mb-4">
          {actual + 1} / {slides.length}
        </p>
        <h3 className="text-lg font-bold text-gray-900 mb-4">{slide.titulo}</h3>
        {slide.puntos && (
          <ul className="space-y-2 flex-1">
            {slide.puntos.map((punto, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-amarillo mt-1.5" />
                {punto}
              </li>
            ))}
          </ul>
        )}
        {slide.ejemplo && (
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-xs font-medium text-amber-700 mb-1">Ejemplo</p>
            <p className="text-sm text-gray-800">{slide.ejemplo}</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-4">
        <button
          type="button"
          onClick={() => setActual(Math.max(0, actual - 1))}
          disabled={actual === 0}
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 disabled:text-gray-300 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" /> Anterior
        </button>
        <div className="flex gap-1">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActual(i)}
              className={`w-2 h-2 rounded-full transition-colors ${i === actual ? 'bg-amarillo' : 'bg-gray-200'}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => setActual(Math.min(slides.length - 1, actual + 1))}
          disabled={actual === slides.length - 1}
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 disabled:text-gray-300 disabled:cursor-not-allowed"
        >
          Siguiente <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

function VisorEvaluacion({ preguntas }) {
  if (!Array.isArray(preguntas) || preguntas.length === 0) return <p className="text-sm text-gray-400">Sin preguntas</p>

  return (
    <div className="divide-y divide-gray-100">
      {preguntas.map((p, i) => (
        <div key={i} className="py-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-gray-400">{i + 1}</span>
            <span className="text-xs text-gray-400 uppercase">{p.tipo?.replace('_', ' ')}</span>
          </div>
          <p className="text-sm text-gray-800">{p.pregunta}</p>
          {p.opciones && (
            <ul className="mt-1.5 space-y-0.5">
              {p.opciones.map((op, j) => (
                <li
                  key={j}
                  className={`text-xs px-2 py-1 rounded ${
                    String(op).startsWith(String(p.respuesta))
                      ? 'bg-green-50 text-green-700 font-medium'
                      : 'text-gray-500'
                  }`}
                >
                  {op}
                </li>
              ))}
            </ul>
          )}
          {p.respuesta && !p.opciones && (
            <p className="text-xs text-green-600 mt-1">Respuesta: {String(p.respuesta)}</p>
          )}
        </div>
      ))}
    </div>
  )
}

function VisorOrientacionEstructurada({ orientacion }) {
  const { contenidos_especificos, actividad_inicio, desarrollo, cierre_individual, cierre_grupal, preguntas_comprension } = orientacion

  return (
    <div className="space-y-6">
      {/* Contenidos especificos */}
      {contenidos_especificos?.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Contenidos especificos</h4>
          <ul className="space-y-1">
            {contenidos_especificos.map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="w-1.5 h-1.5 rounded-full bg-amarillo mt-1.5 flex-shrink-0" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* INTRODUCCION */}
      <div>
        <span className="inline-block bg-amarillo text-gray-900 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded mb-3">
          Introduccion
        </span>
        <h4 className="text-sm font-semibold text-gray-900 mt-3 mb-2">Actividad de inicio</h4>
        <ul className="space-y-1.5">
          {actividad_inicio?.map((a, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="w-1.5 h-1.5 rounded-full bg-amarillo mt-1.5 flex-shrink-0" />
              {a}
            </li>
          ))}
        </ul>
      </div>

      {/* DESARROLLO */}
      <div>
        <span className="inline-block bg-amarillo text-gray-900 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded mb-3">
          Desarrollo
        </span>
        <div className="space-y-4 mt-3">
          {desarrollo?.map((paso, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {i + 1}
              </div>
              <div className="flex-1">
                <h5 className="text-sm font-semibold text-gray-900 mb-1">{paso.titulo}</h5>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {paso.diapositiva && (
                    <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      Diapositiva {paso.diapositiva}
                    </span>
                  )}
                  {paso.libro && (
                    <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      Libro: {paso.libro}
                    </span>
                  )}
                  {paso.video && (
                    <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      Video: {paso.video}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-700">{paso.descripcion}</p>
                {paso.tip && (
                  <div className="mt-2 bg-teal-50 border-l-2 border-teal-500 px-3 py-2 rounded-r">
                    <p className="text-[10px] font-bold text-teal-700 uppercase mb-0.5">Tip pedagogico</p>
                    <p className="text-xs text-teal-800">{paso.tip}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CIERRE */}
      <div>
        <span className="inline-block bg-amarillo text-gray-900 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded mb-3">
          Cierre
        </span>

        {cierre_individual && (
          <div className="mt-3 space-y-3">
            <h4 className="text-sm font-semibold text-gray-900">Cierre individual</h4>
            {cierre_individual.reflexiona && (
              <p className="text-sm text-gray-700 italic">{cierre_individual.reflexiona}</p>
            )}
            {cierre_individual.profundiza?.map((p, i) => (
              <div key={i}>
                <p className="text-sm font-medium text-gray-900 mb-1">{i + 1}. {p.pregunta}</p>
                <div className="bg-rose-50 border-l-2 border-rose-500 px-3 py-2 rounded-r">
                  <p className="text-[10px] font-bold text-rose-600 mb-0.5">R.M.</p>
                  <p className="text-xs text-gray-700">{p.respuesta_modelo}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {cierre_grupal?.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Cierre grupal</h4>
            <p className="text-xs text-gray-500 mb-2">Al finalizar, tus estudiantes deben haber comprendido:</p>
            <ul className="space-y-1">
              {cierre_grupal.map((p, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-amarillo mt-1.5 flex-shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Preguntas de comprension */}
      {preguntas_comprension?.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
            Preguntas para evaluar la comprension
          </h4>
          <ol className="space-y-1.5">
            {preguntas_comprension.map((q, i) => (
              <li key={i} className="text-sm text-gray-700">
                <span className="font-bold text-gray-900 mr-1">{i + 1}.</span> {q}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}

function VisorLibroEstructurado({ libro }) {
  const { introduccion, conceptos, ejemplos, datos_curiosos, ejercicios, puntos_clave } = libro

  return (
    <div className="space-y-6">
      {/* Introduccion */}
      {introduccion && (
        <p className="text-sm text-gray-600 italic leading-relaxed">{introduccion}</p>
      )}

      {/* Conceptos */}
      {conceptos?.length > 0 && (
        <div>
          <span className="inline-block bg-amarillo text-gray-900 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded mb-3">
            Conceptos
          </span>
          {conceptos.map((c, i) => (
            <div key={i} className="mb-4">
              {c.titulo && <h4 className="text-sm font-semibold text-gray-900 mb-1">{c.titulo}</h4>}
              <p className="text-sm text-gray-700 leading-relaxed">{c.contenido}</p>
              {c.definicion && (
                <div className="mt-2 bg-amber-50 border-l-2 border-amarillo px-3 py-2 rounded-r">
                  <p className="text-[10px] font-bold text-amber-700 uppercase mb-0.5">Definicion</p>
                  <p className="text-sm font-medium text-gray-900">{c.definicion}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Ejemplos */}
      {ejemplos?.length > 0 && (
        <div>
          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded mb-3">
            Ejemplos resueltos
          </span>
          {ejemplos.map((ej, i) => (
            <div key={i} className="mb-4 bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">{i + 1}</span>
                <h5 className="text-sm font-semibold text-blue-800">{ej.titulo || `Ejemplo ${i + 1}`}</h5>
              </div>
              {ej.enunciado && <p className="text-sm text-gray-700 mb-2">{ej.enunciado}</p>}
              {ej.pasos?.map((paso, j) => (
                <div key={j} className="flex gap-2 mb-1 ml-2">
                  <span className="text-xs font-bold text-blue-500 w-4">{j + 1}.</span>
                  <p className="text-sm text-gray-700">{paso}</p>
                </div>
              ))}
              {ej.resultado && (
                <div className="mt-2 bg-white rounded px-3 py-2 border border-blue-200">
                  <p className="text-[10px] font-bold text-blue-600 mb-0.5">RESULTADO</p>
                  <p className="text-sm font-semibold text-gray-900">{ej.resultado}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Datos curiosos */}
      {datos_curiosos && (
        <div className="bg-teal-50 rounded-lg p-4 border border-teal-100">
          <p className="text-[10px] font-bold text-teal-700 uppercase mb-1">Dato curioso</p>
          <p className="text-sm text-teal-800">{datos_curiosos}</p>
        </div>
      )}

      {/* Ejercicios */}
      {ejercicios?.length > 0 && (
        <div>
          <span className="inline-block bg-gray-200 text-gray-800 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded mb-3">
            Practica
          </span>
          {ejercicios.map((ej, i) => (
            <div key={i} className="mb-3">
              <p className="text-sm text-gray-700">
                <span className="font-bold text-gray-900 mr-1">{ej.numero}.</span>
                {ej.enunciado}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Puntos clave */}
      {puntos_clave?.length > 0 && (
        <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
          <p className="text-[10px] font-bold text-amber-700 uppercase mb-2">Puntos clave</p>
          <ul className="space-y-1">
            {puntos_clave.map((p, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default function VisorContenido({ semana, tipo, contenido, onCerrar }) {
  const config = TIPO_CONFIG[tipo]
  const Icon = config?.icon ?? FileText
  const [verPDF, setVerPDF] = useState(true)
  const esOrientacionObj = tipo === 'orientacion' && typeof contenido === 'object' && contenido !== null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm overflow-y-auto py-8">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl mx-4 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
              <Icon className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">{config?.label}</h2>
              <p className="text-xs text-gray-400">
                Semana {semana.secuencia} &middot; {semana.titulo}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {esOrientacionObj && (
              <>
                <button
                  type="button"
                  onClick={() => setVerPDF((v) => !v)}
                  className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                    verPDF
                      ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  {verPDF ? 'Ver contenido' : 'Ver PDF'}
                </button>
                <Suspense fallback={null}>
                  <PDFDownloadLinkLazy
                    document={<OrientacionPDF semana={semana} orientacion={contenido} />}
                    fileName={`orientacion-semana-${semana.secuencia}.pdf`}
                  >
                    {({ loading }) => (
                      <button
                        type="button"
                        disabled={loading}
                        className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        {loading ? 'Generando...' : 'Descargar PDF'}
                      </button>
                    )}
                  </PDFDownloadLinkLazy>
                </Suspense>
              </>
            )}
            <button
              type="button"
              onClick={onCerrar}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        {esOrientacionObj && verPDF ? (
          <div className="h-[75vh]">
            <Suspense fallback={<div className="flex items-center justify-center h-full text-sm text-gray-400">Cargando PDF...</div>}>
              <BlobProviderLazy document={<OrientacionPDF semana={semana} orientacion={contenido} />}>
                {({ url, loading }) =>
                  loading ? (
                    <div className="flex items-center justify-center h-full text-sm text-gray-400">Generando PDF...</div>
                  ) : (
                    <iframe src={url} title="Vista previa PDF" className="w-full h-full rounded-b-2xl" />
                  )
                }
              </BlobProviderLazy>
            </Suspense>
          </div>
        ) : (
          <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
            {tipo === 'evaluacion' && <VisorEvaluacion preguntas={contenido?.preguntas ?? contenido} />}
            {tipo === 'diapositiva' && <VisorDiapositivas slides={contenido} />}
            {esOrientacionObj && <VisorOrientacionEstructurada orientacion={contenido} />}
            {tipo === 'orientacion' && typeof contenido === 'string' && (
              <VisorMarkdown contenido={contenido} />
            )}
            {tipo === 'libro' && typeof contenido === 'object' && contenido !== null && (
              <VisorLibroEstructurado libro={contenido} />
            )}
            {tipo === 'libro' && typeof contenido === 'string' && (
              <VisorMarkdown contenido={contenido} />
            )}
            {tipo === 'video_script' && (
              <VisorMarkdown contenido={contenido} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
