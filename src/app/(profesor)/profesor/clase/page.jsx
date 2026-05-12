'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import NavBar from '@/components/layout/NavBar.jsx'
import Boton from '@/components/ui/Boton.jsx'
import MensajeError from '@/components/ui/MensajeError.jsx'
import Modal from '@/components/ui/Modal.jsx'
import {
  useAgregarAlumno,
  useAlumnos,
  useEliminarAlumno,
  useEliminarClase,
} from '@/hooks/useTareas.js'
import { supabase } from '@/lib/supabase.js'
import useAuthStore from '@/store/useAuthStore.js'

export default function GestionClase() {
  const _router = useRouter()
  const { clase, profesor, setClase, agregarClaseLocal, eliminarClaseLocal } = useAuthStore()
  const { data: alumnos = [] } = useAlumnos(clase?.id)
  const agregarAlumnoMut = useAgregarAlumno()
  const eliminarAlumnoMut = useEliminarAlumno()
  const eliminarClaseMut = useEliminarClase()

  const [clases, setClases] = useState([])
  const [nuevoAlumno, setNuevoAlumno] = useState('')
  const [modalNuevaClase, setModalNuevaClase] = useState(false)
  const [formClase, setFormClase] = useState({ nombre: '', grado: '1° Secundaria' })
  const [error, setError] = useState(null)
  const [copiado, setCopiado] = useState(null)
  const [compartido, setCompartido] = useState(null)
  const [modalAgregarAlumno, setModalAgregarAlumno] = useState(false)
  const [menuClaseOpen, setMenuClaseOpen] = useState(false)
  const [confirmEliminar, setConfirmEliminar] = useState(null)
  const [confirmEliminarClase, setConfirmEliminarClase] = useState(false)

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

    setClases((prev) => [data, ...prev])
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

  async function compartirCodigo(alumno) {
    const url = `${window.location.origin}/acceso-alumno`
    const mensaje = `Hola ${alumno.nombre.split(' ')[0]}, para entrar a Kleo:\n1. Ve a ${url}\n2. Escribe tu codigo: ${alumno.codigo_acceso}\n3. ¡Listo! Ya puedes hacer tus tareas.`

    if (navigator.share) {
      try {
        await navigator.share({ text: mensaje })
        return
      } catch {
        // User cancelled or share failed — fall back to clipboard
      }
    }

    navigator.clipboard.writeText(mensaje)
    setCompartido(alumno.id)
    setTimeout(() => setCompartido(null), 2000)
  }

  async function handleEliminarAlumno() {
    if (!confirmEliminar) return
    await eliminarAlumnoMut.mutateAsync({ alumnoId: confirmEliminar, claseId: clase.id })
    setConfirmEliminar(null)
  }

  async function handleEliminarClase() {
    if (!clase) return
    const claseId = clase.id
    await eliminarClaseMut.mutateAsync(claseId)
    setClases((prev) => prev.filter((c) => c.id !== claseId))
    eliminarClaseLocal(claseId)
    setConfirmEliminarClase(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar titulo="Gestion de clase" volver="/profesor" />

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
            {clases.map((c) => (
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
            <div className="card px-6 py-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{clase.nombre}</h2>
                  <p className="text-sm text-gray-500">
                    {clase.grado} · {alumnos.length} alumno{alumnos.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setModalAgregarAlumno(true)}
                    className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                    title="Agregar alumno"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 00-6 6h12a6 6 0 00-6-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                    </svg>
                  </button>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setMenuClaseOpen(!menuClaseOpen)}
                      className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>

                    {menuClaseOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setMenuClaseOpen(false)}
                        />
                        <div className="absolute right-0 top-full mt-1 z-20 w-48 bg-white rounded-xl border border-gray-200 shadow-lg py-1">
                          <button
                            type="button"
                            onClick={() => {
                              setConfirmEliminarClase(true)
                              setMenuClaseOpen(false)
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                              <path
                                fillRule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Eliminar clase
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
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
                  <p className="text-sm mt-1">
                    Agrega alumnos para que puedan acceder a las tareas.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {alumnos.map((alumno) => (
                    <div
                      key={alumno.id}
                      className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`inline-flex items-center justify-center w-9 h-9 rounded-full text-xs font-bold flex-shrink-0 ${alumno.avatar_color}`}
                        >
                          {alumno.avatar_iniciales}
                        </span>
                        <div>
                          <p className="font-medium text-gray-900">{alumno.nombre}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span
                              className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded cursor-help"
                              title="Codigo que el alumno usa para entrar a Kleo"
                            >
                              {alumno.codigo_acceso}
                            </span>
                            <button
                              onClick={() => copiarCodigo(alumno.codigo_acceso)}
                              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              {copiado === alumno.codigo_acceso ? '¡Copiado!' : 'Copiar'}
                            </button>
                            <span className="text-gray-200">·</span>
                            <button
                              onClick={() => compartirCodigo(alumno)}
                              className="text-xs text-blue-500 hover:text-blue-700 transition-colors"
                            >
                              {compartido === alumno.id ? '¡Mensaje copiado!' : 'Compartir'}
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
        onCerrar={() => {
          setModalNuevaClase(false)
          setFormClase({ nombre: '', grado: '1° Secundaria' })
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
            <label className="label-base">Grado</label>
            <select
              value={formClase.grado}
              onChange={(e) => setFormClase((p) => ({ ...p, grado: e.target.value }))}
              className="input-base"
            >
              <option>1° Secundaria</option>
            </select>
          </div>
          <MensajeError mensaje={error} onCerrar={() => setError(null)} />
          <Boton type="submit" variante="primario" size="md" className="w-full">
            Crear clase
          </Boton>
        </form>
      </Modal>

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
        <form
          onSubmit={(e) => {
            handleAgregarAlumno(e)
            if (nuevoAlumno.trim()) {
              setModalAgregarAlumno(false)
            }
          }}
          className="space-y-4"
        >
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

      {/* Confirm delete student */}
      <Modal
        abierto={!!confirmEliminar}
        onCerrar={() => setConfirmEliminar(null)}
        titulo="Eliminar alumno"
      >
        <p className="text-sm text-gray-600 mb-4">
          ¿Estas seguro? Se eliminaran todos los resultados de este alumno. Esta accion no se puede
          deshacer.
        </p>
        <div className="flex gap-3">
          <Boton variante="peligro" onClick={handleEliminarAlumno}>
            Si, eliminar
          </Boton>
          <Boton variante="secundario" onClick={() => setConfirmEliminar(null)}>
            Cancelar
          </Boton>
        </div>
      </Modal>

      {/* Confirm delete class */}
      <Modal
        abierto={confirmEliminarClase}
        onCerrar={() => setConfirmEliminarClase(false)}
        titulo="Eliminar clase"
      >
        <p className="text-sm text-gray-600 mb-4">
          ¿Estas seguro de que quieres eliminar <strong>{clase?.nombre}</strong>? Se eliminaran
          tambien todos los alumnos, tareas y resultados asociados. Esta accion no se puede
          deshacer.
        </p>
        <div className="flex gap-3">
          <Boton
            variante="peligro"
            onClick={handleEliminarClase}
            disabled={eliminarClaseMut.isPending}
          >
            {eliminarClaseMut.isPending ? 'Eliminando...' : 'Si, eliminar'}
          </Boton>
          <Boton variante="secundario" onClick={() => setConfirmEliminarClase(false)}>
            Cancelar
          </Boton>
        </div>
      </Modal>
    </div>
  )
}
