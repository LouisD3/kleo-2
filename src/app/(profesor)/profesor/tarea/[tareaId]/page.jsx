'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Spinner from '@/components/ui/Spinner.jsx'
import { useTareasProfesor } from '@/hooks/useTareas.js'
import useAuthStore from '@/store/useAuthStore.js'

/**
 * Legacy redirect: /profesor/tarea/[tareaId] → /profesor/clase/[claseId]/tarea/[tareaId]
 */
export default function LegacyTareaRedirect() {
  const { tareaId } = useParams()
  const router = useRouter()
  const { profesor } = useAuthStore()
  const { data } = useTareasProfesor(profesor?.id)
  const tareas = data?.tareas ?? []

  useEffect(() => {
    const tarea = tareas.find((t) => t.id === tareaId)
    if (tarea?.clase_id) {
      router.replace(`/profesor/clase/${tarea.clase_id}/tarea/${tareaId}`)
    }
  }, [tareas, tareaId, router])

  return (
    <div className="flex items-center justify-center py-20">
      <Spinner size="lg" />
    </div>
  )
}
