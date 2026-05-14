'use client'

import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

const TRES_DIAS_MS = 3 * 24 * 60 * 60 * 1000

/**
 * Detects blocked students by checking the intentos table.
 * A student is "blocked" on a tarea if:
 * - They have at least 1 intento started 3+ days ago
 * - AND their latest intento on that tarea has fin_at = null
 *   OR scores_cpa shows an unvalidated step
 * - AND the tarea is still en_curso
 *
 * @param {string|undefined} profesorId
 * @returns {{ data: Array<{alumno_id, alumno_nombre, tarea_id, tarea_nombre, etapa, inicio_at, numero_intentos, pista_usada}>, isLoading }}
 */
export function useAlumnosBloqueados(profesorId) {
  return useQuery({
    queryKey: ['alumnos-bloqueados', profesorId],
    queryFn: async () => {
      // Get all en_curso tareas for this teacher
      const { data: tareas } = await supabase
        .from('tareas')
        .select('id, nombre, clase_id')
        .eq('profesor_id', profesorId)
        .eq('estado', 'en_curso')

      if (!tareas || tareas.length === 0) return []

      const tareaIds = tareas.map((t) => t.id)
      const tareasMap = {}
      for (const t of tareas) tareasMap[t.id] = t

      // Get all intentos for those tareas
      const { data: intentos } = await supabase
        .from('intentos')
        .select('id, tarea_id, alumno_id, numero, inicio_at, fin_at, scores_cpa')
        .in('tarea_id', tareaIds)
        .order('numero', { ascending: false })

      if (!intentos || intentos.length === 0) return []

      // Get alumno names
      const alumnoIds = [...new Set(intentos.map((i) => i.alumno_id))]
      const { data: alumnos } = await supabase
        .from('alumnos')
        .select('id, nombre')
        .in('id', alumnoIds)

      const alumnosMap = {}
      for (const a of alumnos ?? []) alumnosMap[a.id] = a

      // Group intentos by alumno+tarea, take the latest
      const latestByPair = {}
      const countByPair = {}
      for (const intento of intentos) {
        const key = `${intento.alumno_id}:${intento.tarea_id}`
        countByPair[key] = (countByPair[key] ?? 0) + 1
        if (!latestByPair[key]) {
          latestByPair[key] = intento
        }
      }

      const cutoff = Date.now() - TRES_DIAS_MS
      const bloqueados = []

      for (const [key, intento] of Object.entries(latestByPair)) {
        const inicioAt = new Date(intento.inicio_at).getTime()
        if (inicioAt > cutoff) continue

        // Determine blocked step
        let etapa = null
        if (!intento.fin_at) {
          // Intento not finished — determine step from scores_cpa
          const scores = intento.scores_cpa
          if (!scores?.concreto?.completada) etapa = 'Concreto'
          else if (!scores?.pictorico?.completada) etapa = 'Pictórico'
          else etapa = 'Abstracto'
        } else if (intento.scores_cpa) {
          const scores = intento.scores_cpa
          if (!scores.concreto?.completada) etapa = 'Concreto'
          else if (!scores.pictorico?.completada) etapa = 'Pictórico'
          else if (!scores.abstracto?.completada) etapa = 'Abstracto'
        }

        if (!etapa) continue

        const tarea = tareasMap[intento.tarea_id]
        const alumno = alumnosMap[intento.alumno_id]
        if (!tarea || !alumno) continue

        // Check if pista was used (intentos >= intentos_para_pista, default 3)
        const numIntentos = countByPair[key] ?? 1
        const pistaUsada = numIntentos >= 3

        bloqueados.push({
          alumno_id: intento.alumno_id,
          alumno_nombre: alumno.nombre,
          tarea_id: intento.tarea_id,
          tarea_nombre: tarea.nombre,
          etapa,
          inicio_at: intento.inicio_at,
          numero_intentos: numIntentos,
          pista_usada: pistaUsada,
        })
      }

      return bloqueados
    },
    enabled: !!profesorId,
  })
}

/**
 * Get blocked info for a single alumno.
 * Returns the first (oldest) blocked tarea, or null.
 */
export function useAlumnoBloqueado(alumnoId, profesorId) {
  const { data: allBloqueados, isLoading } = useAlumnosBloqueados(profesorId)

  const bloqueado = (allBloqueados ?? []).find((b) => b.alumno_id === alumnoId)
  return { data: bloqueado ?? null, isLoading }
}
