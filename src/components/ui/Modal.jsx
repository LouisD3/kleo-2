'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

export default function Modal({ abierto, onCerrar, titulo, children, maxWidth = 'max-w-lg' }) {
  return (
    <Dialog open={abierto} onOpenChange={(open) => !open && onCerrar?.()}>
      <DialogContent
        className={cn('sm:max-w-lg rounded-2xl p-0', maxWidth === 'max-w-2xl' && 'sm:max-w-2xl')}
      >
        <DialogHeader className="px-6 py-4 border-b border-gray-100">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            {titulo}
          </DialogTitle>
        </DialogHeader>
        <div className="px-6 py-5">{children}</div>
      </DialogContent>
    </Dialog>
  )
}
