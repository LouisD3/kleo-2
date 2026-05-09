'use client'

import { Document, Page, Text, View } from '@react-pdf/renderer'
import { basePDF, kleo } from './KleoPDFStyles.jsx'

function BulletList({ items, color = kleo.amarillo }) {
  return (
    <View>
      {items.map((item, i) => (
        <View key={i} style={{ flexDirection: 'row', marginBottom: 4, paddingRight: 12 }}>
          <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: color, marginRight: 8, marginTop: 5 }} />
          <Text style={{ flex: 1, fontSize: kleo.fontBase, color: kleo.gray700, lineHeight: 1.6 }}>{item}</Text>
        </View>
      ))}
    </View>
  )
}

function SectionBadge({ label, color = kleo.amarillo }) {
  return (
    <View style={{ backgroundColor: color, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4, alignSelf: 'flex-start', marginBottom: 10, marginTop: 16 }}>
      <Text style={{ fontSize: kleo.fontXs, fontWeight: 700, color: kleo.gray900, letterSpacing: 1, textTransform: 'uppercase' }}>{label}</Text>
    </View>
  )
}

function DefinitionBox({ titulo, contenido, definicion }) {
  return (
    <View style={{ marginBottom: 12 }} wrap={false}>
      {titulo && <Text style={{ fontSize: kleo.fontMd, fontWeight: 700, color: kleo.gray900, marginBottom: 4 }}>{titulo}</Text>}
      <Text style={{ fontSize: kleo.fontBase, color: kleo.gray700, lineHeight: 1.6, marginBottom: definicion ? 6 : 0 }}>{contenido}</Text>
      {definicion && (
        <View style={{ backgroundColor: kleo.amarilloLight, borderLeftWidth: 3, borderLeftColor: kleo.amarillo, borderRadius: 4, padding: 10, marginTop: 4 }}>
          <Text style={{ fontSize: kleo.fontXs, fontWeight: 700, color: kleo.amarilloDark, letterSpacing: 0.5, marginBottom: 3 }}>DEFINICION</Text>
          <Text style={{ fontSize: kleo.fontBase, color: kleo.gray900, lineHeight: 1.5, fontWeight: 600 }}>{definicion}</Text>
        </View>
      )}
    </View>
  )
}

function EjemploBox({ titulo, enunciado, pasos, resultado, index }) {
  return (
    <View style={{ backgroundColor: kleo.blueLight, borderRadius: 6, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#DBEAFE' }} wrap={false}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
        <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: kleo.blue, alignItems: 'center', justifyContent: 'center', marginRight: 8 }}>
          <Text style={{ fontSize: kleo.fontXs, fontWeight: 700, color: kleo.white, textAlign: 'center', lineHeight: 20 }}>{index + 1}</Text>
        </View>
        <Text style={{ fontSize: kleo.fontBase, fontWeight: 700, color: kleo.blue }}>{titulo || `Ejemplo ${index + 1}`}</Text>
      </View>
      {enunciado && <Text style={{ fontSize: kleo.fontBase, color: kleo.gray700, lineHeight: 1.5, marginBottom: 6 }}>{enunciado}</Text>}
      {pasos?.length > 0 && (
        <View style={{ marginBottom: 6 }}>
          {pasos.map((paso, i) => (
            <View key={i} style={{ flexDirection: 'row', marginBottom: 3 }}>
              <Text style={{ fontSize: kleo.fontSm, fontWeight: 700, color: kleo.blue, width: 20 }}>{i + 1}.</Text>
              <Text style={{ flex: 1, fontSize: kleo.fontBase, color: kleo.gray700, lineHeight: 1.5 }}>{paso}</Text>
            </View>
          ))}
        </View>
      )}
      {resultado && (
        <View style={{ backgroundColor: kleo.white, borderRadius: 4, padding: 8, borderWidth: 1, borderColor: '#DBEAFE' }}>
          <Text style={{ fontSize: kleo.fontXs, fontWeight: 700, color: kleo.blue, marginBottom: 2 }}>RESULTADO</Text>
          <Text style={{ fontSize: kleo.fontBase, fontWeight: 600, color: kleo.gray900 }}>{resultado}</Text>
        </View>
      )}
    </View>
  )
}

