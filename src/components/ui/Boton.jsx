'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const VARIANTE_MAP = {
  primario: 'default',
  secundario: 'outline',
  peligro: 'destructive',
  fantasma: 'ghost',
}

const SIZE_MAP = {
  sm: 'sm',
  md: 'default',
  lg: 'lg',
}

const PRIMARIO_CLASSES =
  'bg-tinta hover:bg-tinta-600 text-amarillo border-tinta focus-visible:ring-tinta shadow-none active:scale-95'

const SECUNDARIO_CLASSES =
  'bg-white hover:bg-crema-50 text-tinta border border-crema-300 shadow-none'

export default function Boton({
  children,
  onClick,
  type = 'button',
  variante = 'primario',
  disabled = false,
  className = '',
  size = 'md',
}) {
  const variant = VARIANTE_MAP[variante] ?? 'default'
  const mappedSize = SIZE_MAP[size] ?? 'default'

  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled}
      variant={variant}
      size={mappedSize}
      className={cn(
        'rounded-full gap-2 font-medium active:scale-95',
        variante === 'primario' && PRIMARIO_CLASSES,
        variante === 'secundario' && SECUNDARIO_CLASSES,
        variante === 'peligro' && 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200',
        size === 'sm' && 'px-3 py-1.5 h-auto text-sm',
        size === 'md' && 'px-5 py-2.5 h-auto text-sm',
        size === 'lg' && 'px-7 py-3 h-auto text-base',
        className,
      )}
    >
      {children}
    </Button>
  )
}
