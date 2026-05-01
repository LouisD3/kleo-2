'use client'
import { create } from 'zustand'
import { supabase } from '../lib/supabase.js'

function calcularPromedio(resultados) {
  if (!resultados || resultados.length === 0) return null
  const suma = resultados.reduce((acc, r) => acc + (r.calificacion_manual ?? r.calificacion), 0)
  return Math.round((suma / resultados.length) * 10) / 10
}

const useTareaStore = create((set, get) => ({
  tareas: [],
  alumnos: [],
  resultados: {},
  cargandoDatos: true,

  cargarTareas: async (claseId) => {
    if (!claseId) return
    set({ cargandoDatos: true })

    const { data: tareas } = await supabase
      .from('tareas')
      .select('*')
      .eq('clase_id', claseId)
      .order('created_at', { ascending: false })

    const { data: resultados } = await supabase
      .from('resultados')
      .select('*')
      .in(
        'tarea_id',
        (tareas ?? []).map((t) => t.id),
      )

    const resultadosMap = {}
    for (const r of resultados ?? []) {
      if (!resultadosMap[r.tarea_id]) resultadosMap[r.tarea_id] = {}
      resultadosMap[r.tarea_id][r.alumno_id] = r
    }

    set({ tareas: tareas ?? [], resultados: resultadosMap, cargandoDatos: false })
  },

  cargarTareasProfesor: async (profesorId) => {
    if (!profesorId) return
    set({ cargandoDatos: true })

    const { data: tareas } = await supabase
      .from('tareas')
      .select('*')
      .eq('profesor_id', profesorId)
      .order('created_at', { ascending: false })

    const { data: resultados } = await supabase
      .from('resultados')
      .select('*')
      .in(
        'tarea_id',
        (tareas ?? []).map((t) => t.id),
      )

    const resultadosMap = {}
    for (const r of resultados ?? []) {
      if (!resultadosMap[r.tarea_id]) resultadosMap[r.tarea_id] = {}
      resultadosMap[r.tarea_id][r.alumno_id] = r
    }

    set({ tareas: tareas ?? [], resultados: resultadosMap, cargandoDatos: false })
  },

  cargarTareasAlumno: async (claseId) => {
    if (!claseId) return
    set({ cargandoDatos: true })

    const { data: tareas } = await supabase
      .from('tareas')
      .select('*')
      .eq('clase_id', claseId)
      .in('estado', ['en_curso', 'completada'])
      .order('created_at', { ascending: false })

    const { data: resultados } = await supabase
      .from('resultados')
      .select('*')
      .in(
        'tarea_id',
        (tareas ?? []).map((t) => t.id),
      )

    const resultadosMap = {}
    for (const r of resultados ?? []) {
      if (!resultadosMap[r.tarea_id]) resultadosMap[r.tarea_id] = {}
      resultadosMap[r.tarea_id][r.alumno_id] = r
    }

    set({ tareas: tareas ?? [], resultados: resultadosMap, cargandoDatos: false })
  },

  cargarAlumnos: async (claseId) => {
    if (!claseId) return
    const { data } = await supabase
      .from('alumnos')
      .select('*')
      .eq('clase_id', claseId)
      .order('nombre')

    set({ alumnos: data ?? [] })
  },

  getTareaById: (id) => get().tareas.find((t) => t.id === id),

  getResultadosTarea: (tareaId) => get().resultados[tareaId] ?? {},

  getTareasParaAlumno: (alumnoId) => {
    const { tareas, resultados } = get()
    return tareas.map((t) => {
      const resultado = resultados[t.id]?.[alumnoId]
      let estadoAlumno = 'pendiente'
      if (resultado) {
        estadoAlumno = 'completada'
      } else if (t.estado === 'en_curso' || t.estado === 'completada') {
        estadoAlumno = 'en_curso'
      }
      return { ...t, estadoAlumno, resultadoAlumno: resultado ?? null }
    })
  },

  agregarTarea: async (tarea) => {
    const { data, error } = await supabase
      .from('tareas')
      .insert({
        profesor_id: tarea.profesor_id,
        clase_id: tarea.clase_id,
        nombre: tarea.nombre,
        materia: tarea.materia,
        dificultad: tarea.dificultad,
        metodologia: tarea.metodologia,
        tipos: tarea.tipos,
        preguntas: tarea.preguntas,
        estado: 'borrador',
        fecha_limite: tarea.fecha_limite || null,
        pda: tarea.pda || null,
        numero_preguntas: tarea.preguntas?.length ?? 0,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating task:', error)
      return null
    }

    set((state) => ({ tareas: [data, ...state.tareas] }))
    return data
  },

  actualizarTarea: async (id, cambios) => {
    const { error } = await supabase.from('tareas').update(cambios).eq('id', id)

    if (!error) {
      set((state) => ({
        tareas: state.tareas.map((t) => (t.id === id ? { ...t, ...cambios } : t)),
      }))
    }
  },

  publicarTarea: async (id) => {
    const { error } = await supabase.from('tareas').update({ estado: 'en_curso' }).eq('id', id)

    if (!error) {
      set((state) => ({
        tareas: state.tareas.map((t) => (t.id === id ? { ...t, estado: 'en_curso' } : t)),
      }))
    }
  },

  guardarResultado: async (tareaId, alumnoId, resultado) => {
    const { error } = await supabase.from('resultados').upsert({
      tarea_id: tareaId,
      alumno_id: alumnoId,
      respuestas: resultado.respuestas,
      calificacion: resultado.calificacion,
      retroalimentacion: resultado.retroalimentacion,
      areas_de_mejora: resultado.areas_de_mejora ?? [],
    })

    if (error) {
      console.error('Error saving result:', error)
      return false
    }

    set((state) => {
      const resultados = { ...state.resultados }
      if (!resultados[tareaId]) resultados[tareaId] = {}
      resultados[tareaId][alumnoId] = { ...resultado, calificacion_manual: null }

      const totalAlumnos = state.alumnos.length
      const entregados = Object.keys(resultados[tareaId]).length
      const nuevoEstado = entregados >= totalAlumnos && totalAlumnos > 0 ? 'completada' : 'en_curso'

      return {
        resultados,
        tareas: state.tareas.map((t) => (t.id === tareaId ? { ...t, estado: nuevoEstado } : t)),
      }
    })

    return true
  },

  guardarCalificacionManual: async (resultadoId, calificacion) => {
    const { error } = await supabase
      .from('resultados')
      .update({ calificacion_manual: calificacion })
      .eq('id', resultadoId)

    if (!error) {
      set((state) => {
        const resultados = { ...state.resultados }
        for (const tareaId in resultados) {
          for (const alumnoId in resultados[tareaId]) {
            if (resultados[tareaId][alumnoId].id === resultadoId) {
              resultados[tareaId][alumnoId] = {
                ...resultados[tareaId][alumnoId],
                calificacion_manual: calificacion,
              }
            }
          }
        }
        return { resultados }
      })
    }
  },

  getPromedioGrupo: (tareaId) => {
    const resultados = get().resultados[tareaId]
    if (!resultados) return null
    return calcularPromedio(Object.values(resultados))
  },

  agregarAlumno: async (claseId, nombre) => {
    const iniciales = nombre
      .split(' ')
      .map((p) => p[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)

    const colores = [
      'bg-pink-100 text-pink-700',
      'bg-blue-100 text-blue-700',
      'bg-purple-100 text-purple-700',
      'bg-green-100 text-green-700',
      'bg-orange-100 text-orange-700',
      'bg-teal-100 text-teal-700',
      'bg-red-100 text-red-700',
      'bg-indigo-100 text-indigo-700',
    ]
    const color = colores[Math.floor(Math.random() * colores.length)]
    const codigo = generarCodigo()

    const { data, error } = await supabase
      .from('alumnos')
      .insert({
        clase_id: claseId,
        nombre,
        codigo_acceso: codigo,
        avatar_iniciales: iniciales,
        avatar_color: color,
      })
      .select()
      .single()

    if (error) {
      console.error('Error adding student:', error)
      return null
    }

    set((state) => ({ alumnos: [...state.alumnos, data] }))
    return data
  },

  eliminarAlumno: async (alumnoId) => {
    const { error } = await supabase.from('alumnos').delete().eq('id', alumnoId)

    if (!error) {
      set((state) => ({ alumnos: state.alumnos.filter((a) => a.id !== alumnoId) }))
    }
  },
}))

function generarCodigo() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let codigo = ''
  for (let i = 0; i < 6; i++) {
    codigo += chars[Math.floor(Math.random() * chars.length)]
  }
  return codigo
}

export default useTareaStore
