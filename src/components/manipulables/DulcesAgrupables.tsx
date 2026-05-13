'use client'

import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { DulcesAgrupablesSpec } from '@/types/tarea-cpa'

// ── Types ────────────────────────────────────────────────────────

interface Props {
  spec: DulcesAgrupablesSpec
  intentos_para_pista: number
  /** Restore state from localStorage progress */
  estadoInicial?: EstadoManipulable
  onValidado: (intentos: number, pistaUsada: boolean) => void
  onChange?: (estado: EstadoManipulable) => void
}

export interface EstadoManipulable {
  grupos: Record<string, string[]> // groupId -> dulceIds
  sinAsignar: string[]
  intentos: number
  pistaVisible: boolean
  validado: boolean
}

// ── Candy SVG ────────────────────────────────────────────────────

const CANDY_COLORS = [
  '#EF4444',
  '#F59E0B',
  '#10B981',
  '#3B82F6',
  '#8B5CF6',
  '#EC4899',
  '#F97316',
  '#14B8A6',
  '#6366F1',
  '#D946EF',
  '#06B6D4',
  '#84CC16',
]

function CandySVG({ color, size = 36 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36">
      <circle cx="18" cy="18" r="14" fill={color} opacity="0.9" />
      <circle cx="18" cy="18" r="10" fill={color} />
      <ellipse cx="14" cy="14" rx="4" ry="3" fill="white" opacity="0.3" />
    </svg>
  )
}

// ── Draggable candy ──────────────────────────────────────────────

