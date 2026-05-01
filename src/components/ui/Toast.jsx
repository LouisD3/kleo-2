'use client'

import { useEffect, useState } from 'react'

export default function Toast({ mensaje, visible, duracion = 3000, onCerrar }) {
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

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-900 text-white text-sm font-medium shadow-md">
        <svg
          className="w-4 h-4 text-green-400 flex-shrink-0"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
        {mensaje}
      </div>
    </div>
  )
}
