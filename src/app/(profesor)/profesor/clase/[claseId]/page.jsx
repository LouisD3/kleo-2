'use client'

import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, MoreHorizontal, Plus, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import AlumnoCard from '@/components/profesor/AlumnoCard'
import ClaseSwitcher from '@/components/profesor/ClaseSwitcher'
import HeatmapCPA from '@/components/profesor/HeatmapCPA'
import Boton from '@/components/ui/Boton.jsx'
import MensajeError from '@/components/ui/MensajeError.jsx'
import Modal from '@/components/ui/Modal.jsx'
import Spinner from '@/components/ui/Spinner.jsx'
import { useAlumnosBloqueados } from '@/hooks/useAlumnosBloqueados.js'
import { useAgregarAlumno, useAlumnos, useTareasProfesor } from '@/hooks/useTareas.js'
import { BLOQUES_NEM } from '@/lib/bloques-nem'
import { supabase } from '@/lib/supabase.js'
import useAuthStore from '@/store/useAuthStore.js'

function useClaseById(claseId) {
  return useQuery({
    queryKey: ['clase', claseId],
    queryFn: async () => {
      const { data } = await supabase.from('clases').select('*').eq('id', claseId).single()
      if (data) return { type: 'clase', data }
      // Legacy fallback: maybe claseId is actually an alumnoId
      const { data: alumno } = await supabase
        .from('alumnos')
        .select('id, clase_id')
        .eq('id', claseId)
        .single()
      if (alumno) return { type: 'alumno', data: alumno }
      return null
    },
    enabled: !!claseId,
  })
}

const TABS = [
  { id: 'alumnos', label: 'Alumnos' },
  { id: 'progreso', label: 'Progreso' },
  { id: 'tareas', label: 'Tareas' },
]

