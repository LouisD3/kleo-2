'use client'

import { ClipboardList, FileSpreadsheet, StickyNote, UserPlus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AccionRapidaMenu() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    function handleEvent() {
      setOpen(true)
    }
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault()
        setOpen(true)
      }
    }
    document.addEventListener('accion-rapida', handleEvent)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('accion-rapida', handleEvent)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[90]">
      <div className="fixed inset-0 bg-black/30" onClick={() => setOpen(false)} />
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 w-full max-w-sm px-4">
        <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 text-sm">Acción rápida</h3>
          </div>
          <div className="p-2 space-y-1">
            <button
              onClick={() => {
                setOpen(false)
                router.push('/profesor/programa')
              }}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <ClipboardList className="w-4 h-4 text-gray-400" />
              Asignar tarea
            </button>
            <button
              onClick={() => {
                setOpen(false)
                // Navigate to Mis clases — user picks a class then adds student
                router.push('/profesor')
              }}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <UserPlus className="w-4 h-4 text-gray-400" />
              Agregar alumno
            </button>
            <button
              disabled
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-gray-300 cursor-not-allowed"
            >
              <StickyNote className="w-4 h-4" />
              Tomar nota
              <span className="ml-auto text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-400">
                v2
              </span>
            </button>
            <button
              disabled
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-gray-300 cursor-not-allowed"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Exportar reporte
              <span className="ml-auto text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-400">
                v2
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
