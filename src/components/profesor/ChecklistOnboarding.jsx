'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

function CheckIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  )
}

export default function ChecklistOnboarding({ tieneClase, tieneAlumnos, tieneTareas }) {
  const [descartado, setDescartado] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDescartado(localStorage.getItem('kleo_onboarding_descartado') === '1')
    }
  }, [])

  const todoCompleto = tieneClase && tieneAlumnos && tieneTareas
  if (descartado || todoCompleto) return null

  const pasos = [
    {
      completado: tieneClase,
      titulo: 'Configura tu clase',
      descripcion: 'Dale un nombre y grado a tu grupo.',
      href: '/profesor/bienvenida',
    },
    {
      completado: tieneAlumnos,
      titulo: 'Agrega alumnos',
      descripcion: 'Cada alumno recibe un código de 6 caracteres para entrar a Kleo.',
      href: '/profesor/clase',
    },
    {
      completado: tieneTareas,
      titulo: 'Genera tu primera tarea',
      descripcion: 'La IA crea las preguntas por ti en segundos.',
      href: '/profesor/generar',
    },
  ]

  function descartar() {
    localStorage.setItem('kleo_onboarding_descartado', '1')
    setDescartado(true)
  }

  return (
    <div className="card p-6 mb-8 border-amarillo/30 bg-amber-50/30">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="font-bold text-gray-900">Primeros pasos</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Completa estos pasos para empezar a usar Kleo.
          </p>
        </div>
        <button
          onClick={descartar}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors shrink-0 ml-4"
        >
          Descartar
        </button>
      </div>

      <div className="space-y-3">
        {pasos.map((paso) => (
          <Link
            key={paso.titulo}
            href={paso.completado ? '#' : paso.href}
            className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${
              paso.completado ? 'bg-white/60' : 'bg-white hover:bg-gray-50 cursor-pointer'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                paso.completado ? 'bg-green-100 text-green-600' : 'border-2 border-gray-200'
              }`}
            >
              {paso.completado && <CheckIcon />}
            </div>
            <div>
              <p
                className={`text-sm font-medium ${
                  paso.completado ? 'text-gray-400 line-through' : 'text-gray-900'
                }`}
              >
                {paso.titulo}
              </p>
              <p
                className={`text-xs mt-0.5 ${paso.completado ? 'text-gray-300' : 'text-gray-500'}`}
              >
                {paso.descripcion}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
