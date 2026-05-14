'use client'

import { UserPlus } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import HeatmapCPA from '@/components/profesor/HeatmapCPA'
import Boton from '@/components/ui/Boton.jsx'
import MensajeError from '@/components/ui/MensajeError.jsx'
import Modal from '@/components/ui/Modal.jsx'
import {
  useAgregarAlumno,
  useAlumnos,
  useEliminarAlumno,
  useEliminarClase,
  useTareasProfesor,
} from '@/hooks/useTareas.js'
import { supabase } from '@/lib/supabase.js'
import useAuthStore from '@/store/useAuthStore.js'

export default function MiClase() {
  const { clase, profesor, setClase, agregarClaseLocal, eliminarClaseLocal } = useAuthStore()
  const { data: alumnos = [] } = useAlumnos(clase?.id)
  const { data: tareasData } = useTareasProfesor(profesor?.id)
  const tareas = tareasData?.tareas ?? []
  const resultados = tareasData?.resultados ?? {}
  const agregarAlumnoMut = useAgregarAlumno()
  const eliminarAlumnoMut = useEliminarAlumno()
  const eliminarClaseMut = useEliminarClase()

  const [clases, setClases] = useState([])
  const [nuevoAlumno, setNuevoAlumno] = useState('')
  const [modalNuevaClase, setModalNuevaClase] = useState(false)
  const [formClase, setFormClase] = useState({ nombre: '', grado: '1° Secundaria' })
  const [error, setError] = useState(null)
  const [modalAgregarAlumno, setModalAgregarAlumno] = useState(false)
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

  // Filter tareas for current class
  const tareasClase = tareas.filter((t) => t.clase_id === clase?.id)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mi clase</h1>
          <p className="text-lg text-gray-600 mt-1">
            {clase?.nombre ?? 'Selecciona una clase'}{' '}
            {clase && (
              <span className="text-sm text-gray-500">
                · {alumnos.length} alumno{alumnos.length !== 1 ? 's' : ''}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Class selector — only if multiple */}
          {clases.length > 1 && (
            <select
              value={clase?.id ?? ''}
              onChange={(e) => {
                const c = clases.find((cl) => cl.id === e.target.value)
                if (c) setClase(c)
              }}
              className="input-base text-sm py-2 px-3"
              aria-label="Seleccionar clase"
            >
              {clases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          )}
          <button
            type="button"
            onClick={() => setModalAgregarAlumno(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 border border-gray-200 transition-colors"
            aria-label="Agregar alumno"
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Agregar alumno</span>
          </button>
        </div>
      </div>

      {/* Heatmap CPA — main view */}
      {clase && (
        <div className="card p-4 overflow-hidden mb-8">
          <HeatmapCPA alumnos={alumnos} tareas={tareasClase} resultados={resultados} />
        </div>
      )}

      {/* Alumnos list as cards */}
      {clase && alumnos.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Alumnos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {alumnos.map((alumno) => (
              <Link
                key={alumno.id}
                href={`/profesor/clase/${alumno.id}`}
                className="card p-4 hover:shadow-md hover:border-amarillo transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold flex-shrink-0 ${alumno.avatar_color}`}
                  >
                    {alumno.avatar_iniciales}
                  </span>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 truncate">{alumno.nombre}</p>
                    <p className="text-xs font-mono text-gray-400">{alumno.codigo_acceso}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {clase && alumnos.length === 0 && (
        <div className="card p-12 text-center text-gray-400">
          <p className="font-medium">Sin alumnos</p>
          <p className="text-sm mt-1">Agrega alumnos para que puedan acceder a las tareas.</p>
        </div>
      )}

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
          ¿Estás seguro? Se eliminarán todos los resultados de este alumno. Esta acción no se puede
          deshacer.
        </p>
        <div className="flex gap-3">
          <Boton variante="peligro" onClick={handleEliminarAlumno}>
            Sí, eliminar
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
          ¿Estás seguro de que quieres eliminar <strong>{clase?.nombre}</strong>? Se eliminarán
          también todos los alumnos, tareas y resultados asociados. Esta acción no se puede
          deshacer.
        </p>
        <div className="flex gap-3">
          <Boton
            variante="peligro"
            onClick={handleEliminarClase}
            disabled={eliminarClaseMut.isPending}
          >
            {eliminarClaseMut.isPending ? 'Eliminando...' : 'Sí, eliminar'}
          </Boton>
          <Boton variante="secundario" onClick={() => setConfirmEliminarClase(false)}>
            Cancelar
          </Boton>
        </div>
      </Modal>
    </div>
  )
}
