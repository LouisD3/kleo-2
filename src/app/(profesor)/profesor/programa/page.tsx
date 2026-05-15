'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { BookOpen, ChevronRight } from 'lucide-react'
import { getAllSecuencias } from '@/content/biblioteca/matematicas-1'
import { getTareasReferencia } from '@/data/tareas-referencia'
import { useTareasProfesor } from '@/hooks/useTareas.js'
import { BLOQUES_NEM } from '@/lib/bloques-nem'
import { supabase } from '@/lib/supabase.js'
import useAuthStore from '@/store/useAuthStore.js'

const secuencias = getAllSecuencias()

type Vista = 'programa' | 'clases'

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
  const [vista, setVista] = useState<Vista>('programa')
  const [clases, setClases] = useState<{ id: string; nombre: string; emoji?: string }[]>([])

  useEffect(() => {
    if (!profesor) return
    ;(supabase as any)
      .from('clases')
      .select('id, nombre')
      .eq('profesor_id', profesor.id)
      .order('created_at', { ascending: false })
      .then(({ data }: { data: any[] | null }) => setClases(data ?? []))
  }, [profesor])

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

  const clasePorSecuencia = useMemo(() => {
    const map: Record<number, string[]> = {}
    if (vista !== 'clases') return map
    for (const clase of clases) {
      const claseTareas = tareasDB.filter((t: any) => t.clase_id === clase.id)
      let latestSec = 0
      for (const t of claseTareas) {
        if (!t.secuencia_ref) continue
        if (t.estado === 'en_curso' || t.estado === 'completada') {
          latestSec = Math.max(latestSec, t.secuencia_ref)
        }
      }
      if (latestSec > 0) {
        if (!map[latestSec]) map[latestSec] = []
        map[latestSec].push(clase.id)
      }
    }
    return map
  }, [vista, clases, tareasDB])

  return (
    <div className="px-4 sm:px-6 md:px-8 py-10 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-tinta tracking-tight">Programa</h1>
        <p className="text-sm text-tinta-400 mt-1">
          36 secuencias del programa NEM &mdash; Matematicas 1° Secundaria
        </p>
      </div>

      {/* Vista toggle — pill tabs */}
      {clases.length > 1 && (
        <div className="flex items-center gap-1 bg-crema-200 p-1 rounded-full w-fit mb-8">
          <button
            onClick={() => setVista('programa')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
              vista === 'programa'
                ? 'bg-tinta text-tinta-50 shadow-sm'
                : 'text-tinta-600 hover:bg-white'
            }`}
          >
            Vista del programa
          </button>
          <button
            onClick={() => setVista('clases')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
              vista === 'clases'
                ? 'bg-tinta text-tinta-50 shadow-sm'
                : 'text-tinta-600 hover:bg-white'
            }`}
          >
            Vista por mis clases
          </button>
        </div>
      )}

      {/* Bloques */}
      <div className="space-y-10">
        {BLOQUES_NEM.map((bloque) => (
          <section key={bloque.id}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xl">{bloque.emoji}</span>
              <h2 className="text-xl font-semibold text-tinta">
                Bloque {bloque.id} &middot; {bloque.titulo}
              </h2>
              <span className="text-xs text-tinta-400 bg-crema-200 px-2.5 py-0.5 rounded-full">
                {bloque.secuencias.length} sec.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {bloque.secuencias.map((secNum) => {
                const sec = secuencias.find((s: any) => s.secuencia === secNum)
                const numTareas = getTareasReferencia(secNum).length
                const status = statusMap[secNum] ?? 'sin_asignar'
                const clasesEnSec = clasePorSecuencia[secNum] ?? []
                const colorClass = BLOQUE_COLORS[bloque.id] ?? 'bg-crema-200 text-tinta-600'

                return (
                  <Link
                    key={secNum}
                    href={`/profesor/programa/${secNum}`}
                    className="group bg-white rounded-2xl p-5 shadow-sm ring-1 ring-black/[0.04] hover:shadow-md hover:ring-black/[0.06] transition-all flex items-start gap-4"
                  >
                    {/* Number badge */}
                    <div
                      className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold ${colorClass}`}
                    >
                      {secNum}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold text-tinta leading-snug line-clamp-2 group-hover:text-tinta-600 transition-colors">
                          {sec?.titulo ?? `Secuencia ${secNum}`}
                        </h3>
                        <ChevronRight className="w-4 h-4 text-tinta-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <span className="inline-flex items-center gap-1 text-xs text-tinta-400">
                          <BookOpen className="w-3.5 h-3.5" />
                          {numTareas} tarea{numTareas !== 1 ? 's' : ''}
                        </span>

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
                      </div>

                      {/* Vista por clases: class indicators */}
                      {vista === 'clases' && clasesEnSec.length > 0 && (
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {clasesEnSec.map((cId) => {
                            const c = clases.find((cl) => cl.id === cId)
                            return (
                              <span
                                key={cId}
                                className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amarillo/20 text-[10px] font-bold text-tinta-600"
                                title={c?.nombre}
                              >
                                {c?.nombre?.charAt(0)?.toUpperCase() ?? '?'}
                              </span>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
