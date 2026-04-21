export default function Boton({
  children,
  onClick,
  type = 'button',
  variante = 'primario',
  disabled = false,
  className = '',
  size = 'md',
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3 text-base',
  }

  const variantes = {
    primario:
      'bg-amarillo hover:bg-amarillo-hover text-gray-900 focus:ring-amarillo shadow-sm hover:shadow-md active:scale-95',
    secundario:
      'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 focus:ring-gray-300 shadow-sm hover:shadow active:scale-95',
    peligro:
      'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 focus:ring-red-300 active:scale-95',
    fantasma:
      'bg-transparent hover:bg-gray-100 text-gray-600 focus:ring-gray-200 active:scale-95',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${sizes[size]} ${variantes[variante]} ${className}`}
    >
      {children}
    </button>
  )
}
