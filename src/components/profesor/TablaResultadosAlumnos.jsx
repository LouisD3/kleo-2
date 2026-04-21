import { ALUMNOS_MOCK } from '../../mock/alumnos.js'
import Badge from '../ui/Badge.jsx'

export default function TablaResultadosAlumnos({ resultadosPorAlumno }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Alumno</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Estado</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Nota</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide hidden sm:table-cell">Áreas de mejora</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide hidden md:table-cell">Entrega</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {ALUMNOS_MOCK.map((alumno) => {
            const resultado = resultadosPorAlumno?.[alumno.id]
            return (
              <tr key={alumno.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold flex-shrink-0 ${alumno.color}`}
                    >
                      {alumno.avatar}
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
                    <span
                      className={`font-bold text-base ${
                        resultado.calificacion >= 8
                          ? 'text-green-600'
                          : resultado.calificacion >= 6
                          ? 'text-orange-500'
                          : 'text-red-500'
                      }`}
                    >
                      {resultado.calificacion}/10
                    </span>
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
                  <span className="text-gray-500 text-xs">{resultado?.fechaEntrega ?? '—'}</span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
