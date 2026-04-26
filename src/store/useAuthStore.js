import { create } from 'zustand'
import { supabase } from '../lib/supabase.js'

const useAuthStore = create((set, get) => ({
  usuario: null,
  profesor: null,
  alumno: null,
  clase: null,
  rol: null,
  cargando: true,
  error: null,

  inicializar: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const { data: profesor } = await supabase
          .from('profesores')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (profesor) {
          const { data: clases } = await supabase
            .from('clases')
            .select('*')
            .eq('profesor_id', profesor.id)
            .order('created_at', { ascending: false })

          set({
            usuario: session.user,
            profesor,
            rol: 'profesor',
            clase: clases?.[0] ?? null,
            cargando: false,
          })
          return
        }
      }
    } catch (e) {
      console.error('Error initializing auth:', e)
    }
    set({ cargando: false })
  },

  registrarse: async (email, password, nombre, escuela) => {
    set({ error: null })
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) {
      set({ error: error.message })
      return false
    }

    const userId = data.user.id
    const { error: insertError } = await supabase
      .from('profesores')
      .insert({ id: userId, nombre, escuela })

    if (insertError) {
      set({ error: insertError.message })
      return false
    }

    const { error: claseError, data: claseData } = await supabase
      .from('clases')
      .insert({ profesor_id: userId, nombre: 'Mi clase', grado: '1° Secundaria' })
      .select()
      .single()

    set({
      usuario: data.user,
      profesor: { id: userId, nombre, escuela },
      rol: 'profesor',
      clase: claseData ?? null,
    })
    return true
  },

  iniciarSesion: async (email, password) => {
    set({ error: null })
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      set({ error: error.message })
      return false
    }

    const { data: profesor } = await supabase
      .from('profesores')
      .select('*')
      .eq('id', data.user.id)
      .single()

    const { data: clases } = await supabase
      .from('clases')
      .select('*')
      .eq('profesor_id', data.user.id)
      .order('created_at', { ascending: false })

    set({
      usuario: data.user,
      profesor,
      rol: 'profesor',
      clase: clases?.[0] ?? null,
    })
    return true
  },

  loginAlumno: async (codigo) => {
    set({ error: null })
    const { data, error } = await supabase
      .from('alumnos')
      .select('*, clases(nombre, grado)')
      .eq('codigo_acceso', codigo.toUpperCase().trim())
      .single()

    if (error || !data) {
      set({ error: 'Código de acceso no encontrado. Verifica con tu profesor.' })
      return false
    }

    set({
      alumno: {
        id: data.id,
        nombre: data.nombre,
        avatar: data.avatar_iniciales,
        color: data.avatar_color,
        clase_id: data.clase_id,
        grado: data.clases?.grado ?? '',
      },
      rol: 'alumno',
    })
    return true
  },

  setClase: (clase) => set({ clase }),

  cerrarSesion: async () => {
    const { rol } = get()
    if (rol === 'profesor') {
      await supabase.auth.signOut()
    }
    set({
      usuario: null,
      profesor: null,
      alumno: null,
      clase: null,
      rol: null,
      error: null,
    })
  },

  setError: (error) => set({ error }),
}))

export default useAuthStore
