'use client'

import { CircleAlert, X } from 'lucide-react'
import { Alert, AlertAction, AlertDescription } from '@/components/ui/alert'

export default function MensajeError({ mensaje, onCerrar }) {
  if (!mensaje) return null

  return (
    <Alert
      variant="destructive"
      className="animate-slide-up bg-amber-50 border-amber-200 rounded-xl py-3"
    >
      <CircleAlert className="size-5 text-amber-500" />
      <AlertDescription className="text-sm text-amber-700">{mensaje}</AlertDescription>
      {onCerrar && (
        <AlertAction>
          <button
            onClick={onCerrar}
            className="text-amber-400 hover:text-amber-600 transition-colors"
            aria-label="Cerrar"
          >
            <X className="size-4" />
          </button>
        </AlertAction>
      )}
    </Alert>
  )
}
