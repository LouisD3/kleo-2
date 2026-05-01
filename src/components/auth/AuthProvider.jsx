'use client'

import { useEffect } from 'react'
import Spinner from '@/components/ui/Spinner.jsx'
import useAuthStore from '@/store/useAuthStore.js'

export default function AuthProvider({ children }) {
  const { cargando, inicializar } = useAuthStore()

  useEffect(() => {
    inicializar()
  }, [inicializar])

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner size="lg" />
      </div>
    )
  }

  return children
}
