'use client'

import { useState } from 'react'

function renderMarkdown(text) {
  if (!text) return ''
  return text
    .replace(/^### (.+)$/gm, '<h4 class="font-semibold text-gray-900 mt-3 mb-1">$1</h4>')
    .replace(/^## (.+)$/gm, '<h3 class="font-bold text-gray-900 mt-4 mb-2 text-lg">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^\- (.+)$/gm, '<li class="ml-4 list-disc text-gray-700">$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal text-gray-700">$1</li>')
    .replace(/\n{2,}/g, '<br/><br/>')
    .replace(/\n/g, '<br/>')
    .replace(
      /\|(.+)\|/g,
      (match) => `<div class="overflow-x-auto"><table class="w-full text-sm border-collapse my-2"><tr>${match.split('|').filter(Boolean).map(cell => `<td class="border border-gray-200 px-2 py-1">${cell.trim()}</td>`).join('')}</tr></table></div>`
    )
}

export default function VisorContenido({ titulo, secciones, onSeccionChange }) {
  const [editando, setEditando] = useState(null)
  const [textoEdicion, setTextoEdicion] = useState('')

  function iniciarEdicion(idx) {
    setEditando(idx)
    setTextoEdicion(secciones[idx].contenido)
  }

  function guardarEdicion() {
    if (editando === null) return
    const nuevas = secciones.map((s, i) =>
      i === editando ? { ...s, contenido: textoEdicion } : s,
    )
    onSeccionChange(nuevas)
    setEditando(null)
  }

  function cancelarEdicion() {
    setEditando(null)
    setTextoEdicion('')
  }

  return (
    <div className="space-y-4">
      <div className="card p-6">
        <h2 className="text-xl font-bold text-gray-900">{titulo}</h2>
      </div>

      {secciones.map((seccion, idx) => (
        <div key={idx} className="card p-6">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3 className="font-semibold text-gray-900">{seccion.titulo}</h3>
            {editando !== idx && (
              <button
                type="button"
                onClick={() => iniciarEdicion(idx)}
                className="flex-shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                title="Editar sección"
              >
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
            )}
          </div>

          {editando === idx ? (
            <div className="space-y-3">
              <textarea
                value={textoEdicion}
                onChange={(e) => setTextoEdicion(e.target.value)}
                rows={Math.max(6, textoEdicion.split('\n').length + 2)}
                className="input-base resize-y font-mono text-sm"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={guardarEdicion}
                  className="px-3 py-1.5 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={cancelarEdicion}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div
              className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(seccion.contenido) }}
            />
          )}
        </div>
      ))}
    </div>
  )
}
