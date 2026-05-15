'use client'

import { useQuery } from '@tanstack/react-query'
import { AlertTriangle, ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useMemo, useState } from 'react'
import Boton from '@/components/ui/Boton.jsx'
import Spinner from '@/components/ui/Spinner.jsx'
import Toast from '@/components/ui/Toast.jsx'
import { useAlumnoBloqueado } from '@/hooks/useAlumnosBloqueados.js'
import { useTareasProfesor } from '@/hooks/useTareas.js'
import { supabase } from '@/lib/supabase.js'
import useAuthStore from '@/store/useAuthStore.js'

function useAlumnoById(alumnoId: string | undefined) {
  return useQuery({
    queryKey: ['alumno', alumnoId],
    queryFn: async () => {
      const { data } = await (supabase as any)
        .from('alumnos')
        .select('*')
        .eq('id', alumnoId!)
        .single()
      return data
    },
    enabled: !!alumnoId,
  })
}

export default function AlumnoDetalle() {
  const { claseId, alumnoId } = useParams<{ claseId: string; alumnoId: string }>()
  const { profesor } = useAuthStore()
  const { data: alumno, isLoading: loadingAlumno } = useAlumnoById(alumnoId)
  const { data: tareasData, isLoading: loadingTareas } = useTareasProfesor(profesor?.id)
  const { data: bloqueado } = useAlumnoBloqueado(alumnoId, profesor?.id)
  const [marcando, setMarcando] = useState(false)
  const [toastCompletado, setToastCompletado] = useState(false)
  const tareas = tareasData?.tareas ?? []
  const resultados = (tareasData?.resultados ?? {}) as Record<string, Record<string, any>>

  const tareasAlumno = useMemo(() => {
    if (!alumno) return []
    const tareasClase = tareas.filter(
      (t: { clase_id: string; estado: string }) =>
        t.clase_id === alumno.clase_id && (t.estado === 'en_curso' || t.estado === 'completada'),
    )
    return tareasClase.map((t: { id: string; nombre: string; estado: string }) => {
      const res = resultados[t.id]?.[alumnoId]
      const score = res?.calificacion_manual ?? res?.calificacion ?? null
      const scoresCPA = res?.scores_cpa ?? null
      return { ...t, score, scoresCPA, completada: !!res }
    })
  }, [tareas, resultados, alumnoId, alumno])

  const completadas = tareasAlumno.filter((t: { completada: boolean }) => t.completada).length
  const total = tareasAlumno.length
  const progreso = total > 0 ? Math.round((completadas / total) * 100) : 0

  async function handleMarcarCompletado() {
    if (!bloqueado || !alumnoId) return
    setMarcando(true)
    try {
      await (supabase as any).from('resultados').upsert(
        {
          tarea_id: bloqueado.tarea_id,
          alumno_id: alumnoId,
          calificacion: 10,
          calificacion_manual: 10,
          scores_cpa: {
            concreto: { nota: 10, completada: true },
            pictorico: { nota: 10, completada: true },
            abstracto: { nota: 10, completada: true },
            global: 10,
          },
          numero_intentos: bloqueado.numero_intentos,
          ultima_tentativa_at: new Date().toISOString(),
        },
        { onConflict: 'tarea_id,alumno_id' },
      )
      setToastCompletado(true)
    } catch {
      // silent
    } finally {
      setMarcando(false)
    }
  }

  if (loadingAlumno || loadingTareas) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!alumno) {
    return (
      <div className="px-4 sm:px-6 md:px-8 py-8">
        <p className="text-gray-500">Alumno no encontrado.</p>
        <Link
          href={`/profesor/clase/${claseId}`}
          className="text-sm text-blue-600 hover:text-blue-800 mt-2 inline-block"
        >
          Volver a la clase
        </Link>
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-6 md:px-8 py-8 animate-fade-in">
      {/* Back */}
      <Link
        href={`/profesor/clase/${claseId}`}
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a la clase
      </Link>

      {/* Header */}
      <div className="card p-6 mb-6">
        <div className="flex items-center gap-4">
          <span
            className={`inline-flex items-center justify-center w-14 h-14 rounded-full text-lg font-bold ${alumno.avatar_color}`}
          >
            {alumno.avatar_iniciales}
          </span>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{alumno.nombre}</h1>
            <p className="text-sm text-gray-500 mt-1">
              Código de acceso:{' '}
              <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">
                {alumno.codigo_acceso}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="card p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Progreso global</h2>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <div
            className="bg-amarillo h-3 rounded-full transition-all duration-500"
            style={{ width: `${progreso}%` }}
          />
        </div>
        <p className="text-sm text-gray-500">
          {completadas}/{total} tareas completadas ({progreso}%)
        </p>
      </div>

      {/* Bloqueada */}
      {bloqueado && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h2 className="font-semibold text-gray-900">Bloqueada</h2>
              <p className="text-sm text-gray-700 mt-1">
                Tarea {bloqueado.tarea_nombre} — etapa {bloqueado.etapa}
              </p>
              <p className="text-sm text-gray-500 mt-0.5">
                Desde el{' '}
                {new Date(bloqueado.inicio_at).toLocaleDateString('es-MX', {
                  day: 'numeric',
                  month: 'long',
                })}
              </p>
              <p className="text-sm text-gray-500">
                Intentos: {bloqueado.numero_intentos}. Pista usada:{' '}
                {bloqueado.pista_usada ? 'Sí' : 'No'}.
              </p>
              <div className="flex gap-2 mt-3">
                <Link
                  href={`/profesor/clase/${claseId}/tarea/${bloqueado.tarea_id}`}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  Ver intentos detallados
                </Link>
                <Boton
                  variante="primario"
                  size="sm"
                  onClick={handleMarcarCompletado}
                  disabled={marcando}
                >
                  {marcando ? 'Guardando...' : 'Marcar como completado'}
                </Boton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tareas asignadas */}
      <h2 className="text-lg font-bold text-gray-900 mb-4">Tareas asignadas</h2>
      {tareasAlumno.length === 0 ? (
        <div className="card p-12 text-center text-gray-400">
          <p className="text-sm">Sin tareas asignadas aún.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tareasAlumno.map(
            (t: {
              id: string
              nombre: string
              completada: boolean
              score: number | null
              scoresCPA: {
                concreto?: { nota: number }
                pictorico?: { nota: number }
                abstracto?: { nota: number }
                global?: number
              } | null
            }) => (
              <div key={t.id} className="card p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">{t.nombre}</h3>
                  {t.completada ? (
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                  )}
                </div>
                {t.completada && t.score != null && (
                  <p className="text-2xl font-bold text-gray-900">{t.score}</p>
                )}
                {t.completada && t.scoresCPA && (
                  <div className="flex gap-3 mt-2 text-xs text-gray-500">
                    <span>C: {t.scoresCPA.concreto?.nota ?? '-'}</span>
                    <span>P: {t.scoresCPA.pictorico?.nota ?? '-'}</span>
                    <span>A: {t.scoresCPA.abstracto?.nota ?? '-'}</span>
                  </div>
                )}
                {!t.completada && <p className="text-sm text-gray-400 mt-1">En curso</p>}
                <Link
                  href={`/profesor/clase/${claseId}/tarea/${t.id}`}
                  className="text-xs text-blue-600 hover:text-blue-800 mt-2 inline-block"
                >
                  Ver detalle
                </Link>
              </div>
            ),
          )}
        </div>
      )}

      <Toast
        mensaje="Tarea marcada como completada"
        visible={toastCompletado}
        onCerrar={() => setToastCompletado(false)}
      />
    </div>
  )
}
