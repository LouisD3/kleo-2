'use client'

import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import ClaseCard from '@/components/profesor/ClaseCard'
import Boton from '@/components/ui/Boton.jsx'
import MensajeError from '@/components/ui/MensajeError.jsx'
import Modal from '@/components/ui/Modal.jsx'
import Spinner from '@/components/ui/Spinner.jsx'
import { useClasesEnriched } from '@/hooks/useClasesEnriched.js'
import { supabase } from '@/lib/supabase.js'
import useAuthStore from '@/store/useAuthStore.js'

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

  if (isLoading && clases.length > 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 animate-fade-in">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {saludoDelDia()}, {profesor?.nombre?.split(' ')[0] ?? 'Profe'} 👋
        </h1>
        <p className="text-lg text-gray-600 mt-1">
          {clases.length} grupo{clases.length !== 1 ? 's' : ''} · {totalAlumnos} alumno
          {totalAlumnos !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Empty state */}
      {clases.length === 0 && !isLoading && (
        <div className="card p-12 text-center">
          <p className="text-lg font-medium text-gray-600 mb-2">Aún no tienes clases.</p>
          <p className="text-sm text-gray-400 mb-6">¡Crea tu primera para empezar el viaje! 🗺️</p>
          <Boton variante="primario" onClick={() => setModalNuevaClase(true)}>
            Crear mi primera clase
          </Boton>
        </div>
      )}

      {/* Class cards grid */}
      {(clasesEnriched ?? []).length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {clasesEnriched.map((clase) => (
            <ClaseCard key={clase.id} clase={clase} />
          ))}
        </div>
      )}

      {/* Create new class button */}
      {clases.length > 0 && (
        <button
          onClick={() => setModalNuevaClase(true)}
          className="flex items-center justify-center gap-2 w-full max-w-md mx-auto px-4 py-3 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 hover:border-amarillo hover:text-gray-700 transition-colors"
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
                  className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center border-2 transition-colors ${
                    formClase.emoji === e
                      ? 'border-amarillo bg-amarillo/10'
                      : 'border-gray-200 hover:border-gray-300'
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
