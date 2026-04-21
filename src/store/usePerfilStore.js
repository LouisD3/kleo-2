import { create } from 'zustand'

const usePerfilStore = create((set) => ({
  perfilActivo: null, // 'profesor' | 'alumno'
  alumnoSeleccionado: null, // objeto alumno

  setPerfilProfesor: () =>
    set({ perfilActivo: 'profesor', alumnoSeleccionado: null }),

  setPerfilAlumno: (alumno) =>
    set({ perfilActivo: 'alumno', alumnoSeleccionado: alumno }),

  resetPerfil: () =>
    set({ perfilActivo: null, alumnoSeleccionado: null }),
}))

export default usePerfilStore
