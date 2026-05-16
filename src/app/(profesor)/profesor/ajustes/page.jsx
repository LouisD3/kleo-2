'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Boton from '@/components/ui/Boton.jsx'
import MensajeError from '@/components/ui/MensajeError.jsx'
import Modal from '@/components/ui/Modal.jsx'
import { supabase } from '@/lib/supabase.js'
import useAuthStore from '@/store/useAuthStore.js'

export default function Ajustes() {
  const router = useRouter()
  const { profesor, usuario } = useAuthStore()

  const [nombre, setNombre] = useState(profesor?.nombre ?? '')
  const [escuela, setEscuela] = useState(profesor?.escuela ?? '')
  const [guardando, setGuardando] = useState(false)
  const [guardadoOk, setGuardadoOk] = useState(false)
  const [error, setError] = useState(null)

  const [passwordNuevo, setPasswordNuevo] = useState('')
  const [cambiandoPassword, setCambiandoPassword] = useState(false)
  const [passwordOk, setPasswordOk] = useState(false)

  const [modalEliminar, setModalEliminar] = useState(false)
  const [confirmEliminar, setConfirmEliminar] = useState('')

  const [seedLoading, setSeedLoading] = useState(false)
  const [seedResult, setSeedResult] = useState(null)

  async function handleGuardarPerfil(e) {
    e.preventDefault()
    if (!nombre.trim()) {
      setError('El nombre es obligatorio.')
      return
    }
    setGuardando(true)
    setError(null)
    setGuardadoOk(false)

    const { error: err } = await supabase
      .from('profesores')
      .update({ nombre: nombre.trim(), escuela: escuela.trim() || null })
      .eq('id', profesor.id)

    setGuardando(false)
    if (err) {
      setError(err.message)
    } else {
      setGuardadoOk(true)
      setTimeout(() => setGuardadoOk(false), 3000)
    }
  }

  async function handleCambiarPassword(e) {
    e.preventDefault()
    if (passwordNuevo.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres.')
      return
    }
    setCambiandoPassword(true)
    setError(null)
    setPasswordOk(false)

    const { error: err } = await supabase.auth.updateUser({
      password: passwordNuevo,
    })

    setCambiandoPassword(false)
    if (err) {
      setError(err.message)
    } else {
      setPasswordOk(true)
      setPasswordNuevo('')
      setTimeout(() => setPasswordOk(false), 3000)
    }
  }

  async function handleEliminarCuenta() {
    if (confirmEliminar !== 'ELIMINAR') return
    // Sign out — actual deletion would require a server-side function
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="px-4 sm:px-6 md:px-8 py-8 animate-fade-in space-y-6">
      {/* Perfil */}
      <div className="card p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Perfil</h2>
        <form onSubmit={handleGuardarPerfil} className="space-y-4">
          <div>
            <label className="label-base">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="input-base"
            />
          </div>
          <div>
            <label className="label-base">
              Escuela <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <input
              type="text"
              value={escuela}
              onChange={(e) => setEscuela(e.target.value)}
              placeholder="Ej. Escuela Secundaria Tecnica #42"
              className="input-base"
            />
          </div>
          <div>
            <label className="label-base">Correo electronico</label>
            <input
              type="email"
              value={usuario?.email ?? ''}
              disabled
              className="input-base bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>

          <div className="flex items-center gap-3">
            <Boton type="submit" variante="primario" size="md" disabled={guardando}>
              {guardando ? 'Guardando...' : 'Guardar cambios'}
            </Boton>
            {guardadoOk && <span className="text-sm text-green-600">Guardado</span>}
          </div>
        </form>
      </div>

      {/* Contrasena */}
      <div className="card p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Contrasena</h2>
        <form onSubmit={handleCambiarPassword} className="space-y-4">
          <div>
            <label className="label-base">Nueva contrasena</label>
            <input
              type="password"
              value={passwordNuevo}
              onChange={(e) => setPasswordNuevo(e.target.value)}
              placeholder="Minimo 6 caracteres"
              className="input-base"
            />
          </div>

          <div className="flex items-center gap-3">
            <Boton
              type="submit"
              variante="secundario"
              size="md"
              disabled={cambiandoPassword || !passwordNuevo}
            >
              {cambiandoPassword ? 'Cambiando...' : 'Cambiar contrasena'}
            </Boton>
            {passwordOk && <span className="text-sm text-green-600">Contrasena actualizada</span>}
          </div>
        </form>
      </div>

      {/* Datos demo (dev only) */}
      {process.env.NODE_ENV !== 'production' && (
        <div className="card p-6 border-blue-100">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Datos de demostración</h2>
          <p className="text-xs text-gray-500 mb-4">
            Crea 6 clases, ~134 alumnos con perfiles variados, ~56 tareas, resultados e intentos para probar la plataforma.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Boton
              variante="secundario"
              size="md"
              disabled={seedLoading}
              onClick={async () => {
                setSeedLoading(true)
                setSeedResult(null)
                setError(null)
                try {
                  const { seedDemoData } = await import('@/lib/seed-demo')
                  const created = await seedDemoData(profesor.id)
                  setSeedResult(created)
                  setTimeout(() => window.location.reload(), 1500)
                } catch (err) {
                  setError(err instanceof Error ? err.message : 'Error al crear datos demo')
                } finally {
                  setSeedLoading(false)
                }
              }}
            >
              {seedLoading ? 'Creando...' : 'Cargar datos demo'}
            </Boton>
            <Boton
              variante="secundario"
              size="md"
              disabled={seedLoading}
              onClick={async () => {
                if (!confirm('Esto eliminara TODAS tus clases, alumnos, tareas y resultados. Continuar?')) return
                setSeedLoading(true)
                setSeedResult(null)
                setError(null)
                try {
                  const { clearDemoData, seedDemoData } = await import('@/lib/seed-demo')
                  await clearDemoData(profesor.id)
                  const created = await seedDemoData(profesor.id)
                  setSeedResult(created)
                  setTimeout(() => window.location.reload(), 1500)
                } catch (err) {
                  setError(err instanceof Error ? err.message : 'Error al reiniciar datos demo')
                } finally {
                  setSeedLoading(false)
                }
              }}
            >
              {seedLoading ? 'Reiniciando...' : 'Reiniciar datos demo'}
            </Boton>
            {seedResult && (
              <span className="text-sm text-green-600">
                {seedResult.clases} clases, {seedResult.alumnos} alumnos, {seedResult.tareas} tareas, {seedResult.resultados} resultados
              </span>
            )}
          </div>
        </div>
      )}

      {/* Zona de peligro */}
      <div className="card p-6 border-red-100">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Zona de peligro</h2>
        <p className="text-xs text-gray-500 mb-4">Estas acciones son irreversibles.</p>
        <button
          type="button"
          onClick={() => setModalEliminar(true)}
          className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
        >
          Eliminar mi cuenta
        </button>
      </div>

      <MensajeError mensaje={error} onCerrar={() => setError(null)} />
      {/* Modal confirmar eliminacion */}
      <Modal
        abierto={modalEliminar}
        onCerrar={() => {
          setModalEliminar(false)
          setConfirmEliminar('')
        }}
        titulo="Eliminar cuenta"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Esta acción eliminará tu cuenta y todos tus datos (clases, alumnos, tareas, resultados).
            No se puede deshacer.
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
              onClick={handleEliminarCuenta}
              disabled={confirmEliminar !== 'ELIMINAR'}
            >
              Eliminar cuenta
            </Boton>
            <Boton
              variante="secundario"
              onClick={() => {
                setModalEliminar(false)
                setConfirmEliminar('')
              }}
            >
              Cancelar
            </Boton>
          </div>
        </div>
      </Modal>
    </div>
  )
}
