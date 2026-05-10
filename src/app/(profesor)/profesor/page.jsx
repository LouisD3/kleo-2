'use client'

import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import {
  ChevronRight,
  Flame,
  Sparkles,
  Target,
} from 'lucide-react'
import NavBar from '@/components/layout/NavBar.jsx'
import ChecklistOnboarding from '@/components/profesor/ChecklistOnboarding.jsx'
import TablaTareas from '@/components/profesor/TablaTareas.jsx'
import Boton from '@/components/ui/Boton.jsx'
import Spinner from '@/components/ui/Spinner.jsx'
import {
  calcularPromedio,
  useAlumnos,
  useDuplicarTarea,
  useEliminarTarea,
  useTareasProfesor,
} from '@/hooks/useTareas.js'
import useAuthStore from '@/store/useAuthStore.js'

function getSaludo() {
  const h = new Date().getHours()
  if (h < 12) return 'Buenos días'
  if (h < 19) return 'Buenas tardes'
  return 'Buenas noches'
}

/* ── Color palette for class cards ── */
const CLASS_COLORS = [
  { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'bg-blue-500', accent: 'text-blue-600' },
  { bg: 'bg-amber-50', border: 'border-amber-200', icon: 'bg-amber-500', accent: 'text-amber-600' },
  { bg: 'bg-purple-50', border: 'border-purple-200', icon: 'bg-purple-500', accent: 'text-purple-600' },
  { bg: 'bg-emerald-50', border: 'border-emerald-200', icon: 'bg-emerald-500', accent: 'text-emerald-600' },
  { bg: 'bg-rose-50', border: 'border-rose-200', icon: 'bg-rose-500', accent: 'text-rose-600' },
]

