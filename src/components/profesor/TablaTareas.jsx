'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { calcularPromedio } from '@/hooks/useTareas.js'
import Badge from '../ui/Badge.jsx'
import Boton from '../ui/Boton.jsx'
import Modal from '../ui/Modal.jsx'

export default function TablaTareas({ tareas, clasesMap, resultados, onEliminar, eliminando }) {
  const router = useRouter()
  const mostrarClase = clasesMap && Object.keys(clasesMap).length > 1
  const [tareaAEliminar, setTareaAEliminar] = useState(null)

  if (tareas.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <svg
          className="w-12 h-12 mx-auto mb-3 opacity-40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"
          />
        </svg>
        <p className="font-medium">Sin tareas todavía</p>
        <p className="text-sm mt-1">Genera tu primera tarea con IA</p>
      </div>
    )
  }

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                Nombre
              </th>
              {mostrarClase && (
                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide hidden sm:table-cell">
                  Clase
                </th>
              )}
              <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide hidden sm:table-cell">
                Materia
              </th>
              <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide hidden md:table-cell">
                Dificultad
              </th>
              <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                Estado
              </th>
              <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide hidden md:table-cell">
                Promedio
              </th>
              <th className="text-right px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {tareas.map((tarea) => {
              const promedio = calcularPromedio(resultados?.[tarea.id])
              const clase = clasesMap?.[tarea.clase_id]
              return (
                <tr
                  key={tarea.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/profesor/tarea/${tarea.id}`)}
                >
                  <td className="px-4 py-3.5">
                    <span className="font-medium text-gray-900">{tarea.nombre}</span>
                  </td>
                  {mostrarClase && (
                    <td className="px-4 py-3.5 hidden sm:table-cell">
                      <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                        {clase?.nombre ?? '—'}
                      </span>
                    </td>
                  )}
                  <td className="px-4 py-3.5 hidden sm:table-cell">
                    <span className="text-gray-600">{tarea.materia}</span>
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <Badge valor={tarea.dificultad} />
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge valor={tarea.estado} />
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <span className="font-semibold text-gray-900">
                      {promedio !== null ? `${promedio}/10` : '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <Boton
                        variante="fantasma"
                        size="sm"
                        onClick={() => router.push(`/profesor/tarea/${tarea.id}`)}
                      >
                        Ver detalle
                      </Boton>
                      <button
                        onClick={() => setTareaAEliminar(tarea)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Eliminar tarea"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <Modal
        abierto={!!tareaAEliminar}
        onCerrar={() => setTareaAEliminar(null)}
        titulo="Eliminar tarea"
      >
        <p className="text-sm text-gray-600 mb-6">
          ¿Estás seguro de que deseas eliminar{' '}
          <span className="font-semibold text-gray-900">{tareaAEliminar?.nombre}</span>? Los
          resultados de los alumnos asociados también serán eliminados. Esta acción no se puede
          deshacer.
        </p>
        <div className="flex justify-end gap-3">
          <Boton variante="secundario" size="sm" onClick={() => setTareaAEliminar(null)}>
            Cancelar
          </Boton>
          <Boton
            variante="primario"
            size="sm"
            className="!bg-red-600 hover:!bg-red-700"
            disabled={eliminando}
            onClick={async () => {
              await onEliminar(tareaAEliminar.id)
              setTareaAEliminar(null)
            }}
          >
            {eliminando ? 'Eliminando...' : 'Eliminar'}
          </Boton>
        </div>
      </Modal>
    </>
  )
}
