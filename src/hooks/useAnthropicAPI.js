'use client'

import { useState } from 'react'

const API_URL = '/api'

export function useAnthropicAPI() {
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)

  async function llamarAPI(type, payload) {
    setCargando(true)
    setError(null)

    try {
      const res = await fetch(`${API_URL}/ia`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, payload }),
      })

      const datos = await res.json()

      if (!res.ok) {
        const mensaje = datos?.error ?? 'Ocurrió un error inesperado. Intenta de nuevo.'
        setError(mensaje)
        return null
      }

      return datos
    } catch (_err) {
      setError('No se pudo conectar con el servidor. Verifica tu conexión a internet.')
      return null
    } finally {
      setCargando(false)
    }
  }

  function generarTarea(params) {
    return llamarAPI('generar', params)
  }

  function corregirTarea(params) {
    return llamarAPI('corregir', params)
  }

  return { generarTarea, corregirTarea, cargando, error, setError }
}
