'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { getAllSecuencias } from '@/content/biblioteca/matematicas-1'
import { getTareasReferencia } from '@/data/tareas-referencia'
import { useTareasProfesor } from '@/hooks/useTareas.js'
import { BLOQUES_NEM } from '@/lib/bloques-nem'
import useAuthStore from '@/store/useAuthStore.js'

const secuencias = getAllSecuencias()

export default function ProgramaPage() {
  const { profesor } = useAuthStore()
  const { data: tareasData } = useTareasProfesor(profesor?.id)
  const tareasDB = tareasData?.tareas ?? []

  // Compute status per secuencia from DB tareas
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Programa</h1>
        <p className="text-lg text-gray-600 mt-1">
          36 secuencias del programa NEM — Matematicas 1° Secundaria
        </p>
      </div>

      <div className="space-y-10">
        {BLOQUES_NEM.map((bloque) => (
          <div key={bloque.id}>
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Bloque {bloque.id} · {bloque.titulo} {bloque.emoji}
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {bloque.secuencias.map((secNum) => {
                const sec = secuencias.find((s) => s.secuencia === secNum)
                const numTareas = getTareasReferencia(secNum).length
                const status = statusMap[secNum] ?? 'sin_asignar'
                const statusBadge =
                  status === 'completada' ? '✅' : status === 'en_curso' ? '📍' : ''

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
