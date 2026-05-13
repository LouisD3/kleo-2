'use client'

import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
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
  grupos: Record<string, string[]> // groupId -> itemIds
  sinAsignar: string[]
  intentos: number
  pistaVisible: boolean
  validado: boolean
}

// ── Fallback candy SVG (used when no emoji is provided) ──────────

const ITEM_COLORS = [
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

function FallbackSVG({ color, size = 36 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36">
      <circle cx="18" cy="18" r="14" fill={color} opacity="0.9" />
      <circle cx="18" cy="18" r="10" fill={color} />
      <ellipse cx="14" cy="14" rx="4" ry="3" fill="white" opacity="0.3" />
    </svg>
  )
}

// ── Emoji item ──────────────────────────────────────────────────

function EmojiItem({ emoji, size = 36 }: { emoji: string; size?: number }) {
  return (
    <span className="select-none leading-none" style={{ fontSize: size * 0.75 }} role="img">
      {emoji}
    </span>
  )
}

// ── Renderable item (emoji or fallback SVG) ─────────────────────

function ItemVisual({ emoji, color, size }: { emoji?: string; color: string; size?: number }) {
  if (emoji) return <EmojiItem emoji={emoji} size={size} />
  return <FallbackSVG color={color} size={size} />
}

// ── Draggable item ──────────────────────────────────────────────

function DraggableItem({
  id,
  emoji,
  color,
  isDragging,
}: {
  id: string
  emoji?: string
  color: string
  isDragging: boolean
}) {
  return (
    <motion.div
      layoutId={id}
      data-item-id={id}
      className="touch-none cursor-grab active:cursor-grabbing"
      style={{ opacity: isDragging ? 0.3 : 1 }}
      whileTap={{ scale: 1.1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <ItemVisual emoji={emoji} color={color} />
    </motion.div>
  )
}

// ── Droppable group zone ─────────────────────────────────────────

function GrupoZone({
  id,
  items,
  itemColors,
  emoji,
  activeItemId,
  isOver,
}: {
  id: string
  items: string[]
  itemColors: Record<string, string>
  emoji?: string
  activeItemId: string | null
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
      {items.length === 0 && !isOver && (
        <span className="text-xs text-gray-300">Arrastra aqui</span>
      )}
      <AnimatePresence>
        {items.map((dId) => (
          <DraggableItem
            key={dId}
            id={dId}
            emoji={emoji}
            color={itemColors[dId]}
            isDragging={activeItemId === dId}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

// ── Main component ───────────────────────────────────────────────

export default function ManipulableAgrupable({
  spec,
  intentos_para_pista,
  estadoInicial,
  onValidado,
  onChange,
}: Props) {
  const itemEmoji = spec.emoji
  const grupoLabel = spec.etiqueta_grupo ?? 'Grupo'
  const grupoEmoji = spec.emoji_grupo

  // Build stable item IDs and colors
  const itemIds = useMemo(
    () => Array.from({ length: spec.cantidad }, (_, i) => `d${i}`),
    [spec.cantidad],
  )
  const itemColors = useMemo(() => {
    const map: Record<string, string> = {}
    for (let i = 0; i < itemIds.length; i++) {
      map[itemIds[i]] = ITEM_COLORS[i % ITEM_COLORS.length]
    }
    return map
  }, [itemIds])

  // State
  const [grupos, setGrupos] = useState<Record<string, string[]>>(estadoInicial?.grupos ?? {})
  const [sinAsignar, setSinAsignar] = useState<string[]>(estadoInicial?.sinAsignar ?? [...itemIds])
  const [intentos, setIntentos] = useState(estadoInicial?.intentos ?? 0)
  const [pistaVisible, setPistaVisible] = useState(estadoInicial?.pistaVisible ?? false)
  const [validado, setValidado] = useState(estadoInicial?.validado ?? false)
  const [errorFlash, setErrorFlash] = useState(false)
  const [activeItemId, setActiveItemId] = useState<string | null>(null)
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
    setActiveItemId(String(event.active.id))
  }

  function handleDragOver(event: { over: { id: string | number } | null }) {
    setOverGroupId(event.over ? String(event.over.id) : null)
  }

  function handleDragEnd(event: DragEndEvent) {
    const itemId = String(event.active.id)
    const overId = event.over ? String(event.over.id) : null
    setActiveItemId(null)
    setOverGroupId(null)

    if (!overId) return

    // Target is "pool" (unassigned area)
    if (overId === 'pool') {
      setGrupos((prev) => {
        const next = { ...prev }
        for (const gId in next) {
          next[gId] = next[gId].filter((d) => d !== itemId)
        }
        return next
      })
      setSinAsignar((prev) => (prev.includes(itemId) ? prev : [...prev, itemId]))
      return
    }

    // Target is a group
    if (overId.startsWith('g')) {
      setSinAsignar((prev) => prev.filter((d) => d !== itemId))
      setGrupos((prev) => {
        const next = { ...prev }
        for (const gId in next) {
          next[gId] = next[gId].filter((d) => d !== itemId)
        }
        if (next[overId]) {
          next[overId] = [...next[overId], itemId]
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
  const itemLabel = spec.etiqueta ?? 'dulce'

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
                <DraggableItem
                  id={dId}
                  emoji={itemEmoji}
                  color={itemColors[dId]}
                  isDragging={activeItemId === dId}
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
                {grupoEmoji ? `${grupoEmoji} ` : ''}
                {grupoLabel} {idx + 1}
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
                  items={grupos[gId]}
                  itemColors={itemColors}
                  emoji={itemEmoji}
                  activeItemId={activeItemId}
                  isOver={overGroupId === gId}
                />
              </DroppableZone>
            </div>
          ))}
        </div>

        {/* Drag overlay */}
        <DragOverlay>
          {activeItemId && (
            <ItemVisual emoji={itemEmoji} color={itemColors[activeItemId]} size={40} />
          )}
        </DragOverlay>
      </DndContext>

      {/* Add group button */}
      {!validado && (
        <button
          type="button"
          onClick={agregarGrupo}
          className="w-full py-2.5 rounded-xl border-2 border-dashed border-gray-300 text-sm text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors"
        >
          + Agregar {grupoLabel.toLowerCase()}
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
            ? `Asigna todos los ${itemLabel}s (${sinAsignar.length} restantes)`
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
