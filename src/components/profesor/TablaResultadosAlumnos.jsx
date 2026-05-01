'use client'
import Badge from '../ui/Badge.jsx'

export default function TablaResultadosAlumnos({
  resultadosPorAlumno,
  alumnos = [],
  editandoNota,
  notaManual,
  onEditarNota,
  onCambiarNota,
  onGuardarNota,
  onCancelarEdicion,
}) {
  if (alumnos.length === 0) {
    return (
      <div className="p-8 text-center text-gray-400">
        <p className="font-medium">Sin alumnos en la clase</p>
        <p className="text-sm mt-1">Agrega alumnos desde la gestión de clase.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">
              Alumno
            </th>
            <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">
              Estado
            </th>
            <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">
              Nota IA
            </th>
            <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">
              Nota final
            </th>
            <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide hidden sm:table-cell">
              Áreas de mejora
            </th>
            <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide hidden md:table-cell">
              Entrega
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {alumnos.map((alumno) => {
            const resultado = resultadosPorAlumno?.[alumno.id]
            const notaFinal = resultado
              ? (resultado.calificacion_manual ?? resultado.calificacion)
              : null
            const isEditing = editandoNota === alumno.id

            return (
              <tr key={alumno.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold flex-shrink-0 ${alumno.avatar_color}`}
                    >
                      {alumno.avatar_iniciales}
                    </span>
                    <span className="font-medium text-gray-900">{alumno.nombre}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  {resultado ? (
                    <Badge valor="completada" />
                  ) : (
                    <Badge valor="pendiente" texto="Pendiente" />
                  )}
                </td>
                <td className="px-4 py-3.5">
                  {resultado ? (
                    <span className="text-sm text-gray-500">{resultado.calificacion}/10</span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3.5">
                  {resultado ? (
                    isEditing ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="0"
                          max="10"
                          step="0.5"
                          value={notaManual}
                          onChange={(e) => onCambiarNota(e.target.value)}
                          className="w-16 px-2 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-amarillo"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') onGuardarNota(resultado.id)
                            if (e.key === 'Escape') onCancelarEdicion()
                          }}
                        />
                        <button
                          onClick={() => onGuardarNota(resultado.id)}
                          className="text-xs text-green-600 hover:text-green-700 font-medium"
                        >
                          OK
                        </button>
                        <button
                          onClick={onCancelarEdicion}
                          className="text-xs text-gray-400 hover:text-gray-600"
                        >
                          X
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => onEditarNota(alumno.id, notaFinal)}
                        className="group flex items-center gap-1"
                      >
                        <span
                          className={`font-bold text-base ${
                            notaFinal >= 8
                              ? 'text-green-600'
                              : notaFinal >= 6
                                ? 'text-orange-500'
                                : 'text-red-500'
                          }`}
                        >
                          {notaFinal}/10
                        </span>
                        {resultado.calificacion_manual != null && (
                          <span className="text-xs text-gray-400">(manual)</span>
                        )}
                        <svg
                          className="w-3 h-3 text-gray-300 group-hover:text-gray-500 transition-colors"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                    )
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3.5 hidden sm:table-cell">
                  {resultado?.areas_de_mejora?.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {resultado.areas_de_mejora.map((area, i) => (
                        <span
                          key={i}
                          className="text-xs text-gray-600 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-full"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  ) : resultado ? (
                    <span className="text-xs text-green-600 font-medium">Sin áreas de mejora</span>
                  ) : (
                    <span className="text-gray-400 text-xs">—</span>
                  )}
                </td>
                <td className="px-4 py-3.5 hidden md:table-cell">
                  <span className="text-gray-500 text-xs">
                    {resultado?.submitted_at
                      ? new Date(resultado.submitted_at).toLocaleDateString('es-MX')
                      : '—'}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
