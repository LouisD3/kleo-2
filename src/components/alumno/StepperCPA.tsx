'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { EstadoManipulable } from '@/components/manipulables/DulcesAgrupables'
import ManipulableDispatcher from '@/components/manipulables/ManipulableDispatcher'
import ModeloBarras from '@/components/pictorico/ModeloBarras'
import Boton from '@/components/ui/Boton'
import Spinner from '@/components/ui/Spinner'
import type {
  BloqueAbstracto,
  BloqueConcreto,
  BloquePictorico,
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

export interface DatosIntento {
  concreto: { intentos: number; pista_usada: boolean }
  pictorico: { respuestas: Record<string, string | boolean> }
  abstracto: { respuestas: Record<string, string | boolean> }
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

  function handleConcretoValidado(intentos: number, pistaUsada: boolean) {
    setConcretoIntentos(intentos)
    setConcretoPista(pistaUsada)
    setConcretoValidado(true)
    setTimeout(() => setEtapa('pictorico'), 1500)
  }

  function handleManipulableChange(estado: EstadoManipulable) {
    setEstadoManipulable(estado)
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
      if (resp === undefined || resp === null || String(resp).trim() === '') {
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
      setTimeout(() => setEtapa('abstracto'), 1000)
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

  async function handleSubmit() {
    // Flush timing for current step
    const elapsed = Date.now() - etapaStartRef.current
    tiempoRef.current.abstracto += elapsed
    etapaStartRef.current = Date.now()

    await onSubmit({
      concreto: { intentos: concretoIntentos, pista_usada: concretoPista },
      pictorico: { respuestas: pictoricoResp },
      abstracto: { respuestas: abstractoResp },
      tiempos: {
        concreto_ms: tiempoRef.current.concreto,
        pictorico_ms: tiempoRef.current.pictorico,
        abstracto_ms: tiempoRef.current.abstracto,
      },
    })
    clearProgreso(tareaId, alumnoId)
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
            <EtapaConcreto
              bloque={tareaCPA.concreto}
              estadoInicial={estadoManipulable}
              onValidado={handleConcretoValidado}
              onChange={handleManipulableChange}
            />
          )}

          {etapa === 'pictorico' && (
            <EtapaPictorico
              bloque={tareaCPA.pictorico}
              respuestas={pictoricoResp}
              onResp={handlePictoricoResp}
              validado={pictoricoValidado}
              error={pictoricoError}
              onValidar={validarPictorico}
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
  onChange,
}: {
  bloque: BloqueConcreto
  estadoInicial?: EstadoManipulable
  onValidado: (intentos: number, pistaUsada: boolean) => void
  onChange: (estado: EstadoManipulable) => void
}) {
  return (
    <div className="card p-5 sm:p-6">
      <StepHeader
        numero={1}
        titulo="Concreto"
        descripcion="Manipula los objetos para resolver el problema"
      />
      <ManipulableDispatcher
        bloque={bloque}
        estadoInicial={estadoInicial}
        onValidado={onValidado}
        onChange={onChange}
      />
    </div>
  )
}

// ── Step: Pictorico ──────────────────────────────────────────────

function EtapaPictorico({
  bloque,
  respuestas,
  onResp,
  validado,
  error,
  onValidar,
}: {
  bloque: BloquePictorico
  respuestas: Record<string, string | boolean>
  onResp: (idx: number, valor: string | boolean) => void
  validado: boolean
  error: boolean
  onValidar: () => void
}) {
  return (
    <div className="space-y-4">
      <div className="card p-5 sm:p-6">
        <StepHeader
          numero={2}
          titulo="Pictorico"
          descripcion="Observa el modelo de barras y responde"
        />
        <ModeloBarras spec={bloque.modelo_barras} className="mb-6" />
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
          className={`w-full ${error ? 'animate-[shake_0.3s_ease-in-out] !bg-red-500' : ''}`}
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
}: {
  bloque: BloqueAbstracto
  respuestas: Record<string, string | boolean>
  onResp: (idx: number, valor: string | boolean) => void
  respondidas: number
  total: number
  onSubmit: () => void
  submitting: boolean
}) {
  return (
    <div className="space-y-4">
      <div className="card p-5 sm:p-6">
        <StepHeader
          numero={3}
          titulo="Abstracto"
          descripcion={`Resuelve las preguntas (${respondidas}/${total})`}
        />
      </div>

      {bloque.preguntas.map((p, i) => (
        <PreguntaCard
          key={i}
          pregunta={p}
          indice={i}
          respuesta={respuestas[i]}
          onChange={(val) => onResp(i, val)}
          disabled={submitting}
        />
      ))}

      <Boton
        variante="primario"
        size="lg"
        onClick={onSubmit}
        disabled={submitting || respondidas === 0}
        className="w-full"
      >
        {submitting ? (
          <>
            <Spinner size="sm" />
            Enviando...
          </>
        ) : (
          'ENTREGAR TAREA'
        )}
      </Boton>
    </div>
  )
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
