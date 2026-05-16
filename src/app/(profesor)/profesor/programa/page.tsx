'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { BookOpen, ChevronDown, FileText, Presentation } from 'lucide-react'
import { getAllSecuencias, getSecuenciaById } from '@/content/biblioteca/matematicas-1'
import { getTareasReferencia } from '@/data/tareas-referencia'
import { useTareasProfesor } from '@/hooks/useTareas.js'
import { BLOQUES_NEM } from '@/lib/bloques-nem'
import useAuthStore from '@/store/useAuthStore.js'
import VisorContenido from '@/components/profesor/biblioteca/VisorContenido'

const secuencias = getAllSecuencias()

type Trimestre = 1 | 2 | 3

const TRIMESTRES: { id: Trimestre; label: string; secuencias: number[] }[] = [
  { id: 1, label: 'Trimestre 1', secuencias: Array.from({ length: 12 }, (_, i) => i + 1) },
  { id: 2, label: 'Trimestre 2', secuencias: Array.from({ length: 12 }, (_, i) => i + 13) },
  { id: 3, label: 'Trimestre 3', secuencias: Array.from({ length: 12 }, (_, i) => i + 25) },
]

// Soft color per bloque for the number badge
const BLOQUE_COLORS: Record<number, string> = {
  1: 'bg-amber-100 text-amber-700',
  2: 'bg-violet-100 text-violet-700',
  3: 'bg-emerald-100 text-emerald-700',
  4: 'bg-sky-100 text-sky-700',
  5: 'bg-rose-100 text-rose-700',
  6: 'bg-orange-100 text-orange-700',
  7: 'bg-teal-100 text-teal-700',
}

