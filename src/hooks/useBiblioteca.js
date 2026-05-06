'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export function useBibliotecaSearch({ materia, grado, busqueda, metodologia }) {
  return useQuery({
    queryKey: ['biblioteca', 'search', materia, grado, busqueda, metodologia],
    queryFn: async () => {
      let query = supabase
        .from('biblioteca')
        .select('*')
        .eq('aprobado', true)
        .order('created_at', { ascending: false })
        .limit(50)

      if (materia) query = query.eq('materia', materia)
      if (grado) query = query.eq('grado', grado)
      if (metodologia) query = query.eq('metodologia', metodologia)
      if (busqueda) {
        query = query.or(
          `pda.ilike.%${busqueda}%,tema.ilike.%${busqueda}%,contenido_pda.ilike.%${busqueda}%`,
        )
      }

      const { data, error } = await query
      if (error) throw error
      return data ?? []
    },
    enabled: true,
  })
}

export function useFavoritos(profesorId) {
  return useQuery({
    queryKey: ['biblioteca', 'favoritos', profesorId],
    queryFn: async () => {
      const { data } = await supabase
        .from('biblioteca_favoritos')
        .select('recurso_id')
        .eq('profesor_id', profesorId)
      return new Set((data ?? []).map((f) => f.recurso_id))
    },
    enabled: !!profesorId,
  })
}

export function useToggleFavorito() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ profesorId, recursoId, isFavorito }) => {
      if (isFavorito) {
        await supabase
          .from('biblioteca_favoritos')
          .delete()
          .eq('profesor_id', profesorId)
          .eq('recurso_id', recursoId)
      } else {
        await supabase
          .from('biblioteca_favoritos')
          .insert({ profesor_id: profesorId, recurso_id: recursoId })
      }
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['biblioteca', 'favoritos', variables.profesorId] })
    },
  })
}
