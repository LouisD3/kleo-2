'use client'

import { useEffect, useState } from 'react'

export default function Toast({ mensaje, visible, duracion = 3000, onCerrar, variante = 'exito' }) {
  const [mostrar, setMostrar] = useState(false)

  useEffect(() => {
    if (visible) {
      setMostrar(true)
      const timer = setTimeout(() => {
        setMostrar(false)
        onCerrar?.()
      }, duracion)
      return () => clearTimeout(timer)
    }
    setMostrar(false)
  }, [visible, duracion, onCerrar])

  if (!mostrar) return null

  const estilos = {
    exito: { icon: 'text-green-400', bg: 'bg-gray-900' },
    error: { icon: 'text-red-400', bg: 'bg-red-900' },
    info: { icon: 'text-blue-400', bg: 'bg-gray-900' },
  }
  const estilo = estilos[variante] ?? estilos.exito

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up" role="status" aria-live="polite">
      <div className={`flex items-center gap-2 px-4 py-3 rounded-xl ${estilo.bg} text-white text-sm font-medium shadow-md`}>
        {variante === 'exito' && (
          <svg className={`w-4 h-4 ${estilo.icon} flex-shrink-0`} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
        {variante === 'error' && (
          <svg className={`w-4 h-4 ${estilo.icon} flex-shrink-0`} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        )}
        {variante === 'info' && (
          <svg className={`w-4 h-4 ${estilo.icon} flex-shrink-0`} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        )}
        {mensaje}
      </div>
    </div>
  )
}
