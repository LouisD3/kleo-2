import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useAuthStore from '../../store/useAuthStore.js'
import Boton from '../../components/ui/Boton.jsx'
import MensajeError from '../../components/ui/MensajeError.jsx'

export default function Login() {
  const navigate = useNavigate()
  const { iniciarSesion, error, setError } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [cargando, setCargando] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      setError('Completa todos los campos.')
      return
    }
    setCargando(true)
    const ok = await iniciarSesion(email, password)
    setCargando(false)
    if (ok) navigate('/profesor')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="px-6 py-5 flex items-center">
        <Link to="/" className="text-2xl font-bold text-gray-900 hover:opacity-80 transition-opacity">Kleo</Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-sm animate-fade-in">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">Inicia sesión</h1>
          <p className="text-sm text-gray-500 text-center mb-8">Accede a tu panel de profesor</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-base">Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="profesor@escuela.edu.mx"
                className="input-base"
                autoFocus
              />
            </div>
            <div>
              <label className="label-base">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-base"
              />
            </div>

            <MensajeError mensaje={error} onCerrar={() => setError(null)} />

            <Boton
              type="submit"
              variante="primario"
              size="lg"
              disabled={cargando}
              className="w-full"
            >
              {cargando ? 'Entrando...' : 'Iniciar sesión'}
            </Boton>
          </form>

          <p className="text-sm text-gray-500 text-center mt-6">
            <Link to="/recuperar-contrasena" className="hover:underline text-gray-500">
              ¿Olvidaste tu contraseña?
            </Link>
          </p>

          <p className="text-sm text-gray-500 text-center mt-3">
            ¿No tienes cuenta?{' '}
            <Link to="/registro" className="font-semibold text-gray-900 hover:underline">
              Regístrate gratis
            </Link>
          </p>

          <p className="text-sm text-gray-400 text-center mt-4">
            <Link to="/" className="hover:text-gray-600 transition-colors">
              ← Volver al inicio
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
