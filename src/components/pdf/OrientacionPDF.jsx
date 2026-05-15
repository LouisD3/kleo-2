'use client'

import { Document, Page, Text, View } from '@react-pdf/renderer'
import { basePDF, kleo } from './KleoPDFStyles.jsx'

function BulletList({ items }) {
  return (
    <View>
      {items.map((item, i) => (
        <View key={i} style={basePDF.bulletItem}>
          <View style={basePDF.bulletDot} />
          <Text style={basePDF.bulletText}>{item}</Text>
        </View>
      ))}
    </View>
  )
}

function RefTags({ diapositiva, libro, video }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: 6 }}>
      {diapositiva && (
        <View style={basePDF.refTag}>
          <Text style={basePDF.refTagText}>Diapositiva {diapositiva}</Text>
        </View>
      )}
      {libro && (
        <View style={basePDF.refTag}>
          <Text style={basePDF.refTagText}>Libro: {libro}</Text>
        </View>
      )}
      {video && (
        <View style={basePDF.refTag}>
          <Text style={basePDF.refTagText}>Video: {video}</Text>
        </View>
      )}
    </View>
  )
}

function SectionDivider({ label }) {
  return (
    <View style={basePDF.sectionDivider}>
      <Text style={basePDF.sectionDividerText}>{label}</Text>
    </View>
  )
}

function NumberedBlock({ numero, titulo, children }) {
  return (
    <View style={basePDF.numberedBlock} wrap={false}>
      <View style={basePDF.numberBadge}>
        <Text style={basePDF.numberBadgeText}>{numero}</Text>
      </View>
      <View style={basePDF.numberedContent}>
        <Text style={basePDF.numberedTitle}>{titulo}</Text>
        {children}
      </View>
    </View>
  )
}

