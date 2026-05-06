'use client'

import { useEffect } from 'react'
import Spinner from '@/components/ui/Spinner.jsx'
import { supabase } from '@/lib/supabase.js'
import useAuthStore from '@/store/useAuthStore.js'

export default function AuthProvider({ children }) {
  const { cargando, inicializar } = useAuthStore()

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        inicializar()
      }
    })

    return () => subscription.unsubscribe()
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
