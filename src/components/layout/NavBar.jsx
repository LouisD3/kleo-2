import { useNavigate } from 'react-router-dom'
import usePerfilStore from '../../store/usePerfilStore.js'

export default function NavBar({ titulo, volver }) {
  const navigate = useNavigate()
  const { perfilActivo, alumnoSeleccionado, resetPerfil } = usePerfilStore()

  function handleSalir() {
    resetPerfil()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {volver && (
            <button
              onClick={() => navigate(volver)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Volver"
            >
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900">Kleo</span>
            {titulo && (
              <>
                <span className="text-gray-300">/</span>
                <span className="text-sm text-gray-500 font-medium">{titulo}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {perfilActivo === 'alumno' && alumnoSeleccionado && (
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${alumnoSeleccionado.color}`}
              >
                {alumnoSeleccionado.avatar}
              </span>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                {alumnoSeleccionado.nombre}
              </span>
            </div>
          )}
          {perfilActivo === 'profesor' && (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-xs font-bold text-gray-600">
                P
              </span>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">Profesor</span>
            </div>
          )}
          <button
            onClick={handleSalir}
            className="text-sm text-gray-400 hover:text-gray-700 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            Salir
          </button>
        </div>
      </div>
    </header>
  )
}
