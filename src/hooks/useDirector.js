'use client'

import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export function useEscuelaData(escuelaId) {
  return useQuery({
    queryKey: ['escuela', 'data', escuelaId],
    queryFn: async () => {
      // Get all profesores in the school
      const { data: profesores } = await supabase
        .from('profesores')
        .select('id, nombre, escuela_id')
        .eq('escuela_id', escuelaId)

      const profesorIds = (profesores ?? []).map((p) => p.id)
      if (profesorIds.length === 0) {
        return { profesores: [], clases: [], alumnos: [], tareas: [], resultados: [] }
      }

      // Get all classes from those teachers
      const { data: clases } = await supabase
        .from('clases')
        .select('*')
        .in('profesor_id', profesorIds)
        .order('created_at', { ascending: false })

      const claseIds = (clases ?? []).map((c) => c.id)
      if (claseIds.length === 0) {
        return { profesores: profesores ?? [], clases: [], alumnos: [], tareas: [], resultados: [] }
      }

      // Get all students
      const { data: alumnos } = await supabase
        .from('alumnos')
        .select('*')
        .in('clase_id', claseIds)
        .order('nombre')

      // Get all tasks
      const { data: tareas } = await supabase
        .from('tareas')
        .select('*')
        .in('clase_id', claseIds)
        .order('created_at', { ascending: false })

      const tareaIds = (tareas ?? []).map((t) => t.id)

      // Get all results
      let resultados = []
      if (tareaIds.length > 0) {
        const { data: res } = await supabase.from('resultados').select('*').in('tarea_id', tareaIds)
        resultados = res ?? []
      }

      return {
        profesores: profesores ?? [],
        clases: clases ?? [],
        alumnos: alumnos ?? [],
        tareas: tareas ?? [],
        resultados,
      }
    },
    enabled: !!escuelaId,
  })
}

export function useEscuela(directorId) {
  return useQuery({
    queryKey: ['escuela', directorId],
    queryFn: async () => {
      const { data } = await supabase
        .from('escuelas')
        .select('*')
        .eq('director_id', directorId)
        .single()
      return data
    },
    enabled: !!directorId,
  })
}