function ClaseCard({ clase, tareas, resultados, colorIdx, onClick }) {
  const colors = CLASS_COLORS[colorIdx % CLASS_COLORS.length]
  const claseId = clase.id

  const { enCurso, completadasClase, promedio, entregas } = useMemo(() => {
    const tareasClase = tareas.filter((t) => t.clase_id === claseId)
    const ec = tareasClase.filter((t) => t.estado === 'en_curso').length
    const cc = tareasClase.filter((t) => t.estado === 'completada').length

    const notas = []
    let ent = 0
    for (const t of tareasClase) {
      const resMap = resultados[t.id] ?? {}
      const keys = Object.keys(resMap)
      if (t.estado !== 'borrador') ent += keys.length
      for (const alumnoId of keys) {
        const r = resMap[alumnoId]
        const nota = r.calificacion_manual ?? r.calificacion
        if (nota !== null && nota !== undefined) notas.push(nota)
      }
    }
    const prom = notas.length === 0 ? null : (notas.reduce((a, b) => a + b, 0) / notas.length).toFixed(1)

    return { enCurso: ec, completadasClase: cc, promedio: prom, entregas: ent }
  }, [tareas, resultados, claseId])

  return (
    <button
      onClick={onClick}
      className={`${colors.bg} border ${colors.border} rounded-2xl p-5 text-left hover:shadow-md hover:-translate-y-0.5 transition-all active:scale-[0.98] cursor-pointer`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 ${colors.icon} rounded-xl flex items-center justify-center`}>
            <span className="text-white text-sm font-bold">
              {clase.nombre?.charAt(0)?.toUpperCase() ?? 'C'}
            </span>
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">{clase.nombre}</p>
            {clase.grado && (
              <p className="text-xs text-gray-500">{clase.grado}</p>
            )}
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-400" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/60 rounded-xl px-3 py-2.5">
          <p className="text-xs text-gray-500 mb-0.5">Promedio</p>
          <p className={`text-lg font-bold ${promedio !== null ? colors.accent : 'text-gray-300'}`}>
            {promedio !== null ? promedio : '—'}
          </p>
        </div>
        <div className="bg-white/60 rounded-xl px-3 py-2.5">
          <p className="text-xs text-gray-500 mb-0.5">Entregas</p>
          <p className={`text-lg font-bold ${entregas > 0 ? colors.accent : 'text-gray-300'}`}>
            {entregas}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-white/80">
        {enCurso > 0 ? (
          <p className="text-xs text-gray-600">
            <span className="font-semibold">{enCurso}</span> tarea{enCurso !== 1 ? 's' : ''} en curso
          </p>
        ) : completadasClase > 0 ? (
          <p className="text-xs text-gray-500">
            {completadasClase} tarea{completadasClase !== 1 ? 's' : ''} completada{completadasClase !== 1 ? 's' : ''}
          </p>
        ) : (
          <p className={`text-xs font-medium ${colors.accent}`}>Asignar tareas</p>
        )}
      </div>
    </button>
  )
}

export default function DashboardProfesor() {
  const router = useRouter()
  const { profesor, clase, clases } = useAuthStore()
  const { data, isLoading } = useTareasProfesor(profesor?.id)
  const tareas = data?.tareas ?? []
  const resultados = data?.resultados ?? {}
  const { data: alumnos = [] } = useAlumnos(clase?.id)

  const eliminarTareaMut = useEliminarTarea()
  const duplicarTareaMut = useDuplicarTarea()
  const [filtroClases, setFiltroClases] = useState([])
  const [tabActiva, setTabActiva] = useState('todas')

  const clasesMap = useMemo(() => {
    const map = {}
    for (const c of clases) map[c.id] = c
    return map
  }, [clases])

  const tareasFiltradas = useMemo(() => {
    let filtered = tareas
    if (filtroClases.length > 0) {
      filtered = filtered.filter((t) => filtroClases.includes(t.clase_id))
    }
    if (tabActiva !== 'todas') {
      filtered = filtered.filter((t) => t.estado === tabActiva)
    }
    return filtered
  }, [tareas, filtroClases, tabActiva])

  function toggleFiltroClase(claseId) {
    setFiltroClases((prev) =>
      prev.includes(claseId) ? prev.filter((id) => id !== claseId) : [...prev, claseId],
    )
  }

  // Tasks that need attention: en_curso with at least 1 result submitted
  const tareasAtencion = useMemo(() => {
    return tareas
      .filter((t) => t.estado === 'en_curso')
      .map((t) => {
        const resMap = resultados[t.id] ?? {}
        const entregados = Object.keys(resMap).length
        const promedio = calcularPromedio(resMap)
        return { tarea: t, entregados, promedio }
      })
      .filter((item) => item.entregados > 0)
      .sort((a, b) => b.entregados - a.entregados)
  }, [tareas, resultados])

  const completadas = tareas.filter((t) => t.estado === 'completada').length
  const enCurso = tareas.filter((t) => t.estado === 'en_curso').length
  const borradores = tareas.filter((t) => t.estado === 'borrador').length

  const tabs = [
    { key: 'todas', label: 'Todas', count: tareas.length },
    { key: 'en_curso', label: 'En curso', count: enCurso },
    { key: 'borrador', label: 'Borradores', count: borradores },
    { key: 'completada', label: 'Completadas', count: completadas },
  ]

  // Weekly streak: count weeks with at least 1 task created
  const rachaEstaSemana = useMemo(() => {
    const ahora = new Date()
    const inicioSemana = new Date(ahora)
    inicioSemana.setDate(ahora.getDate() - ahora.getDay())
    inicioSemana.setHours(0, 0, 0, 0)
    return tareas.filter((t) => new Date(t.created_at) >= inicioSemana).length
  }, [tareas])

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar titulo="Mis clases" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
        {/* ── Hero Banner ── */}
        <div className="rounded-2xl bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border border-amber-200/60 p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                ¡{getSaludo()}, {profesor?.nombre?.split(' ')[0] ?? 'Profesor'}!
              </h1>
              {tareasAtencion.length > 0 ? (
                <p className="text-sm font-medium text-amber-700 mt-1.5">
                  Tienes {tareasAtencion.length} tarea{tareasAtencion.length !== 1 ? 's' : ''} con entregas sin revisar.
                </p>
              ) : tareas.length === 0 ? (
                <p className="text-sm text-gray-500 mt-1.5">
                  Empieza creando tu primera actividad con IA.
                </p>
              ) : (
                <p className="text-sm text-gray-500 mt-1.5">
                  Todo al día. ¡Sigue así!
                </p>
              )}
            </div>
            <Boton onClick={() => router.push('/profesor/generar')} variante="primario" size="md">
              <Sparkles className="w-4 h-4" />
              Generar con IA
            </Boton>
          </div>

          {/* Attention table inside hero */}
          {tareasAtencion.length > 0 && (
            <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-amber-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-amber-100/60">
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-amber-600 uppercase tracking-wide">Tarea</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-amber-600 uppercase tracking-wide hidden sm:table-cell">Materia</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-amber-600 uppercase tracking-wide hidden sm:table-cell">Clase</th>
                    <th className="text-right px-4 py-2.5 text-xs font-semibold text-amber-600 uppercase tracking-wide">Entregas</th>
                    <th className="text-right px-4 py-2.5 text-xs font-semibold text-amber-600 uppercase tracking-wide hidden sm:table-cell">Promedio</th>
                    <th className="w-8" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-50">
                  {tareasAtencion.slice(0, 5).map(({ tarea, entregados, promedio }) => (
                    <tr
                      key={tarea.id}
                      onClick={() => router.push(`/profesor/tarea/${tarea.id}`)}
                      className="hover:bg-amber-50/50 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="font-medium text-gray-900">{tarea.nombre}</span>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell text-gray-600">{tarea.materia}</td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                          {clasesMap[tarea.clase_id]?.nombre ?? '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="font-semibold text-amber-700">{entregados}</span>
                      </td>
                      <td className="px-4 py-3 text-right hidden sm:table-cell">
                        <span className="font-semibold text-gray-900">
                          {promedio !== null ? `${promedio}` : '—'}
                        </span>
                      </td>
                      <td className="px-2 py-3">
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Objective + streak bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-5 pt-5 border-t border-amber-200/40">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <Target className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-medium text-gray-700">Objetivo semanal</span>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      rachaEstaSemana >= i
                        ? 'bg-amber-400 text-white'
                        : 'bg-amber-100 text-amber-300'
                    }`}
                  >
                    {rachaEstaSemana >= i ? '✓' : i}
                  </div>
                ))}
              </div>
              <span className="text-xs text-gray-400">
                {rachaEstaSemana}/3 tareas esta semana
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Flame className={`w-4 h-4 ${rachaEstaSemana > 0 ? 'text-orange-500' : 'text-gray-300'}`} />
              <span className="text-sm font-medium text-gray-700">Racha</span>
              <span className={`text-sm font-bold ${rachaEstaSemana > 0 ? 'text-orange-600' : 'text-gray-400'}`}>
                {rachaEstaSemana > 0 ? '1 semana' : 'Inactiva'}
              </span>
            </div>
          </div>
        </div>

        {/* Onboarding checklist */}
        <ChecklistOnboarding
          tieneClase={clases.length > 0}
          tieneAlumnos={alumnos.length > 0}
          tieneTareas={tareas.length > 0}
        />

        {/* ── Class Cards ── */}
        {clases.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900">Mis clases</h2>
              <button
                onClick={() => router.push('/profesor/clase')}
                className="text-sm text-gray-500 hover:text-gray-700 font-medium flex items-center gap-1 transition-colors"
              >
                Gestionar
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {clases.map((c, i) => (
                <ClaseCard
                  key={c.id}
                  clase={c}
                  tareas={tareas}
                  resultados={resultados}
                  colorIdx={i}
                  onClick={() => router.push('/profesor/clase')}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Task Table Section ── */}
        <div id="tabla-tareas">
          {/* Filtros de clases */}
          {clases.length > 1 && (
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              <button
                onClick={() => setFiltroClases([])}
                className={`px-4 py-2 rounded-xl text-sm font-medium border whitespace-nowrap transition-all ${
                  filtroClases.length === 0
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                Todas las clases
              </button>
              {clases.map((c) => (
                <button
                  key={c.id}
                  onClick={() => toggleFiltroClase(c.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border whitespace-nowrap transition-all ${
                    filtroClases.includes(c.id)
                      ? 'border-gray-900 bg-gray-900 text-white'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {c.nombre}
                </button>
              ))}
            </div>
          )}

          {/* Tabs */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-1 bg-gray-100 rounded-xl p-1 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setTabActiva(tab.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    tabActiva === tab.key
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span
                      className={`ml-1.5 text-xs ${
                        tabActiva === tab.key ? 'text-gray-500' : 'text-gray-400'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="card p-16 flex items-center justify-center">
              <Spinner size="lg" />
            </div>
          ) : tareasFiltradas.length === 0 && tabActiva !== 'todas' ? (
            <div className="card p-12 text-center">
              <p className="text-gray-400 font-medium">
                No hay tareas {tabActiva === 'en_curso' ? 'en curso' : tabActiva === 'borrador' ? 'en borrador' : 'completadas'}
              </p>
            </div>
          ) : (
            <div className="card p-0 overflow-hidden">
              <TablaTareas
                tareas={tareasFiltradas}
                clasesMap={clasesMap}
                resultados={resultados}
                onEliminar={(id) => eliminarTareaMut.mutateAsync(id)}
                eliminando={eliminarTareaMut.isPending}
                onDuplicar={async (tarea) => {
                  const copia = await duplicarTareaMut.mutateAsync(tarea)
                  router.push(`/profesor/generar/tarea?tarea=${copia.id}`)
                }}
                duplicando={duplicarTareaMut.isPending}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
