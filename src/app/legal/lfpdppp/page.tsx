import Link from 'next/link'

export default function AvisoLFPDPPP() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="px-6 py-5 flex items-center border-b border-gray-100">
        <Link
          href="/"
          className="text-2xl font-bold text-gray-900 hover:opacity-80 transition-opacity"
        >
          Kleo
        </Link>
        <span className="ml-2 text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
          Legal
        </span>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Aviso de Privacidad Integral</h1>
        <p className="text-sm text-gray-400 mb-2">
          Conforme a la Ley Federal de Protección de Datos Personales en Posesión de los
          Particulares (LFPDPPP)
        </p>
        <p className="text-sm text-gray-400 mb-8">Última actualización: mayo 2026</p>

        <div className="prose prose-gray prose-sm max-w-none space-y-6 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">
              I. Identidad y domicilio del responsable
            </h2>
            <p>
              Kleo Educación, S.A.P.I. de C.V. (en adelante &ldquo;Kleo&rdquo;), con domicilio en
              Ciudad de México, México, es el responsable del tratamiento de sus datos personales,
              en términos de lo dispuesto por la Ley Federal de Protección de Datos Personales en
              Posesión de los Particulares (LFPDPPP) y su Reglamento.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">
              II. Datos personales que recabamos
            </h2>
            <p>
              Para las finalidades descritas en el presente aviso, recabamos las siguientes
              categorías de datos personales:
            </p>
            <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">
              A. Profesores (Usuarios docentes)
            </h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Nombre completo</li>
              <li>Correo electrónico institucional</li>
              <li>Nombre de la escuela o institución</li>
              <li>Contraseña (almacenada de forma cifrada, nunca en texto plano)</li>
              <li>Datos de conexión con Google Classroom (tokens de acceso cifrados)</li>
            </ul>
            <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">
              B. Alumnos (Menores de edad)
            </h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Nombre proporcionado por el profesor (puede ser nombre de pila únicamente)</li>
              <li>Código de acceso alfanumérico (no constituye dato personal per se)</li>
              <li>Respuestas a ejercicios y calificaciones obtenidas</li>
              <li>Datos de remediación pedagógica (diagnósticos de aprendizaje)</li>
            </ul>
            <p className="mt-3 font-medium text-gray-800">
              No recabamos datos personales sensibles. No recabamos datos biométricos,
              patrimoniales, de salud ni ideológicos.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">
              III. Finalidades del tratamiento
            </h2>
            <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">
              Finalidades primarias (necesarias)
            </h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Creación y gestión de cuentas de profesor</li>
              <li>Generación de tareas escolares mediante inteligencia artificial</li>
              <li>Calificación automática de respuestas de alumnos</li>
              <li>Generación de reportes de desempeño académico por clase y por alumno</li>
              <li>Remediación pedagógica personalizada en tiempo real</li>
              <li>
                Integración con Google Classroom para sincronización de clases y calificaciones
              </li>
              <li>Soporte técnico y comunicaciones relacionadas con el servicio</li>
            </ul>
            <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">
              Finalidades secundarias (opcionales)
            </h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                Análisis estadísticos agregados para mejora del servicio (sin identificación
                individual)
              </li>
              <li>Envío de comunicaciones sobre nuevas funcionalidades o actualizaciones</li>
            </ul>
            <p className="mt-3">
              Si usted no desea que sus datos sean tratados para finalidades secundarias, puede
              ejercer su derecho de oposición mediante los mecanismos descritos en la sección VII.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">
              IV. Transferencias de datos
            </h2>
            <p>Sus datos personales pueden ser transferidos a:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>
                <strong>Supabase Inc.</strong> (infraestructura de base de datos) — servidores en
                Estados Unidos, con cláusulas contractuales de protección de datos.
              </li>
              <li>
                <strong>Anthropic, PBC</strong> (procesamiento de IA) — las respuestas de alumnos
                son procesadas para calificación y remediación. No se almacenan datos personales
                identificables en los modelos de IA.
              </li>
              <li>
                <strong>Google LLC</strong> (únicamente si el profesor activa la integración con
                Google Classroom) — se comparten nombres de alumnos y calificaciones con el servicio
                de Google Classroom del profesor.
              </li>
            </ul>
            <p className="mt-3">
              Estas transferencias se realizan conforme al artículo 37 de la LFPDPPP, siendo
              necesarias para la prestación del servicio contratado.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">
              V. Protección de datos de menores
            </h2>
            <p>
              Kleo trata datos de menores de edad exclusivamente en el contexto educativo y bajo la
              responsabilidad del profesor y la institución educativa contratante. Conforme al
              artículo 4 del Reglamento de la LFPDPPP:
            </p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>
                El consentimiento para el tratamiento de datos de menores es otorgado por la
                institución educativa que contrata el servicio.
              </li>
              <li>
                Los datos de alumnos se limitan al mínimo necesario para la prestación del servicio
                educativo.
              </li>
              <li>
                No se crean perfiles de marketing ni se comparten datos de menores con terceros para
                fines comerciales.
              </li>
              <li>
                Los alumnos no crean cuentas con correo electrónico — acceden mediante un código
                temporal proporcionado por su profesor.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">VI. Medidas de seguridad</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Cifrado de datos en tránsito (TLS 1.3) y en reposo (AES-256)</li>
              <li>Autenticación segura con hash de contraseñas (bcrypt)</li>
              <li>Control de acceso basado en roles (Row Level Security en base de datos)</li>
              <li>
                Tokens de Google Classroom cifrados y almacenados con clave de servicio separada
              </li>
              <li>Respaldos automáticos diarios con retención de 30 días</li>
              <li>Monitoreo de accesos y auditoría de operaciones sensibles</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">VII. Derechos ARCO</h2>
            <p>
              Usted tiene derecho a Acceder, Rectificar, Cancelar u Oponerse al tratamiento de sus
              datos personales (derechos ARCO), así como a revocar su consentimiento, conforme a los
              artículos 28 a 35 de la LFPDPPP.
            </p>
            <p className="mt-2">
              Para ejercer estos derechos, envíe su solicitud a:{' '}
              <strong>privacidad@kleo.education</strong>
            </p>
            <p className="mt-2">Su solicitud deberá contener:</p>
            <ul className="list-disc pl-6 space-y-1 mt-1">
              <li>Nombre completo del titular</li>
              <li>Correo electrónico asociado a la cuenta</li>
              <li>Descripción clara del derecho que desea ejercer</li>
              <li>Documentos que acrediten su identidad (copia de INE o pasaporte)</li>
            </ul>
            <p className="mt-2">
              Daremos respuesta a su solicitud en un plazo máximo de 20 días hábiles, conforme a la
              ley.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">
              VIII. Uso de cookies y tecnologías de rastreo
            </h2>
            <p>
              Kleo utiliza cookies estrictamente necesarias para el funcionamiento de la sesión de
              usuario. Utilizamos PostHog para análisis de uso con datos anonimizados. No utilizamos
              cookies de publicidad ni de terceros con fines de marketing.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">
              IX. Modificaciones al aviso de privacidad
            </h2>
            <p>
              Cualquier modificación a este aviso será comunicada a través de la plataforma y/o por
              correo electrónico. La versión vigente estará siempre disponible en{' '}
              <Link href="/legal/lfpdppp" className="text-blue-600 underline">
                kleo.education/legal/lfpdppp
              </Link>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">X. Autoridad competente</h2>
            <p>
              Si considera que su derecho de protección de datos ha sido lesionado, puede acudir al
              Instituto Nacional de Transparencia, Acceso a la Información y Protección de Datos
              Personales (INAI): <span className="font-medium">www.inai.org.mx</span>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">XI. Contacto</h2>
            <p>
              Departamento de Protección de Datos Personales
              <br />
              Correo: <strong>privacidad@kleo.education</strong>
              <br />
              Sitio web: kleo.education
            </p>
          </section>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-200 flex gap-4 text-sm text-gray-400">
          <Link href="/legal/privacidad" className="hover:text-gray-600">
            Aviso de Privacidad (simplificado)
          </Link>
          <Link href="/legal/terminos" className="hover:text-gray-600">
            Términos de Uso
          </Link>
        </div>
      </main>
    </div>
  )
}
