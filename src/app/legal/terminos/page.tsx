import Link from 'next/link'

export default function TerminosUso() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="px-6 py-5 flex items-center border-b border-gray-100">
        <Link href="/" className="text-2xl font-bold text-gray-900 hover:opacity-80 transition-opacity">Kleo</Link>
        <span className="ml-2 text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Legal</span>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Términos de Uso</h1>
        <p className="text-sm text-gray-400 mb-8">Última actualización: abril 2026</p>

        <div className="prose prose-gray prose-sm max-w-none space-y-6 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">1. Aceptación de los términos</h2>
            <p>
              Al registrarse y utilizar Kleo (en adelante "la Plataforma"), usted acepta estos Términos
              de Uso en su totalidad. Si no está de acuerdo con alguna disposición, no utilice la
              Plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">2. Descripción del servicio</h2>
            <p>
              Kleo es una plataforma educativa que permite a profesores de educación secundaria en
              México generar tareas con inteligencia artificial, asignarlas a sus alumnos y recibir
              corrección automática con retroalimentación. El servicio incluye:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Generación automática de preguntas alineadas al programa NEM.</li>
              <li>Corrección y retroalimentación instantánea mediante IA.</li>
              <li>Gestión de clases y seguimiento del progreso de alumnos.</li>
              <li>Exportación de calificaciones.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">3. Cuentas de usuario</h2>
            <p><strong>Profesores:</strong> deben registrarse con un correo electrónico válido y una contraseña. Son responsables de mantener la confidencialidad de sus credenciales.</p>
            <p className="mt-2"><strong>Alumnos:</strong> acceden mediante un código alfanumérico proporcionado por su profesor. No requieren crear una cuenta propia.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">4. Responsabilidades del profesor</h2>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Proporcionar datos verídicos al registrarse.</li>
              <li>Gestionar la información de sus alumnos de forma responsable.</li>
              <li>Contar con las autorizaciones necesarias de padres o tutores para incluir datos de alumnos menores de edad.</li>
              <li>Revisar el contenido generado por la IA antes de publicarlo, ya que las respuestas automáticas son orientativas.</li>
              <li>No compartir los códigos de acceso de alumnos con personas no autorizadas.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">5. Limitaciones de la inteligencia artificial</h2>
            <p>
              El contenido generado por inteligencia artificial es una herramienta de apoyo educativo.
              La Plataforma no garantiza la exactitud al 100% de las preguntas generadas ni de las
              calificaciones asignadas. El profesor tiene la facultad y responsabilidad de:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Revisar y editar las preguntas antes de publicarlas.</li>
              <li>Modificar manualmente las calificaciones asignadas por la IA.</li>
              <li>Utilizar su criterio profesional como complemento a la evaluación automática.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">6. Uso aceptable</h2>
            <p>Queda prohibido:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Utilizar la Plataforma para fines distintos a los educativos.</li>
              <li>Intentar acceder a datos de otros usuarios sin autorización.</li>
              <li>Realizar ingeniería inversa o interferir con el funcionamiento del servicio.</li>
              <li>Generar contenido ofensivo, discriminatorio o inapropiado para menores.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">7. Propiedad intelectual</h2>
            <p>
              Las tareas generadas por la IA a través de la Plataforma son para uso exclusivo del
              profesor y su grupo. El profesor retiene los derechos sobre el contenido que cree o
              modifique. La Plataforma retiene los derechos sobre su código, diseño e interfaz.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">8. Disponibilidad del servicio</h2>
            <p>
              La Plataforma se proporciona "tal cual" sin garantía de disponibilidad ininterrumpida.
              Nos reservamos el derecho de modificar, suspender o descontinuar el servicio con previo
              aviso cuando sea posible.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">9. Limitación de responsabilidad</h2>
            <p>
              Kleo no será responsable por decisiones académicas tomadas exclusivamente con base en
              las calificaciones o retroalimentación generadas por la IA. La evaluación final es
              responsabilidad del profesor.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">10. Modificaciones</h2>
            <p>
              Nos reservamos el derecho de modificar estos términos. Los cambios serán notificados a
              través de la Plataforma. El uso continuado después de las modificaciones constituye la
              aceptación de los nuevos términos.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">11. Legislación aplicable</h2>
            <p>
              Estos términos se rigen por las leyes de los Estados Unidos Mexicanos. Cualquier
              controversia será resuelta ante los tribunales competentes de la Ciudad de México.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-200">
          <Link href="/" className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">
            ← Volver al inicio
          </Link>
        </div>
      </main>
    </div>
  )
}
