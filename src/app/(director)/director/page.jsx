'use client'

import { pdf } from '@react-pdf/renderer'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import ReporteEscuelaPDF from '@/components/director/ReporteEscuelaPDF.jsx'
import NavBar from '@/components/layout/NavBar.jsx'
import Boton from '@/components/ui/Boton.jsx'
import Spinner from '@/components/ui/Spinner.jsx'
import { useEscuela, useEscuelaData } from '@/hooks/useDirector.js'
import useAuthStore from '@/store/useAuthStore.js'

function StatCard({ label, value, sublabel }) {
  return (
    <div className="card p-5">
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm font-medium text-gray-600 mt-1">{label}</p>
      {sublabel && <p className="text-xs text-gray-400 mt-0.5">{sublabel}</p>}
    </div>
  )
}

export default function DashboardDirector() {
  const router = useRouter()
  const { profesor } = useAuthStore()
  const { data: escuela, isLoading: loadingEscuela } = useEscuela(profesor?.id)
  const { data, isLoading } = useEscuelaData(escuela?.id)
  const [descargandoPDF, setDescargandoPDF] = useState(false)

  if (loadingEscuela || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!escuela) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar titulo="Director" />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Sin escuela asignada</h1>
          <p className="text-gray-500">
            No se encontró una escuela vinculada a tu cuenta. Contacta al administrador.
          </p>
        </main>
      </div>
    )
  }

  const { profesores, clases, alumnos, tareas, resultados } = data ?? {}
  const totalProfesores = profesores?.length ?? 0
  const totalAlumnos = alumnos?.length ?? 0
  const totalTareas = tareas?.length ?? 0
  const tareasActivas = tareas?.filter((t) => t.estado === 'en_curso').length ?? 0

  // Calculate average grade
  const calificaciones = (resultados ?? [])
    .map((r) => r.calificacion_manual ?? r.calificacion)
    .filter((c) => c != null)
  const promedioGeneral =
    calificaciones.length > 0
      ? Math.round((calificaciones.reduce((a, b) => a + b, 0) / calificaciones.length) * 10) / 10
      : null

  // Group stats by class
  const clasesConStats = (clases ?? []).map((clase) => {
    const profClase = profesores?.find((p) => p.id === clase.profesor_id)
    const alumnosClase = alumnos?.filter((a) => a.clase_id === clase.id) ?? []
    const tareasClase = tareas?.filter((t) => t.clase_id === clase.id) ?? []
    const resultadosClase =
      resultados?.filter((r) => tareasClase.some((t) => t.id === r.tarea_id)) ?? []
    const cals = resultadosClase
      .map((r) => r.calificacion_manual ?? r.calificacion)
      .filter((c) => c != null)
    const promedio =
      cals.length > 0 ? Math.round((cals.reduce((a, b) => a + b, 0) / cals.length) * 10) / 10 : null

    return {
      ...clase,
      profesor_nombre: profClase?.nombre ?? 'Sin profesor',
      total_alumnos: alumnosClase.length,
      total_tareas: tareasClase.length,
      promedio,
    }
  })

  async function handleExportPDF() {
    setDescargandoPDF(true)
    try {
      const fecha = new Date().toLocaleDateString('es-MX', {
        month: 'long',
        year: 'numeric',
      })
      const blob = await pdf(
        <ReporteEscuelaPDF
          escuela={escuela}
          stats={{ totalProfesores, totalAlumnos, totalTareas, promedioGeneral }}
          clasesConStats={clasesConStats}
          fecha={fecha}
        />,
      ).toBlob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Reporte_${escuela.nombre.replace(/[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ ]/g, '')}_${new Date().toISOString().slice(0, 7)}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setDescargandoPDF(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar titulo={escuela.nombre} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
        {/* Export button */}
        <div className="flex justify-end mb-4">
          <Boton
            variante="secundario"
            size="sm"
            onClick={handleExportPDF}
            disabled={descargandoPDF}
          >
            {descargandoPDF ? 'Generando...' : 'Exportar reporte PDF'}
          </Boton>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard label="Profesores activos" value={totalProfesores} />
          <StatCard label="Alumnos" value={totalAlumnos} />
          <StatCard
            label="Tareas creadas"
            value={totalTareas}
            sublabel={`${tareasActivas} activas`}
          />
          <StatCard
            label="Promedio general"
            value={promedioGeneral != null ? `${promedioGeneral}/10` : '—'}
          />
        </div>

        {/* Classes table */}
        <div className="card p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Clases</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                    Clase
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                    Profesor
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                    Alumnos
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                    Tareas
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                    Promedio
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {clasesConStats.map((clase) => (
                  <tr
                    key={clase.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => router.push(`/director/clase/${clase.id}`)}
                  >
                    <td className="px-4 py-3.5">
                      <div>
                        <span className="font-medium text-gray-900">{clase.nombre}</span>
                        {clase.grado && (
                          <span className="text-xs text-gray-400 ml-2">{clase.grado}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-gray-600">{clase.profesor_nombre}</td>
                    <td className="px-4 py-3.5 text-gray-600">{clase.total_alumnos}</td>
                    <td className="px-4 py-3.5 text-gray-600">{clase.total_tareas}</td>
                    <td className="px-4 py-3.5">
                      {clase.promedio != null ? (
                        <span
                          className={`font-bold ${
                            clase.promedio >= 8
                              ? 'text-green-600'
                              : clase.promedio >= 6
                                ? 'text-orange-500'
                                : 'text-red-500'
                          }`}
                        >
                          {clase.promedio}/10
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
                {clasesConStats.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                      No hay clases registradas en esta escuela.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