function DraggableDulce({
  id,
  color,
  isDragging,
}: {
  id: string
  color: string
  isDragging: boolean
}) {
  return (
    <motion.div
      layoutId={id}
      data-dulce-id={id}
      className="touch-none cursor-grab active:cursor-grabbing"
      style={{ opacity: isDragging ? 0.3 : 1 }}
      whileTap={{ scale: 1.1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <CandySVG color={color} />
    </motion.div>
  )
}

// ── Droppable group zone ─────────────────────────────────────────

function GrupoZone({
  id,
  dulces,
  dulceColors,
  activeDulceId,
  isOver,
}: {
  id: string
  dulces: string[]
  dulceColors: Record<string, string>
  activeDulceId: string | null
  isOver: boolean
}) {
  return (
    <div
      data-grupo-id={id}
      className={`
        min-h-[72px] rounded-2xl border-2 border-dashed p-3 transition-colors
        flex flex-wrap gap-2 items-center justify-center
        ${isOver ? 'border-yellow-400 bg-yellow-50' : 'border-gray-300 bg-white'}
      `}
    >
      {dulces.length === 0 && !isOver && (
        <span className="text-xs text-gray-300">Arrastra aqui</span>
      )}
      <AnimatePresence>
        {dulces.map((dId) => (
          <DraggableDulce
            key={dId}
            id={dId}
            color={dulceColors[dId]}
            isDragging={activeDulceId === dId}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

// ── Main component ───────────────────────────────────────────────

export default function DulcesAgrupables({
  spec,
  intentos_para_pista,
  estadoInicial,
  onValidado,
  onChange,
}: Props) {
  // Build stable candy IDs and colors
  const dulceIds = useMemo(
    () => Array.from({ length: spec.cantidad }, (_, i) => `d${i}`),
    [spec.cantidad],
  )
  const dulceColors = useMemo(() => {
    const map: Record<string, string> = {}
    for (let i = 0; i < dulceIds.length; i++) {
      map[dulceIds[i]] = CANDY_COLORS[i % CANDY_COLORS.length]
    }
    return map
  }, [dulceIds])

  // State
  const [grupos, setGrupos] = useState<Record<string, string[]>>(estadoInicial?.grupos ?? {})
  const [sinAsignar, setSinAsignar] = useState<string[]>(estadoInicial?.sinAsignar ?? [...dulceIds])
  const [intentos, setIntentos] = useState(estadoInicial?.intentos ?? 0)
  const [pistaVisible, setPistaVisible] = useState(estadoInicial?.pistaVisible ?? false)
  const [validado, setValidado] = useState(estadoInicial?.validado ?? false)
  const [errorFlash, setErrorFlash] = useState(false)
  const [activeDulceId, setActiveDulceId] = useState<string | null>(null)
  const [overGroupId, setOverGroupId] = useState<string | null>(null)

  // Notify parent of state changes for persistence
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange
  useEffect(() => {
    onChangeRef.current?.({ grupos, sinAsignar, intentos, pistaVisible, validado })
  }, [grupos, sinAsignar, intentos, pistaVisible, validado])

  // Sensors for pointer + touch
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 5 },
  })
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 150, tolerance: 5 },
  })
  const sensors = useSensors(pointerSensor, touchSensor)

  // ── Group management ──────────────────────────────────────────

  function agregarGrupo() {
    const id = `g${Date.now()}`
    setGrupos((prev) => ({ ...prev, [id]: [] }))
  }

  function eliminarGrupo(grupoId: string) {
    setGrupos((prev) => {
      const { [grupoId]: removed, ...rest } = prev
      setSinAsignar((sa) => [...sa, ...(removed ?? [])])
      return rest
    })
  }

  // ── Drag handlers ─────────────────────────────────────────────

  function handleDragStart(event: DragStartEvent) {
    setActiveDulceId(String(event.active.id))
  }

  function handleDragOver(event: { over: { id: string | number } | null }) {
    setOverGroupId(event.over ? String(event.over.id) : null)
  }

  function handleDragEnd(event: DragEndEvent) {
    const dulceId = String(event.active.id)
    const overId = event.over ? String(event.over.id) : null
    setActiveDulceId(null)
    setOverGroupId(null)

    if (!overId) return

    // Target is "pool" (unassigned area)
    if (overId === 'pool') {
      // Remove from current group
      setGrupos((prev) => {
        const next = { ...prev }
        for (const gId in next) {
          next[gId] = next[gId].filter((d) => d !== dulceId)
        }
        return next
      })
      setSinAsignar((prev) => (prev.includes(dulceId) ? prev : [...prev, dulceId]))
      return
    }

    // Target is a group
    if (overId.startsWith('g')) {
      // Remove from sinAsignar
      setSinAsignar((prev) => prev.filter((d) => d !== dulceId))
      // Remove from any other group
      setGrupos((prev) => {
        const next = { ...prev }
        for (const gId in next) {
          next[gId] = next[gId].filter((d) => d !== dulceId)
        }
        // Add to target group
        if (next[overId]) {
          next[overId] = [...next[overId], dulceId]
        }
        return next
      })
    }
  }

  // ── Validation ────────────────────────────────────────────────

  const verificar = useCallback(() => {
    if (validado) return

    const gruposActivos = Object.values(grupos).filter((g) => g.length > 0)
    const numGrupos = gruposActivos.length
    const tamanos = gruposActivos.map((g) => g.length)

    const esValido = spec.soluciones_validas.some(
      (sol) =>
        numGrupos === sol.grupos &&
        tamanos.every((t) => t === sol.por_grupo) &&
        sinAsignar.length === 0,
    )

    const nuevoIntentos = intentos + 1
    setIntentos(nuevoIntentos)

    if (esValido) {
      setValidado(true)
      onValidado(nuevoIntentos, pistaVisible)
    } else {
      setErrorFlash(true)
      setTimeout(() => setErrorFlash(false), 600)
      if (nuevoIntentos >= intentos_para_pista && spec.pista) {
        setPistaVisible(true)
      }
    }
  }, [
    validado,
    grupos,
    sinAsignar,
    spec.soluciones_validas,
    spec.pista,
    intentos,
    intentos_para_pista,
    pistaVisible,
    onValidado,
  ])

  // ── Render ────────────────────────────────────────────────────

  const grupoIds = Object.keys(grupos)

  return (
    <div className="space-y-4">
      {/* Question */}
      <p className="text-sm font-medium text-gray-800">{spec.pregunta}</p>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {/* Unassigned pool */}
        <DroppableZone id="pool" isOver={overGroupId === 'pool'}>
          <div className="flex flex-wrap gap-2 justify-center min-h-[48px] items-center">
            {sinAsignar.length === 0 && (
              <span className="text-xs text-gray-300">Todos asignados</span>
            )}
            {sinAsignar.map((dId) => (
              <DraggableWrapper key={dId} id={dId}>
                <DraggableDulce
                  id={dId}
                  color={dulceColors[dId]}
                  isDragging={activeDulceId === dId}
                />
              </DraggableWrapper>
            ))}
          </div>
        </DroppableZone>

        {/* Groups */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {grupoIds.map((gId, idx) => (
            <div key={gId} className="relative">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1 block">
                Grupo {idx + 1}
                {!validado && grupos[gId].length === 0 && (
                  <button
                    type="button"
                    onClick={() => eliminarGrupo(gId)}
                    className="ml-2 text-red-300 hover:text-red-500"
                  >
                    x
                  </button>
                )}
              </span>
              <DroppableZone id={gId} isOver={overGroupId === gId}>
                <GrupoZone
                  id={gId}
                  dulces={grupos[gId]}
                  dulceColors={dulceColors}
                  activeDulceId={activeDulceId}
                  isOver={overGroupId === gId}
                />
              </DroppableZone>
            </div>
          ))}
        </div>

        {/* Drag overlay */}
        <DragOverlay>
          {activeDulceId && <CandySVG color={dulceColors[activeDulceId]} size={40} />}
        </DragOverlay>
      </DndContext>

      {/* Add group button */}
      {!validado && (
        <button
          type="button"
          onClick={agregarGrupo}
          className="w-full py-2.5 rounded-xl border-2 border-dashed border-gray-300 text-sm text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors"
        >
          + Agregar grupo
        </button>
      )}

      {/* Hint */}
      <AnimatePresence>
        {pistaVisible && spec.pista && !validado && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-700"
          >
            <span className="font-semibold">Pista:</span> {spec.pista}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Validate button */}
      {!validado && (
        <button
          type="button"
          onClick={verificar}
          disabled={sinAsignar.length > 0}
          className={`
            w-full py-3 rounded-xl text-sm font-semibold transition-all
            ${
              sinAsignar.length > 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : errorFlash
                  ? 'bg-red-500 text-white animate-[shake_0.3s_ease-in-out]'
                  : 'bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.98]'
            }
          `}
        >
          {sinAsignar.length > 0
            ? `Asigna todos los dulces (${sinAsignar.length} restantes)`
            : 'Verificar'}
        </button>
      )}

      {/* Success */}
      <AnimatePresence>
        {validado && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl bg-green-50 border border-green-200 px-4 py-4 text-center"
          >
            <p className="text-lg font-bold text-green-700">Correcto!</p>
            <p className="text-sm text-green-600 mt-1">
              Lo lograste en {intentos} intento{intentos > 1 ? 's' : ''}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── dnd-kit wrappers ─────────────────────────────────────────────

import { useDraggable, useDroppable } from '@dnd-kit/core'

function DraggableWrapper({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  })
  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </div>
  )
}

function DroppableZone({
  id,
  isOver,
  children,
}: {
  id: string
  isOver: boolean
  children: React.ReactNode
}) {
  const { setNodeRef } = useDroppable({ id })
  return (
    <div
      ref={setNodeRef}
      className={`rounded-2xl border-2 border-dashed p-3 transition-colors ${
        isOver ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 bg-gray-50'
      }`}
    >
      {children}
    </div>
  )
}