export default function ProgramaPage() {
  const { profesor } = useAuthStore()
  const { data: tareasData } = useTareasProfesor(profesor?.id)
  const tareasDB = tareasData?.tareas ?? []
  const [trimestre, setTrimestre] = useState<Trimestre | null>(null) // auto-detect
  const [openBloques, setOpenBloques] = useState<Set<number>>(new Set())
  const [recurso, setRecurso] = useState<{ secNum: number; tipo: 'libro' | 'guia' | 'diapositivas' } | null>(null)
  const currentRef = useRef<HTMLAnchorElement>(null)
  const didScroll = useRef(false)

  const statusMap = useMemo(() => {
    const map: Record<number, 'completada' | 'en_curso' | 'sin_asignar'> = {}
    for (let i = 1; i <= 36; i++) map[i] = 'sin_asignar'
    for (const t of tareasDB) {
      const sec = t.secuencia_ref
      if (!sec) continue
      if (t.estado === 'completada') {
        map[sec] = 'completada'
      } else if (t.estado === 'en_curso' && map[sec] !== 'completada') {
        map[sec] = 'en_curso'
      }
    }
    return map
  }, [tareasDB])

  // Find the "current" sequence: first en_curso, or first sin_asignar after the last completed
  const currentSecNum = useMemo(() => {
    // First en_curso
    for (let i = 1; i <= 36; i++) {
      if (statusMap[i] === 'en_curso') return i
    }
    // First sin_asignar after last completed
    let lastCompleted = 0
    for (let i = 1; i <= 36; i++) {
      if (statusMap[i] === 'completada') lastCompleted = i
    }
    for (let i = lastCompleted + 1; i <= 36; i++) {
      if (statusMap[i] === 'sin_asignar') return i
    }
    return 1
  }, [statusMap])

  // Auto-detect trimestre based on current sequence
  useEffect(() => {
    if (trimestre !== null) return
    const t = TRIMESTRES.find((tr) => tr.secuencias.includes(currentSecNum))
    if (t) setTrimestre(t.id)
  }, [currentSecNum, trimestre])

  // Auto-open the bloque containing the current sequence
  useEffect(() => {
    const bloque = BLOQUES_NEM.find((b) => b.secuencias.includes(currentSecNum))
    if (bloque) setOpenBloques(new Set([bloque.id]))
  }, [currentSecNum])

  // Auto-scroll to current card once
  useEffect(() => {
    if (!didScroll.current && currentRef.current) {
      setTimeout(() => {
        currentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 300)
      didScroll.current = true
    }
  })

  // Filter bloques by trimestre
  const activeTrimestre = TRIMESTRES.find((t) => t.id === trimestre) ?? TRIMESTRES[0]
  const visibleBloques = BLOQUES_NEM.filter((b) =>
    b.secuencias.some((s) => activeTrimestre.secuencias.includes(s)),
  )

  function toggleBloque(id: number) {
    setOpenBloques((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // Progress stats
  const totalAssigned = Object.values(statusMap).filter((s) => s !== 'sin_asignar').length

  // Recurso modal data
  const recursoSec = recurso ? getSecuenciaById(recurso.secNum) : null

  return (
    <div className="px-4 sm:px-6 md:px-8 py-10 animate-fade-in">
      {/* Header card */}
      <div className="card px-6 py-5 mb-6">
        <div className="flex items-baseline justify-between gap-4 flex-wrap mb-5">
          <div>
            <h1 className="text-3xl font-bold text-tinta tracking-tight">Programa</h1>
            <p className="text-sm text-tinta-400 mt-1">
              36 secuencias del programa NEM &mdash; Matematicas 1° Secundaria
            </p>
          </div>
          <span className="text-sm text-tinta-400 font-medium">
            {totalAssigned}/36 asignadas
          </span>
        </div>

        {/* Trimestre tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-crema-100 p-1 rounded-full">
            {TRIMESTRES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTrimestre(t.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  trimestre === t.id
                    ? 'bg-tinta text-tinta-50 shadow-sm'
                    : 'text-tinta-600 hover:bg-crema-50'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Bloques — accordion */}
      <div className="space-y-4">
        {visibleBloques.map((bloque) => {
          const isOpen = openBloques.has(bloque.id)
          // Only show secuencias that belong to current trimestre
          const bloqueSecuencias = bloque.secuencias.filter((s) =>
            activeTrimestre.secuencias.includes(s),
          )
          const assigned = bloqueSecuencias.filter(
            (s) => statusMap[s] === 'en_curso' || statusMap[s] === 'completada',
          ).length

          return (
            <section key={bloque.id} className="card overflow-hidden">
              {/* Bloque header — clickable */}
              <button
                onClick={() => toggleBloque(bloque.id)}
                className="w-full flex flex-col gap-2 px-5 py-4 hover:bg-crema-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3 w-full">
                  <span className="text-xl">{bloque.emoji}</span>
                  <h2 className="text-base font-semibold text-tinta">
                    Bloque {bloque.id} &middot; {bloque.titulo}
                  </h2>
                  <span className="text-xs text-tinta-400 bg-crema-200 px-2.5 py-0.5 rounded-full shrink-0">
                    {bloqueSecuencias.length} sec.
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-tinta-400 transition-transform duration-200 shrink-0 ml-auto ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </div>
                {/* Progress bar */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-crema-200 rounded-full overflow-hidden max-w-48">
                    <div
                      className="h-full bg-amarillo rounded-full transition-all duration-500"
                      style={{
                        width: `${bloqueSecuencias.length > 0 ? (assigned / bloqueSecuencias.length) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs text-tinta-400">
                    {assigned}/{bloqueSecuencias.length}
                  </span>
                </div>
              </button>

              {/* Expandable content */}
              {isOpen && (
                <div className="px-5 pb-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {bloqueSecuencias.map((secNum) => {
                      const sec = secuencias.find((s: any) => s.secuencia === secNum)
                      const numTareas = getTareasReferencia(secNum).length
                      const status = statusMap[secNum] ?? 'sin_asignar'
                      const colorClass =
                        BLOQUE_COLORS[bloque.id] ?? 'bg-crema-200 text-tinta-600'
                      const isCurrent = secNum === currentSecNum

                      return (
                        <Link
                          key={secNum}
                          ref={isCurrent ? currentRef : undefined}
                          href={`/profesor/programa/${secNum}`}
                          className={`group bg-crema-50 rounded-xl p-4 transition-all flex items-start gap-3 ${
                            isCurrent
                              ? 'ring-2 ring-amarillo shadow-md'
                              : 'hover:bg-crema-100 hover:shadow-sm'
                          }`}
                        >
                          {/* Number badge */}
                          <div
                            className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-base font-bold ${colorClass}`}
                          >
                            {secNum}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-1">
                              <h3 className="text-sm font-semibold text-tinta leading-snug line-clamp-2 group-hover:text-tinta-600 transition-colors">
                                {sec?.titulo ?? `Secuencia ${secNum}`}
                              </h3>
                            </div>

                            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                              <span className="text-xs text-tinta-400">
                                Sem. {secNum}
                              </span>
                              {numTareas > 0 && (
                                <span className="inline-flex items-center gap-1 text-xs text-tinta-400">
                                  &middot; {numTareas} tarea{numTareas !== 1 ? 's' : ''}
                                </span>
                              )}

                              {status === 'completada' && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-medium">
                                  Completada
                                </span>
                              )}
                              {status === 'en_curso' && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-amarillo/20 text-amber-700 text-[10px] font-medium">
                                  En curso
                                </span>
                              )}
                              {isCurrent && status === 'sin_asignar' && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-amarillo/30 text-amber-800 text-[10px] font-medium">
                                  Siguiente
                                </span>
                              )}
                            </div>

                            {/* Quick resource icons */}
                            <div className="flex items-center gap-1 mt-2">
                              <button
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  setRecurso({ secNum, tipo: 'libro' })
                                }}
                                className="p-1.5 rounded-lg text-tinta-400 hover:text-tinta hover:bg-crema-100 transition-colors"
                                title="Libro alumno"
                              >
                                <BookOpen className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  setRecurso({ secNum, tipo: 'guia' })
                                }}
                                className="p-1.5 rounded-lg text-tinta-400 hover:text-tinta hover:bg-crema-100 transition-colors"
                                title="Guia profe"
                              >
                                <FileText className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  setRecurso({ secNum, tipo: 'diapositivas' })
                                }}
                                className="p-1.5 rounded-lg text-tinta-400 hover:text-tinta hover:bg-crema-100 transition-colors"
                                title="Diapositivas"
                              >
                                <Presentation className="w-3.5 h-3.5" />
                              </button>
                            </div>

                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}
            </section>
          )
        })}
      </div>

      {/* Recurso modal */}
      {recurso !== null && recursoSec && (
        <VisorContenido
          semana={recursoSec}
          tipo={recurso.tipo === 'guia' ? 'orientacion' : recurso.tipo === 'diapositivas' ? 'diapositiva' : recurso.tipo}
          contenido={
            recurso.tipo === 'libro'
              ? recursoSec.libro
              : recurso.tipo === 'guia'
                ? recursoSec.orientacion
                : recursoSec.diapositiva
          }
          onCerrar={() => setRecurso(null)}
        />
      )}
    </div>
  )
}
