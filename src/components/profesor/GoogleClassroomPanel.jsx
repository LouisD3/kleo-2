'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Boton from '@/components/ui/Boton.jsx'
import GoogleClassroomIcon from '@/components/ui/GoogleClassroomIcon.jsx'
import Modal from '@/components/ui/Modal.jsx'
import {
  useGCConnect,
  useGCCourses,
  useGCDisconnect,
  useGCStatus,
  useGCSyncStudents,
} from '@/hooks/useGoogleClassroom.js'

export default function GoogleClassroomPanel({ profesorId, claseId, claseNombre }) {
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()
  const { data: gcStatus, isLoading: statusLoading } = useGCStatus(profesorId)
  const connectMut = useGCConnect()
  const disconnectMut = useGCDisconnect()
  const syncMut = useGCSyncStudents()

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [syncResult, setSyncResult] = useState(null)
  const [justConnected, setJustConnected] = useState(false)

  // Detect OAuth callback redirect and refresh GC status
  useEffect(() => {
    if (searchParams.get('gc_connected') === 'true') {
      queryClient.invalidateQueries({ queryKey: ['gc-status'] })
      setJustConnected(true)
    }
  }, [searchParams, queryClient])

  const { data: courses = [], isLoading: coursesLoading } = useGCCourses(
    modalOpen && gcStatus?.connected,
  )

  const connected = gcStatus?.connected ?? false

  async function handleSync() {
    if (!selectedCourse || !claseId) return
    setSyncResult(null)
    try {
      const result = await syncMut.mutateAsync({
        courseId: selectedCourse,
        claseId,
      })
      setSyncResult(result)
    } catch {
      // Error handled by mutation
    }
  }

  if (statusLoading) return null

  return (
    <div className="card p-5 mb-6 border-green-100 bg-green-50/30">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            Google Classroom
            <GoogleClassroomIcon size={20} />
          </p>
          <p className="text-xs text-gray-500">
            {connected
              ? 'Conectado — importa alumnos y sincroniza tareas'
              : 'Conecta tu cuenta para importar alumnos automáticamente'}
          </p>
        </div>
        {connected && (
          <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
            Conectado
          </span>
        )}
      </div>

      {justConnected && connected && (
        <div className="mb-3 p-3 rounded-lg bg-green-50 border border-green-200">
          <p className="text-sm text-green-800">
            Google Classroom conectado. Ya puedes importar tus alumnos.
          </p>
        </div>
      )}

      {!connected ? (
        <Boton
          variante="secundario"
          size="sm"
          onClick={() => connectMut.mutate()}
          disabled={connectMut.isPending}
        >
          {connectMut.isPending ? 'Conectando...' : 'Conectar Google Classroom'}
        </Boton>
      ) : (
        <div className="flex gap-2">
          <Boton variante="primario" size="sm" onClick={() => setModalOpen(true)}>
            Importar alumnos
          </Boton>
          <Boton
            variante="secundario"
            size="sm"
            onClick={() => disconnectMut.mutate()}
            disabled={disconnectMut.isPending}
          >
            {disconnectMut.isPending ? 'Desconectando...' : 'Desconectar'}
          </Boton>
        </div>
      )}

      {/* Modal: Select GC course to sync */}
      <Modal
        abierto={modalOpen}
        onCerrar={() => {
          setModalOpen(false)
          setSelectedCourse(null)
          setSyncResult(null)
        }}
        titulo="Importar alumnos de Google Classroom"
      >
        <p className="text-sm text-gray-600 mb-4">
          Selecciona el curso de Google Classroom para importar alumnos a{' '}
          <strong>{claseNombre}</strong>.
        </p>

        {coursesLoading ? (
          <div className="py-8 text-center text-sm text-gray-400">Cargando cursos...</div>
        ) : courses.length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-400">
            No se encontraron cursos activos en tu Google Classroom.
          </div>
        ) : (
          <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
            {courses.map((course) => (
              <button
                key={course.id}
                onClick={() => setSelectedCourse(course.id)}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                  selectedCourse === course.id
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <p className="font-medium text-gray-900 text-sm">{course.name}</p>
                {course.section && <p className="text-xs text-gray-500 mt-0.5">{course.section}</p>}
              </button>
            ))}
          </div>
        )}

        {syncResult && (
          <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200">
            <p className="text-sm text-green-800">
              {syncResult.imported > 0
                ? `${syncResult.imported} alumno${syncResult.imported !== 1 ? 's' : ''} importado${syncResult.imported !== 1 ? 's' : ''}.`
                : 'Todos los alumnos ya estaban importados.'}
              {syncResult.alreadyExisted > 0 &&
                ` ${syncResult.alreadyExisted} ya existía${syncResult.alreadyExisted !== 1 ? 'n' : ''}.`}
            </p>
          </div>
        )}

        {syncMut.isError && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm text-red-700">{syncMut.error?.message}</p>
          </div>
        )}

        <div className="flex gap-3">
          <Boton
            variante="primario"
            onClick={handleSync}
            disabled={!selectedCourse || syncMut.isPending}
          >
            {syncMut.isPending ? 'Importando...' : 'Importar alumnos'}
          </Boton>
          <Boton
            variante="secundario"
            onClick={() => {
              setModalOpen(false)
              setSelectedCourse(null)
              setSyncResult(null)
            }}
          >
            {syncResult ? 'Cerrar' : 'Cancelar'}
          </Boton>
        </div>
      </Modal>
    </div>
  )
}
