import { Link } from 'react-router-dom'

export default function VerificarCorreo() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="px-6 py-5 flex items-center">
        <Link to="/" className="text-2xl font-bold text-gray-900 hover:opacity-80 transition-opacity">Kleo</Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-sm text-center animate-fade-in">
          <div className="text-5xl mb-6">📬</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Revisa tu correo</h1>
          <p className="text-sm text-gray-500 mb-6">
            Te enviamos un enlace de confirmación. Haz clic en él para activar tu cuenta y empezar a usar Kleo.
          </p>
          <p className="text-xs text-gray-400 mb-8">
            Si no lo encuentras, revisa tu carpeta de spam.
          </p>
          <Link to="/login" className="text-sm font-semibold text-gray-900 hover:underline">
            Ya confirme mi correo → Iniciar sesión
          </Link>
        </div>
      </main>
    </div>
  )
}
