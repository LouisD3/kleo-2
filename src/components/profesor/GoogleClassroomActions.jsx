'use client'

import { useState } from 'react'
import Boton from '@/components/ui/Boton.jsx'
import GoogleClassroomIcon from '@/components/ui/GoogleClassroomIcon.jsx'
import { useGCPublish, useGCStatus, useGCSyncGrades } from '@/hooks/useGoogleClassroom.js'

export default function GoogleClassroomActions({ profesorId, tarea }) {
  const { data: gcStatus } = useGCStatus(profesorId)
  const publishMut = useGCPublish()
  const gradesMut = useGCSyncGrades()
  const [publishResult, setPublishResult] = useState(null)
  const [gradesResult, setGradesResult] = useState(null)

  if (!gcStatus?.connected) return null

  const isPublished = !!tarea.gc_coursework_id
  const isEnCurso = tarea.estado === 'en_curso' || tarea.estado === 'completada'

  async function handlePublish() {
    setPublishResult(null)
    try {
      const result = await publishMut.mutateAsync({ tareaId: tarea.id })
      setPublishResult(result)
    } catch {
      // handled by mutation
    }
  }

  async function handleSyncGrades() {
    setGradesResult(null)
    try {
      const result = await gradesMut.mutateAsync({ tareaId: tarea.id })
      setGradesResult(result)
    } catch {
      // handled by mutation
    }
  }

  return (
    <div className="card p-4 mb-4 border-green-100 bg-green-50/30">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-semibold text-gray-900">Google Classroom</span>
        <GoogleClassroomIcon size={20} />
        {isPublished && (
          <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full ml-auto">
            Publicada
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {!isPublished && isEnCurso && (
          <Boton
            variante="secundario"
            size="sm"
            onClick={handlePublish}
            disabled={publishMut.isPending}
          >
            {publishMut.isPending ? 'Publicando...' : 'Publicar en Classroom'}
          </Boton>
        )}

        {isPublished && (
          <Boton
            variante="secundario"
            size="sm"
            onClick={handleSyncGrades}
            disabled={gradesMut.isPending}
          >
            {gradesMut.isPending ? 'Sincronizando...' : 'Enviar calificaciones'}
          </Boton>
        )}
      </div>

      {publishResult && (
        <p className="text-xs text-green-700 mt-2">Tarea publicada en Google Classroom.</p>
      )}

      {publishMut.isError && (
        <p className="text-xs text-red-600 mt-2">{publishMut.error?.message}</p>
      )}

      {gradesResult && (
        <p className="text-xs text-green-700 mt-2">
          {gradesResult.synced} calificación{gradesResult.synced !== 1 ? 'es' : ''} enviada
          {gradesResult.synced !== 1 ? 's' : ''}.
          {gradesResult.skipped > 0 &&
            ` ${gradesResult.skipped} omitida${gradesResult.skipped !== 1 ? 's' : ''}.`}
        </p>
      )}

      {gradesMut.isError && <p className="text-xs text-red-600 mt-2">{gradesMut.error?.message}</p>}
    </div>
  )
}
