'use client'

import { Command } from 'cmdk'
import { BookOpen, ClipboardList, Search, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { getAllSecuencias } from '@/content/biblioteca/matematicas-1'
import { useTareasProfesor } from '@/hooks/useTareas.js'
import { supabase } from '@/lib/supabase.js'
import useAuthStore from '@/store/useAuthStore.js'

const secuencias = getAllSecuencias()

export default function SearchGlobalModal() {
  const [open, setOpen] = useState(false)
  const [alumnos, setAlumnos] = useState<{ id: string; nombre: string; clase_id: string }[]>([])
  const router = useRouter()
  const { profesor } = useAuthStore()
  const { data: tareasData } = useTareasProfesor(profesor?.id)
  const tareas = tareasData?.tareas ?? []

  // Listen for ⌘K
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Load alumnos when opened
  useEffect(() => {
    if (!open || !profesor) return
    ;(supabase as any)
      .from('alumnos')
      .select('id, nombre, clase_id')
      .in('clase_id', (profesor as any).clases_ids ?? [])
      .order('nombre')
      .then(({ data }: { data: any[] | null }) => setAlumnos(data ?? []))

    // Fallback: load via clases
    ;(supabase as any)
      .from('clases')
      .select('id')
      .eq('profesor_id', profesor.id)
      .then(({ data: clases }: { data: { id: string }[] | null }) => {
        if (!clases?.length) return
        ;(supabase as any)
          .from('alumnos')
          .select('id, nombre, clase_id')
          .in(
            'clase_id',
            clases.map((c) => c.id),
          )
          .order('nombre')
          .then(({ data }: { data: any[] | null }) => setAlumnos(data ?? []))
      })
  }, [open, profesor])

  const navigate = useCallback(
    (path: string) => {
      setOpen(false)
      router.push(path)
    },
    [router],
  )

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="fixed inset-0 bg-black/50" onClick={() => setOpen(false)} />
      <div className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-[600px] px-4">
        <Command className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="flex items-center gap-2 px-4 border-b border-gray-100">
            <Search className="w-4 h-4 text-gray-400" />
            <Command.Input
              placeholder="Buscar alumnos, secuencias, tareas..."
              className="w-full py-3 text-sm outline-none bg-transparent placeholder-gray-400"
              autoFocus
            />
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded bg-gray-100 border border-gray-200 text-[10px] font-mono text-gray-400">
              ESC
            </kbd>
          </div>
          <Command.List className="max-h-[300px] overflow-y-auto p-2">
            <Command.Empty className="py-8 text-center text-sm text-gray-400">
              Sin resultados.
            </Command.Empty>

            {/* Alumnos */}
            <Command.Group heading="Alumnos">
              {alumnos.slice(0, 8).map((a) => (
                <Command.Item
                  key={a.id}
                  value={`alumno ${a.nombre}`}
                  onSelect={() => navigate(`/profesor/clase/${a.clase_id}/alumno/${a.id}`)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm cursor-pointer data-[selected=true]:bg-amarillo/10"
                >
                  <Users className="w-4 h-4 text-gray-400" />
                  {a.nombre}
                </Command.Item>
              ))}
            </Command.Group>

            {/* Secuencias */}
            <Command.Group heading="Secuencias">
              {secuencias.slice(0, 8).map((s: any) => (
                <Command.Item
                  key={s.secuencia}
                  value={`secuencia ${s.secuencia} ${s.titulo}`}
                  onSelect={() => navigate(`/profesor/programa/${s.secuencia}`)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm cursor-pointer data-[selected=true]:bg-amarillo/10"
                >
                  <BookOpen className="w-4 h-4 text-gray-400" />
                  Sec {s.secuencia} — {s.titulo}
                </Command.Item>
              ))}
            </Command.Group>

            {/* Tareas */}
            <Command.Group heading="Tareas">
              {(tareas as any[]).slice(0, 8).map((t) => (
                <Command.Item
                  key={t.id}
                  value={`tarea ${t.nombre}`}
                  onSelect={() => navigate(`/profesor/clase/${t.clase_id}/tarea/${t.id}`)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm cursor-pointer data-[selected=true]:bg-amarillo/10"
                >
                  <ClipboardList className="w-4 h-4 text-gray-400" />
                  {t.nombre}
                </Command.Item>
              ))}
            </Command.Group>

            {/* Quick actions */}
            <Command.Group heading="Acciones rápidas">
              <Command.Item
                value="asignar tarea"
                onSelect={() => navigate('/profesor/programa')}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm cursor-pointer data-[selected=true]:bg-amarillo/10"
              >
                + Asignar tarea
              </Command.Item>
              <Command.Item
                value="agregar alumno"
                onSelect={() => {
                  setOpen(false)
                  document.dispatchEvent(new CustomEvent('accion-rapida'))
                }}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm cursor-pointer data-[selected=true]:bg-amarillo/10"
              >
                + Agregar alumno
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  )
}
