'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { getAllSecuencias } from '@/content/biblioteca/matematicas-1'
import { getTareasReferencia } from '@/data/tareas-referencia'
import { useTareasProfesor } from '@/hooks/useTareas.js'
import { BLOQUES_NEM } from '@/lib/bloques-nem'
import { supabase } from '@/lib/supabase.js'
import useAuthStore from '@/store/useAuthStore.js'

const secuencias = getAllSecuencias()

type Vista = 'programa' | 'clases'

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

  // Compute status per secuencia from DB tareas (global)
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

  // Compute per-clase position: last secuencia with en_curso or most advanced completada
  const clasePorSecuencia = useMemo(() => {
    // Map: secNum -> claseIds that are "at" this secuencia
    const map: Record<number, string[]> = {}
    if (vista !== 'clases') return map

    for (const clase of clases) {
      const claseTareas = tareasDB.filter((t: any) => t.clase_id === clase.id)
      // Find the latest secuencia where this class has active/completed tareas
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Programa</h1>
        <p className="text-lg text-gray-600 mt-1">
          36 secuencias del programa NEM — Matemáticas 1° Secundaria
        </p>
      </div>

      {/* Vista toggle */}
      {clases.length > 1 && (
        <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setVista('programa')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              vista === 'programa'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Vista del programa
          </button>
          <button
            onClick={() => setVista('clases')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              vista === 'clases'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Vista por mis clases
          </button>
        </div>
      )}

      <div className="space-y-10">
        {BLOQUES_NEM.map((bloque) => (
          <div key={bloque.id}>
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Bloque {bloque.id} · {bloque.titulo} {bloque.emoji}
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {bloque.secuencias.map((secNum) => {
                const sec = secuencias.find((s: any) => s.secuencia === secNum)
                const numTareas = getTareasReferencia(secNum).length
                const status = statusMap[secNum] ?? 'sin_asignar'
                const statusBadge =
                  status === 'completada' ? '✅' : status === 'en_curso' ? '📍' : ''
                const clasesEnSec = clasePorSecuencia[secNum] ?? []

                return (
                  <Link
                    key={secNum}
                    href={`/profesor/programa/${secNum}`}
                    className="card p-3 flex flex-col items-center text-center hover:shadow-md hover:border-amarillo transition-all group relative"
                  >
                    {statusBadge && (
                      <span className="absolute top-1 right-1 text-sm">{statusBadge}</span>
                    )}
                    <span className="text-2xl font-black text-gray-300 group-hover:text-gray-400 transition-colors">
                      {secNum}
                    </span>
                    <span className="text-xs text-gray-600 mt-1 line-clamp-2 leading-tight">
                      {sec?.titulo ?? `Secuencia ${secNum}`}
                    </span>
                    <span className="text-[10px] text-gray-400 mt-1">
                      {numTareas} tarea{numTareas !== 1 ? 's' : ''}
                    </span>
                    {/* Vista por clases: show class indicators */}
                    {vista === 'clases' && clasesEnSec.length > 0 && (
                      <div className="flex gap-1 mt-1.5 flex-wrap justify-center">
                        {clasesEnSec.map((cId) => {
                          const c = clases.find((cl) => cl.id === cId)
                          return (
                            <span
                              key={cId}
                              className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amarillo/20 text-[10px] font-bold text-gray-700"
                              title={c?.nombre}
                            >
                              {c?.nombre?.charAt(0)?.toUpperCase() ?? '?'}
                            </span>
                          )
                        })}
                      </div>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
