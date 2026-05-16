'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { EstadoManipulable } from '@/components/manipulables/ManipulableAgrupable'
import ManipulableDispatcher from '@/components/manipulables/ManipulableDispatcher'
import DiagramaGeometrico from '@/components/pictorico/DiagramaGeometrico'
import ModeloBarras from '@/components/pictorico/ModeloBarras'
import TablaPictorica from '@/components/pictorico/TablaPictorica'
import Boton from '@/components/ui/Boton'
import Spinner from '@/components/ui/Spinner'
import type {
  BloqueAbstracto,
  BloqueConcreto,
  BloquePictorico,
  ContextoAnchor,
  EtapaCPA,
  PreguntaAbstracto,
  PreguntaPictorico,
  ProgresoCPA,
  TareaCPA,
} from '@/types/tarea-cpa'

// ── Types ────────────────────────────────────────────────────────

interface Props {
  tareaCPA: TareaCPA
  tareaId: string
  alumnoId: string
  onSubmit: (datos: DatosIntento) => Promise<void>
  submitting: boolean
}

export interface RetroItem {
  indice_pregunta: number
  correcta: boolean
  comentario: string
}

export interface DatosIntento {
  concreto: { intentos: number; pista_usada: boolean }
  pictorico: { respuestas: Record<string, string | boolean> }
  abstracto: { respuestas: Record<string, string | boolean>; retroIA?: RetroItem[] }
  tiempos: { concreto_ms: number; pictorico_ms: number; abstracto_ms: number }
}

const ETAPAS: EtapaCPA[] = ['concreto', 'pictorico', 'abstracto']
const ETAPA_LABELS: Record<string, string> = {
  concreto: 'Concreto',
  pictorico: 'Pictorico',
  abstracto: 'Abstracto',
}

// ── localStorage helpers ─────────────────────────────────────────

function storageKey(tareaId: string, alumnoId: string) {
  return `kleo_progreso_${tareaId}_${alumnoId}`
}

