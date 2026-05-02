'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

async function getAuthHeaders() {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session?.access_token) throw new Error('No autenticado')
  return {
    Authorization: `Bearer ${session.access_token}`,
    'Content-Type': 'application/json',
  }
}

// Check if the teacher has GC connected
export function useGCStatus(profesorId) {
  return useQuery({
    queryKey: ['gc-status', profesorId],
    queryFn: async () => {
      const { data } = await supabase
        .from('profesores')
        .select('gc_connected')
        .eq('id', profesorId)
        .single()
      return { connected: data?.gc_connected ?? false }
    },
    enabled: !!profesorId,
  })
}

// Start OAuth flow
export function useGCConnect() {
  return useMutation({
    mutationFn: async () => {
      const headers = await getAuthHeaders()
      const res = await fetch('/api/gc/auth', { headers })
      if (!res.ok) throw new Error('Error al iniciar conexión')
      const { url } = await res.json()
      window.location.href = url
    },
  })
}

// Disconnect GC
export function useGCDisconnect() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const headers = await getAuthHeaders()
      const res = await fetch('/api/gc/disconnect', {
        method: 'POST',
        headers,
      })
      if (!res.ok) throw new Error('Error al desconectar')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gc-status'] })
    },
  })
}

// Fetch GC courses
export function useGCCourses(enabled = false) {
  return useQuery({
    queryKey: ['gc-courses'],
    queryFn: async () => {
      const headers = await getAuthHeaders()
      const res = await fetch('/api/gc/courses', { headers })
      if (!res.ok) throw new Error('Error al cargar cursos')
      const { courses } = await res.json()
      return courses
    },
    enabled,
  })
}

// Sync students from a GC course
export function useGCSyncStudents() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ courseId, claseId }) => {
      const headers = await getAuthHeaders()
      const res = await fetch('/api/gc/sync', {
        method: 'POST',
        headers,
        body: JSON.stringify({ courseId, claseId }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Error al sincronizar')
      }
      return res.json()
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['alumnos', variables.claseId] })
    },
  })
}

// Publish task to GC
export function useGCPublish() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ tareaId }) => {
      const headers = await getAuthHeaders()
      const res = await fetch('/api/gc/publish', {
        method: 'POST',
        headers,
        body: JSON.stringify({ tareaId }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Error al publicar')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tareas'] })
    },
  })
}

// Sync grades to GC
export function useGCSyncGrades() {
  return useMutation({
    mutationFn: async ({ tareaId }) => {
      const headers = await getAuthHeaders()
      const res = await fetch('/api/gc/grades', {
        method: 'POST',
        headers,
        body: JSON.stringify({ tareaId }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Error al sincronizar notas')
      }
      return res.json()
    },
  })
}
