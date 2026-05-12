'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import NavBar from '@/components/layout/NavBar.jsx'
import ModeloBarras from '@/components/pictorico/ModeloBarras'
import Boton from '@/components/ui/Boton.jsx'
import Modal from '@/components/ui/Modal.jsx'
import Toast from '@/components/ui/Toast.jsx'
import { getSecuenciaById } from '@/content/biblioteca/matematicas-1'
import { getTareaReferencia } from '@/data/tareas-referencia'
import { useAgregarTarea } from '@/hooks/useTareas.js'
import useAuthStore from '@/store/useAuthStore.js'

const TABS = [
  { id: 'orientacion', label: 'Orientacion' },
  { id: 'diapositivas', label: 'Diapositivas' },
  { id: 'libro', label: 'Libro alumno' },
  { id: 'examenes', label: 'Examenes' },
  { id: 'tarea', label: 'Tarea Singapur' },
]

export default function SecuenciaDetalle() {
  const { secuenciaId } = useParams()
  const router = useRouter()
  const id = Number(secuenciaId)
  const sec = getSecuenciaById(id)
  const tareaCPA = getTareaReferencia(id)

  const [tab, setTab] = useState('orientacion')

  if (!sec) {
    router.push('/profesor/biblioteca')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar titulo={`Secuencia ${id}`} volver="/profesor/biblioteca" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
        {/* Header */}
        <div className="card p-6 mb-6">
          <div className="flex items-start gap-4">
            <span className="text-4xl font-black text-gray-200 leading-none">
              {String(id).padStart(2, '0')}
            </span>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-gray-900">{sec.titulo}</h1>
              <p className="text-sm text-gray-600 mt-1">{sec.contenido}</p>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">{sec.pda}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                tab === t.id
                  ? 'bg-gray-900 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'orientacion' && <TabOrientacion o={sec.orientacion} />}
        {tab === 'diapositivas' && <TabDiapositivas slides={sec.diapositiva} />}
        {tab === 'libro' && <TabLibro libro={sec.libro} />}
        {tab === 'examenes' && <TabExamenes preguntas={sec.evaluacion.preguntas} />}
        {tab === 'tarea' && <TabTareaSingapur tareaCPA={tareaCPA} secuencia={sec} />}
      </main>
    </div>
  )
}

// ── Tab 1: Orientacion ───────────────────────────────────────────

