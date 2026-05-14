'use client'

import { useQuery } from '@tanstack/react-query'
import { BLOQUES_NEM } from '@/lib/bloques-nem'
import { supabase } from '@/lib/supabase'

/**
 * Returns enriched data for all classes of a professor.
 * Each clase gets: alumnosCount, tareasActivas, tareasCompletadas,
 * bloqueActual, progressPct, alumnosBloqueadosCount, ultimaActividad.
 */
export function useClasesEnriched(profesorId, clases) {
  const claseIds = (clases ?? []).map((c) => c.id)

  return useQuery({
    queryKey: ['clases-enriched', profesorId, claseIds],
    queryFn: async () => {
      if (claseIds.length === 0) return []

      // Batch fetch alumnos, tareas, intentos for all classes
      const [alumnosRes, tareasRes] = await Promise.all([
        supabase.from('alumnos').select('id, clase_id').in('clase_id', claseIds),
        supabase
          .from('tareas')
          .select('id, clase_id, estado, secuencia_ref, created_at')
          .eq('profesor_id', profesorId)
          .in('clase_id', claseIds),
      ])

      const alumnos = alumnosRes.data ?? []
      const tareas = tareasRes.data ?? []

      // Get intentos for active tareas to detect blocked students
      const activeTareaIds = tareas.filter((t) => t.estado === 'en_curso').map((t) => t.id)
      let intentos = []
      if (activeTareaIds.length > 0) {
        const { data } = await supabase
          .from('intentos')
          .select('id, tarea_id, alumno_id, inicio_at, fin_at, scores_cpa, numero')
          .in('tarea_id', activeTareaIds)
          .order('numero', { ascending: false })
        intentos = data ?? []
      }

      const TRES_DIAS_MS = 3 * 24 * 60 * 60 * 1000
      const cutoff = Date.now() - TRES_DIAS_MS

      return clases.map((clase) => {
        const claseAlumnos = alumnos.filter((a) => a.clase_id === clase.id)
        const claseTareas = tareas.filter((t) => t.clase_id === clase.id)
        const activas = claseTareas.filter((t) => t.estado === 'en_curso')
        const completadas = claseTareas.filter((t) => t.estado === 'completada')

        // Bloque actual: last bloque with active or completed tareas
        let bloqueActual = null
        const secRefs = claseTareas
          .filter((t) => t.secuencia_ref && (t.estado === 'en_curso' || t.estado === 'completada'))
          .map((t) => t.secuencia_ref)
        if (secRefs.length > 0) {
          for (const bloque of BLOQUES_NEM) {
            if (bloque.secuencias.some((s) => secRefs.includes(s))) {
              bloqueActual = bloque
            }
          }
        }

        // Progress: % of 36 secuencias that have at least one completed tarea
        const secCompletadas = new Set(
          completadas.filter((t) => t.secuencia_ref).map((t) => t.secuencia_ref),
        )
        const progressPct = Math.round((secCompletadas.size / 36) * 100)

        // Blocked students count
        const claseIntentos = intentos.filter((i) => activas.some((t) => t.id === i.tarea_id))
        const latestByPair = {}
        const countByPair = {}
        for (const intento of claseIntentos) {
          const key = `${intento.alumno_id}:${intento.tarea_id}`
          countByPair[key] = (countByPair[key] ?? 0) + 1
          if (!latestByPair[key]) latestByPair[key] = intento
        }
        const bloqueadosSet = new Set()
        for (const [, intento] of Object.entries(latestByPair)) {
          const inicioAt = new Date(intento.inicio_at).getTime()
          if (inicioAt > cutoff) continue
          let etapa = null
          if (!intento.fin_at) {
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
          if (etapa) bloqueadosSet.add(intento.alumno_id)
        }

        // Última actividad: most recent intento or tarea creation
        let ultimaActividad = null
        const claseIntentoDates = claseIntentos.map((i) => new Date(i.inicio_at).getTime())
        const claseTareaDates = claseTareas.map((t) => new Date(t.created_at).getTime())
        const allDates = [...claseIntentoDates, ...claseTareaDates]
        if (allDates.length > 0) {
          ultimaActividad = new Date(Math.max(...allDates))
        }

        return {
          ...clase,
          alumnosCount: claseAlumnos.length,
          tareasActivas: activas.length,
          tareasCompletadas: completadas.length,
          bloqueActual,
          progressPct,
          alumnosBloqueadosCount: bloqueadosSet.size,
          ultimaActividad,
        }
      })
    },
    enabled: !!profesorId && claseIds.length > 0,
  })
}