function EjercicioItem({ ejercicio }) {
  return (
    <View style={{ marginBottom: 14 }} wrap={false}>
      <View style={{ flexDirection: 'row', marginBottom: 4 }}>
        <Text style={{ fontSize: kleo.fontBase, fontWeight: 700, color: kleo.gray900, marginRight: 4 }}>{ejercicio.numero}.</Text>
        <Text style={{ flex: 1, fontSize: kleo.fontBase, color: kleo.gray700, lineHeight: 1.5 }}>{ejercicio.enunciado}</Text>
      </View>
      {ejercicio.espacio && (
        <View style={{ marginTop: 4, marginLeft: 16 }}>
          {Array.from({ length: ejercicio.lineas || 3 }).map((_, i) => (
            <View key={i} style={{ borderBottomWidth: 0.5, borderBottomColor: kleo.gray200, height: 22 }} />
          ))}
        </View>
      )}
    </View>
  )
}

function ChapterPage({ semana, libro }) {
  const { introduccion, conceptos, ejemplos, datos_curiosos, ejercicios, puntos_clave } = libro

  return (
    <>
      {/* Chapter header */}
      <View style={{ backgroundColor: kleo.gray900, marginHorizontal: -44, marginTop: -20, paddingHorizontal: 44, paddingTop: 40, paddingBottom: 28, marginBottom: 20 }}>
        <Text style={{ fontSize: 11, fontWeight: 600, color: kleo.amarillo, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>
          SEMANA {semana.secuencia}
        </Text>
        <Text style={{ fontSize: 22, fontWeight: 700, color: kleo.white, marginBottom: 6 }}>{semana.titulo}</Text>
        <Text style={{ fontSize: kleo.fontBase, color: kleo.gray400, lineHeight: 1.4 }}>{semana.pda}</Text>
      </View>

      {/* Introduccion */}
      {introduccion && (
        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: kleo.fontMd, color: kleo.gray700, lineHeight: 1.7, fontStyle: 'italic' }}>{introduccion}</Text>
        </View>
      )}

      {/* Conceptos */}
      {conceptos?.length > 0 && (
        <View>
          <SectionBadge label="Conceptos" />
          {conceptos.map((c, i) => (
            <DefinitionBox key={i} titulo={c.titulo} contenido={c.contenido} definicion={c.definicion} />
          ))}
        </View>
      )}

      {/* Ejemplos */}
      {ejemplos?.length > 0 && (
        <View>
          <SectionBadge label="Ejemplos resueltos" color="#DBEAFE" />
          {ejemplos.map((ej, i) => (
            <EjemploBox key={i} index={i} titulo={ej.titulo} enunciado={ej.enunciado} pasos={ej.pasos} resultado={ej.resultado} />
          ))}
        </View>
      )}

      {/* Datos curiosos */}
      {datos_curiosos && (
        <View style={{ backgroundColor: kleo.tealLight, borderRadius: 6, padding: 12, marginTop: 12, marginBottom: 12, borderWidth: 1, borderColor: '#99F6E4' }} wrap={false}>
          <Text style={{ fontSize: kleo.fontXs, fontWeight: 700, color: kleo.teal, letterSpacing: 0.5, marginBottom: 4 }}>DATO CURIOSO</Text>
          <Text style={{ fontSize: kleo.fontBase, color: kleo.tealDark, lineHeight: 1.5 }}>{datos_curiosos}</Text>
        </View>
      )}

      {/* Ejercicios */}
      {ejercicios?.length > 0 && (
        <View>
          <SectionBadge label="Practica" color={kleo.gray200} />
          <Text style={{ fontSize: kleo.fontSm, color: kleo.gray500, marginBottom: 8 }}>Resuelve los siguientes ejercicios en el espacio proporcionado.</Text>
          {ejercicios.map((ej, i) => (
            <EjercicioItem key={i} ejercicio={ej} />
          ))}
        </View>
      )}

      {/* Puntos clave */}
      {puntos_clave?.length > 0 && (
        <View style={{ backgroundColor: kleo.amarilloLight, borderRadius: 6, padding: 12, marginTop: 14, borderWidth: 1, borderColor: '#FDE68A' }} wrap={false}>
          <Text style={{ fontSize: kleo.fontXs, fontWeight: 700, color: kleo.amarilloDark, letterSpacing: 0.5, marginBottom: 6 }}>PUNTOS CLAVE</Text>
          <BulletList items={puntos_clave} color={kleo.amarilloDark} />
        </View>
      )}
    </>
  )
}

