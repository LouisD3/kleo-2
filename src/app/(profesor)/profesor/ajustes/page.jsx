'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import NavBar from '@/components/layout/NavBar.jsx'
import Boton from '@/components/ui/Boton.jsx'
import GoogleClassroomIcon from '@/components/ui/GoogleClassroomIcon.jsx'
import MensajeError from '@/components/ui/MensajeError.jsx'
import Modal from '@/components/ui/Modal.jsx'
import { useGCConnect, useGCDisconnect, useGCStatus } from '@/hooks/useGoogleClassroom.js'
import { supabase } from '@/lib/supabase.js'
import useAuthStore from '@/store/useAuthStore.js'

export default function Ajustes() {
  const router = useRouter()
  const { profesor, usuario, setError: setAuthError } = useAuthStore()
  const { data: gcStatus, isLoading: gcLoading } = useGCStatus(profesor?.id)
  const connectMut = useGCConnect()
  const disconnectMut = useGCDisconnect()

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

  const isGoogleUser = usuario?.app_metadata?.provider === 'google'
  const gcConnected = gcStatus?.connected ?? false

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
      setPasswordActual('')
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
    <div className="min-h-screen bg-gray-50">
      <NavBar titulo="Ajustes" volver="/profesor" />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 animate-fade-in space-y-6">
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
                placeholder="Ej. Escuela Secundaria Técnica #42"
                className="input-base"
              />
            </div>
            <div>
              <label className="label-base">Correo electrónico</label>
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

        {/* Google Classroom */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-bold text-gray-900">Google Classroom</h2>
            <GoogleClassroomIcon size={20} />
          </div>

          {gcLoading ? (
            <p className="text-sm text-gray-400">Cargando...</p>
          ) : gcConnected ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-sm text-gray-700">Conectado</span>
              </div>
              <p className="text-xs text-gray-500">
                Puedes importar clases y alumnos desde Google Classroom, publicar tareas y
                sincronizar calificaciones.
              </p>
              <Boton
                variante="secundario"
                size="sm"
                onClick={() => disconnectMut.mutate()}
                disabled={disconnectMut.isPending}
              >
                {disconnectMut.isPending ? 'Desconectando...' : 'Desconectar'}
              </Boton>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gray-300" />
                <span className="text-sm text-gray-700">No conectado</span>
              </div>
              <p className="text-xs text-gray-500">
                Conecta tu cuenta para importar clases, sincronizar alumnos y publicar tareas en
                Google Classroom.
              </p>
              <Boton
                variante="primario"
                size="sm"
                onClick={() => connectMut.mutate()}
                disabled={connectMut.isPending}
              >
                {connectMut.isPending ? 'Conectando...' : 'Conectar Google Classroom'}
              </Boton>
            </div>
          )}
        </div>

        {/* Contraseña */}
        {!isGoogleUser && (
          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Contraseña</h2>
            <form onSubmit={handleCambiarPassword} className="space-y-4">
              <div>
                <label className="label-base">Nueva contraseña</label>
                <input
                  type="password"
                  value={passwordNuevo}
                  onChange={(e) => setPasswordNuevo(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
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
                  {cambiandoPassword ? 'Cambiando...' : 'Cambiar contraseña'}
                </Boton>
                {passwordOk && (
                  <span className="text-sm text-green-600">Contraseña actualizada</span>
                )}
              </div>
            </form>
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
      </main>

      {/* Modal confirmar eliminación */}
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