function loadProgreso(tareaId: string, alumnoId: string): ProgresoCPA | null {
  try {
    const raw = localStorage.getItem(storageKey(tareaId, alumnoId))
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveProgreso(progreso: ProgresoCPA) {
  try {
    localStorage.setItem(
      storageKey(progreso.tarea_id, progreso.alumno_id),
      JSON.stringify({ ...progreso, updated_at: new Date().toISOString() }),
    )
  } catch {}
}

function clearProgreso(tareaId: string, alumnoId: string) {
  try {
    localStorage.removeItem(storageKey(tareaId, alumnoId))
  } catch {}
}

// ── Component ────────────────────────────────────────────────────

export default function StepperCPA({ tareaCPA, tareaId, alumnoId, onSubmit, submitting }: Props) {
  const saved = useRef(loadProgreso(tareaId, alumnoId))

  const [etapa, setEtapa] = useState<EtapaCPA>(saved.current?.etapa_actual ?? 'concreto')

  // Concreto state
  const [concretoIntentos, setConcretoIntentos] = useState(
    saved.current?.concreto_estado?.intentos ?? 0,
  )
  const [concretoPista, setConcretoPista] = useState(
    saved.current?.concreto_estado?.pista_mostrada ?? false,
  )
  const [concretoValidado, setConcretoValidado] = useState(
    saved.current?.concreto_estado?.validado ?? false,
  )
  const [estadoManipulable, setEstadoManipulable] = useState<EstadoManipulable | undefined>(
    saved.current?.concreto_estado?.estado_manipulable as EstadoManipulable | undefined,
  )
  const [diagnostico, setDiagnostico] = useState<string | null>(null)

  // Pictorico state
  const [pictoricoResp, setPictoricoResp] = useState<Record<string, string | boolean>>(
    saved.current?.pictorico_estado?.respuestas ?? {},
  )
  const [pictoricoValidado, setPictoricoValidado] = useState(
    saved.current?.pictorico_estado?.validado ?? false,
  )
  const [pictoricoError, setPictoricoError] = useState(false)

  // Abstracto state
  const [abstractoResp, setAbstractoResp] = useState<Record<string, string | boolean>>(
    saved.current?.abstracto_estado?.respuestas ?? {},
  )

  // Timing
  const tiempoRef = useRef({ concreto: 0, pictorico: 0, abstracto: 0 })
  const etapaStartRef = useRef(Date.now())

  // Track time on etapa change
  useEffect(() => {
    const prev = etapaStartRef.current
    return () => {
      const elapsed = Date.now() - prev
      if (etapa === 'concreto') tiempoRef.current.concreto += elapsed
      else if (etapa === 'pictorico') tiempoRef.current.pictorico += elapsed
      else if (etapa === 'abstracto') tiempoRef.current.abstracto += elapsed
    }
  }, [etapa])

  useEffect(() => {
    etapaStartRef.current = Date.now()
  }, [etapa])

  // ── Persist to localStorage ───────────────────────────────────

  const persist = useCallback(() => {
    const progreso: ProgresoCPA = {
      tarea_id: tareaId,
      alumno_id: alumnoId,
      etapa_actual: etapa,
      intento_actual: 1,
      concreto_estado: {
        intentos: concretoIntentos,
        pista_mostrada: concretoPista,
        validado: concretoValidado,
        estado_manipulable: estadoManipulable as Record<string, unknown> | undefined,
      },
      pictorico_estado: { respuestas: pictoricoResp, validado: pictoricoValidado },
      abstracto_estado: { respuestas: abstractoResp },
      updated_at: new Date().toISOString(),
    }
    saveProgreso(progreso)
  }, [
    tareaId,
    alumnoId,
    etapa,
    concretoIntentos,
    concretoPista,
    concretoValidado,
    estadoManipulable,
    pictoricoResp,
    pictoricoValidado,
    abstractoResp,
  ])

  useEffect(() => {
    persist()
  }, [persist])

  // ── Concreto handlers ─────────────────────────────────────────

  const [recapConcreto, setRecapConcreto] = useState(false)

  function handleConcretoValidado(intentos: number, pistaUsada: boolean) {
    setConcretoIntentos(intentos)
    setConcretoPista(pistaUsada)
    setConcretoValidado(true)
    setRecapConcreto(true)
    setTimeout(() => {
      setRecapConcreto(false)
      setEtapa('pictorico')
    }, 3000)
  }

  function handleManipulableChange(estado: EstadoManipulable) {
    setEstadoManipulable(estado)
  }

  function handleDiagnostico(msg: string) {
    setDiagnostico(msg)
    setTimeout(() => setDiagnostico(null), 5000)
  }

  // ── Pictorico handlers ────────────────────────────────────────

  function handlePictoricoResp(idx: number, valor: string | boolean) {
    setPictoricoResp((prev) => ({ ...prev, [idx]: valor }))
  }

  function validarPictorico() {
    const preguntas = tareaCPA.pictorico.preguntas
    let allCorrect = true

    for (let i = 0; i < preguntas.length; i++) {
      const p = preguntas[i]
      const resp = pictoricoResp[i]
      const respStr = String(resp ?? '').trim()
      if (respStr === '') {
        allCorrect = false
        break
      }
      // Reject trivially short answers for open/calc questions
      if ((p.tipo === 'calculo' || p.tipo === 'abierta') && respStr.length < 3) {
        allCorrect = false
        break
      }
      // Client-side check for objective types
      if (p.tipo === 'opcion_multiple' || p.tipo === 'verdadero_falso' || p.tipo === 'espacios') {
        const correcta = String(p.respuesta).toLowerCase().trim()
        const alumno = String(resp).toLowerCase().trim()
        if (alumno !== correcta) {
          allCorrect = false
          break
        }
      }
      // calculo/abierta: just require non-empty (AI grades later)
    }

    if (allCorrect) {
      setPictoricoValidado(true)
      setPictoricoError(false)
      setTimeout(() => setEtapa('abstracto'), 3000)
    } else {
      setPictoricoError(true)
      setTimeout(() => setPictoricoError(false), 2000)
    }
  }

  // ── Abstracto handlers ────────────────────────────────────────

  function handleAbstractoResp(idx: number, valor: string | boolean) {
    setAbstractoResp((prev) => ({ ...prev, [idx]: valor }))
  }

  const abstractoPreguntas = tareaCPA.abstracto.preguntas
  const abstractoRespondidas = abstractoPreguntas.filter(
    (_, i) => abstractoResp[i] !== undefined && String(abstractoResp[i]).trim() !== '',
  ).length

  // AI grading state
  const [corrigiendo, setCorrigiendo] = useState(false)
  const [retroIA, setRetroIA] = useState<RetroItem[] | null>(null)
  const [errorIA, setErrorIA] = useState<string | null>(null)

  async function handleCorregir() {
    // Check if there are any calculo/abierta questions that need AI grading
    const needsAI = abstractoPreguntas.some((p) => p.tipo === 'calculo' || p.tipo === 'abierta')

    if (!needsAI) {
      // All objective — skip AI, submit directly
      await doSubmit(null)
      return
    }

    setCorrigiendo(true)
    setErrorIA(null)

    try {
      const res = await fetch('/api/ia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'corregir',
          payload: {
            tarea: {
              dificultad: 'Media',
              contenido_cpa: abstractoPreguntas.map((p) => ({
                tipo: p.tipo,
                pregunta: p.pregunta,
                opciones: p.opciones,
                respuesta: p.respuesta,
              })),
            },
            respuestasAlumno: abstractoResp,
          },
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data?.error ?? 'Error al corregir')

      const retro: RetroItem[] = data.retroalimentacion ?? []
      setRetroIA(retro)
    } catch (err) {
      setErrorIA(err instanceof Error ? err.message : 'Error al conectar con IA')
    } finally {
      setCorrigiendo(false)
    }
  }

  async function doSubmit(retro: RetroItem[] | null) {
    const elapsed = Date.now() - etapaStartRef.current
    tiempoRef.current.abstracto += elapsed
    etapaStartRef.current = Date.now()

    await onSubmit({
      concreto: { intentos: concretoIntentos, pista_usada: concretoPista },
      pictorico: { respuestas: pictoricoResp },
      abstracto: { respuestas: abstractoResp, retroIA: retro ?? undefined },
      tiempos: {
        concreto_ms: tiempoRef.current.concreto,
        pictorico_ms: tiempoRef.current.pictorico,
        abstracto_ms: tiempoRef.current.abstracto,
      },
    })
    clearProgreso(tareaId, alumnoId)
  }

  async function handleSubmit() {
    if (retroIA) {
      // Already graded, submit with AI results
      await doSubmit(retroIA)
    } else {
      // First click: grade with AI
      await handleCorregir()
    }
  }

  // ── Navigation ────────────────────────────────────────────────

  function canGoTo(target: EtapaCPA): boolean {
    if (target === 'concreto') return true
    if (target === 'pictorico') return concretoValidado
    if (target === 'abstracto') return pictoricoValidado
    return false
  }

  // ── Render ────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Step indicators */}
      <div className="flex items-center gap-1 sm:gap-2">
        {ETAPAS.map((e, i) => {
          const isActive = e === etapa
          const isCompleted =
            (e === 'concreto' && concretoValidado) ||
            (e === 'pictorico' && pictoricoValidado) ||
            (e === 'abstracto' && etapa === 'completada')
          const isAccessible = canGoTo(e)

          return (
            <button
              key={e}
              type="button"
              disabled={!isAccessible}
              onClick={() => isAccessible && setEtapa(e)}
              className={`
                flex-1 py-2.5 px-2 rounded-xl text-xs sm:text-sm font-semibold transition-all text-center
                ${isActive ? 'bg-gray-900 text-white shadow-md' : ''}
                ${!isActive && isCompleted ? 'bg-green-100 text-green-700' : ''}
                ${!isActive && !isCompleted && isAccessible ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : ''}
                ${!isAccessible ? 'bg-gray-50 text-gray-300 cursor-not-allowed' : ''}
              `}
            >
              <span className="hidden sm:inline">{i + 1}. </span>
              {ETAPA_LABELS[e]}
              {isCompleted && !isActive && ' ✓'}
            </button>
          )
        })}
      </div>

      {/* Anchor banner — persists across step transitions */}
      {tareaCPA.contexto && <BandeauContexto contexto={tareaCPA.contexto} />}

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={etapa}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {etapa === 'concreto' && (
            <>
              <EtapaConcreto
                bloque={tareaCPA.concreto}
                estadoInicial={estadoManipulable}
                onValidado={handleConcretoValidado}
                onDiagnostico={handleDiagnostico}
                onChange={handleManipulableChange}
                diagnostico={diagnostico}
                transicion={tareaCPA.contexto?.transiciones.concreto}
              />
              {recapConcreto && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-center"
                >
                  <p className="text-sm font-semibold text-green-700">
                    Acabas de resolver el paso Concreto. Ahora vamos al modelo visual.
                  </p>
                </motion.div>
              )}
            </>
          )}

          {etapa === 'pictorico' && (
            <EtapaPictorico
              bloque={tareaCPA.pictorico}
              respuestas={pictoricoResp}
              onResp={handlePictoricoResp}
              validado={pictoricoValidado}
              error={pictoricoError}
              onValidar={validarPictorico}
              bridge={tareaCPA.contexto?.transiciones.bridge_pictorico}
              transicion={tareaCPA.contexto?.transiciones.pictorico}
            />
          )}

          {etapa === 'abstracto' && (
            <EtapaAbstracto
              bloque={tareaCPA.abstracto}
              respuestas={abstractoResp}
              onResp={handleAbstractoResp}
              respondidas={abstractoRespondidas}
              total={abstractoPreguntas.length}
              onSubmit={handleSubmit}
              submitting={submitting}
              corrigiendo={corrigiendo}
              retroIA={retroIA}
              errorIA={errorIA}
              bridge={tareaCPA.contexto?.transiciones.bridge_abstracto}
              transicion={tareaCPA.contexto?.transiciones.abstracto}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// ── Step: Concreto ───────────────────────────────────────────────

function EtapaConcreto({
  bloque,
  estadoInicial,
  onValidado,
  onDiagnostico,
  onChange,
  diagnostico,
  transicion,
}: {
  bloque: BloqueConcreto
  estadoInicial?: EstadoManipulable
  onValidado: (intentos: number, pistaUsada: boolean) => void
  onDiagnostico?: (diagnostico: string) => void
  onChange: (estado: EstadoManipulable) => void
  diagnostico?: string | null
  transicion?: string
}) {
  return (
    <div className="card p-5 sm:p-6">
      <StepHeader
        numero={1}
        titulo="Concreto"
        descripcion="Manipula los objetos para resolver el problema"
      />
      {transicion && <TransicionNarrativa texto={transicion} />}
      <ManipulableDispatcher
        bloque={bloque}
        estadoInicial={estadoInicial}
        onValidado={onValidado}
        onDiagnostico={onDiagnostico}
        onChange={onChange}
      />
      <AnimatePresence>
        {diagnostico && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-3 rounded-lg bg-orange-50 border border-orange-200 px-4 py-2 text-sm text-orange-800"
          >
            {diagnostico}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Visual representation dispatcher ─────────────────────────────

function RepresentacionVisual({ bloque }: { bloque: BloquePictorico }) {
  // New field: representacion (discriminated union)
  const rep = bloque.representacion ?? (bloque.modelo_barras ? { ...bloque.modelo_barras, tipo_representacion: 'modelo_barras' as const } : null)

  if (!rep) return null

  switch (rep.tipo_representacion) {
    case 'modelo_barras':
      return <ModeloBarras spec={rep} className="mb-6" />
    case 'diagrama_geometrico':
      return <DiagramaGeometrico spec={rep} className="mb-6" />
    case 'tabla':
      return <TablaPictorica spec={rep} className="mb-6" />
    default:
      return null
  }
}

// ── Step: Pictorico ──────────────────────────────────────────────

function EtapaPictorico({
  bloque,
  respuestas,
  onResp,
  validado,
  error,
  onValidar,
  bridge,
  transicion,
}: {
  bloque: BloquePictorico
  respuestas: Record<string, string | boolean>
  onResp: (idx: number, valor: string | boolean) => void
  validado: boolean
  error: boolean
  onValidar: () => void
  bridge?: string
  transicion?: string
}) {
  return (
    <div className="space-y-4">
      <div className="card p-5 sm:p-6">
        <StepHeader
          numero={2}
          titulo="Pictorico"
          descripcion="Observa la representacion visual y responde"
        />
        {bridge && <BridgeRetrospectivo texto={bridge} />}
        {transicion && <TransicionNarrativa texto={transicion} />}
        <RepresentacionVisual bloque={bloque} />
      </div>

      {bloque.preguntas.map((p, i) => (
        <PreguntaCard
          key={i}
          pregunta={p}
          indice={i}
          respuesta={respuestas[i]}
          onChange={(val) => onResp(i, val)}
          disabled={validado}
        />
      ))}

      {!validado && (
        <Boton
          variante="primario"
          size="lg"
          onClick={onValidar}
          className={`w-full ${error ? 'animate-[shake_0.3s_ease-in-out] !bg-amber-500' : ''}`}
        >
          {error ? 'Revisa tus respuestas' : 'Verificar'}
        </Boton>
      )}

      {validado && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-center"
        >
          <p className="font-bold text-green-700">Correcto!</p>
          <p className="text-sm text-green-600 mt-1">
            Acabas de completar el modelo visual. Ahora aplica lo aprendido.
          </p>
        </motion.div>
      )}
    </div>
  )
}

// ── Step: Abstracto ──────────────────────────────────────────────

function EtapaAbstracto({
  bloque,
  respuestas,
  onResp,
  respondidas,
  total,
  onSubmit,
  submitting,
  corrigiendo,
  retroIA,
  errorIA,
  bridge,
  transicion,
}: {
  bloque: BloqueAbstracto
  respuestas: Record<string, string | boolean>
  onResp: (idx: number, valor: string | boolean) => void
  respondidas: number
  total: number
  onSubmit: () => void
  submitting: boolean
  corrigiendo: boolean
  retroIA: RetroItem[] | null
  errorIA: string | null
  bridge?: string
  transicion?: string
}) {
  const yaCorregido = retroIA !== null

  return (
    <div className="space-y-4">
      <div className="card p-5 sm:p-6">
        <StepHeader
          numero={3}
          titulo="Abstracto"
          descripcion={
            yaCorregido
              ? 'Revisa tu retroalimentacion y envia'
              : `Resuelve las preguntas (${respondidas}/${total})`
          }
        />
        {bridge && <BridgeRetrospectivo texto={bridge} />}
        {transicion && <TransicionNarrativa texto={transicion} />}
      </div>

      {bloque.preguntas.map((p, i) => {
        const retro = retroIA?.find((r) => r.indice_pregunta === i)
        return (
          <div key={i}>
            <PreguntaCard
              pregunta={p}
              indice={i}
              respuesta={respuestas[i]}
              onChange={(val) => onResp(i, val)}
              disabled={yaCorregido || submitting || corrigiendo}
            />
            {retro && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mx-1 -mt-1 rounded-b-xl px-4 py-3 text-sm border-x border-b ${
                  retro.correcta
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'bg-amber-50 border-amber-200 text-amber-700'
                }`}
              >
                <span className="font-semibold">{retro.correcta ? 'Correcto' : 'Incorrecto'}:</span>{' '}
                {retro.comentario}
              </motion.div>
            )}
          </div>
        )
      })}

      {errorIA && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-700">
          {errorIA}
        </div>
      )}

      <Boton
        variante="primario"
        size="lg"
        onClick={onSubmit}
        disabled={submitting || corrigiendo || respondidas === 0}
        className="w-full"
      >
        {corrigiendo ? (
          <>
            <Spinner size="sm" />
            Corrigiendo con IA...
          </>
        ) : submitting ? (
          <>
            <Spinner size="sm" />
            Enviando...
          </>
        ) : yaCorregido ? (
          'ENVIAR RESULTADO'
        ) : (
          'ENTREGAR TAREA'
        )}
      </Boton>
    </div>
  )
}

// ── Anchor banner (persistent across steps) ─────────────────────

function BandeauContexto({ contexto }: { contexto: ContextoAnchor }) {
  return (
    <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
      <p className="text-sm text-amber-900 leading-relaxed">{contexto.narrativa}</p>
      <p className="text-sm font-semibold text-amber-800 mt-1">{contexto.pregunta_central}</p>
    </div>
  )
}

// ── Bridge retrospectif (resume ce que l'eleve a decouvert) ─────

function BridgeRetrospectivo({ texto }: { texto: string }) {
  return (
    <div className="rounded-lg bg-green-50 border border-green-200 px-3 py-2 mb-2">
      <p className="text-sm font-medium text-green-700">{texto}</p>
    </div>
  )
}

// ── Transition intro ────────────────────────────────────────────

function TransicionNarrativa({ texto }: { texto: string }) {
  return <p className="text-sm text-gray-600 italic leading-relaxed mb-3">{texto}</p>
}

// ── Shared: Step header ──────────────────────────────────────────

function StepHeader({
  numero,
  titulo,
  descripcion,
}: {
  numero: number
  titulo: string
  descripcion: string
}) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-1">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-900 text-white text-xs font-bold">
          {numero}
        </span>
        <h2 className="text-lg font-bold text-gray-900">{titulo}</h2>
      </div>
      <p className="text-sm text-gray-500 ml-8">{descripcion}</p>
    </div>
  )
}

// ── Shared: Question card ────────────────────────────────────────

function PreguntaCard({
  pregunta,
  indice,
  respuesta,
  onChange,
  disabled,
}: {
  pregunta: PreguntaPictorico | PreguntaAbstracto
  indice: number
  respuesta: string | boolean | undefined
  onChange: (val: string | boolean) => void
  disabled: boolean
}) {
  const { tipo, pregunta: enunciado, opciones } = pregunta

  return (
    <div className="card p-5">
      <p className="text-sm font-medium text-gray-800 mb-3">{enunciado}</p>

      {tipo === 'opcion_multiple' && opciones && (
        <div className="space-y-2">
          {opciones.map((op) => (
            <label
              key={op}
              className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                respuesta === op.charAt(0)
                  ? 'border-amarillo bg-yellow-50'
                  : 'border-gray-200 hover:border-gray-300'
              } ${disabled ? 'pointer-events-none opacity-70' : ''}`}
            >
              <input
                type="radio"
                name={`picabs-${indice}`}
                value={op.charAt(0)}
                checked={respuesta === op.charAt(0)}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="accent-yellow-400 w-4 h-4"
              />
              <span className="text-sm text-gray-700">{op}</span>
            </label>
          ))}
        </div>
      )}

      {tipo === 'verdadero_falso' && (
        <div className="flex gap-3">
          {['Verdadero', 'Falso'].map((op) => (
            <button
              key={op}
              type="button"
              disabled={disabled}
              onClick={() => onChange(op === 'Verdadero' ? 'true' : 'false')}
              className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                String(respuesta) === (op === 'Verdadero' ? 'true' : 'false')
                  ? 'border-amarillo bg-yellow-50 text-gray-900'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              } ${disabled ? 'pointer-events-none opacity-70' : ''}`}
            >
              {op}
            </button>
          ))}
        </div>
      )}

      {tipo === 'espacios' && (
        <input
          type="text"
          value={String(respuesta ?? '')}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="Tu respuesta"
          className="input-base"
        />
      )}

      {(tipo === 'calculo' || tipo === 'abierta') && (
        <textarea
          value={String(respuesta ?? '')}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={
            tipo === 'calculo'
              ? 'Escribe tu procedimiento y resultado...'
              : 'Escribe tu respuesta...'
          }
          rows={3}
          className="input-base resize-none"
        />
      )}
    </div>
  )
}
