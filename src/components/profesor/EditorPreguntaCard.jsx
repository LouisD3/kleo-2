'use client'

import { useState } from 'react'
import Spinner from '@/components/ui/Spinner.jsx'

const ETIQUETA_TIPO = {
  opcion_multiple: 'Opción múltiple',
  verdadero_falso: 'Verdadero / Falso',
  abierta: 'Pregunta abierta',
  espacios: 'Completar espacios',
  calculo: 'Cálculo',
}

export default function EditorPreguntaCard({
  pregunta,
  indice,
  total,
  onChange,
  onEliminar,
  onMoverArriba,
  onMoverAbajo,
  onRegenerar,
  regenerando,
  onModificarConIA,
  modificandoConIA,
}) {
  const [editando, setEditando] = useState(false)
  const [mostrarPromptIA, setMostrarPromptIA] = useState(false)
  const [instruccionIA, setInstruccionIA] = useState('')

  function handleCampo(campo, valor) {
    onChange({ ...pregunta, [campo]: valor })
  }

  function handleOpcion(idx, valor) {
    const nuevas = [...pregunta.opciones]
    // If this was the correct answer, update respuesta too
    const letraAnterior = String.fromCharCode(65 + idx)
    const eraCorrecta = pregunta.respuesta === letraAnterior
    nuevas[idx] = `${letraAnterior}) ${valor.replace(/^[A-Z]\)\s*/, '')}`
    const updated = { ...pregunta, opciones: nuevas }
    if (eraCorrecta) {
      updated.respuesta = letraAnterior
    }
    onChange(updated)
  }

  function handleRespuestaMultiple(idx) {
    const letra = String.fromCharCode(65 + idx)
    onChange({ ...pregunta, respuesta: letra })
  }

  function agregarOpcion() {
    if (!pregunta.opciones || pregunta.opciones.length >= 6) return
    const letra = String.fromCharCode(65 + pregunta.opciones.length)
    onChange({
      ...pregunta,
      opciones: [...pregunta.opciones, `${letra}) `],
    })
  }

  function eliminarOpcion(idx) {
    if (!pregunta.opciones || pregunta.opciones.length <= 2) return
    const nuevas = pregunta.opciones.filter((_, i) => i !== idx)
    // Re-letter all options
    const relettered = nuevas.map((op, i) => {
      const letra = String.fromCharCode(65 + i)
      return `${letra}) ${op.replace(/^[A-Z]\)\s*/, '')}`
    })
    // Fix respuesta if needed
    const letraEliminada = String.fromCharCode(65 + idx)
    let nuevaRespuesta = pregunta.respuesta
    if (pregunta.respuesta === letraEliminada) {
      nuevaRespuesta = 'A'
    } else if (pregunta.respuesta > letraEliminada) {
      nuevaRespuesta = String.fromCharCode(pregunta.respuesta.charCodeAt(0) - 1)
    }
    onChange({ ...pregunta, opciones: relettered, respuesta: nuevaRespuesta })
  }

  function textoOpcion(op) {
    return op.replace(/^[A-Z]\)\s*/, '')
  }

  async function handleModificarConIA() {
    if (!instruccionIA.trim() || !onModificarConIA) return
    await onModificarConIA(instruccionIA.trim())
    setInstruccionIA('')
    setMostrarPromptIA(false)
  }

  if (regenerando || modificandoConIA) {
    return (
      <div className="card p-5 flex items-center justify-center gap-3 min-h-[100px]">
        <Spinner size="sm" />
        <span className="text-sm text-gray-500">
          {modificandoConIA ? 'Modificando con IA...' : 'Regenerando pregunta...'}
        </span>
      </div>
    )
  }

  return (
    <div className="card p-5 group">
      <div className="flex items-start gap-3">
        {/* Number */}
        <span className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-xs font-bold text-gray-600 mt-0.5">
          {indice + 1}
        </span>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header row with type + actions */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              {ETIQUETA_TIPO[pregunta.tipo] ?? pregunta.tipo}
            </span>

            {/* Action buttons */}
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              {/* Move up */}
              <button
                type="button"
                onClick={onMoverArriba}
                disabled={indice === 0}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="Mover arriba"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {/* Move down */}
              <button
                type="button"
                onClick={onMoverAbajo}
                disabled={indice === total - 1}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="Mover abajo"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {/* Regenerate */}
              <button
                type="button"
                onClick={onRegenerar}
                className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                title="Regenerar con IA"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {/* Modify with AI */}
              <button
                type="button"
                onClick={() => setMostrarPromptIA(!mostrarPromptIA)}
                className={`p-1.5 rounded-lg transition-colors ${
                  mostrarPromptIA
                    ? 'text-purple-600 bg-purple-50'
                    : 'text-gray-400 hover:text-purple-600 hover:bg-purple-50'
                }`}
                title="Modificar con IA"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
                </svg>
              </button>
              {/* Edit toggle */}
              <button
                type="button"
                onClick={() => setEditando(!editando)}
                className={`p-1.5 rounded-lg transition-colors ${
                  editando
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                }`}
                title={editando ? 'Terminar edición' : 'Editar pregunta'}
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
              {/* Delete */}
              <button
                type="button"
                onClick={onEliminar}
                disabled={total <= 1}
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="Eliminar pregunta"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>

          {editando ? (
            <EditMode
              pregunta={pregunta}
              onCampo={handleCampo}
              onOpcion={handleOpcion}
              onRespuestaMultiple={handleRespuestaMultiple}
              onAgregarOpcion={agregarOpcion}
              onEliminarOpcion={eliminarOpcion}
              textoOpcion={textoOpcion}
            />
          ) : (
            <ViewMode pregunta={pregunta} />
          )}

          {/* AI modification prompt */}
          {mostrarPromptIA && (
            <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <p className="text-xs font-medium text-purple-700 mb-2">
                Describe cómo quieres modificar esta pregunta
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={instruccionIA}
                  onChange={(e) => setInstruccionIA(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleModificarConIA()}
                  placeholder="Ej. Hazla más difícil, cambia el contexto a deportes..."
                  className="input-base flex-1 text-sm"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleModificarConIA}
                  disabled={!instruccionIA.trim()}
                  className="px-3 py-2 rounded-xl bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                >
                  Aplicar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function EditMode({
  pregunta,
  onCampo,
  onOpcion,
  onRespuestaMultiple,
  onAgregarOpcion,
  onEliminarOpcion,
  textoOpcion,
}) {
  return (
    <div className="space-y-3">
      {/* Question text */}
      <textarea
        value={pregunta.pregunta}
        onChange={(e) => onCampo('pregunta', e.target.value)}
        rows={2}
        className="input-base text-sm resize-none"
        placeholder="Texto de la pregunta..."
      />

      {/* Type-specific fields */}
      {pregunta.tipo === 'opcion_multiple' && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-500">
            Opciones{' '}
            <span className="text-gray-400 font-normal">(selecciona la respuesta correcta)</span>
          </p>
          {pregunta.opciones?.map((op, j) => {
            const letra = String.fromCharCode(65 + j)
            const esCorrecta = pregunta.respuesta === letra
            return (
              <div key={j} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onRespuestaMultiple(j)}
                  className={`flex-shrink-0 w-5 h-5 rounded-full border-2 transition-colors flex items-center justify-center ${
                    esCorrecta
                      ? 'border-green-500 bg-green-500'
                      : 'border-gray-300 hover:border-green-400'
                  }`}
                  title={esCorrecta ? 'Respuesta correcta' : 'Marcar como correcta'}
                >
                  {esCorrecta && (
                    <svg className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
                <span className="text-xs font-bold text-gray-400 w-5">{letra})</span>
                <input
                  type="text"
                  value={textoOpcion(op)}
                  onChange={(e) => onOpcion(j, e.target.value)}
                  className={`input-base flex-1 text-sm ${esCorrecta ? 'border-green-200 bg-green-50' : ''}`}
                  placeholder={`Opción ${letra}`}
                />
                {pregunta.opciones.length > 2 && (
                  <button
                    type="button"
                    onClick={() => onEliminarOpcion(j)}
                    className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                    title="Eliminar opción"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}
              </div>
            )
          })}
          {pregunta.opciones && pregunta.opciones.length < 6 && (
            <button
              type="button"
              onClick={onAgregarOpcion}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1 ml-7"
            >
              <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Agregar opción
            </button>
          )}
        </div>
      )}

      {pregunta.tipo === 'verdadero_falso' && (
        <div>
          <p className="text-xs font-medium text-gray-500 mb-2">Respuesta correcta</p>
          <div className="flex gap-2">
            {[true, false].map((val) => (
              <button
                key={String(val)}
                type="button"
                onClick={() => onCampo('respuesta', val)}
                className={`flex-1 py-2 px-4 rounded-xl border text-sm font-medium transition-all ${
                  pregunta.respuesta === val
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                {val ? 'Verdadero' : 'Falso'}
              </button>
            ))}
          </div>
        </div>
      )}

      {(pregunta.tipo === 'abierta' || pregunta.tipo === 'calculo') && (
        <div>
          <p className="text-xs font-medium text-gray-500 mb-1">Respuesta modelo</p>
          <textarea
            value={pregunta.respuesta ?? ''}
            onChange={(e) => onCampo('respuesta', e.target.value)}
            rows={3}
            className="input-base text-sm resize-none"
            placeholder="Respuesta esperada..."
          />
        </div>
      )}

      {pregunta.tipo === 'espacios' && (
        <div>
          <p className="text-xs font-medium text-gray-500 mb-1">Respuesta correcta</p>
          <input
            type="text"
            value={pregunta.respuesta ?? ''}
            onChange={(e) => onCampo('respuesta', e.target.value)}
            className="input-base text-sm"
            placeholder="Texto que completa el espacio"
          />
        </div>
      )}
    </div>
  )
}

function ViewMode({ pregunta }) {
  return (
    <>
      <p className="text-sm text-gray-800">{pregunta.pregunta}</p>

      {pregunta.opciones && (
        <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1">
          {pregunta.opciones.map((op, j) => (
            <li
              key={j}
              className={`text-xs px-2.5 py-1.5 rounded-lg ${
                op.startsWith(pregunta.respuesta)
                  ? 'bg-green-50 text-green-700 font-semibold border border-green-200'
                  : 'text-gray-500 bg-gray-50'
              }`}
            >
              {op}
            </li>
          ))}
        </ul>
      )}

      {pregunta.tipo === 'verdadero_falso' && (
        <span className="mt-2 inline-block text-xs font-medium px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded-lg">
          {pregunta.respuesta ? 'Verdadero' : 'Falso'}
        </span>
      )}

      {pregunta.tipo === 'espacios' && pregunta.respuesta && (
        <span className="mt-2 inline-block text-xs font-medium px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded-lg">
          {pregunta.respuesta}
        </span>
      )}

      {(pregunta.tipo === 'abierta' || pregunta.tipo === 'calculo') && pregunta.respuesta && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-xs font-semibold text-green-700 mb-1">Respuesta modelo</p>
          <p className="text-sm text-green-900 whitespace-pre-line">{pregunta.respuesta}</p>
        </div>
      )}
    </>
  )
}
