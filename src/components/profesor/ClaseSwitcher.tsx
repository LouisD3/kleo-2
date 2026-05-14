'use client'

import { ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase.js'
import useAuthStore from '@/store/useAuthStore.js'

export default function ClaseSwitcher({ currentClaseId }: { currentClaseId: string }) {
  const { profesor } = useAuthStore()
  const router = useRouter()
  const [clases, setClases] = useState<{ id: string; nombre: string }[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!profesor) return
    ;(supabase as any)
      .from('clases')
      .select('id, nombre')
      .eq('profesor_id', profesor.id)
      .order('created_at', { ascending: false })
      .then(({ data }: { data: { id: string; nombre: string }[] | null }) => setClases(data ?? []))
  }, [profesor])

  const current = clases.find((c) => c.id === currentClaseId)

  if (clases.length <= 1) return null

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
      >
        {current?.nombre ?? 'Clase'}
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[200px] py-1">
            {clases.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setOpen(false)
                  if (c.id !== currentClaseId) {
                    router.push(`/profesor/clase/${c.id}`)
                  }
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                  c.id === currentClaseId
                    ? 'font-semibold text-gray-900 bg-amarillo/10'
                    : 'text-gray-600'
                }`}
              >
                {c.nombre}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