function TabOrientacion({ o }) {
  return (
    <div className="space-y-6">
      {/* Contenidos especificos */}
      <Section titulo="Contenidos especificos">
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
          {o.contenidos_especificos.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </Section>

      {/* Actividad de inicio */}
      <Section titulo="Actividad de inicio">
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
          {o.actividad_inicio.map((a, i) => (
            <li key={i} className="leading-relaxed">
              {a}
            </li>
          ))}
        </ol>
      </Section>

      {/* Desarrollo */}
      <Section titulo="Desarrollo">
        <div className="space-y-4">
          {o.desarrollo.map((d, i) => (
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
      </Section>

      {/* Cierre individual */}
      <Section titulo="Cierre individual">
        <p className="text-sm text-gray-700 italic mb-3">{o.cierre_individual.reflexiona}</p>
        {o.cierre_individual.profundiza.map((p, i) => (
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
      </Section>

      {/* Cierre grupal */}
      <Section titulo="Cierre grupal">
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
          {o.cierre_grupal.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </Section>

      {/* Preguntas de comprension */}
      <Section titulo="Preguntas de comprension">
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
          {o.preguntas_comprension.map((p, i) => (
            <li key={i} className="leading-relaxed">
              {p}
            </li>
          ))}
        </ol>
      </Section>
    </div>
  )
}

// ── Tab 2: Diapositivas ──────────────────────────────────────────

function TabDiapositivas({ slides }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {slides.map((s, i) => (
        <div key={i} className="card p-5 relative">
          <span className="absolute top-3 right-3 text-xs font-bold text-gray-300">
            {i + 1}/{slides.length}
          </span>
          <h4 className="font-semibold text-gray-900 text-sm mb-3">{s.titulo}</h4>
          <ul className="space-y-1 mb-3">
            {s.puntos.map((p, j) => (
              <li key={j} className="text-sm text-gray-700 flex gap-2">
                <span className="text-gray-300 flex-shrink-0">•</span>
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

// ── Tab 3: Libro alumno ──────────────────────────────────────────

function TabLibro({ libro }) {
  return (
    <div className="space-y-6">
      <Section titulo="Introduccion">
        <p className="text-sm text-gray-700 leading-relaxed">{libro.introduccion}</p>
      </Section>

      <Section titulo="Conceptos">
        <div className="space-y-4">
          {libro.conceptos.map((c, i) => (
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
      </Section>

      <Section titulo="Ejemplos">
        <div className="space-y-4">
          {libro.ejemplos.map((e, i) => (
            <div key={i} className="rounded-xl border border-gray-100 p-4">
              <h4 className="font-semibold text-gray-900 text-sm mb-1">{e.titulo}</h4>
              <p className="text-sm text-gray-600 mb-2">{e.enunciado}</p>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700 mb-2">
                {e.pasos.map((p, j) => (
                  <li key={j}>{p}</li>
                ))}
              </ol>
              <p className="text-sm font-semibold text-green-700 bg-green-50 rounded-lg px-3 py-2">
                {e.resultado}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section titulo="Datos curiosos">
        <p className="text-sm text-gray-700 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 leading-relaxed">
          {libro.datos_curiosos}
        </p>
      </Section>

      <Section titulo="Ejercicios">
        <div className="space-y-3">
          {libro.ejercicios.map((e) => (
            <div key={e.numero} className="rounded-xl border border-gray-100 p-4">
              <p className="text-sm text-gray-800">
                <span className="font-bold text-gray-500 mr-2">{e.numero}.</span>
                {e.enunciado}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section titulo="Puntos clave">
        <ul className="space-y-1">
          {libro.puntos_clave.map((p, i) => (
            <li key={i} className="text-sm text-gray-700 flex gap-2">
              <span className="text-green-500 flex-shrink-0 font-bold">✓</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  )
}

// ── Tab 4: Examenes ──────────────────────────────────────────────

function TabExamenes({ preguntas }) {
  return (
    <div className="space-y-4">
      {preguntas.map((p, i) => (
        <div key={i} className="card p-5">
          <div className="flex items-start gap-3 mb-3">
            <span className="flex-shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-xs font-bold text-gray-600">
              {i + 1}
            </span>
            <div className="flex-1">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                {p.tipo.replace('_', ' ')}
              </span>
              <p className="text-sm text-gray-800 mt-1">{p.pregunta}</p>
            </div>
          </div>

          {p.opciones && (
            <div className="ml-10 space-y-1 mb-3">
              {p.opciones.map((op, j) => (
                <p key={j} className="text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-1.5">
                  {op}
                </p>
              ))}
            </div>
          )}

          <details className="ml-10 text-sm">
            <summary className="cursor-pointer text-blue-600 hover:text-blue-800 text-xs font-medium">
              Mostrar respuesta
            </summary>
            <p className="mt-2 text-gray-600 bg-green-50 border border-green-200 rounded-lg px-3 py-2 whitespace-pre-line">
              {String(p.respuesta)}
            </p>
          </details>
        </div>
      ))}
    </div>
  )
}

// ── Tab 5: Tarea Singapur ────────────────────────────────────────

function TabTareaSingapur({ tareaCPA, secuencia }) {
  const { profesor, clases } = useAuthStore()
  const agregarTarea = useAgregarTarea()
  const router = useRouter()

  const [modalAbierto, setModalAbierto] = useState(false)
  const [claseId, setClaseId] = useState(clases?.[0]?.id ?? '')
  const [fechaLimite, setFechaLimite] = useState('')
  const [asignando, setAsignando] = useState(false)
  const [toast, setToast] = useState(false)

  if (!tareaCPA) {
    return (
      <div className="card p-12 text-center">
        <p className="text-4xl mb-4">🔨</p>
        <p className="text-lg font-semibold text-gray-900 mb-2">Tarea CPA en preparacion</p>
        <p className="text-sm text-gray-500 max-w-sm mx-auto">
          La tarea Singapur para esta secuencia esta siendo desarrollada. Mientras tanto, puedes
          usar los recursos pedagogicos de las otras pestanas.
        </p>
      </div>
    )
  }

  async function handleAsignar() {
    if (!claseId || !profesor) return
    setAsignando(true)
    try {
      await agregarTarea.mutateAsync({
        profesor_id: profesor.id,
        clase_id: claseId,
        nombre: `${secuencia.titulo} — Secuencia ${secuencia.secuencia}`,
        dificultad: 'Media',
        contenido_cpa: tareaCPA,
        fecha_limite: fechaLimite || null,
        secuencia_ref: secuencia.secuencia,
        estado_override: 'en_curso',
      })
      setModalAbierto(false)
      setToast(true)
      setTimeout(() => router.push('/profesor'), 1500)
    } catch {
      // error handled by mutation
    } finally {
      setAsignando(false)
    }
  }

  const spec = tareaCPA.concreto.manipulable

  return (
    <div className="space-y-6">
      {/* Preview Concreto */}
      <div className="card p-5">
        <h3 className="font-semibold text-gray-900 text-sm mb-1 flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-900 text-white text-xs font-bold">
            1
          </span>
          Concreto — {spec.tipo_concreto.replace('_', ' ')}
        </h3>
        <p className="text-sm text-gray-600 ml-8 mb-2">{spec.pregunta}</p>
        <p className="text-xs text-gray-400 ml-8">
          {spec.cantidad} objetos · {tareaCPA.concreto.intentos_para_pista} intentos para pista
        </p>
      </div>

      {/* Preview Pictorico */}
      <div className="card p-5">
        <h3 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-900 text-white text-xs font-bold">
            2
          </span>
          Pictorico — Modelo de barras
        </h3>
        <ModeloBarras spec={tareaCPA.pictorico.modelo_barras} className="mb-3" />
        <p className="text-xs text-gray-400 ml-8">
          {tareaCPA.pictorico.preguntas.length} pregunta
          {tareaCPA.pictorico.preguntas.length > 1 ? 's' : ''} sobre el modelo
        </p>
      </div>

      {/* Preview Abstracto */}
      <div className="card p-5">
        <h3 className="font-semibold text-gray-900 text-sm mb-2 flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-900 text-white text-xs font-bold">
            3
          </span>
          Abstracto — {tareaCPA.abstracto.preguntas.length} preguntas
        </h3>
        <div className="ml-8 space-y-2">
          {tareaCPA.abstracto.preguntas.map((p, i) => (
            <div key={i} className="text-sm text-gray-600 flex gap-2">
              <span className="text-gray-400 font-semibold flex-shrink-0">{i + 1}.</span>
              <span className="line-clamp-2">{p.pregunta}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Assign button */}
      <Boton variante="primario" size="lg" onClick={() => setModalAbierto(true)} className="w-full">
        Asignar a una clase
      </Boton>

      {/* Assignment modal */}
      <Modal
        abierto={modalAbierto}
        onCerrar={() => setModalAbierto(false)}
        titulo="Asignar tarea Singapur"
      >
        <div className="space-y-4">
          <div>
            <label className="label-base">Clase</label>
            {clases.length === 0 ? (
              <p className="text-sm text-gray-500">
                No tienes clases. Ve a "Mis clases" para crear una.
              </p>
            ) : (
              <select
                value={claseId}
                onChange={(e) => setClaseId(e.target.value)}
                className="input-base"
              >
                {clases.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre} · {c.grado}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div>
            <label className="label-base">
              Fecha limite <span className="text-gray-400 font-normal">(opcional)</span>
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
            disabled={asignando || !claseId}
            className="w-full"
          >
            {asignando ? 'Asignando...' : 'Asignar'}
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

// ── Shared section wrapper ───────────────────────────────────────

function Section({ titulo, children }) {
  return (
    <div className="card p-5">
      <h3 className="font-semibold text-gray-900 text-sm mb-3">{titulo}</h3>
      {children}
    </div>
  )
}
