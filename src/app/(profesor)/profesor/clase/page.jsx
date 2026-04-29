'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import NavBar from '@/components/layout/NavBar.jsx'
import Boton from '@/components/ui/Boton.jsx'
import Modal from '@/components/ui/Modal.jsx'
import MensajeError from '@/components/ui/MensajeError.jsx'
import { useAlumnos, useAgregarAlumno, useEliminarAlumno } from '@/hooks/useTareas.js'
import useAuthStore from '@/store/useAuthStore.js'
import { supabase } from '@/lib/supabase.js'

export default function GestionClase() {
  const router = useRouter()
  const { clase, profesor, setClase, agregarClaseLocal } = useAuthStore()
  const { data: alumnos = [] } = useAlumnos(clase?.id)
  const agregarAlumnoMut = useAgregarAlumno()
  const eliminarAlumnoMut = useEliminarAlumno()

  const [clases, setClases] = useState([])
  const [nuevoAlumno, setNuevoAlumno] = useState('')
  const [modalNuevaClase, setModalNuevaClase] = useState(false)
  const [formClase, setFormClase] = useState({ nombre: '', grado: '1° Secundaria' })
  const [error, setError] = useState(null)
  const [copiado, setCopiado] = useState(null)
  const [confirmEliminar, setConfirmEliminar] = useState(null)

  const GRADOS = ['1° Secundaria', '2° Secundaria', '3° Secundaria']

  useEffect(() => {
    cargarClases()
  }, [profesor])

  async function cargarClases() {
    if (!profesor) return
    const { data } = await supabase
      .from('clases')
      .select('*')
      .eq('profesor_id', profesor.id)
      .order('created_at', { ascending: false })
    setClases(data ?? [])
  }

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
        grado: formClase.grado,
      })
      .select()
      .single()

    if (err) {
      setError(err.message)
      return
    }

    setClases(prev => [data, ...prev])
    setClase(data)
    agregarClaseLocal(data)
    setModalNuevaClase(false)
    setFormClase({ nombre: '', grado: '1° Secundaria' })
  }

  async function handleAgregarAlumno(e) {
    e.preventDefault()
    if (!nuevoAlumno.trim()) return
    setError(null)
    try {
      await agregarAlumnoMut.mutateAsync({ claseId: clase.id, nombre: nuevoAlumno.trim() })
      setNuevoAlumno('')
    } catch {
      setError('No se pudo agregar al alumno. Intenta de nuevo.')
    }
  }

  function copiarCodigo(codigo) {
    navigator.clipboard.writeText(codigo)
    setCopiado(codigo)
    setTimeout(() => setCopiado(null), 2000)
  }

  async function handleEliminarAlumno() {
    if (!confirmEliminar) return
    await eliminarAlumnoMut.mutateAsync({ alumnoId: confirmEliminar, claseId: clase.id })
    setConfirmEliminar(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar titulo="Gestión de clase" volver="/profesor" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
        {/* Selector de clase */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mi clase</h1>
            <p className="text-sm text-gray-500 mt-1">Administra tus clases y alumnos</p>
          </div>
          <Boton variante="secundario" size="sm" onClick={() => setModalNuevaClase(true)}>
            + Nueva clase
          </Boton>
        </div>

        {/* Tabs de clases */}
        {clases.length > 1 && (
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {clases.map(c => (
              <button
                key={c.id}
                onClick={() => setClase(c)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border whitespace-nowrap transition-all ${
                  clase?.id === c.id
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {c.nombre}
              </button>
            ))}
          </div>
        )}

        {clase && (
          <>
            {/* Info de clase */}
            <div className="card p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{clase.nombre}</h2>
                  <p className="text-sm text-gray-500">{clase.grado} · {alumnos.length} alumno{alumnos.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
            </div>

            {/* Agregar alumno */}
            <div className="card p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Agregar alumno</h3>
              <form onSubmit={handleAgregarAlumno} className="flex gap-3">
                <input
                  type="text"
                  value={nuevoAlumno}
                  onChange={(e) => setNuevoAlumno(e.target.value)}
                  placeholder="Nombre completo del alumno"
                  className="input-base flex-1"
                />
                <Boton type="submit" variante="primario" size="md" disabled={!nuevoAlumno.trim()}>
                  Agregar
                </Boton>
              </form>
              <MensajeError mensaje={error} onCerrar={() => setError(null)} />
            </div>

            {/* Lista de alumnos */}
            <div className="card p-0 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Alumnos</h3>
                <span className="text-sm text-gray-400">{alumnos.length} en total</span>
              </div>

              {alumnos.length === 0 ? (
                <div className="p-12 text-center text-gray-400">
                  <p className="font-medium">Sin alumnos</p>
                  <p className="text-sm mt-1">Agrega alumnos para que puedan acceder a las tareas.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {alumnos.map(alumno => (
                    <div key={alumno.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center justify-center w-9 h-9 rounded-full text-xs font-bold flex-shrink-0 ${alumno.avatar_color}`}>
                          {alumno.avatar_iniciales}
                        </span>
                        <div>
                          <p className="font-medium text-gray-900">{alumno.nombre}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                              {alumno.codigo_acceso}
                            </span>
                            <button
                              onClick={() => copiarCodigo(alumno.codigo_acceso)}
                              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              {copiado === alumno.codigo_acceso ? '¡Copiado!' : 'Copiar'}
                            </button>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setConfirmEliminar(alumno.id)}
                        className="text-xs text-gray-400 hover:text-red-500 transition-colors px-2 py-1"
                      >
                        Eliminar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Modal nueva clase */}
      <Modal
        abierto={modalNuevaClase}
        onCerrar={() => setModalNuevaClase(false)}
        titulo="Nueva clase"
      >
        <form onSubmit={handleCrearClase} className="space-y-4">
          <div>
            <label className="label-base">Nombre de la clase</label>
            <input
              type="text"
              value={formClase.nombre}
              onChange={(e) => setFormClase(p => ({ ...p, nombre: e.target.value }))}
              placeholder="Ej. 3°A Vespertino"
              className="input-base"
              autoFocus
            />
          </div>
          <div>
            <label className="label-base">Grado</label>
            <select
              value={formClase.grado}
              onChange={(e) => setFormClase(p => ({ ...p, grado: e.target.value }))}
              className="input-base"
            >
              {GRADOS.map(g => <option key={g}>{g}</option>)}
            </select>
          </div>
          <MensajeError mensaje={error} onCerrar={() => setError(null)} />
          <Boton type="submit" variante="primario" size="md" className="w-full">
            Crear clase
          </Boton>
        </form>
      </Modal>

      {/* Confirm delete */}
      <Modal
        abierto={!!confirmEliminar}
        onCerrar={() => setConfirmEliminar(null)}
        titulo="Eliminar alumno"
      >
        <p className="text-sm text-gray-600 mb-4">
          ¿Estás seguro? Se eliminarán todos los resultados de este alumno. Esta acción no se puede deshacer.
        </p>
        <div className="flex gap-3">
          <Boton variante="peligro" onClick={handleEliminarAlumno}>Sí, eliminar</Boton>
          <Boton variante="secundario" onClick={() => setConfirmEliminar(null)}>Cancelar</Boton>
        </div>
      </Modal>
    </div>
  )
}
