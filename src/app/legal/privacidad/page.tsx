import Link from 'next/link'

export default function AvisoPrivacidad() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="px-6 py-5 flex items-center border-b border-gray-100">
        <Link href="/" className="text-2xl font-bold text-gray-900 hover:opacity-80 transition-opacity">Kleo</Link>
        <span className="ml-2 text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Legal</span>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Aviso de Privacidad</h1>
        <p className="text-sm text-gray-400 mb-8">Última actualización: abril 2026</p>

        <div className="prose prose-gray prose-sm max-w-none space-y-6 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">1. Responsable del tratamiento</h2>
            <p>
              Kleo (en adelante "la Plataforma") es una plataforma educativa con inteligencia artificial
              destinada a profesores y alumnos de educación secundaria en México. El responsable del
              tratamiento de los datos personales es el titular de la Plataforma, con domicilio en México.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">2. Datos personales que recabamos</h2>
            <p>Recabamos las siguientes categorías de datos personales:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Profesores:</strong> nombre completo, correo electrónico, nombre de escuela (opcional), datos de autenticación.</li>
              <li><strong>Alumnos:</strong> nombre completo (proporcionado por el profesor), código de acceso generado automáticamente.</li>
              <li><strong>Datos académicos:</strong> tareas generadas, respuestas de alumnos, calificaciones y retroalimentación producida por inteligencia artificial.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">3. Finalidades del tratamiento</h2>
            <p>Los datos personales serán utilizados para:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Crear y gestionar cuentas de profesor y perfiles de alumno.</li>
              <li>Generar tareas educativas mediante inteligencia artificial.</li>
              <li>Evaluar automáticamente respuestas de alumnos y proporcionar retroalimentación.</li>
              <li>Mostrar estadísticas y promedios al profesor para el seguimiento académico del grupo.</li>
              <li>Mejorar la calidad del servicio educativo ofrecido.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">4. Uso de inteligencia artificial</h2>
            <p>
              La Plataforma utiliza modelos de inteligencia artificial (Anthropic Claude) para generar
              preguntas y evaluar respuestas. Los datos enviados al modelo incluyen el contenido de la
              tarea y las respuestas del alumno, pero <strong>no incluyen datos personales identificables</strong> como
              nombres o correos electrónicos. Las respuestas generadas por la IA son orientativas y el
              profesor tiene la posibilidad de modificar las calificaciones manualmente.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">5. Protección de datos de menores</h2>
            <p>
              Los alumnos de educación secundaria pueden ser menores de edad. En cumplimiento con la
              Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP)
              y la Ley General de los Derechos de Niñas, Niños y Adolescentes:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Los datos de alumnos son proporcionados exclusivamente por el profesor, quien actúa como responsable dentro de su institución educativa.</li>
              <li>No solicitamos directamente datos personales a menores de edad.</li>
              <li>Los alumnos acceden mediante un código alfanumérico, sin necesidad de proporcionar correo electrónico ni contraseña.</li>
              <li>El profesor es responsable de contar con las autorizaciones necesarias de padres o tutores dentro de su institución educativa.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">6. Transferencia de datos</h2>
            <p>
              Los datos se almacenan en servidores de Supabase (infraestructura en la nube). Las
              solicitudes de generación y corrección de tareas se procesan a través de la API de
              Anthropic. Ambos proveedores cumplen con estándares internacionales de protección de datos.
              No vendemos ni compartimos datos personales con terceros para fines comerciales.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">7. Derechos ARCO</h2>
            <p>
              De conformidad con la LFPDPPP, usted tiene derecho a Acceder, Rectificar, Cancelar u
              Oponerse al tratamiento de sus datos personales (derechos ARCO). Para ejercer estos
              derechos, contacte al responsable a través del correo electrónico proporcionado en la
              Plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">8. Conservación de datos</h2>
            <p>
              Los datos personales se conservarán durante el tiempo que la cuenta esté activa. El
              profesor puede eliminar alumnos y sus resultados en cualquier momento. Al eliminar una
              cuenta de profesor, se eliminarán todos los datos asociados (clases, alumnos, tareas y
              resultados).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">9. Modificaciones al aviso</h2>
            <p>
              Nos reservamos el derecho de modificar este aviso de privacidad. Cualquier cambio será
              notificado a través de la Plataforma. El uso continuado después de las modificaciones
              constituye la aceptación de los cambios.
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
