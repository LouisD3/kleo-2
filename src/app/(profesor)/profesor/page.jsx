'use client'

import {
  Activity,
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
  if (h < 12) return 'Buenos días'
  if (h < 18) return 'Buenas tardes'
  return 'Buenas noches'
}

function NotificationRow({ item }) {
  const Icon = item.icon
  const inner = (
    <div className="flex items-center gap-3 group">
      <div
        className={`w-8 h-8 rounded-lg ${item.iconBg} flex items-center justify-center shrink-0`}
      >
        <Icon className={`w-4 h-4 ${item.iconColor}`} />
      </div>
      <p className="text-sm text-tinta-600 group-hover:text-tinta transition-colors">
        <span className="font-semibold">{item.bold}</span>
        <span className="text-tinta-400"> · {item.rest}</span>
      </p>
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
  const [formClase, setFormClase] = useState({ nombre: '', emoji: '🎓' })
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

  // Priority-based notification items for hero card (always shows top 3)
  const notifications = useMemo(() => {
    const tareas = tareasData?.tareas ?? []
    const resultados = tareasData?.resultados ?? {}
    const enriched = clasesEnriched ?? []
    const now = Date.now()
    const items = []

    // --- Prio 1: Alumnos bloqueados ---
    const bloqueados = enriched.reduce((sum, c) => sum + c.alumnosBloqueadosCount, 0)
    if (bloqueados > 0) {
      items.push({
        key: 'bloqueados',
        icon: HandHelping,
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-600',
        href: '/profesor/clase',
        bold: `${bloqueados} ${bloqueados === 1 ? 'alumno bloqueado' : 'alumnos bloqueados'}`,
        rest: 'hace +3 dias',
      })
    }

    // --- Prio 2: Tareas con resultados sin revisar ---
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
        rest: 'sin revisar',
      })
    }

    // --- Prio 3: Deadline dans < 3 jours ---
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

    // --- Prio 4: Paso mas dificil (semana) ---
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
        rest: `prom. ${hardest.avg.toFixed(1)}`,
      })
    }

    // --- Prio 5: Avance del programa ---
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

    // --- Prio 5b: Tarea 100% completada (tous les élèves ont un résultat) ---
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
        break // only show the first one
      }
    }

    // --- Prio 5c: Best CPA step (celebrate what's working) ---
    if (steps.length > 0) {
      const best = steps.reduce((max, s) => (s.avg > max.avg ? s : max))
      if (best.avg >= 7) {
        items.push({
          key: 'paso-fuerte',
          icon: Star,
          iconBg: 'bg-yellow-100',
          iconColor: 'text-yellow-600',
          bold: `Tu grupo domina ${best.label}`,
          rest: `prom. ${best.avg.toFixed(1)}`,
        })
      }
    }

    // --- Prio 6: Actividad reciente (semana) ---
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
        rest: 'esta semana',
      })
    }

    // --- Prio 7: Siguiente secuencia (fallback) ---
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

    // Mix: 2 urgent max + always 1 positive in slot 3
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
        grado: '1° Secundaria',
      })
      .select()
      .single()

    if (err) {
      setError(err.message)
      return
    }

    // Store emoji in local enriched data (DB doesn't have emoji column yet)
    const claseConEmoji = { ...data, emoji: formClase.emoji }
    setClases((prev) => [claseConEmoji, ...prev])
    setClase(data)
    agregarClaseLocal(data)
    setModalNuevaClase(false)
    setFormClase({ nombre: '', emoji: '🎓' })
  }

  // Compute summary stats
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
    <div className="px-4 sm:px-6 md:px-8 py-8 animate-fade-in">
      {/* Hero card — greeting + CTAs */}
      <div className="grid grid-cols-12 gap-6 mb-8">
        <div className="col-span-12 lg:col-span-8 bg-white rounded-3xl shadow-sm p-8">
          <h1 className="text-3xl font-bold text-tinta tracking-tight">
            {saludoDelDia()}, {extractFirstName(profesor?.nombre)} 👋
          </h1>
          <p className="text-sm text-tinta-400 mt-1 mb-5">
            {notifications.some((n) => ['bloqueados', 'resultados', 'deadline'].includes(n.key))
              ? 'Esto necesita tu atencion'
              : 'Todo va bien — sigue asi'}
          </p>
          <div className="space-y-4">
            {notifications.slice(0, 3).map((n) => (
              <NotificationRow key={n.key} item={n} />
            ))}
          </div>
          {notifications.length > 3 && (
            <button
              type="button"
              onClick={() => setShowAllNotifs((v) => !v)}
              className="mt-4 text-sm text-tinta-400 hover:text-tinta transition-colors"
            >
              {showAllNotifs ? 'Ver menos' : `Ver mas (${notifications.length - 3})`}
            </button>
          )}
          {showAllNotifs && (
            <div className="mt-2 space-y-4">
              {notifications.slice(3).map((n) => (
                <NotificationRow key={n.key} item={n} />
              ))}
            </div>
          )}
        </div>

        {/* Stats card */}
        <div className="col-span-12 lg:col-span-4 bg-white rounded-3xl shadow-sm p-6 flex flex-col justify-between gap-3">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-crema-50">
            <div className="w-10 h-10 rounded-full bg-tinta text-amarillo flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-tinta tabular-nums leading-none">
                {totalAlumnos}
              </p>
              <p className="text-xs text-tinta-400 mt-0.5">Alumnos</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-crema-50">
            <div className="w-10 h-10 rounded-full bg-amarillo text-tinta flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-tinta tabular-nums leading-none">
                {totalTareasActivas}
              </p>
              <p className="text-xs text-tinta-400 mt-0.5">Tareas activas</p>
            </div>
          </div>
          {totalBloqueados > 0 ? (
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-amber-50">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
                <HandHelping className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600 tabular-nums leading-none">
                  {totalBloqueados}
                </p>
                <p className="text-xs text-amber-500 mt-0.5">Necesitan ayuda</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-crema-200">
              <div className="w-10 h-10 rounded-full bg-crema-300 text-tinta-400 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-tinta-400">Todo en orden</p>
                <p className="text-xs text-crema-500 mt-0.5">Sin alumnos bloqueados</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Empty state */}
      {clases.length === 0 && !isLoading && (
        <div className="bg-white rounded-3xl shadow-sm p-12 text-center">
          <p className="text-lg font-semibold text-tinta mb-2">Aún no tienes clases.</p>
          <p className="text-sm text-tinta-400 mb-6">¡Crea tu primera para empezar el viaje!</p>
          <Boton variante="primario" onClick={() => setModalNuevaClase(true)}>
            Crear mi primera clase
          </Boton>
        </div>
      )}

      {/* Class cards grid */}
      {(clasesEnriched ?? []).length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {clasesEnriched.map((clase) => (
            <ClaseCard key={clase.id} clase={clase} />
          ))}
        </div>
      )}

      {/* Create new class button */}
      {clases.length > 0 && (
        <button
          onClick={() => setModalNuevaClase(true)}
          className="flex items-center justify-center gap-2 w-full max-w-sm mx-auto px-4 py-3 rounded-full bg-crema-200 text-tinta-400 hover:bg-crema-300 hover:text-tinta transition-colors font-medium text-sm"
        >
          <Plus className="w-4 h-4" />
          Crear nueva clase
        </button>
      )}

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
              placeholder="Ej. 1°A Vespertino"
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
