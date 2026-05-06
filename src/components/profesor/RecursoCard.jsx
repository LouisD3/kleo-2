'use client'

import { useState } from 'react'
import Boton from '@/components/ui/Boton.jsx'
import Modal from '@/components/ui/Modal.jsx'

const TIPO_LABEL = {
  ejercicio: 'Ejercicio',
  quiz: 'Quiz',
  ficha: 'Ficha',
  problema: 'Problema',
}

const METODOLOGIA_COLOR = {
  Feynman: 'bg-purple-50 text-purple-700 border-purple-200',
  'Memorización activa': 'bg-blue-50 text-blue-700 border-blue-200',
  'Resolución de problemas': 'bg-green-50 text-green-700 border-green-200',
  'Práctica directa': 'bg-orange-50 text-orange-700 border-orange-200',
}

export default function RecursoCard({ recurso, isFavorito, onToggleFavorito, onUsar }) {
  const [showPreview, setShowPreview] = useState(false)

  const metColor =
    METODOLOGIA_COLOR[recurso.metodologia] ?? 'bg-gray-50 text-gray-700 border-gray-200'

  return (
    <>
      <div className="card p-4 flex flex-col gap-3 hover:shadow-md transition-shadow">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 line-clamp-2">
              {recurso.tema || recurso.pda}
            </p>
            <p className="text-xs text-gray-400 mt-1 truncate">
              {recurso.materia} · {recurso.grado}
            </p>
          </div>
          <button
            type="button"
            onClick={onToggleFavorito}
            className="flex-shrink-0 p-1"
            title={isFavorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          >
            <svg
              className={`w-5 h-5 ${isFavorito ? 'text-amarillo fill-amarillo' : 'text-gray-300'}`}
              viewBox="0 0 20 20"
              fill={isFavorito ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          <span className={`text-xs px-2 py-0.5 rounded-full border ${metColor}`}>
            {recurso.metodologia}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full border border-gray-200 text-gray-500">
            {TIPO_LABEL[recurso.tipo_recurso] ?? recurso.tipo_recurso}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full border border-gray-200 text-gray-500">
            {recurso.numero_preguntas} preg.
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full border border-gray-200 text-gray-500">
            {recurso.dificultad}
          </span>
        </div>

        {/* PDA line */}
        {recurso.contenido_pda && (
          <p className="text-xs text-gray-500 line-clamp-2">{recurso.contenido_pda}</p>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-auto pt-2 border-t border-gray-100">
          <Boton variante="primario" size="sm" className="flex-1" onClick={onUsar}>
            Usar
          </Boton>
          <Boton variante="secundario" size="sm" onClick={() => setShowPreview(true)}>
            Vista previa
          </Boton>
        </div>
      </div>

      {/* Preview modal */}
      <Modal
        abierto={showPreview}
        onCerrar={() => setShowPreview(false)}
        titulo="Vista previa del recurso"
      >
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="font-medium text-gray-700">{recurso.materia}</span>
            <span className="text-gray-400">·</span>
            <span className="text-gray-500">{recurso.grado}</span>
            <span className="text-gray-400">·</span>
            <span className="text-gray-500">{recurso.metodologia}</span>
            <span className="text-gray-400">·</span>
            <span className="text-gray-500">{recurso.dificultad}</span>
          </div>

          {recurso.pda && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs font-medium text-gray-500 mb-1">PDA</p>
              <p className="text-sm text-gray-700">{recurso.pda}</p>
            </div>
          )}

          <div className="divide-y divide-gray-100">
            {recurso.preguntas?.map((p, i) => (
              <div key={i} className="py-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-gray-400">{i + 1}</span>
                  <span className="text-xs text-gray-400 uppercase">{p.tipo}</span>
                </div>
                <p className="text-sm text-gray-800">{p.pregunta}</p>
                {p.opciones && (
                  <ul className="mt-1.5 space-y-0.5">
                    {p.opciones.map((op, j) => (
                      <li
                        key={j}
                        className={`text-xs px-2 py-1 rounded ${
                          op.startsWith(String(p.respuesta))
                            ? 'bg-green-50 text-green-700 font-medium'
                            : 'text-gray-500'
                        }`}
                      >
                        {op}
                      </li>
                    ))}
                  </ul>
                )}
                {p.respuesta && !p.opciones && (
                  <p className="text-xs text-green-600 mt-1">Respuesta: {String(p.respuesta)}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
          <Boton variante="primario" size="sm" className="flex-1" onClick={onUsar}>
            Usar tal cual
          </Boton>
          <Boton variante="secundario" size="sm" onClick={() => setShowPreview(false)}>
            Cerrar
          </Boton>
        </div>
      </Modal>
    </>
  )
}