export default function OrientacionPDF({ semana, orientacion }) {
  const {
    contenidos_especificos,
    actividad_inicio,
    desarrollo,
    cierre_individual,
    cierre_grupal,
    preguntas_comprension,
  } = orientacion

  return (
    <Document>
      <Page size="A4" style={basePDF.page}>
        {/* === HEADER BAND === */}
        <View style={basePDF.headerBand} fixed>
          <Text style={basePDF.headerLogo}>Kleo</Text>
          <Text style={basePDF.headerTitle}>{semana.titulo}</Text>
          <Text style={basePDF.headerSubtitle}>
            Orientacion didactica · Semana {semana.secuencia}
          </Text>
        </View>

        {/* === META STRIP === */}
        <View style={basePDF.metaStrip}>
          <Text style={basePDF.metaItem}>
            <Text style={basePDF.metaLabel}>Materia: </Text>Matematicas
          </Text>
          <Text style={basePDF.metaItem}>
            <Text style={basePDF.metaLabel}>Grado: </Text>1° Secundaria
          </Text>
          <Text style={basePDF.metaItem}>
            <Text style={basePDF.metaLabel}>Duracion: </Text>45 min
          </Text>
        </View>

        <View style={basePDF.content}>
          {/* PDA */}
          <View style={basePDF.card}>
            <Text style={{ fontSize: kleo.fontXs, fontWeight: 700, color: kleo.gray500, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 4 }}>
              Proceso de desarrollo de aprendizaje
            </Text>
            <Text style={basePDF.bodyText}>{semana.pda}</Text>
          </View>

          {/* Contenidos especificos */}
          {contenidos_especificos && contenidos_especificos.length > 0 && (
            <View style={{ marginBottom: 8 }}>
              <Text style={{ fontSize: kleo.fontSm, fontWeight: 700, color: kleo.gray700, marginBottom: 4 }}>
                Contenidos especificos:
              </Text>
              <BulletList items={contenidos_especificos} />
            </View>
          )}

          {/* === INTRODUCCION === */}
          <SectionDivider label="INTRODUCCION" />

          <NumberedBlock numero={1} titulo="Actividad de inicio">
            <BulletList items={actividad_inicio} />
          </NumberedBlock>

          <NumberedBlock numero={2} titulo="Recursos de la semana">
            <RefTags diapositiva="1-8" libro="Contenido completo" video="Video leccion" />
            <Text style={{ fontSize: kleo.fontSm, color: kleo.gray500, lineHeight: 1.4 }}>
              Revisa los materiales antes de la sesion para familiarizarte con los ejemplos y ejercicios propuestos.
            </Text>
          </NumberedBlock>

          {/* === DESARROLLO === */}
          <SectionDivider label="DESARROLLO" />

          {desarrollo.map((paso, i) => (
            <NumberedBlock key={i} numero={i + 1} titulo={paso.titulo}>
              <RefTags diapositiva={paso.diapositiva} libro={paso.libro} video={paso.video} />
              <Text style={basePDF.bodyText}>{paso.descripcion}</Text>
              {paso.tip && (
                <View style={basePDF.highlightBox}>
                  <Text style={basePDF.highlightLabel}>Tip pedagogico</Text>
                  <Text style={basePDF.highlightText}>{paso.tip}</Text>
                </View>
              )}
            </NumberedBlock>
          ))}

          {/* === CIERRE === */}
          <SectionDivider label="CIERRE" />

          {/* Cierre individual */}
          <NumberedBlock numero={1} titulo="Cierre individual">
            {cierre_individual.reflexiona && (
              <View style={{ marginBottom: 8 }}>
                <Text style={{ fontSize: kleo.fontSm, fontWeight: 600, color: kleo.gray700, marginBottom: 3 }}>
                  Reflexiona:
                </Text>
                <Text style={{ ...basePDF.bodyText, fontStyle: 'italic' }}>{cierre_individual.reflexiona}</Text>
              </View>
            )}

            {cierre_individual.profundiza?.map((p, i) => (
              <View key={i} style={{ marginBottom: 10 }}>
                <Text style={{ fontSize: kleo.fontBase, fontWeight: 600, color: kleo.gray900, marginBottom: 4 }}>
                  {i + 1}. {p.pregunta}
                </Text>
                <View style={basePDF.roseBox}>
                  <Text style={basePDF.roseLabel}>R.M.</Text>
                  <Text style={basePDF.roseText}>{p.respuesta_modelo}</Text>
                </View>
              </View>
            ))}
          </NumberedBlock>

          {/* Cierre grupal */}
          <NumberedBlock numero={2} titulo="Cierre grupal">
            <Text style={{ fontSize: kleo.fontSm, fontWeight: 600, color: kleo.gray500, marginBottom: 6 }}>
              Al finalizar, tus estudiantes deben haber comprendido:
            </Text>
            <BulletList items={cierre_grupal} />
          </NumberedBlock>

          {/* Preguntas de comprension */}
          {preguntas_comprension && preguntas_comprension.length > 0 && (
            <View style={basePDF.card}>
              <Text style={{ fontSize: kleo.fontSm, fontWeight: 700, color: kleo.gray700, marginBottom: 8 }}>
                Preguntas para evaluar la comprension:
              </Text>
              {preguntas_comprension.map((q, i) => (
                <View key={i} style={{ flexDirection: 'row', marginBottom: 5 }}>
                  <Text style={{ fontSize: kleo.fontBase, fontWeight: 700, color: kleo.gray900, marginRight: 6, width: 14 }}>
                    {i + 1}.
                  </Text>
                  <Text style={{ fontSize: kleo.fontBase, color: kleo.gray700, flex: 1, lineHeight: 1.5 }}>
                    {q}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* === FOOTER === */}
        <View style={basePDF.footer} fixed>
          <Text style={basePDF.footerLeft}>
            Planeacion lectiva Kleo · {semana.titulo} · Semana {semana.secuencia}
          </Text>
          <Text
            style={basePDF.footerRight}
            render={({ pageNumber, totalPages }) => `pag ${pageNumber}/${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  )
}