export function LibroChapterPDF({ semana, libro }) {
  return (
    <Document>
      <Page size="A4" style={{ ...basePDF.page, paddingHorizontal: 44, paddingTop: 20 }} wrap>
        <ChapterPage semana={semana} libro={libro} />
        <View style={basePDF.footer} fixed>
          <Text style={basePDF.footerLeft}>Semana {semana.secuencia} · {semana.titulo}</Text>
          <Text style={basePDF.footerRight} render={({ pageNumber, totalPages }) => `pag ${pageNumber}/${totalPages}`} />
        </View>
      </Page>
    </Document>
  )
}

export default function LibroPDF({ semanas }) {
  return (
    <Document>
      {/* Cover page */}
      <Page size="A4" style={{ fontFamily: 'Inter', paddingBottom: 0 }}>
        <View style={{ backgroundColor: kleo.gray900, flex: 1, paddingHorizontal: 60, justifyContent: 'center' }}>
          <Text style={{ fontSize: 36, fontWeight: 700, color: kleo.amarillo, marginBottom: 8 }}>Kleo</Text>
          <Text style={{ fontSize: 28, fontWeight: 700, color: kleo.white, marginBottom: 12 }}>Matematicas</Text>
          <Text style={{ fontSize: 16, color: kleo.gray400, marginBottom: 4 }}>1° Secundaria</Text>
          <Text style={{ fontSize: 12, color: kleo.gray500, marginTop: 20 }}>Libro del alumno · 36 semanas</Text>
          <Text style={{ fontSize: 10, color: kleo.gray500, marginTop: 4 }}>Programa NEM</Text>
        </View>
      </Page>

      {/* Table of contents */}
      <Page size="A4" style={{ ...basePDF.page, paddingHorizontal: 44, paddingTop: 50 }}>
        <Text style={{ fontSize: 18, fontWeight: 700, color: kleo.gray900, marginBottom: 20 }}>Contenido</Text>
        {semanas.map((s) => (
          <View key={s.secuencia} style={{ flexDirection: 'row', alignItems: 'baseline', paddingVertical: 4, borderBottomWidth: 0.5, borderBottomColor: kleo.gray100 }}>
            <Text style={{ fontSize: kleo.fontSm, fontWeight: 700, color: kleo.gray400, width: 28 }}>{s.secuencia}</Text>
            <Text style={{ flex: 1, fontSize: kleo.fontBase, color: kleo.gray900 }}>{s.titulo}</Text>
          </View>
        ))}
        <View style={basePDF.footer} fixed>
          <Text style={basePDF.footerLeft}>Kleo · Matematicas · 1° Secundaria</Text>
          <Text style={basePDF.footerRight} render={({ pageNumber }) => `pag ${pageNumber}`} />
        </View>
      </Page>

      {/* Chapter pages */}
      {semanas.map((s) => (
        <Page key={s.secuencia} size="A4" style={{ ...basePDF.page, paddingHorizontal: 44, paddingTop: 20 }} wrap>
          <ChapterPage semana={s} libro={s.libro} />
          <View style={basePDF.footer} fixed>
            <Text style={basePDF.footerLeft}>Semana {s.secuencia} · {s.titulo}</Text>
            <Text style={basePDF.footerRight} render={({ pageNumber }) => `pag ${pageNumber}`} />
          </View>
        </Page>
      ))}
    </Document>
  )
}
