'use client'

import { CircleAlert, X } from 'lucide-react'
import { Alert, AlertAction, AlertDescription } from '@/components/ui/alert'

export default function MensajeError({ mensaje, onCerrar }) {
  if (!mensaje) return null

  return (
    <Alert
      variant="destructive"
      className="animate-slide-up bg-red-50 border-red-200 rounded-xl py-3"
    >
      <CircleAlert className="size-5 text-red-500" />
      <AlertDescription className="text-sm text-red-700">{mensaje}</AlertDescription>
      {onCerrar && (
        <AlertAction>
          <button
            onClick={onCerrar}
            className="text-red-400 hover:text-red-600 transition-colors"
            aria-label="Cerrar"
          >
            <X className="size-4" />
          </button>
        </AlertAction>
      )}
    </Alert>
  )
}
