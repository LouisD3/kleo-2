import Link from 'next/link'

export default function VerificarCorreo() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="px-6 py-5 flex items-center">
        <Link
          href="/"
          className="text-2xl font-bold text-gray-900 hover:opacity-80 transition-opacity"
        >
          Kleo
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-sm animate-fade-in">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-amarillo rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-gray-900"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>

            <h1 className="text-xl font-bold text-gray-900 mb-2">Revisa tu correo</h1>
            <p className="text-sm text-gray-500 mb-4 leading-relaxed">
              Te enviamos un enlace de confirmación. Haz clic en él para activar tu cuenta y empezar
              a usar Kleo.
            </p>
            <p className="text-xs text-gray-400 mb-6">
              ¿No lo encuentras? Revisa tu carpeta de spam.
            </p>

            <Link
              href="/login"
              className="block w-full py-2.5 px-4 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors"
            >
              Ya confirmé mi correo
            </Link>
          </div>

          <p className="text-sm text-gray-400 text-center mt-6">
            <Link href="/" className="hover:text-gray-600 transition-colors">
              ← Volver al inicio
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
