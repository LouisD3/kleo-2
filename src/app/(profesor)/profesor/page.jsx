'use client'

import { AlertTriangle, BookOpen, CheckCircle, Plus, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import ClaseCard from '@/components/profesor/ClaseCard'
import Boton from '@/components/ui/Boton.jsx'
import MensajeError from '@/components/ui/MensajeError.jsx'
import Modal from '@/components/ui/Modal.jsx'
import Spinner from '@/components/ui/Spinner.jsx'
import { useClasesEnriched } from '@/hooks/useClasesEnriched.js'
import { supabase } from '@/lib/supabase.js'
import useAuthStore from '@/store/useAuthStore.js'

function capitalize(str) {
  if (!str) return ''
  return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
}

function saludoDelDia() {
  const h = new Date().getHours()
  if (h < 12) return 'Buenos días'
  if (h < 18) return 'Buenas tardes'
  return 'Buenas noches'
}

export default function PaginaMisClases() {
  const { profesor, clases: authClases, setClase, agregarClaseLocal } = useAuthStore()
  const [clases, setClases] = useState([])
  const [modalNuevaClase, setModalNuevaClase] = useState(false)
  const [formClase, setFormClase] = useState({ nombre: '', emoji: '🎓' })
  const [error, setError] = useState(null)

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
  const totalBloqueados = (clasesEnriched ?? []).reduce((sum, c) => sum + c.alumnosBloqueadosCount, 0)

  if (isLoading && clases.length > 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 animate-fade-in">
      {/* Hero card — greeting + CTAs */}
      <div className="grid grid-cols-12 gap-6 mb-8">
        <div className="col-span-12 lg:col-span-8 bg-white rounded-2xl shadow-sm ring-1 ring-black/[0.04] p-8 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-tinta tracking-tight">
              {saludoDelDia()}, {capitalize(profesor?.nombre?.replace(/\./g, ' ')) || 'Profe'} 👋
            </h1>
            <p className="text-sm text-tinta-400 mt-1">¿Qué quieres enseñar hoy?</p>
          </div>
          <div className="flex items-center gap-3 mt-6">
            <Boton variante="primario" size="md" onClick={() => setModalNuevaClase(true)}>
              <Plus className="w-4 h-4" />
              Nueva clase
            </Boton>
            <Boton
              variante="secundario"
              size="md"
              onClick={() => window.location.href = '/profesor/biblioteca'}
            >
              <BookOpen className="w-4 h-4" />
              Biblioteca
            </Boton>
          </div>
        </div>

        {/* Stats card */}
        <div className="col-span-12 lg:col-span-4 bg-white rounded-2xl shadow-sm ring-1 ring-black/[0.04] p-6 flex flex-col justify-between gap-3">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-crema-50">
            <div className="w-10 h-10 rounded-full bg-tinta text-amarillo flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-tinta tabular-nums leading-none">{totalAlumnos}</p>
              <p className="text-xs text-tinta-400 mt-0.5">Alumnos</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-crema-50">
            <div className="w-10 h-10 rounded-full bg-amarillo text-tinta flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-tinta tabular-nums leading-none">{totalTareasActivas}</p>
              <p className="text-xs text-tinta-400 mt-0.5">Tareas activas</p>
            </div>
          </div>
          {totalBloqueados > 0 ? (
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-orange-50">
              <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600 tabular-nums leading-none">{totalBloqueados}</p>
                <p className="text-xs text-orange-500 mt-0.5">Necesitan atención</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-green-50">
              <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-600">Todo en orden</p>
                <p className="text-xs text-green-500 mt-0.5">Sin alumnos bloqueados</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Empty state */}
      {clases.length === 0 && !isLoading && (
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-black/[0.04] p-12 text-center">
          <p className="text-lg font-semibold text-tinta mb-2">Aún no tienes clases.</p>
          <p className="text-sm text-tinta-400 mb-6">¡Crea tu primera para empezar el viaje!</p>
          <Boton variante="primario" onClick={() => setModalNuevaClase(true)}>
            Crear mi primera clase
          </Boton>
        </div>
      )}

      {/* Class cards grid — asymmetric */}
      {(clasesEnriched ?? []).length > 0 && (
        <div className="grid grid-cols-12 gap-6 mb-8">
          {clasesEnriched.map((clase, i) => (
            <div
              key={clase.id}
              className={
                i === 0
                  ? 'col-span-12 lg:col-span-7'
                  : i === 1
                    ? 'col-span-12 lg:col-span-5'
                    : 'col-span-12 md:col-span-6 lg:col-span-4'
              }
            >
              <ClaseCard clase={clase} />
            </div>
          ))}
        </div>
      )}

      {/* Create new class button */}
      {clases.length > 0 && (
        <button
          onClick={() => setModalNuevaClase(true)}
          className="flex items-center justify-center gap-2 w-full max-w-md mx-auto px-4 py-3 rounded-2xl border-2 border-dashed border-crema-300 text-tinta-400 hover:border-tinta-400 hover:text-tinta transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Crear nueva clase</span>
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
