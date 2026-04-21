import { create } from 'zustand'
import { TAREAS_MOCK } from '../mock/tareas.js'
import { ALUMNOS_MOCK } from '../mock/alumnos.js'

function calcularPromedio(resultadosPorAlumno) {
  const resultados = Object.values(resultadosPorAlumno)
  if (resultados.length === 0) return null
  const suma = resultados.reduce((acc, r) => acc + r.calificacion, 0)
  return Math.round((suma / resultados.length) * 10) / 10
}

const useTareaStore = create((set, get) => ({
  tareas: TAREAS_MOCK,
  alumnos: ALUMNOS_MOCK,

  getTareaById: (id) => get().tareas.find((t) => t.id === id),

  getTareasParaAlumno: (alumnoId) => {
    const { tareas } = get()
    return tareas
      .filter((t) => t.estado !== 'borrador')
      .map((t) => {
        const resultado = t.resultadosPorAlumno?.[alumnoId]
        let estadoAlumno = 'pendiente'
        if (resultado) {
          estadoAlumno = 'completada'
        } else if (t.estado === 'en_curso' || t.estado === 'completada') {
          estadoAlumno = 'en_curso'
        }
        return {
          ...t,
          estadoAlumno,
          resultadoAlumno: resultado ?? null,
        }
      })
  },

  agregarTarea: (tarea) => {
    const nueva = {
      ...tarea,
      id: `tarea-${Date.now()}`,
      estado: 'borrador',
      fechaCreacion: new Date().toISOString().split('T')[0],
      resultadosPorAlumno: {},
    }
    set((state) => ({ tareas: [nueva, ...state.tareas] }))
    return nueva
  },

  actualizarTarea: (id, cambios) => {
    set((state) => ({
      tareas: state.tareas.map((t) =>
        t.id === id ? { ...t, ...cambios } : t
      ),
    }))
  },

  publicarTarea: (id) => {
    set((state) => ({
      tareas: state.tareas.map((t) =>
        t.id === id ? { ...t, estado: 'en_curso' } : t
      ),
    }))
  },

  guardarResultado: (tareaId, alumnoId, resultado) => {
    set((state) => {
      const tareas = state.tareas.map((t) => {
        if (t.id !== tareaId) return t

        const nuevosResultados = {
          ...t.resultadosPorAlumno,
          [alumnoId]: { alumnoId, ...resultado, fechaEntrega: new Date().toISOString().split('T')[0] },
        }

        const totalAlumnos = state.alumnos.length
        const entregados = Object.keys(nuevosResultados).length
        const estado = entregados >= totalAlumnos ? 'completada' : 'en_curso'

        return {
          ...t,
          resultadosPorAlumno: nuevosResultados,
          estado,
        }
      })
      return { tareas }
    })
  },

  getPromedioGrupo: (tareaId) => {
    const tarea = get().tareas.find((t) => t.id === tareaId)
    if (!tarea) return null
    return calcularPromedio(tarea.resultadosPorAlumno ?? {})
  },
}))

export default useTareaStore