export default function ClaseDetalle() {
  const { claseId } = useParams()
  const router = useRouter()
  const { profesor } = useAuthStore()
  const { data: claseResult, isLoading: loadingClase } = useClaseById(claseId)

  // Legacy redirect: if claseId is actually an alumnoId
  useEffect(() => {
    if (claseResult?.type === 'alumno') {
      router.replace(`/profesor/clase/${claseResult.data.clase_id}/alumno/${claseResult.data.id}`)
    }
  }, [claseResult, router])

  const clase = claseResult?.type === 'clase' ? claseResult.data : null
  const { data: alumnos = [] } = useAlumnos(claseId)
  const { data: tareasData } = useTareasProfesor(profesor?.id)
  const { data: alumnosBloqueados = [] } = useAlumnosBloqueados(profesor?.id)
  const agregarAlumnoMut = useAgregarAlumno()

  const [tab, setTab] = useState('alumnos')
  const [filtro, setFiltro] = useState('todos')
  const [modalAgregarAlumno, setModalAgregarAlumno] = useState(false)
  const [nuevoAlumno, setNuevoAlumno] = useState('')
  const [error, setError] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [modalRenombrar, setModalRenombrar] = useState(false)
  const [nuevoNombre, setNuevoNombre] = useState('')
  const [modalEmoji, setModalEmoji] = useState(false)
  const [modalArchivar, setModalArchivar] = useState(false)
  const [modalEliminar, setModalEliminar] = useState(false)
  const [confirmEliminar, setConfirmEliminar] = useState('')
  const [eliminando, setEliminando] = useState(false)

  const tareas = tareasData?.tareas ?? []
  const resultados = tareasData?.resultados ?? {}
  const tareasClase = useMemo(() => tareas.filter((t) => t.clase_id === claseId), [tareas, claseId])

  const bloqueadosClase = useMemo(
    () => alumnosBloqueados.filter((b) => alumnos.some((a) => a.id === b.alumno_id)),
    [alumnosBloqueados, alumnos],
  )

  // Get latest intento per alumno for CPA dots and activity
  const { data: intentosData } = useQuery({
    queryKey: ['intentos-clase', claseId],
    queryFn: async () => {
      const activeTareaIds = tareasClase.filter((t) => t.estado === 'en_curso').map((t) => t.id)
      if (activeTareaIds.length === 0) return {}
      const { data } = await supabase
        .from('intentos')
        .select('alumno_id, tarea_id, scores_cpa, inicio_at')
        .in('tarea_id', activeTareaIds)
        .order('numero', { ascending: false })
      // Group by alumno, keep latest
      const map = {}
      for (const i of data ?? []) {
        if (!map[i.alumno_id]) map[i.alumno_id] = i
      }
      return map
    },
    enabled: tareasClase.length > 0,
  })

  // Compute bloque actual
  const bloqueActual = useMemo(() => {
    const secRefs = tareasClase
      .filter((t) => t.secuencia_ref && (t.estado === 'en_curso' || t.estado === 'completada'))
      .map((t) => t.secuencia_ref)
    let last = null
    for (const bloque of BLOQUES_NEM) {
      if (bloque.secuencias.some((s) => secRefs.includes(s))) last = bloque
    }
    return last
  }, [tareasClase])

  const progressPct = useMemo(() => {
    const completed = new Set(
      tareasClase
        .filter((t) => t.estado === 'completada' && t.secuencia_ref)
        .map((t) => t.secuencia_ref),
    )
    return Math.round((completed.size / 36) * 100)
  }, [tareasClase])

  // Filter alumnos
  const bloqueadosIds = new Set(bloqueadosClase.map((b) => b.alumno_id))
  const filteredAlumnos = useMemo(() => {
    if (filtro === 'bloqueados') return alumnos.filter((a) => bloqueadosIds.has(a.id))
    if (filtro === 'avanzando')
      return alumnos.filter((a) => !bloqueadosIds.has(a.id) && intentosData?.[a.id])
    if (filtro === 'sin_actividad') return alumnos.filter((a) => !intentosData?.[a.id])
    return alumnos
  }, [alumnos, filtro, bloqueadosIds, intentosData])

  async function handleAgregarAlumno(e) {
    e.preventDefault()
    if (!nuevoAlumno.trim()) return
    setError(null)
    try {
      await agregarAlumnoMut.mutateAsync({ claseId, nombre: nuevoAlumno.trim() })
      setNuevoAlumno('')
      setModalAgregarAlumno(false)
    } catch {
      setError('No se pudo agregar al alumno.')
    }
  }

  if (loadingClase) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!clase) {
    return (
      <div className="px-4 sm:px-6 md:px-8 py-8">
        <p className="text-gray-500">Clase no encontrada.</p>
        <Link
          href="/profesor"
          className="text-sm text-blue-600 hover:text-blue-800 mt-2 inline-block"
        >
          Volver a Mis clases
        </Link>
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-6 md:px-8 py-8 animate-fade-in">
      {/* Breadcrumb */}
      <Link
        href="/profesor"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Mis clases
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{clase.nombre}</h1>
          <ClaseSwitcher currentClaseId={claseId} />
        </div>
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <MoreHorizontal className="w-5 h-5 text-gray-500" />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
              <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[180px] py-1">
                <button
                  onClick={() => { setMenuOpen(false); setNuevoNombre(clase.nombre); setModalRenombrar(true) }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                >
                  Renombrar
                </button>
                <button
                  onClick={() => { setMenuOpen(false); setModalEmoji(true) }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                >
                  Cambiar emoji
                </button>
                <div className="border-t border-gray-100 my-1" />
                <button
                  onClick={() => { setMenuOpen(false); setModalArchivar(true) }}
                  className="w-full text-left px-4 py-2 text-sm text-orange-600 hover:bg-orange-50"
                >
                  Archivar clase
                </button>
                <button
                  onClick={() => { setMenuOpen(false); setConfirmEliminar(''); setModalEliminar(true) }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Eliminar clase
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        {alumnos.length} alumno{alumnos.length !== 1 ? 's' : ''}
        {bloqueActual && ` · ${bloqueActual.emoji} ${bloqueActual.titulo}`}
        {` · ${progressPct}% del programa`}
      </p>

      {/* Blocked students banner */}
      {bloqueadosClase.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
          <p className="text-sm font-medium text-orange-700">
            ⚠️ {bloqueadosClase.length} alumno{bloqueadosClase.length > 1 ? 's' : ''} necesita
            {bloqueadosClase.length > 1 ? 'n' : ''} atención
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-200 mb-6">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === t.id
                ? 'border-amarillo text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab: Alumnos */}
      {tab === 'alumnos' && (
        <div>
          {/* Filters + actions */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {[
              { id: 'todos', label: 'Todos' },
              { id: 'bloqueados', label: 'Bloqueados' },
              { id: 'avanzando', label: 'Avanzando' },
              { id: 'sin_actividad', label: 'Sin actividad' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFiltro(f.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  filtro === f.id
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f.label}
              </button>
            ))}
            <div className="flex-1" />
            <button
              onClick={() => setModalAgregarAlumno(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 border border-gray-200 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Agregar alumno</span>
            </button>
            <Link
              href={`/profesor/programa`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-amarillo text-gray-900 hover:bg-amarillo-hover transition-colors"
            >
              Asignar tarea ›
            </Link>
          </div>

          {filteredAlumnos.length === 0 ? (
            <div className="card p-12 text-center text-gray-400">
              <p className="text-sm">
                {filtro === 'todos'
                  ? 'Sin alumnos. Agrega el primero.'
                  : 'Ningún alumno en esta categoría.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredAlumnos.map((alumno) => {
                const intento = intentosData?.[alumno.id]
                return (
                  <AlumnoCard
                    key={alumno.id}
                    alumno={alumno}
                    claseId={claseId}
                    ultimaActividad={intento?.inicio_at}
                    scoresCPA={intento?.scores_cpa}
                    secuenciaEnCurso={
                      tareasClase
                        .find(
                          (t) =>
                            t.estado === 'en_curso' &&
                            t.id === intento?.tarea_id &&
                            t.secuencia_ref,
                        )
                        ?.secuencia_ref?.toString() ?? null
                    }
                  />
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab: Progreso */}
      {tab === 'progreso' && (
        <div>
          <div className="flex gap-2 mb-4">
            <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-gray-900 text-white">
              Heatmap
            </span>
            <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-400 cursor-not-allowed">
              Curvas semanales (próximamente)
            </span>
          </div>
          <div className="card p-4 overflow-hidden">
            <HeatmapCPA alumnos={alumnos} tareas={tareasClase} resultados={resultados} />
          </div>
        </div>
      )}

      {/* Tab: Tareas */}
      {tab === 'tareas' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Tareas de esta clase
            </h3>
            <Link
              href="/profesor/programa"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-amarillo text-gray-900 hover:bg-amarillo-hover transition-colors"
            >
              <Plus className="w-4 h-4" />
              Asignar nueva tarea
            </Link>
          </div>

          {tareasClase.length === 0 ? (
            <div className="card p-12 text-center text-gray-400">
              <p className="text-sm">Sin tareas asignadas aún.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {['en_curso', 'completada', 'borrador'].map((estado) => {
                const group = tareasClase.filter((t) => t.estado === estado)
                if (group.length === 0) return null
                const labels = {
                  en_curso: 'En curso',
                  completada: 'Completadas',
                  borrador: 'Borradores',
                }
                return (
                  <div key={estado}>
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                      {labels[estado]} ({group.length})
                    </h4>
                    <div className="space-y-3">
                      {group.map((tarea) => {
                        const resTarea = resultados[tarea.id] ?? {}
                        const completados = Object.keys(resTarea).length
                        return (
                          <Link
                            key={tarea.id}
                            href={`/profesor/clase/${claseId}/tarea/${tarea.id}`}
                            className="block card p-4 hover:shadow-md hover:border-amarillo transition-all"
                          >
                            <div className="flex items-center justify-between gap-4">
                              <div className="min-w-0">
                                <h5 className="font-semibold text-gray-900 text-sm truncate">
                                  {tarea.nombre}
                                </h5>
                                {tarea.secuencia_ref && (
                                  <p className="text-xs text-gray-400 mt-0.5">
                                    Sec {tarea.secuencia_ref}
                                  </p>
                                )}
                              </div>
                              <div className="text-right flex-shrink-0">
                                <p className="text-sm text-gray-600">
                                  {completados}/{alumnos.length} completaron
                                </p>
                                {tarea.fecha_limite && (
                                  <p className="text-xs text-gray-400">
                                    Límite:{' '}
                                    {new Date(tarea.fecha_limite).toLocaleDateString('es-MX', {
                                      day: 'numeric',
                                      month: 'short',
                                    })}
                                  </p>
                                )}
                              </div>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Modal agregar alumno */}
      <Modal
        abierto={modalAgregarAlumno}
        onCerrar={() => {
          setModalAgregarAlumno(false)
          setNuevoAlumno('')
          setError(null)
        }}
        titulo="Agregar alumno"
      >
        <form onSubmit={handleAgregarAlumno} className="space-y-4">
          <div>
            <label className="label-base">Nombre completo</label>
            <input
              type="text"
              value={nuevoAlumno}
              onChange={(e) => setNuevoAlumno(e.target.value)}
              placeholder="Ej. María López García"
              className="input-base"
              autoFocus
            />
          </div>
          <MensajeError mensaje={error} onCerrar={() => setError(null)} />
          <Boton
            type="submit"
            variante="primario"
            size="md"
            className="w-full"
            disabled={!nuevoAlumno.trim()}
          >
            Agregar alumno
          </Boton>
        </form>
      </Modal>

      {/* Modal renombrar */}
      <Modal
        abierto={modalRenombrar}
        onCerrar={() => setModalRenombrar(false)}
        titulo="Renombrar clase"
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            if (!nuevoNombre.trim()) return
            const { error: err } = await supabase
              .from('clases')
              .update({ nombre: nuevoNombre.trim() })
              .eq('id', claseId)
            if (!err) {
              setModalRenombrar(false)
              window.location.reload()
            } else {
              setError(err.message)
            }
          }}
          className="space-y-4"
        >
          <div>
            <label className="label-base">Nombre de la clase</label>
            <input
              type="text"
              value={nuevoNombre}
              onChange={(e) => setNuevoNombre(e.target.value)}
              className="input-base"
              autoFocus
            />
          </div>
          <Boton type="submit" variante="primario" size="md" className="w-full" disabled={!nuevoNombre.trim()}>
            Guardar
          </Boton>
        </form>
      </Modal>

      {/* Modal cambiar emoji */}
      <Modal
        abierto={modalEmoji}
        onCerrar={() => setModalEmoji(false)}
        titulo="Cambiar emoji"
      >
        <div className="grid grid-cols-6 gap-2">
          {['📐', '📏', '🔢', '📊', '🧮', '✏️', '📚', '🎓', '🏫', '⭐', '🌟', '💡', '🔬', '🧪', '🎯', '📝', '🗂️', '🌈'].map((emoji) => (
            <button
              key={emoji}
              onClick={async () => {
                const { error: err } = await supabase
                  .from('clases')
                  .update({ emoji })
                  .eq('id', claseId)
                if (!err) {
                  setModalEmoji(false)
                  window.location.reload()
                } else {
                  setError(err.message)
                }
              }}
              className="text-2xl p-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {emoji}
            </button>
          ))}
        </div>
      </Modal>

      {/* Modal archivar clase */}
      <Modal
        abierto={modalArchivar}
        onCerrar={() => setModalArchivar(false)}
        titulo="Archivar clase"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Al archivar esta clase, dejará de aparecer en tu lista de clases activas.
            Los datos (alumnos, tareas, resultados) se conservan y podrás restaurarla después.
          </p>
          <p className="text-sm font-medium text-gray-700">
            Clase: <strong>{clase?.nombre}</strong> ({alumnos.length} alumno{alumnos.length !== 1 ? 's' : ''})
          </p>
          <div className="flex gap-3">
            <Boton
              variante="peligro"
              onClick={async () => {
                const { error: err } = await supabase
                  .from('clases')
                  .update({ archivada: true })
                  .eq('id', claseId)
                if (!err) {
                  router.push('/profesor')
                } else {
                  setError(err.message)
                  setModalArchivar(false)
                }
              }}
            >
              Archivar
            </Boton>
            <Boton variante="secundario" onClick={() => setModalArchivar(false)}>
              Cancelar
            </Boton>
          </div>
        </div>
      </Modal>

      {/* Modal eliminar clase */}
      <Modal
        abierto={modalEliminar}
        onCerrar={() => { setModalEliminar(false); setConfirmEliminar('') }}
        titulo="Eliminar clase"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Esta acción es <strong>irreversible</strong>. Se eliminarán permanentemente todos los alumnos, tareas, resultados e intentos asociados a esta clase.
          </p>
          <p className="text-sm font-medium text-gray-700">
            Clase: <strong>{clase?.nombre}</strong> ({alumnos.length} alumno{alumnos.length !== 1 ? 's' : ''}, {tareasClase.length} tarea{tareasClase.length !== 1 ? 's' : ''})
          </p>
          <div>
            <label className="label-base">
              Escribe <strong>ELIMINAR</strong> para confirmar
            </label>
            <input
              type="text"
              value={confirmEliminar}
              onChange={(e) => setConfirmEliminar(e.target.value)}
              className="input-base"
              placeholder="ELIMINAR"
            />
          </div>
          <div className="flex gap-3">
            <Boton
              variante="peligro"
              disabled={confirmEliminar !== 'ELIMINAR' || eliminando}
              onClick={async () => {
                setEliminando(true)
                try {
                  // Delete in order: intentos → resultados → tareas → alumnos → clase
                  const tareaIds = tareasClase.map((t) => t.id)
                  if (tareaIds.length > 0) {
                    await supabase.from('intentos').delete().in('tarea_id', tareaIds)
                    await supabase.from('resultados').delete().in('tarea_id', tareaIds)
                    await supabase.from('tareas').delete().in('id', tareaIds)
                  }
                  await supabase.from('alumnos').delete().eq('clase_id', claseId)
                  const { error: err } = await supabase.from('clases').delete().eq('id', claseId)
                  if (err) throw err
                  router.push('/profesor')
                } catch (err) {
                  setError(err.message ?? 'Error al eliminar la clase')
                  setEliminando(false)
                  setModalEliminar(false)
                }
              }}
            >
              {eliminando ? 'Eliminando...' : 'Eliminar definitivamente'}
            </Boton>
            <Boton variante="secundario" onClick={() => { setModalEliminar(false); setConfirmEliminar('') }}>
              Cancelar
            </Boton>
          </div>
        </div>
      </Modal>
    </div>
  )
}
