'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import useAuthStore from '../../store/useAuthStore.js'
import Spinner from '../ui/Spinner.jsx'

export default function ProtectedRoute({ children, requiere }) {
  const { rol, cargando } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!cargando && (!rol || (requiere && rol !== requiere))) {
      router.replace('/')
    }
  }, [cargando, rol, requiere, router])

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!rol || (requiere && rol !== requiere)) return null

  return children
}
