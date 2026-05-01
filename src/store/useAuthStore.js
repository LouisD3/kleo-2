'use client'
import { create } from 'zustand'
import { supabase } from '../lib/supabase.js'

function traducirError(msg) {
  if (!msg) return 'Ocurrió un error inesperado.'
  if (msg.includes('Invalid login credentials')) return 'Correo o contraseña incorrectos.'
  if (msg.includes('Email not confirmed'))
    return 'Debes confirmar tu correo antes de iniciar sesión.'
  if (msg.includes('User already registered'))
    return 'Ya existe una cuenta con ese correo electrónico.'
  if (msg.includes('Password should be at least'))
    return 'La contraseña debe tener al menos 6 caracteres.'
  if (msg.includes('Unable to validate email address')) return 'El correo electrónico no es válido.'
  if (msg.includes('Email rate limit exceeded')) return 'Demasiados intentos. Espera unos minutos.'
  if (msg.includes('For security purposes'))
    return 'Por seguridad, espera unos segundos antes de intentar de nuevo.'
  if (msg.includes('over_email_send_rate_limit')) return 'Demasiados intentos. Espera unos minutos.'
  return msg
}

const useAuthStore = create((set, get) => ({
  usuario: null,
  profesor: null,
  alumno: null,
  clases: [],
  clase: null,
  rol: null,
  cargando: true,
  error: null,

  inicializar: async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session?.user) {
        let { data: profesor } = await supabase
          .from('profesores')
          .select('*')
          .eq('id', session.user.id)
          .single()

        // User auth exists but profesores row missing (failed registration or email confirmation)
        if (!profesor) {
          const meta = session.user.user_metadata ?? {}
          const { data: newProf } = await supabase
            .from('profesores')
            .upsert({
              id: session.user.id,
              nombre: meta.nombre ?? session.user.email?.split('@')[0] ?? 'Profesor',
              escuela: meta.escuela ?? null,
            })
            .select()
            .single()
          profesor = newProf
        }

        if (profesor) {
          let { data: clases } = await supabase
            .from('clases')
            .select('*')
            .eq('profesor_id', profesor.id)
            .order('created_at', { ascending: false })

          // No class exists, create default
          if (!clases || clases.length === 0) {
            const { data: newClase } = await supabase
              .from('clases')
              .insert({ profesor_id: profesor.id, nombre: 'Mi clase', grado: '1° Secundaria' })
              .select()
              .single()
            clases = newClase ? [newClase] : []
          }

          set({
            usuario: session.user,
            profesor,
            rol: 'profesor',
            clases: clases ?? [],
            clase: clases?.[0] ?? null,
            cargando: false,
          })
          return
        }
      }
    } catch (e) {
      console.error('Error initializing auth:', e)
    }
    // No teacher session — check for saved student session
    try {
      const saved = localStorage.getItem('kleo_alumno')
      if (saved) {
        const alumno = JSON.parse(saved)
        // Verify the student still exists in the database
        const { data: exists } = await supabase
          .from('alumnos')
          .select('id')
          .eq('id', alumno.id)
          .single()
        if (exists) {
          set({ alumno, rol: 'alumno', cargando: false })
          return
        }
        localStorage.removeItem('kleo_alumno')
      }
    } catch {}

    set({ cargando: false })
  },

  registrarse: async (email, password, nombre, escuela) => {
    set({ error: null })
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/profesor/bienvenida`,
        data: { nombre, escuela: escuela || null },
      },
    })
    if (error) {
      set({ error: traducirError(error.message) })
      return false
    }

    // Email confirmation required — no session yet
    if (!data.session) {
      return 'verificar'
    }

    // Email confirmation disabled — proceed immediately
    const userId = data.user.id
    const { error: insertError } = await supabase
      .from('profesores')
      .insert({ id: userId, nombre, escuela })

    if (insertError) {
      set({ error: traducirError(insertError.message) })
      return false
    }

    const { data: claseData } = await supabase
      .from('clases')
      .insert({ profesor_id: userId, nombre: 'Mi clase', grado: '1° Secundaria' })
      .select()
      .single()

    set({
      usuario: data.user,
      profesor: { id: userId, nombre, escuela },
      rol: 'profesor',
      clases: claseData ? [claseData] : [],
      clase: claseData ?? null,
    })
    return true
  },

  iniciarSesion: async (email, password) => {
    set({ error: null })
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      set({ error: traducirError(error.message) })
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
      clases: clases ?? [],
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

    const alumno = {
      id: data.id,
      nombre: data.nombre,
      avatar: data.avatar_iniciales,
      color: data.avatar_color,
      clase_id: data.clase_id,
      grado: data.clases?.grado ?? '',
    }

    localStorage.setItem('kleo_alumno', JSON.stringify(alumno))
    set({ alumno, rol: 'alumno' })
    return true
  },

  recuperarContrasena: async (email) => {
    set({ error: null })
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/restablecer-contrasena`,
    })
    if (error) {
      set({ error: traducirError(error.message) })
      return false
    }
    return true
  },

  restablecerContrasena: async (nuevaPassword) => {
    set({ error: null })
    const { error } = await supabase.auth.updateUser({ password: nuevaPassword })
    if (error) {
      set({ error: traducirError(error.message) })
      return false
    }
    return true
  },

  setClase: (clase) => set({ clase }),

  agregarClaseLocal: (nuevaClase) =>
    set((state) => ({
      clases: [nuevaClase, ...state.clases],
    })),

  cerrarSesion: async () => {
    const { rol } = get()
    if (rol === 'profesor') {
      await supabase.auth.signOut()
    }
    localStorage.removeItem('kleo_alumno')
    set({
      usuario: null,
      profesor: null,
      alumno: null,
      clases: [],
      clase: null,
      rol: null,
      error: null,
    })
  },

  setError: (error) => set({ error }),
}))

export default useAuthStore
