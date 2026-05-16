'use client'

import { useQuery } from '@tanstack/react-query'
import {
  ArrowLeft,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Download,
  MoreHorizontal,
  Plus,
  UserPlus,
} from 'lucide-react'
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
import { calcularPromedio, useAgregarAlumno, useAlumnos, useTareasProfesor } from '@/hooks/useTareas.js'
import { BLOQUES_NEM } from '@/lib/bloques-nem'
import { supabase } from '@/lib/supabase.js'
import useAuthStore from '@/store/useAuthStore.js'

// ── Helpers ────────────────────────────────────────────────────

function useClaseById(claseId) {
  return useQuery({
    queryKey: ['clase', claseId],
    queryFn: async () => {
      const { data } = await supabase.from('clases').select('*').eq('id', claseId).single()
      if (data) return { type: 'clase', data }
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

function formatFecha(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })
}

function promedioCPAClase(resultados, alumnos) {
  const scores = { concreto: [], pictorico: [], abstracto: [] }
  for (const alumnoId of alumnos.map((a) => a.id)) {
    const r = resultados?.[alumnoId]
    if (!r?.scores_cpa) continue
    if (r.scores_cpa.concreto?.nota != null) scores.concreto.push(r.scores_cpa.concreto.nota)
    if (r.scores_cpa.pictorico?.nota != null) scores.pictorico.push(r.scores_cpa.pictorico.nota)
    if (r.scores_cpa.abstracto?.nota != null) scores.abstracto.push(r.scores_cpa.abstracto.nota)
  }
  const avg = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null)
  return { concreto: avg(scores.concreto), pictorico: avg(scores.pictorico), abstracto: avg(scores.abstracto) }
}

function CPADots({ resultados, alumnos }) {
  const avgs = promedioCPAClase(resultados, alumnos)
  return (
    <div className="flex items-center gap-1">
      <CPADot nota={avgs.concreto} label="C" />
      <CPADot nota={avgs.pictorico} label="P" />
      <CPADot nota={avgs.abstracto} label="A" />
    </div>
  )
}

function CPADot({ nota, label }) {
  let color = 'bg-gray-200'
  if (nota != null) {
    if (nota >= 7) color = 'bg-green-400'
    else if (nota >= 5) color = 'bg-yellow-400'
    else color = 'bg-red-400'
  }
  return (
    <div className="flex items-center gap-0.5" title={`${label}: ${nota != null ? nota.toFixed(1) : '-'}`}>
      <span className="text-[9px] text-gray-400 font-medium">{label}</span>
      <div className={`w-2 h-2 rounded-full ${color}`} />
    </div>
  )
}

function exportCSV(tareasClase, resultados, alumnos) {
  const headers = ['Tarea', 'Secuencia', 'Estado', 'Alumno', 'Calificacion', 'Concreto', 'Pictorico', 'Abstracto']
  const rows = []
  for (const tarea of tareasClase) {
    const resTarea = resultados[tarea.id] ?? {}
    for (const alumno of alumnos) {
      const r = resTarea[alumno.id]
      rows.push([
        tarea.nombre,
        tarea.secuencia_ref ?? '',
        tarea.estado,
        alumno.nombre,
        r ? (r.calificacion_manual ?? r.calificacion ?? '') : '',
        r?.scores_cpa?.concreto?.nota ?? '',
        r?.scores_cpa?.pictorico?.nota ?? '',
        r?.scores_cpa?.abstracto?.nota ?? '',
      ])
    }
  }
  const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'resultados-clase.csv'
  a.click()
  URL.revokeObjectURL(url)
}

// ── Tabs ────────────────────────────────────────────────────────

const TABS = [
  { id: 'tareas', label: 'Tareas', icon: null },
  { id: 'alumnos', label: 'Alumnos', icon: null },
  { id: 'progreso', label: 'Progreso', icon: null },
]

// ── Main page ────────────────────────────────────────────────────

export default function ClaseDetalle() {
  const { claseId } = useParams()
  const router = useRouter()
  const { profesor } = useAuthStore()
  const { data: claseResult, isLoading: loadingClase } = useClaseById(claseId)

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

  const [tab, setTab] = useState('tareas')
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

  // Sort state for tareas table
  const [sortKey, setSortKey] = useState('created_at')
  const [sortDir, setSortDir] = useState('desc')
  const [filtroEstado, setFiltroEstado] = useState('todos')

  const tareas = tareasData?.tareas ?? []
  const resultados = tareasData?.resultados ?? {}
  const tareasClase = useMemo(() => tareas.filter((t) => t.clase_id === claseId), [tareas, claseId])

  const bloqueadosClase = useMemo(
    () => alumnosBloqueados.filter((b) => alumnos.some((a) => a.id === b.alumno_id)),
    [alumnosBloqueados, alumnos],
  )

  // Latest intento per alumno
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
      const map = {}
      for (const i of data ?? []) {
        if (!map[i.alumno_id]) map[i.alumno_id] = i
      }
      return map
    },
    enabled: tareasClase.length > 0,
  })

  // Bloque actual
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

  // Tab counts
  const tareasEnCurso = tareasClase.filter((t) => t.estado === 'en_curso').length
  const tareasCompletadas = tareasClase.filter((t) => t.estado === 'completada').length

  // Filter alumnos
  const bloqueadosIds = new Set(bloqueadosClase.map((b) => b.alumno_id))
  const filteredAlumnos = useMemo(() => {
    if (filtro === 'bloqueados') return alumnos.filter((a) => bloqueadosIds.has(a.id))
    if (filtro === 'avanzando')
      return alumnos.filter((a) => !bloqueadosIds.has(a.id) && intentosData?.[a.id])
    if (filtro === 'sin_actividad') return alumnos.filter((a) => !intentosData?.[a.id])
    return alumnos
  }, [alumnos, filtro, bloqueadosIds, intentosData])

  // Filtered + sorted tareas for table
  const filteredTareas = useMemo(() => {
    let list = tareasClase
    if (filtroEstado !== 'todos') {
      list = list.filter((t) => t.estado === filtroEstado)
    }
    list = [...list].sort((a, b) => {
      let va, vb
      if (sortKey === 'promedio') {
        va = calcularPromedio(resultados[a.id]) ?? -1
        vb = calcularPromedio(resultados[b.id]) ?? -1
      } else if (sortKey === 'completada') {
        va = Object.keys(resultados[a.id] ?? {}).length
        vb = Object.keys(resultados[b.id] ?? {}).length
      } else if (sortKey === 'created_at') {
        va = new Date(a.created_at).getTime()
        vb = new Date(b.created_at).getTime()
      } else if (sortKey === 'fecha_limite') {
        va = a.fecha_limite ? new Date(a.fecha_limite).getTime() : 0
        vb = b.fecha_limite ? new Date(b.fecha_limite).getTime() : 0
      }
      return sortDir === 'asc' ? va - vb : vb - va
    })
    return list
  }, [tareasClase, filtroEstado, sortKey, sortDir, resultados])

  function toggleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

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
        <Link href="/profesor" className="text-sm text-blue-600 hover:text-blue-800 mt-2 inline-block">
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
        className="inline-flex items-center gap-1 text-sm text-tinta-400 hover:text-tinta mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Mis clases
      </Link>

      {/* Header card */}
      <div className="bg-white rounded-3xl border border-crema-300 p-6 sm:p-8 mb-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl leading-none">{clase.emoji || '🎓'}</span>
              <h1 className="text-2xl font-bold text-tinta">{clase.nombre}</h1>
            </div>
            <ClaseSwitcher currentClaseId={claseId} />
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/profesor/programa"
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold bg-amarillo text-tinta hover:bg-amarillo-hover transition-colors"
            >
              <Plus className="w-4 h-4" />
              Asignar tarea
            </Link>
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded-xl hover:bg-crema-100 transition-colors"
              >
                <MoreHorizontal className="w-5 h-5 text-tinta-400" />
              </button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                  <div className="absolute top-full right-0 mt-1 bg-white border border-crema-300 rounded-2xl shadow-lg z-50 min-w-[180px] py-1">
                    <button
                      onClick={() => { setMenuOpen(false); setNuevoNombre(clase.nombre); setModalRenombrar(true) }}
                      className="w-full text-left px-4 py-2 text-sm text-tinta-600 hover:bg-crema-50"
                    >
                      Renombrar
                    </button>
                    <button
                      onClick={() => { setMenuOpen(false); setModalEmoji(true) }}
                      className="w-full text-left px-4 py-2 text-sm text-tinta-600 hover:bg-crema-50"
                    >
                      Cambiar emoji
                    </button>
                    <div className="border-t border-crema-200 my-1" />
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
        </div>

        {/* Stats line */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-tinta-400 mb-2">
          <span>{alumnos.length} alumno{alumnos.length !== 1 ? 's' : ''}</span>
          <span className="text-crema-400">·</span>
          <span>{tareasClase.length} tarea{tareasClase.length !== 1 ? 's' : ''}</span>
          {bloqueActual && (
            <>
              <span className="text-crema-400">·</span>
              <span>{bloqueActual.emoji} {bloqueActual.titulo}</span>
            </>
          )}
          <span className="text-crema-400">·</span>
          <span>{progressPct}% del programa</span>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-xs h-1.5 bg-crema-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-amarillo rounded-full transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Blocked students banner (inside header card) */}
        {bloqueadosClase.length > 0 && (
          <div className="bg-orange-50 rounded-2xl p-4 mt-4">
            <p className="text-sm font-medium text-orange-700 mb-1">
              {bloqueadosClase.length} alumno{bloqueadosClase.length > 1 ? 's' : ''} bloqueado{bloqueadosClase.length > 1 ? 's' : ''}
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {bloqueadosClase.slice(0, 5).map((b) => (
                <Link
                  key={`${b.alumno_id}-${b.tarea_id}`}
                  href={`/profesor/clase/${claseId}/alumno/${b.alumno_id}`}
                  className="text-xs text-orange-600 hover:text-orange-800 hover:underline"
                >
                  <span className="font-semibold">{b.alumno_nombre.split(' ')[0]}</span>
                  {' '}
                  <span className="text-orange-500">({b.etapa})</span>
                </Link>
              ))}
              {bloqueadosClase.length > 5 && (
                <span className="text-xs text-orange-500">+{bloqueadosClase.length - 5} mas</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Tabs with counters */}
      <div className="flex items-center gap-1 border-b border-crema-300 mb-6">
        {TABS.map((t) => {
          let count = null
          if (t.id === 'alumnos') count = alumnos.length
          if (t.id === 'tareas') count = tareasClase.length
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                tab === t.id
                  ? 'border-amarillo text-tinta'
                  : 'border-transparent text-tinta-400 hover:text-tinta'
              }`}
            >
              {t.label}
              {count != null && (
                <span
                  className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-semibold ${
                    tab === t.id
                      ? 'bg-amarillo text-tinta'
                      : 'bg-crema-200 text-tinta-400'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* ── Tab: Alumnos ────────────────────────── */}
      {tab === 'alumnos' && (
        <div>
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
                    ? 'bg-tinta text-white'
                    : 'bg-crema-200 text-tinta-600 hover:bg-crema-300'
                }`}
              >
                {f.label}
              </button>
            ))}
            <div className="flex-1" />
            <button
              onClick={() => setModalAgregarAlumno(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium text-tinta-600 hover:bg-crema-100 border border-crema-300 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Agregar alumno</span>
            </button>
          </div>

          {filteredAlumnos.length === 0 ? (
            <div className="bg-white rounded-3xl border border-crema-300 p-12 text-center text-tinta-400">
              <p className="text-sm">
                {filtro === 'todos'
                  ? 'Sin alumnos. Agrega el primero.'
                  : 'Ningun alumno en esta categoria.'}
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

      {/* ── Tab: Tareas (table) ────────────────── */}
      {tab === 'tareas' && (
        <div>
          {/* Filters + actions */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {[
              { id: 'todos', label: 'Todos' },
              { id: 'en_curso', label: `En curso (${tareasEnCurso})` },
              { id: 'completada', label: `Completadas (${tareasCompletadas})` },
              { id: 'borrador', label: 'Borradores' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFiltroEstado(f.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  filtroEstado === f.id
                    ? 'bg-tinta text-white'
                    : 'bg-crema-200 text-tinta-600 hover:bg-crema-300'
                }`}
              >
                {f.label}
              </button>
            ))}
            <div className="flex-1" />
            <button
              onClick={() => exportCSV(tareasClase, resultados, alumnos)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium text-tinta-600 hover:bg-crema-100 border border-crema-300 transition-colors"
              title="Descargar CSV"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">CSV</span>
            </button>
            <Link
              href="/profesor/programa"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium bg-amarillo text-tinta hover:bg-amarillo-hover transition-colors sm:hidden"
            >
              <Plus className="w-4 h-4" />
            </Link>
          </div>

          {filteredTareas.length === 0 ? (
            <div className="bg-white rounded-3xl border border-crema-300 p-12 text-center text-tinta-400">
              <p className="text-sm">Sin tareas asignadas aun.</p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-crema-300 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-crema-200">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-tinta-400 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-tinta-400 uppercase tracking-wider">
                        Tarea
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-tinta-400 uppercase tracking-wider hidden md:table-cell">
                        Sec
                      </th>
                      <SortableHeader
                        label="Completada"
                        sortKey_="completada"
                        currentSort={sortKey}
                        currentDir={sortDir}
                        onToggle={toggleSort}
                      />
                      <SortableHeader
                        label="Promedio"
                        sortKey_="promedio"
                        currentSort={sortKey}
                        currentDir={sortDir}
                        onToggle={toggleSort}
                      />
                      <th className="text-center py-3 px-4 text-xs font-semibold text-tinta-400 uppercase tracking-wider hidden lg:table-cell">
                        C·P·A
                      </th>
                      <SortableHeader
                        label="Inicio"
                        sortKey_="created_at"
                        currentSort={sortKey}
                        currentDir={sortDir}
                        onToggle={toggleSort}
                        className="hidden sm:table-cell"
                      />
                      <SortableHeader
                        label="Limite"
                        sortKey_="fecha_limite"
                        currentSort={sortKey}
                        currentDir={sortDir}
                        onToggle={toggleSort}
                        className="hidden sm:table-cell"
                      />
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTareas.map((tarea) => {
                      const resTarea = resultados[tarea.id] ?? {}
                      const completados = Object.keys(resTarea).length
                      const prom = calcularPromedio(resTarea)
                      const pct = alumnos.length > 0 ? Math.round((completados / alumnos.length) * 100) : 0
                      return (
                        <tr
                          key={tarea.id}
                          onClick={() => router.push(`/profesor/clase/${claseId}/tarea/${tarea.id}`)}
                          className="border-b border-crema-100 last:border-b-0 hover:bg-crema-50 cursor-pointer transition-colors"
                        >
                          <td className="py-3 px-4">
                            <EstadoBadge estado={tarea.estado} />
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-medium text-tinta">{tarea.nombre}</span>
                          </td>
                          <td className="py-3 px-4 text-tinta-400 hidden md:table-cell">
                            {tarea.secuencia_ref ?? '-'}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="text-tinta-600">{completados}/{alumnos.length}</span>
                            <span className="text-tinta-400 ml-1 text-xs">({pct}%)</span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`font-semibold ${prom != null ? (prom >= 7 ? 'text-green-600' : prom >= 5 ? 'text-yellow-600' : 'text-red-600') : 'text-tinta-400'}`}>
                              {prom != null ? prom.toFixed(1) : '-'}
                            </span>
                          </td>
                          <td className="py-3 px-4 hidden lg:table-cell">
                            <div className="flex justify-center">
                              <CPADots resultados={resTarea} alumnos={alumnos} />
                            </div>
                          </td>
                          <td className="py-3 px-4 text-tinta-400 hidden sm:table-cell">
                            {formatFecha(tarea.created_at)}
                          </td>
                          <td className="py-3 px-4 text-tinta-400 hidden sm:table-cell">
                            {formatFecha(tarea.fecha_limite)}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Tab: Progreso ────────────────────────── */}
      {tab === 'progreso' && (
        <div>
          <div className="bg-white rounded-3xl border border-crema-300 p-6 overflow-hidden">
            <HeatmapCPA alumnos={alumnos} tareas={tareasClase} resultados={resultados} />
          </div>
        </div>
      )}

      {/* ── Modals ────────────────────────────────── */}

      {/* Modal agregar alumno */}
      <Modal
        abierto={modalAgregarAlumno}
        onCerrar={() => { setModalAgregarAlumno(false); setNuevoAlumno(''); setError(null) }}
        titulo="Agregar alumno"
      >
        <form onSubmit={handleAgregarAlumno} className="space-y-4">
          <div>
            <label className="label-base">Nombre completo</label>
            <input
              type="text"
              value={nuevoAlumno}
              onChange={(e) => setNuevoAlumno(e.target.value)}
              placeholder="Ej. Maria Lopez Garcia"
              className="input-base"
              autoFocus
            />
          </div>
          <MensajeError mensaje={error} onCerrar={() => setError(null)} />
          <Boton type="submit" variante="primario" size="md" className="w-full" disabled={!nuevoAlumno.trim()}>
            Agregar alumno
          </Boton>
        </form>
      </Modal>

      {/* Modal renombrar */}
      <Modal abierto={modalRenombrar} onCerrar={() => setModalRenombrar(false)} titulo="Renombrar clase">
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            if (!nuevoNombre.trim()) return
            const { error: err } = await supabase.from('clases').update({ nombre: nuevoNombre.trim() }).eq('id', claseId)
            if (!err) { setModalRenombrar(false); window.location.reload() }
            else setError(err.message)
          }}
          className="space-y-4"
        >
          <div>
            <label className="label-base">Nombre de la clase</label>
            <input type="text" value={nuevoNombre} onChange={(e) => setNuevoNombre(e.target.value)} className="input-base" autoFocus />
          </div>
          <Boton type="submit" variante="primario" size="md" className="w-full" disabled={!nuevoNombre.trim()}>
            Guardar
          </Boton>
        </form>
      </Modal>

      {/* Modal cambiar emoji */}
      <Modal abierto={modalEmoji} onCerrar={() => setModalEmoji(false)} titulo="Cambiar emoji">
        <div className="grid grid-cols-6 gap-2">
          {['📐', '📏', '🔢', '📊', '🧮', '✏️', '📚', '🎓', '🏫', '⭐', '🌟', '💡', '🔬', '🧪', '🎯', '📝', '🗂️', '🌈'].map((emoji) => (
            <button
              key={emoji}
              onClick={async () => {
                const { error: err } = await supabase.from('clases').update({ emoji }).eq('id', claseId)
                if (!err) { setModalEmoji(false); window.location.reload() }
                else setError(err.message)
              }}
              className="text-2xl p-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {emoji}
            </button>
          ))}
        </div>
      </Modal>

      {/* Modal archivar */}
      <Modal abierto={modalArchivar} onCerrar={() => setModalArchivar(false)} titulo="Archivar clase">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Al archivar esta clase, dejara de aparecer en tu lista de clases activas.
            Los datos se conservan y podras restaurarla despues.
          </p>
          <p className="text-sm font-medium text-gray-700">
            Clase: <strong>{clase?.nombre}</strong> ({alumnos.length} alumno{alumnos.length !== 1 ? 's' : ''})
          </p>
          <div className="flex gap-3">
            <Boton
              variante="peligro"
              onClick={async () => {
                const { error: err } = await supabase.from('clases').update({ archivada: true }).eq('id', claseId)
                if (!err) router.push('/profesor')
                else { setError(err.message); setModalArchivar(false) }
              }}
            >
              Archivar
            </Boton>
            <Boton variante="secundario" onClick={() => setModalArchivar(false)}>Cancelar</Boton>
          </div>
        </div>
      </Modal>

      {/* Modal eliminar */}
      <Modal
        abierto={modalEliminar}
        onCerrar={() => { setModalEliminar(false); setConfirmEliminar('') }}
        titulo="Eliminar clase"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Esta accion es <strong>irreversible</strong>. Se eliminaran permanentemente todos los alumnos, tareas, resultados e intentos.
          </p>
          <p className="text-sm font-medium text-gray-700">
            Clase: <strong>{clase?.nombre}</strong> ({alumnos.length} alumno{alumnos.length !== 1 ? 's' : ''}, {tareasClase.length} tarea{tareasClase.length !== 1 ? 's' : ''})
          </p>
          <div>
            <label className="label-base">Escribe <strong>ELIMINAR</strong> para confirmar</label>
            <input type="text" value={confirmEliminar} onChange={(e) => setConfirmEliminar(e.target.value)} className="input-base" placeholder="ELIMINAR" />
          </div>
          <div className="flex gap-3">
            <Boton
              variante="peligro"
              disabled={confirmEliminar !== 'ELIMINAR' || eliminando}
              onClick={async () => {
                setEliminando(true)
                try {
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

// ── Sub-components ────────────────────────────────────────────

function EstadoBadge({ estado }) {
  const styles = {
    en_curso: 'bg-green-50 text-green-700 border-green-200',
    completada: 'bg-crema-100 text-tinta-600 border-crema-300',
    borrador: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  }
  const labels = {
    en_curso: 'En curso',
    completada: 'Finalizada',
    borrador: 'Borrador',
  }
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${styles[estado] ?? styles.borrador}`}>
      {estado === 'en_curso' && <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />}
      {estado === 'completada' && <span className="text-green-500">✓</span>}
      {labels[estado] ?? estado}
    </span>
  )
}

function SortableHeader({ label, sortKey_, currentSort, currentDir, onToggle, className = '' }) {
  const active = currentSort === sortKey_
  return (
    <th
      className={`py-3 px-4 text-xs font-semibold text-tinta-400 uppercase tracking-wider cursor-pointer hover:text-tinta select-none text-center ${className}`}
      onClick={() => onToggle(sortKey_)}
    >
      <div className="inline-flex items-center gap-1">
        {label}
        {active ? (
          currentDir === 'asc' ? (
            <ChevronUp className="w-3 h-3" />
          ) : (
            <ChevronDown className="w-3 h-3" />
          )
        ) : (
          <ArrowUpDown className="w-3 h-3 opacity-30" />
        )}
      </div>
    </th>
  )
}
