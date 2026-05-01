const ESTILOS = {
  completada: 'bg-green-100 text-green-700 border-green-200',
  en_curso: 'bg-blue-100 text-blue-700 border-blue-200',
  borrador: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  pendiente: 'bg-gray-100 text-gray-600 border-gray-200',
  facil: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  media: 'bg-orange-100 text-orange-700 border-orange-200',
  dificil: 'bg-red-100 text-red-700 border-red-200',
  default: 'bg-gray-100 text-gray-600 border-gray-200',
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
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${estilo} ${className}`}
    >
      {etiqueta}
    </span>
  )
}
