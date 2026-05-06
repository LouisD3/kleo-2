'use client'

import NavBar from '@/components/layout/NavBar.jsx'

const MODULOS = [
  {
    titulo: 'Primeros pasos con Kleo',
    descripcion: 'Crea tu cuenta, configura tu primera clase y genera tu primer ejercicio con IA.',
    duracion: '5 min',
    tipo: 'video',
  },
  {
    titulo: 'Cómo crear tareas efectivas',
    descripcion:
      'Aprende a elegir la metodología, dificultad y tipo de ejercicio adecuados para tus alumnos.',
    duracion: '8 min',
    tipo: 'video',
  },
  {
    titulo: 'La remediación en tiempo real',
    descripcion:
      'Entiende cómo funciona la boucle de remediación y cómo interpretar el recorrido del alumno.',
    duracion: '6 min',
    tipo: 'video',
  },
  {
    titulo: 'Usar la Biblioteca de recursos',
    descripcion: 'Encuentra ejercicios listos, guárdalos en favoritos y adáptalos a tu clase.',
    duracion: '4 min',
    tipo: 'video',
  },
  {
    titulo: 'Integración con Google Classroom',
    descripcion: 'Conecta tu cuenta, importa alumnos, publica tareas y sincroniza calificaciones.',
    duracion: '7 min',
    tipo: 'video',
  },
]

const GUIAS = [
  {
    titulo: 'Guía rápida del profesor',
    descripcion: 'PDF descargable con las funciones principales de Kleo explicadas paso a paso.',
    paginas: 10,
  },
  {
    titulo: 'Interpretar resultados y lacunas',
    descripcion:
      'Cómo leer los reportes de desempeño, áreas de mejora y recorridos de remediación.',
    paginas: 6,
  },
  {
    titulo: 'Mejores prácticas pedagógicas con IA',
    descripcion:
      'Recomendaciones para integrar Kleo de forma efectiva en tu planificación semanal.',
    paginas: 8,
  },
]

export default function Formacion() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar titulo="Formación" volver="/profesor" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Centro de formación</h1>
          <p className="text-sm text-gray-500">
            Videos cortos y guías para aprovechar Kleo al máximo en tu salón de clase.
          </p>
        </div>

        {/* Videos */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Videos tutoriales</h2>
          <div className="space-y-3">
            {MODULOS.map((modulo, i) => (
              <div key={i} className="card p-4 flex items-center gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-amarillo/20 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{modulo.titulo}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{modulo.descripcion}</p>
                </div>
                <div className="flex-shrink-0 text-xs text-gray-400 font-medium">
                  {modulo.duracion}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3 italic">
            Los videos estarán disponibles próximamente. Se te notificará por correo cuando estén
            listos.
          </p>
        </div>

        {/* Guides */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Guías descargables</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {GUIAS.map((guia, i) => (
              <div key={i} className="card p-5">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{guia.titulo}</p>
                    <p className="text-xs text-gray-500 mt-1">{guia.descripcion}</p>
                    <p className="text-xs text-gray-400 mt-2">{guia.paginas} páginas · PDF</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3 italic">
            Las guías se están finalizando y estarán disponibles para descarga próximamente.
          </p>
        </div>

        {/* Support */}
        <div className="card p-6 bg-gray-900 text-white">
          <h2 className="text-lg font-semibold mb-2">¿Necesitas ayuda?</h2>
          <p className="text-sm text-gray-300 mb-4">
            Nuestro equipo de soporte está disponible para resolver cualquier duda sobre el uso de
            Kleo.
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <div>
              <p className="text-gray-400 text-xs mb-1">Correo</p>
              <p className="font-medium">soporte@kleo.education</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">WhatsApp</p>
              <p className="font-medium">+52 55 1234 5678</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">Horario</p>
              <p className="font-medium">Lun-Vie 8:00-18:00 (CDMX)</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
