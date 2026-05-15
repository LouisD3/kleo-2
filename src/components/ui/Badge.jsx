const ESTILOS = {
  completada: 'bg-crema-200 text-tinta-600',
  en_curso: 'bg-amarillo text-tinta',
  borrador: 'bg-crema-200 text-tinta-400',
  pendiente: 'bg-crema-200 text-tinta-400',
  facil: 'bg-crema-200 text-tinta-600',
  media: 'bg-amarillo text-tinta',
  dificil: 'bg-red-100 text-red-700',
  default: 'bg-crema-200 text-tinta-600',
}

const ETIQUETAS = {
  completada: 'Completada',
  en_curso: 'En curso',
  borrador: 'Borrador',
  pendiente: 'Pendiente',
}

export default function Badge({ valor, texto, className = '' }) {
  const clave = valor
    ?.toLowerCase()
    .replace(/\s/g, '_')
    .replace(/á/g, 'a')
    .replace(/é/g, 'e')
    .replace(/í/g, 'i')
    .replace(/ó/g, 'o')
    .replace(/ú/g, 'u')
  const estilo = ESTILOS[clave] ?? ESTILOS.default
  const etiqueta = texto ?? ETIQUETAS[clave] ?? valor

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${estilo} ${className}`}
    >
      {etiqueta}
    </span>
  )
}
