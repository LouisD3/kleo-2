import { Navigate } from 'react-router-dom'
import useAuthStore from '../../store/useAuthStore.js'
import Spinner from '../ui/Spinner.jsx'

export default function ProtectedRoute({ children, requiere }) {
  const { rol, cargando } = useAuthStore()

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!rol) return <Navigate to="/" replace />
  if (requiere && rol !== requiere) return <Navigate to="/" replace />

  return children
}
