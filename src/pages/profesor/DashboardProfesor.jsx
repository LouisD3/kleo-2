import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import NavBar from '../../components/layout/NavBar.jsx'
import TablaTareas from '../../components/profesor/TablaTareas.jsx'
import Boton from '../../components/ui/Boton.jsx'
import Spinner from '../../components/ui/Spinner.jsx'
import useTareaStore from '../../store/useTareaStore.js'
import useAuthStore from '../../store/useAuthStore.js'

export default function DashboardProfesor() {
  const navigate = useNavigate()
  const { tareas, cargandoDatos, cargarTareas, cargarAlumnos } = useTareaStore()
  const { clase } = useAuthStore()

  useEffect(() => {
    if (clase?.id) {
      cargarTareas(clase.id)
      cargarAlumnos(clase.id)
    }
  }, [clase?.id])

  const completadas = tareas.filter((t) => t.estado === 'completada').length
  const enCurso = tareas.filter((t) => t.estado === 'en_curso').length
  const borradores = tareas.filter((t) => t.estado === 'borrador').length

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar titulo="Panel del profesor" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mis tareas</h1>
            <p className="text-sm text-gray-500 mt-1">
              {clase ? `${clase.nombre} · ${clase.grado}` : 'Gestiona y revisa el progreso de tu grupo'}
            </p>
          </div>
          <div className="flex gap-3">
            <Boton
              onClick={() => navigate('/profesor/clase')}
              variante="secundario"
              size="md"
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              Mi clase
            </Boton>
            <Boton
              onClick={() => navigate('/profesor/generar')}
              variante="primario"
              size="md"
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Generar nueva tarea
            </Boton>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Completadas', valor: completadas, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'En curso', valor: enCurso, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Borradores', valor: borradores, color: 'text-yellow-600', bg: 'bg-yellow-50' },
          ].map((stat) => (
            <div key={stat.label} className={`card p-5 ${stat.bg}`}>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.valor}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {cargandoDatos ? (
          <div className="card p-16 flex items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="card p-0 overflow-hidden">
            <TablaTareas tareas={tareas} />
          </div>
        )}
      </main>
    </div>
  )
}
