'use client'

import {
  Activity,
  ArrowRight,
  BookOpen,
  CalendarClock,
  CheckCircle,
  ClipboardCheck,
  GraduationCap,
  HandHelping,
  PartyPopper,
  Plus,
  Sparkles,
  Star,
  TrendingDown,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import ClaseCard from '@/components/profesor/ClaseCard'
import Boton from '@/components/ui/Boton.jsx'
import MensajeError from '@/components/ui/MensajeError.jsx'
import Modal from '@/components/ui/Modal.jsx'
import Spinner from '@/components/ui/Spinner.jsx'
import { useClasesEnriched } from '@/hooks/useClasesEnriched.js'
import { useTareasProfesor } from '@/hooks/useTareas.js'
import { supabase } from '@/lib/supabase.js'
import { PDAS_MATEMATICAS_1 } from '@/mock/pdas/matematicas_1.js'
import useAuthStore from '@/store/useAuthStore.js'

function extractFirstName(nombre) {
  if (!nombre) return 'Profe'
  const cleaned = nombre.includes('@') ? nombre.split('@')[0] : nombre
  const first = cleaned.split(/[\s._-]/)[0]
  return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase()
}

function saludoDelDia() {
  const h = new Date().getHours()
  if (h < 12) return 'Buenos dias'
  if (h < 18) return 'Buenas tardes'
  return 'Buenas noches'
}

function StatPill({ icon: Icon, value, label, accent = false, delay = '' }) {
  return (
    <div
      className={`group relative flex items-center gap-3 p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
        accent
          ? 'bg-gradient-to-br from-amarillo-soft to-amber-100/50'
          : 'bg-crema-100'
      } ${delay}`}
    >
      <div
        className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:rotate-3 ${
          accent
            ? 'bg-gradient-to-br from-amarillo to-amarillo-hover shadow-sm shadow-amarillo/20'
            : 'bg-tinta text-amarillo'
        }`}
      >
        <Icon className={`w-5 h-5 ${accent ? 'text-tinta' : ''}`} />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-extrabold text-tinta tabular-nums leading-none tracking-tight animate-count-up">
          {value}
        </p>
        <p className="text-xs text-tinta-400 mt-1 font-medium">{label}</p>
      </div>
    </div>
  )
}

function NotificationRow({ item, index }) {
  const Icon = item.icon
  const delays = ['animate-slide-up-1', 'animate-slide-up-2', 'animate-slide-up-3', 'animate-slide-up-4', 'animate-slide-up-5']
  const inner = (
    <div className={`flex items-center gap-3 group p-3 -mx-3 rounded-2xl transition-all duration-200 hover:bg-white/60 ${delays[index] ?? ''}`}>
      <div
        className={`w-9 h-9 rounded-2xl ${item.iconBg} flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110`}
      >
        <Icon className={`w-4 h-4 ${item.iconColor}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-tinta-600 font-medium truncate">
          {item.bold}
        </p>
        <p className="text-xs text-tinta-400 mt-0.5">{item.rest}</p>
      </div>
      {item.href && (
        <ArrowRight className="w-4 h-4 text-tinta-400/0 group-hover:text-tinta-400 transition-all duration-200 group-hover:translate-x-0.5" />
      )}
    </div>
  )
  return item.href ? (
    <Link href={item.href} className="block">
      {inner}
    </Link>
  ) : (
    inner
  )
}

export default function PaginaMisClases() {
  const { profesor, clases: authClases, setClase, agregarClaseLocal } = useAuthStore()
  const [clases, setClases] = useState([])
  const [modalNuevaClase, setModalNuevaClase] = useState(false)
  const [formClase, setFormClase] = useState({ nombre: '', emoji: '�' })
  const [error, setError] = useState(null)
  const [showAllNotifs, setShowAllNotifs] = useState(false)

  useEffect(() => {
    if (!profesor) return
    supabase
      .from('clases')
      .select('*')
      .eq('profesor_id', profesor.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => setClases(data ?? []))
  }, [profesor])

  const { data: clasesEnriched, isLoading } = useClasesEnriched(profesor?.id, clases)
  const { data: tareasData } = useTareasProfesor(profesor?.id)

  // Priority-based notification items
  const notifications = useMemo(() => {
    const tareas = tareasData?.tareas ?? []
    const resultados = tareasData?.resultados ?? {}
    const enriched = clasesEnriched ?? []
    const now = Date.now()
    const items = []

    const bloqueados = enriched.reduce((sum, c) => sum + c.alumnosBloqueadosCount, 0)
    if (bloqueados > 0) {
      items.push({
        key: 'bloqueados',
        icon: HandHelping,
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-600',
        href: '/profesor/clase',
        bold: `${bloqueados} ${bloqueados === 1 ? 'alumno bloqueado' : 'alumnos bloqueados'}`,
        rest: 'Hace +3 dias sin avance',
      })
    }

    const tareasConRes = tareas.filter(
      (t) =>
        t.estado === 'en_curso' && resultados[t.id] && Object.keys(resultados[t.id]).length > 0,
    )
    if (tareasConRes.length > 0) {
      items.push({
        key: 'resultados',
        icon: ClipboardCheck,
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-600',
        href: `/profesor/tarea/${tareasConRes[0].id}`,
        bold: `${tareasConRes.length} ${tareasConRes.length === 1 ? 'tarea tiene' : 'tareas tienen'} resultados`,
        rest: 'Sin revisar',
      })
    }

    const tresDiasMs = 3 * 24 * 60 * 60 * 1000
    const tareasConFecha = tareas
      .filter((t) => t.estado === 'en_curso' && t.fecha_limite)
      .map((t) => ({ ...t, fechaMs: new Date(t.fecha_limite).getTime() }))
      .filter((t) => t.fechaMs > now && t.fechaMs - now < tresDiasMs)
      .sort((a, b) => a.fechaMs - b.fechaMs)
    if (tareasConFecha.length > 0) {
      const prox = tareasConFecha[0]
      const dias = Math.floor((prox.fechaMs - now) / (1000 * 60 * 60 * 24))
      const fechaLabel = dias === 0 ? 'hoy' : dias === 1 ? 'manana' : `en ${dias} dias`
      const res = resultados[prox.id] ?? {}
      const completados = Object.values(res).filter((r) => r.calificacion != null).length
      const clase = enriched.find((c) => c.id === prox.clase_id)
      const total = clase?.alumnosCount ?? 0
      items.push({
        key: 'deadline',
        icon: CalendarClock,
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        href: `/profesor/tarea/${prox.id}`,
        bold: `Fecha limite ${fechaLabel}`,
        rest: `${completados}/${total} completaron`,
      })
    }

    const unaSemanMs = 7 * 24 * 60 * 60 * 1000
    const cutoff = now - unaSemanMs
    const scoresC = []
    const scoresP = []
    const scoresA = []
    for (const tareaId of Object.keys(resultados)) {
      for (const r of Object.values(resultados[tareaId])) {
        if (!r.scores_cpa || !r.ultima_tentativa_at) continue
        if (new Date(r.ultima_tentativa_at).getTime() < cutoff) continue
        if (r.scores_cpa.concreto?.score != null) scoresC.push(r.scores_cpa.concreto.score)
        if (r.scores_cpa.pictorico?.score != null) scoresP.push(r.scores_cpa.pictorico.score)
        if (r.scores_cpa.abstracto?.score != null) scoresA.push(r.scores_cpa.abstracto.score)
      }
    }
    const avg = (arr) => (arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : null)
    const steps = [
      { label: 'Concreto', avg: avg(scoresC) },
      { label: 'Pictorico', avg: avg(scoresP) },
      { label: 'Abstracto', avg: avg(scoresA) },
    ].filter((s) => s.avg !== null)
    if (steps.length > 0) {
      const hardest = steps.reduce((min, s) => (s.avg < min.avg ? s : min))
      items.push({
        key: 'paso-dificil',
        icon: TrendingDown,
        iconBg: 'bg-rose-100',
        iconColor: 'text-rose-600',
        bold: `Paso mas dificil: ${hardest.label}`,
        rest: `Promedio ${hardest.avg.toFixed(1)}/10`,
      })
    }

    const secCompletadas = new Set()
    for (const t of tareas) {
      if (t.secuencia_ref && t.estado === 'completada') secCompletadas.add(t.secuencia_ref)
    }
    if (secCompletadas.size > 0) {
      items.push({
        key: 'avance',
        icon: GraduationCap,
        iconBg: 'bg-violet-100',
        iconColor: 'text-violet-600',
        href: '/profesor/programa',
        bold: `${secCompletadas.size}/36 secuencias completadas`,
        rest: `${Math.round((secCompletadas.size / 36) * 100)}% del programa`,
      })
    }

    for (const t of tareas) {
      if (t.estado !== 'en_curso' && t.estado !== 'completada') continue
      const res = resultados[t.id]
      if (!res) continue
      const clase = enriched.find((c) => c.id === t.clase_id)
      if (!clase || clase.alumnosCount === 0) continue
      const completados = Object.values(res).filter((r) => r.calificacion != null).length
      if (completados === clase.alumnosCount) {
        items.push({
          key: `tarea-100-${t.id}`,
          icon: PartyPopper,
          iconBg: 'bg-emerald-100',
          iconColor: 'text-emerald-600',
          href: `/profesor/tarea/${t.id}`,
          bold: 'Todos completaron una tarea',
          rest: t.nombre,
        })
        break
      }
    }

    if (steps.length > 0) {
      const best = steps.reduce((max, s) => (s.avg > max.avg ? s : max))
      if (best.avg >= 7) {
        items.push({
          key: 'paso-fuerte',
          icon: Star,
          iconBg: 'bg-yellow-100',
          iconColor: 'text-yellow-600',
          bold: `Tu grupo domina ${best.label}`,
          rest: `Promedio ${best.avg.toFixed(1)}/10`,
        })
      }
    }

    let completadosSemana = 0
    for (const tareaId of Object.keys(resultados)) {
      for (const r of Object.values(resultados[tareaId])) {
        if (r.ultima_tentativa_at && new Date(r.ultima_tentativa_at).getTime() > cutoff) {
          completadosSemana++
        }
      }
    }
    if (completadosSemana > 0) {
      items.push({
        key: 'actividad',
        icon: Activity,
        iconBg: 'bg-emerald-100',
        iconColor: 'text-emerald-600',
        bold: `${completadosSemana} ${completadosSemana === 1 ? 'tarea completada' : 'tareas completadas'}`,
        rest: 'Esta semana',
      })
    }

    const secEnCursoOrDone = new Set()
    for (const t of tareas) {
      if (t.secuencia_ref && (t.estado === 'en_curso' || t.estado === 'completada')) {
        secEnCursoOrDone.add(t.secuencia_ref)
      }
    }
    const siguiente = PDAS_MATEMATICAS_1.find((p) => !secEnCursoOrDone.has(p.secuencia))
    items.push({
      key: 'siguiente',
      icon: Sparkles,
      iconBg: 'bg-tinta/10',
      iconColor: 'text-tinta',
      href: siguiente ? `/profesor/programa/${siguiente.secuencia}` : '/profesor/programa',
      bold: siguiente ? `Siguiente: Sec. ${siguiente.secuencia}` : 'Explorar el programa',
      rest: siguiente?.titulo ?? '36 secuencias disponibles',
    })

    const urgentKeys = new Set(['bloqueados', 'resultados', 'deadline', 'paso-dificil'])
    const positiveKeys = new Set(['tarea-100', 'paso-fuerte', 'avance', 'actividad', 'siguiente'])
    const urgent = items.filter((n) => urgentKeys.has(n.key))
    const positive = items.filter((n) => positiveKeys.has(n.key) || n.key.startsWith('tarea-100'))

    if (urgent.length >= 2 && positive.length > 0) {
      return [...urgent.slice(0, 2), positive[0]]
    }
    return items.slice(0, 3)
  }, [tareasData, clasesEnriched])

  async function handleCrearClase(e) {
    e.preventDefault()
    if (!formClase.nombre.trim()) {
      setError('Escribe un nombre para la clase.')
      return
    }
    const { data, error: err } = await supabase
      .from('clases')
      .insert({
        profesor_id: profesor.id,
        nombre: formClase.nombre,
        grado: '1 Secundaria',
      })
      .select()
      .single()

    if (err) {
      setError(err.message)
      return
    }

    const claseConEmoji = { ...data, emoji: formClase.emoji }
    setClases((prev) => [claseConEmoji, ...prev])
    setClase(data)
    agregarClaseLocal(data)
    setModalNuevaClase(false)
    setFormClase({ nombre: '', emoji: '🎓' })
  }

  const totalAlumnos = (clasesEnriched ?? []).reduce((sum, c) => sum + c.alumnosCount, 0)
  const totalTareasActivas = (clasesEnriched ?? []).reduce((sum, c) => sum + c.tareasActivas, 0)
  const totalBloqueados = (clasesEnriched ?? []).reduce(
    (sum, c) => sum + c.alumnosBloqueadosCount,
    0,
  )

  if (isLoading && clases.length > 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-6 md:px-8 py-8 max-w-7xl mx-auto">
      {/* Main dashboard card */}
      <div className="bg-white rounded-3xl shadow-[0_1px_2px_rgba(0,0,0,0.03),0_2px_8px_rgba(0,0,0,0.02)] p-6 sm:p-8 mb-8 animate-fade-in">
        {/* Greeting */}
        <div className="relative mb-8">
          <div className="absolute -top-2 -left-2 w-28 h-28 bg-amarillo/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-tinta tracking-tight">
              {saludoDelDia()},{' '}
              {extractFirstName(profesor?.nombre)}
            </h1>
            <p className="text-tinta-400 mt-1.5 text-sm">
              {notifications.some((n) => ['bloqueados', 'resultados', 'deadline'].includes(n.key))
                ? 'Tienes cosas pendientes hoy'
                : 'Todo va bien, sigue asi'}
            </p>
          </div>
        </div>

        {/* Stats row — sub-cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
          <StatPill
            icon={Users}
            value={totalAlumnos}
            label="Alumnos"
            delay="animate-slide-up-1"
          />
          <StatPill
            icon={BookOpen}
            value={totalTareasActivas}
            label="Tareas activas"
            accent
            delay="animate-slide-up-2"
          />
          {totalBloqueados > 0 ? (
            <div className="group relative flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/60 transition-all duration-300 hover:scale-[1.02] animate-slide-up-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-200 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:rotate-3">
                <HandHelping className="w-5 h-5 text-amber-700" />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-extrabold text-amber-700 tabular-nums leading-none tracking-tight animate-count-up">
                  {totalBloqueados}
                </p>
                <p className="text-xs text-amber-600 mt-1 font-medium">Necesitan ayuda</p>
              </div>
              <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-amber-400 animate-pulse-soft" />
            </div>
          ) : (
            <StatPill
              icon={CheckCircle}
              value="0"
              label="Sin bloqueos"
              delay="animate-slide-up-3"
            />
          )}
        </div>

        {/* Notifications + Quick actions — sub-cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Notifications panel */}
          <div className="lg:col-span-2 bg-crema-100 rounded-2xl p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold text-tinta uppercase tracking-wider">
                Actividad reciente
              </h2>
              {notifications.length > 3 && (
                <button
                  type="button"
                  onClick={() => setShowAllNotifs((v) => !v)}
                  className="text-xs text-tinta-400 hover:text-tinta transition-colors font-medium"
                >
                  {showAllNotifs ? 'Menos' : `+${notifications.length - 3} mas`}
                </button>
              )}
            </div>
            <div className="space-y-1">
              {notifications.slice(0, showAllNotifs ? undefined : 3).map((n, i) => (
                <NotificationRow key={n.key} item={n} index={i} />
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-gradient-to-br from-tinta to-tinta-600 rounded-2xl p-5 sm:p-6 flex flex-col justify-between animate-slide-up-3">
            <div>
              <h2 className="text-xs font-bold text-amarillo uppercase tracking-wider mb-0.5">
                Acciones rapidas
              </h2>
              <p className="text-xs text-white/50 mb-4">Atajos para tu dia a dia</p>
            </div>
            <div className="space-y-2.5">
              <Link
                href="/profesor/biblioteca"
                className="flex items-center gap-3 p-3 rounded-2xl bg-white/10 hover:bg-white/15 transition-colors group"
              >
                <BookOpen className="w-4 h-4 text-amarillo" />
                <span className="text-sm text-white font-medium">Asignar tarea</span>
                <ArrowRight className="w-3.5 h-3.5 text-white/40 ml-auto group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/profesor/generar"
                className="flex items-center gap-3 p-3 rounded-2xl bg-white/10 hover:bg-white/15 transition-colors group"
              >
                <Sparkles className="w-4 h-4 text-amarillo" />
                <span className="text-sm text-white font-medium">Generar con IA</span>
                <ArrowRight className="w-3.5 h-3.5 text-white/40 ml-auto group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/profesor/clase"
                className="flex items-center gap-3 p-3 rounded-2xl bg-white/10 hover:bg-white/15 transition-colors group"
              >
                <Users className="w-4 h-4 text-amarillo" />
                <span className="text-sm text-white font-medium">Gestionar clase</span>
                <ArrowRight className="w-3.5 h-3.5 text-white/40 ml-auto group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mis clases card */}
      <div className="bg-white rounded-3xl shadow-[0_1px_2px_rgba(0,0,0,0.03),0_2px_8px_rgba(0,0,0,0.02)] p-6 sm:p-8 mb-8 animate-slide-up-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-tinta">Mis clases</h2>
          {clases.length > 0 && (
            <button
              onClick={() => setModalNuevaClase(true)}
              className="flex items-center gap-1.5 text-sm font-medium text-tinta-400 hover:text-tinta transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nueva clase
            </button>
          )}
        </div>

        {/* Empty state */}
        {clases.length === 0 && !isLoading && (
          <div className="bg-crema-100 rounded-2xl p-10 text-center">
            <div className="w-14 h-14 bg-amarillo/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-7 h-7 text-amarillo-hover" />
            </div>
            <p className="text-base font-bold text-tinta mb-1.5">Aun no tienes clases</p>
            <p className="text-sm text-tinta-400 mb-5">Crea tu primera para empezar el viaje</p>
            <Boton variante="primario" onClick={() => setModalNuevaClase(true)}>
              Crear mi primera clase
            </Boton>
          </div>
        )}

        {/* Class cards grid */}
        {(clasesEnriched ?? []).length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {clasesEnriched.map((clase) => (
              <ClaseCard key={clase.id} clase={clase} />
            ))}
          </div>
        )}
      </div>

      {/* Modal nueva clase */}
      <Modal
        abierto={modalNuevaClase}
        onCerrar={() => {
          setModalNuevaClase(false)
          setFormClase({ nombre: '', emoji: '🎓' })
          setError(null)
        }}
        titulo="Nueva clase"
      >
        <form onSubmit={handleCrearClase} className="space-y-4">
          <div>
            <label className="label-base">Nombre de la clase</label>
            <input
              type="text"
              value={formClase.nombre}
              onChange={(e) => setFormClase((p) => ({ ...p, nombre: e.target.value }))}
              placeholder="Ej. 1A Vespertino"
              className="input-base"
              autoFocus
            />
          </div>
          <div>
            <label className="label-base">Emoji</label>
            <div className="flex gap-2 flex-wrap">
              {['🎓', '📐', '🧮', '📚', '🔢', '⭐', '🚀', '🎯'].map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setFormClase((p) => ({ ...p, emoji: e }))}
                  className={`w-10 h-10 rounded-2xl text-xl flex items-center justify-center border-2 transition-colors ${
                    formClase.emoji === e
                      ? 'border-tinta bg-crema-100'
                      : 'border-crema-300 hover:border-crema-400'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
          <MensajeError mensaje={error} onCerrar={() => setError(null)} />
          <Boton type="submit" variante="primario" size="md" className="w-full">
            Crear clase
          </Boton>
        </form>
      </Modal>
    </div>
  )
}
