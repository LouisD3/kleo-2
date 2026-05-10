export const RECOMPENSAS = [
  {
    puntos: 5,
    emoji: '\u{1F31F}',
    nombre: 'Primera estrella',
    descripcion: 'Completaste tus primeras tareas. ¡Sigue así!',
    color: 'from-yellow-100 to-yellow-50 border-yellow-200',
  },
  {
    puntos: 15,
    emoji: '\u{1F525}',
    nombre: 'En racha',
    descripcion: 'Tu esfuerzo constante está dando frutos.',
    color: 'from-orange-100 to-orange-50 border-orange-200',
  },
  {
    puntos: 30,
    emoji: '\u{1F3C6}',
    nombre: 'Campeón',
    descripcion: 'Eres un ejemplo para tu clase. ¡Impresionante!',
    color: 'from-amber-100 to-amber-50 border-amber-200',
  },
  {
    puntos: 50,
    emoji: '\u{1F48E}',
    nombre: 'Diamante',
    descripcion: 'Tu dedicación brilla. Pocos llegan aquí.',
    color: 'from-blue-100 to-blue-50 border-blue-200',
  },
  {
    puntos: 100,
    emoji: '\u{1F680}',
    nombre: 'Leyenda',
    descripcion: 'Has alcanzado el nivel máximo. ¡Eres una leyenda!',
    color: 'from-purple-100 to-purple-50 border-purple-200',
  },
]

export function getBadgesDesbloqueados(puntos) {
  return RECOMPENSAS.filter((r) => puntos >= r.puntos)
}

export function getSiguienteRecompensa(puntos) {
  return RECOMPENSAS.find((r) => r.puntos > puntos) ?? null
}
