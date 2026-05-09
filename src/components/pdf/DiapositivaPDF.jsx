'use client'

import { Document, Page, Text, View } from '@react-pdf/renderer'
import { basePDF, kleo } from './KleoPDFStyles.jsx'

function SlideContent({ slide, index, total }) {
  return (
    <>
      {/* Slide number */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: kleo.amarillo, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 12, fontWeight: 700, color: kleo.gray900, textAlign: 'center', lineHeight: 28 }}>{index + 1}</Text>
          </View>
          <Text style={{ fontSize: kleo.fontSm, color: kleo.gray400 }}>de {total}</Text>
        </View>
        <Text style={{ fontSize: kleo.fontXs, color: kleo.gray400 }}>Kleo</Text>
      </View>

      {/* Title */}
      <Text style={{ fontSize: 24, fontWeight: 700, color: kleo.gray900, marginBottom: 24 }}>{slide.titulo}</Text>

      {/* Bullet points */}
      {slide.puntos?.length > 0 && (
        <View style={{ marginBottom: 20 }}>
          {slide.puntos.map((punto, i) => (
            <View key={i} style={{ flexDirection: 'row', marginBottom: 10, paddingRight: 20 }}>
              <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: kleo.amarillo, marginRight: 12, marginTop: 6 }} />
              <Text style={{ flex: 1, fontSize: 13, color: kleo.gray700, lineHeight: 1.6 }}>{punto}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Example box */}
      {slide.ejemplo && (
        <View style={{ backgroundColor: kleo.amarilloLight, borderLeftWidth: 4, borderLeftColor: kleo.amarillo, borderRadius: 6, padding: 16, marginTop: 'auto' }}>
          <Text style={{ fontSize: kleo.fontXs, fontWeight: 700, color: kleo.amarilloDark, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 6 }}>Ejemplo</Text>
          <Text style={{ fontSize: 12, color: kleo.gray900, lineHeight: 1.6 }}>{slide.ejemplo}</Text>
        </View>
      )}
    </>
  )
}

export default function DiapositivaPDF({ semana, slides }) {
  if (!Array.isArray(slides) || slides.length === 0) return null

  return (
    <Document>
      {/* Title slide */}
      <Page size="A4" orientation="landscape" style={{ fontFamily: 'Inter', padding: 0 }}>
        <View style={{ backgroundColor: kleo.gray900, flex: 1, paddingHorizontal: 80, justifyContent: 'center' }}>
          <Text style={{ fontSize: 14, fontWeight: 600, color: kleo.amarillo, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>
            SEMANA {semana.secuencia}
          </Text>
          <Text style={{ fontSize: 32, fontWeight: 700, color: kleo.white, marginBottom: 10 }}>{semana.titulo}</Text>
          <Text style={{ fontSize: 13, color: kleo.gray400, lineHeight: 1.5, maxWidth: '80%' }}>{semana.pda}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 30 }}>
            <Text style={{ fontSize: 20, fontWeight: 700, color: kleo.amarillo }}>Kleo</Text>
            <Text style={{ fontSize: 11, color: kleo.gray500, marginLeft: 12 }}>Matematicas · 1° Secundaria</Text>
          </View>
        </View>
      </Page>

      {/* Content slides */}
      {slides.map((slide, i) => (
        <Page key={i} size="A4" orientation="landscape" style={{ fontFamily: 'Inter', paddingHorizontal: 60, paddingTop: 40, paddingBottom: 50 }}>
          <SlideContent slide={slide} index={i} total={slides.length} />
          <View style={{ position: 'absolute', bottom: 20, left: 60, right: 60, borderTopWidth: 1, borderTopColor: kleo.gray200, paddingTop: 8, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: kleo.fontXs, color: kleo.gray400 }}>Semana {semana.secuencia} · {semana.titulo}</Text>
            <Text style={{ fontSize: kleo.fontXs, color: kleo.gray400 }}>{i + 1} / {slides.length}</Text>
          </View>
        </Page>
      ))}
    </Document>
  )
}
