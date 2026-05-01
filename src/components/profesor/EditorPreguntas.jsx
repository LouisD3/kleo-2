'use client'

import { useState } from 'react'
import Boton from '@/components/ui/Boton.jsx'
import EditorPreguntaCard from './EditorPreguntaCard.jsx'

const TIPOS_DISPONIBLES = [
  { value: 'opcion_multiple', label: 'Opción múltiple' },
  { value: 'verdadero_falso', label: 'Verdadero / Falso' },
  { value: 'abierta', label: 'Pregunta abierta' },
  { value: 'espacios', label: 'Completar espacios' },
  { value: 'calculo', label: 'Cálculo' },
]

function crearPreguntaVacia(tipo) {
  const base = { tipo, pregunta: '' }
  if (tipo === 'opcion_multiple') {
    return { ...base, opciones: ['A) ', 'B) ', 'C) ', 'D) '], respuesta: 'A' }
  }
  if (tipo === 'verdadero_falso') {
    return { ...base, respuesta: true }
  }
  return { ...base, respuesta: '' }
}

export default function EditorPreguntas({
  preguntas,
  onPreguntasChange,
  onRegenerarPregunta,
  regenerandoIndice,
}) {
  const [agregando, setAgregando] = useState(false)
  const [tipoNueva, setTipoNueva] = useState('opcion_multiple')

  function handleChange(indice, preguntaActualizada) {
    const nuevas = [...preguntas]
    nuevas[indice] = preguntaActualizada
    onPreguntasChange(nuevas)
  }

  function handleEliminar(indice) {
    if (preguntas.length <= 1) return
    onPreguntasChange(preguntas.filter((_, i) => i !== indice))
  }

  function handleMover(indice, direccion) {
    const destino = indice + direccion
    if (destino < 0 || destino >= preguntas.length) return
    const nuevas = [...preguntas]
    ;[nuevas[indice], nuevas[destino]] = [nuevas[destino], nuevas[indice]]
    onPreguntasChange(nuevas)
  }

  function handleAgregar() {
    const nueva = crearPreguntaVacia(tipoNueva)
    onPreguntasChange([...preguntas, nueva])
    setAgregando(false)
    setTipoNueva('opcion_multiple')
  }

  return (
    <div className="space-y-3">
      {/* Info banner */}
      <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <svg
          className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
        <p className="text-xs text-blue-700">
          Pasa el cursor sobre una pregunta para ver las opciones de edición. Los cambios se guardan
          automáticamente.
        </p>
      </div>

      {/* Question cards */}
      {preguntas.map((p, i) => (
        <EditorPreguntaCard
          key={i}
          pregunta={p}
          indice={i}
          total={preguntas.length}
          onChange={(actualizada) => handleChange(i, actualizada)}
          onEliminar={() => handleEliminar(i)}
          onMoverArriba={() => handleMover(i, -1)}
          onMoverAbajo={() => handleMover(i, 1)}
          onRegenerar={() => onRegenerarPregunta(i)}
          regenerando={regenerandoIndice === i}
        />
      ))}

      {/* Add question */}
      {preguntas.length < 20 && (
        <>
          {agregando ? (
            <div className="card p-5">
              <p className="text-sm font-medium text-gray-700 mb-3">Agregar pregunta</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  value={tipoNueva}
                  onChange={(e) => setTipoNueva(e.target.value)}
                  className="input-base flex-1"
                >
                  {TIPOS_DISPONIBLES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <Boton variante="primario" size="sm" onClick={handleAgregar}>
                    Agregar
                  </Boton>
                  <Boton variante="secundario" size="sm" onClick={() => setAgregando(false)}>
                    Cancelar
                  </Boton>
                </div>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setAgregando(true)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-dashed border-gray-200 text-sm font-medium text-gray-400 hover:border-gray-300 hover:text-gray-600 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Agregar pregunta ({preguntas.length}/20)
            </button>
          )}
        </>
      )}
    </div>
  )
}
