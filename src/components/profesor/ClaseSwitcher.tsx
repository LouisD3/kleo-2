'use client'

import { ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase.js'
import useAuthStore from '@/store/useAuthStore.js'

interface Props {
  currentClaseId: string
  currentName: string
  emoji?: string
}

export default function ClaseSwitcher({ currentClaseId, currentName, emoji }: Props) {
  const { profesor } = useAuthStore()
  const router = useRouter()
  const [clases, setClases] = useState<{ id: string; nombre: string; emoji?: string }[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!profesor) return
    ;(supabase as any)
      .from('clases')
      .select('id, nombre, emoji')
      .eq('profesor_id', profesor.id)
      .order('created_at', { ascending: false })
      .then(({ data }: { data: { id: string; nombre: string; emoji?: string }[] | null }) =>
        setClases(data ?? []),
      )
  }, [profesor])

  const hasMultiple = clases.length > 1

  return (
    <div className="relative inline-flex">
      <button
        onClick={() => hasMultiple && setOpen(!open)}
        className={`flex items-center gap-2 ${hasMultiple ? 'cursor-pointer' : 'cursor-default'}`}
      >
        <span className="text-2xl leading-none">{emoji || '🎓'}</span>
        <h1 className="text-2xl font-bold text-tinta">{currentName}</h1>
        {hasMultiple && (
          <ChevronDown
            className={`w-5 h-5 text-tinta-400 transition-transform ${open ? 'rotate-180' : ''}`}
          />
        )}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-2 bg-white border border-crema-300 rounded-2xl shadow-lg z-50 min-w-[220px] py-1">
            {clases.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setOpen(false)
                  if (c.id !== currentClaseId) {
                    router.push(`/profesor/clase/${c.id}`)
                  }
                }}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-crema-50 transition-colors flex items-center gap-2 ${
                  c.id === currentClaseId
                    ? 'font-semibold text-tinta bg-amarillo/10'
                    : 'text-tinta-600'
                }`}
              >
                <span className="text-base">{c.emoji || '🎓'}</span>
                {c.nombre}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
