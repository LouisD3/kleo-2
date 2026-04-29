'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

// --- Helpers ---

function buildResultadosMap(resultados) {
  const map = {}
  for (const r of resultados ?? []) {
    if (!map[r.tarea_id]) map[r.tarea_id] = {}
    map[r.tarea_id][r.alumno_id] = r
  }
  return map
}

async function fetchTareasConResultados(query) {
  const { data: tareas } = await query
  const ids = (tareas ?? []).map((t) => t.id)
  if (ids.length === 0) return { tareas: [], resultados: {} }

  const { data: resultados } = await supabase
    .from('resultados')
    .select('*')
    .in('tarea_id', ids)

  return { tareas: tareas ?? [], resultados: buildResultadosMap(resultados) }
}

// --- Queries ---

export function useTareasProfesor(profesorId) {
  return useQuery({
    queryKey: ['tareas', 'profesor', profesorId],
    queryFn: () =>
      fetchTareasConResultados(
        supabase
          .from('tareas')
          .select('*')
          .eq('profesor_id', profesorId)
          .order('created_at', { ascending: false }),
      ),
    enabled: !!profesorId,
  })
}

export function useTareasAlumno(claseId) {
  return useQuery({
    queryKey: ['tareas', 'alumno', claseId],
    queryFn: () =>
      fetchTareasConResultados(
        supabase
          .from('tareas')
          .select('*')
          .eq('clase_id', claseId)
          .in('estado', ['en_curso', 'completada'])
          .order('created_at', { ascending: false }),
      ),
    enabled: !!claseId,
  })
}

export function useAlumnos(claseId) {
  return useQuery({
    queryKey: ['alumnos', claseId],
    queryFn: async () => {
      const { data } = await supabase
        .from('alumnos')
        .select('*')
        .eq('clase_id', claseId)
        .order('nombre')
      return data ?? []
    },
    enabled: !!claseId,
  })
}

// --- Derived data helpers ---

export function getTareasParaAlumno(tareas, resultados, alumnoId) {
  return tareas.map((t) => {
    const resultado = resultados[t.id]?.[alumnoId]
    let estadoAlumno = 'pendiente'
    if (resultado) {
      estadoAlumno = 'completada'
    } else if (t.estado === 'en_curso' || t.estado === 'completada') {
      estadoAlumno = 'en_curso'
    }
    return { ...t, estadoAlumno, resultadoAlumno: resultado ?? null }
  })
}

export function calcularPromedio(resultados) {
  const valores = Object.values(resultados ?? {})
  if (valores.length === 0) return null
  const suma = valores.reduce((acc, r) => acc + (r.calificacion_manual ?? r.calificacion), 0)
  return Math.round((suma / valores.length) * 10) / 10
}

// --- Mutations ---

export function useAgregarTarea() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (tarea) => {
      const { data, error } = await supabase
        .from('tareas')
        .insert({
          profesor_id: tarea.profesor_id,
          clase_id: tarea.clase_id,
          nombre: tarea.nombre,
          materia: tarea.materia,
          dificultad: tarea.dificultad,
          metodologia: tarea.metodologia,
          tipos: tarea.tipos,
          preguntas: tarea.preguntas,
          estado: 'borrador',
          fecha_limite: tarea.fecha_limite || null,
          pda: tarea.pda || null,
          numero_preguntas: tarea.preguntas?.length ?? 0,
        })
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tareas'] })
    },
  })
}

export function useActualizarTarea() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, cambios }) => {
      const { error } = await supabase.from('tareas').update(cambios).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tareas'] })
    },
  })
}

export function usePublicarTarea() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from('tareas')
        .update({ estado: 'en_curso' })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tareas'] })
    },
  })
}

export function useGuardarResultado() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ tareaId, alumnoId, resultado }) => {
      const { error } = await supabase.from('resultados').upsert({
        tarea_id: tareaId,
        alumno_id: alumnoId,
        respuestas: resultado.respuestas,
        calificacion: resultado.calificacion,
        retroalimentacion: resultado.retroalimentacion,
        areas_de_mejora: resultado.areas_de_mejora ?? [],
      })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tareas'] })
    },
  })
}

export function useGuardarCalificacionManual() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ resultadoId, calificacion }) => {
      const { error } = await supabase
        .from('resultados')
        .update({ calificacion_manual: calificacion })
        .eq('id', resultadoId)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tareas'] })
    },
  })
}

export function useAgregarAlumno() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ claseId, nombre }) => {
      const iniciales = nombre
        .split(' ')
        .map((p) => p[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)

      const colores = [
        'bg-pink-100 text-pink-700',
        'bg-blue-100 text-blue-700',
        'bg-purple-100 text-purple-700',
        'bg-green-100 text-green-700',
        'bg-orange-100 text-orange-700',
        'bg-teal-100 text-teal-700',
        'bg-red-100 text-red-700',
        'bg-indigo-100 text-indigo-700',
      ]
      const color = colores[Math.floor(Math.random() * colores.length)]
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
      let codigo = ''
      for (let i = 0; i < 6; i++) {
        codigo += chars[Math.floor(Math.random() * chars.length)]
      }

      const { data, error } = await supabase
        .from('alumnos')
        .insert({
          clase_id: claseId,
          nombre,
          codigo_acceso: codigo,
          avatar_iniciales: iniciales,
          avatar_color: color,
        })
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['alumnos', variables.claseId] })
    },
  })
}

export function useEliminarAlumno() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ alumnoId, claseId }) => {
      const { error } = await supabase.from('alumnos').delete().eq('id', alumnoId)
      if (error) throw error
      return { claseId }
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['alumnos', variables.claseId] })
    },
  })
}
