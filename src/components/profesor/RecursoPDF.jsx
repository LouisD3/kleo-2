'use client'

import { Document, Font, Page, StyleSheet, Text, View } from '@react-pdf/renderer'

Font.register({
  family: 'Inter',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hjQ.ttf',
      fontWeight: 400,
    },
    {
      src: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fAZ9hjQ.ttf',
      fontWeight: 600,
    },
    {
      src: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYAZ9hjQ.ttf',
      fontWeight: 700,
    },
  ],
})

const c = {
  primary: '#111827',
  secondary: '#6B7280',
  accent: '#FFD700',
  border: '#E5E7EB',
  lightBg: '#F9FAFB',
  purple: '#7C3AED',
  purpleBg: '#F5F3FF',
  green: '#15803D',
  greenBg: '#F0FDF4',
  greenBorder: '#BBF7D0',
  blue: '#2563EB',
  blueBg: '#EFF6FF',
  yellowBg: '#FEFCE8',
  yellowBorder: '#FDE68A',
}

const s = StyleSheet.create({
  page: {
    fontFamily: 'Inter',
    fontSize: 10,
    color: c.primary,
    paddingTop: 50,
    paddingBottom: 60,
    paddingHorizontal: 50,
  },
  bar: { backgroundColor: c.accent, height: 4, marginBottom: 20, borderRadius: 2 },
  title: { fontSize: 20, fontWeight: 700, marginBottom: 4 },
  subtitle: { fontSize: 11, color: c.secondary, marginBottom: 20 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 8,
    marginTop: 16,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: c.border,
  },
  card: {
    marginBottom: 8,
    padding: 10,
    backgroundColor: c.lightBg,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: c.border,
  },
  cardTitle: { fontSize: 10, fontWeight: 700, marginBottom: 4 },
  cardMeta: { fontSize: 8, color: c.secondary, marginBottom: 4 },
  body: { fontSize: 10, lineHeight: 1.5, color: c.primary },
  bodySecondary: { fontSize: 10, lineHeight: 1.5, color: c.secondary },
  listItem: { flexDirection: 'row', marginBottom: 3, paddingLeft: 4 },
  bullet: { width: 12, fontSize: 10, color: c.secondary },
  numberedItem: { flexDirection: 'row', marginBottom: 4, paddingLeft: 4 },
  number: { width: 18, fontSize: 10, fontWeight: 600, color: c.secondary },
  tipBox: {
    marginTop: 6,
    padding: 8,
    backgroundColor: c.blueBg,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  tipText: { fontSize: 9, color: c.blue },
  defBox: {
    marginTop: 6,
    padding: 8,
    backgroundColor: c.purpleBg,
    borderRadius: 4,
  },
  defText: { fontSize: 9, color: c.purple },
  resultBox: {
    marginTop: 6,
    padding: 8,
    backgroundColor: c.greenBg,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: c.greenBorder,
  },
  resultText: { fontSize: 9, fontWeight: 600, color: c.green },
  curiosBox: {
    padding: 10,
    backgroundColor: c.yellowBg,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: c.yellowBorder,
  },
  checkItem: { flexDirection: 'row', marginBottom: 3 },
  checkMark: { width: 14, fontSize: 10, fontWeight: 700, color: c.green },
  slideCard: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: c.lightBg,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: c.border,
  },
  slideNumber: { fontSize: 8, fontWeight: 700, color: c.secondary, marginBottom: 4 },
  exampleBox: {
    marginTop: 6,
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: c.border,
  },
  exampleText: { fontSize: 9, color: c.secondary },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 50,
    right: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: c.border,
    paddingTop: 8,
  },
  footerText: { fontSize: 7, color: c.secondary },
  pageNumber: { fontSize: 7, color: c.secondary, fontWeight: 600 },
})

// ── Libro PDF ─────────────────────────────────────────────────────

export function LibroPDF({ libro, secTitulo }) {
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.bar} fixed />
        <Text style={s.title}>{secTitulo}</Text>
        <Text style={s.subtitle}>Libro del alumno</Text>

        <Text style={s.body}>{libro.introduccion}</Text>

        <Text style={s.sectionTitle}>Conceptos</Text>
        {libro.conceptos.map((co, i) => (
          <View key={i} style={s.card} wrap={false}>
            <Text style={s.cardTitle}>{co.titulo}</Text>
            <Text style={s.body}>{co.contenido}</Text>
            {co.definicion && (
              <View style={s.defBox}>
                <Text style={s.defText}>{co.definicion}</Text>
              </View>
            )}
          </View>
        ))}

        <Text style={s.sectionTitle}>Ejemplos</Text>
        {libro.ejemplos.map((ej, i) => (
          <View key={i} style={s.card} wrap={false}>
            <Text style={s.cardTitle}>{ej.titulo}</Text>
            <Text style={s.bodySecondary}>{ej.enunciado}</Text>
            {ej.pasos.map((p, j) => (
              <View key={j} style={s.numberedItem}>
                <Text style={s.number}>{j + 1}.</Text>
                <Text style={[s.body, { flex: 1 }]}>{p}</Text>
              </View>
            ))}
            <View style={s.resultBox}>
              <Text style={s.resultText}>{ej.resultado}</Text>
            </View>
          </View>
        ))}

        <Text style={s.sectionTitle}>Datos curiosos</Text>
        <View style={s.curiosBox}>
          <Text style={s.body}>{libro.datos_curiosos}</Text>
        </View>

        <Text style={s.sectionTitle}>Ejercicios</Text>
        {libro.ejercicios.map((ej) => (
          <View key={ej.numero} style={s.card} wrap={false}>
            <Text style={s.body}>
              <Text style={{ fontWeight: 600 }}>{ej.numero}. </Text>
              {ej.enunciado}
            </Text>
          </View>
        ))}

        <Text style={s.sectionTitle}>Puntos clave</Text>
        {libro.puntos_clave.map((p, i) => (
          <View key={i} style={s.checkItem}>
            <Text style={s.checkMark}>&#10003;</Text>
            <Text style={[s.body, { flex: 1 }]}>{p}</Text>
          </View>
        ))}

        <View style={s.footer} fixed>
          <Text style={s.footerText}>Kleo · {secTitulo} · Libro alumno</Text>
          <Text style={s.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
    </Document>
  )
}

// ── Guia PDF ──────────────────────────────────────────────────────

export function GuiaPDF({ orientacion, secTitulo }) {
  const o = orientacion
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.bar} fixed />
        <Text style={s.title}>{secTitulo}</Text>
        <Text style={s.subtitle}>Guia del profesor</Text>

        <Text style={s.sectionTitle}>Contenidos especificos</Text>
        {o.contenidos_especificos.map((co, i) => (
          <View key={i} style={s.listItem}>
            <Text style={s.bullet}>&#8226;</Text>
            <Text style={[s.body, { flex: 1 }]}>{co}</Text>
          </View>
        ))}

        <Text style={s.sectionTitle}>Actividad de inicio</Text>
        {o.actividad_inicio.map((a, i) => (
          <View key={i} style={s.numberedItem}>
            <Text style={s.number}>{i + 1}.</Text>
            <Text style={[s.body, { flex: 1 }]}>{a}</Text>
          </View>
        ))}

        <Text style={s.sectionTitle}>Desarrollo</Text>
        {o.desarrollo.map((d, i) => (
          <View key={i} style={s.card} wrap={false}>
            <Text style={s.cardTitle}>{d.titulo}</Text>
            {d.diapositiva && (
              <Text style={s.cardMeta}>
                Diapositivas {d.diapositiva}
                {d.libro ? ` · ${d.libro}` : ''}
                {d.video ? ` · ${d.video}` : ''}
              </Text>
            )}
            <Text style={s.body}>{d.descripcion}</Text>
            {d.tip && (
              <View style={s.tipBox}>
                <Text style={s.tipText}>Tip: {d.tip}</Text>
              </View>
            )}
          </View>
        ))}

        <Text style={s.sectionTitle}>Cierre individual</Text>
        <Text style={[s.bodySecondary, { fontStyle: 'italic', marginBottom: 8 }]}>
          {o.cierre_individual.reflexiona}
        </Text>
        {o.cierre_individual.profundiza.map((p, i) => (
          <View key={i} style={s.card} wrap={false}>
            <Text style={[s.body, { fontWeight: 600, marginBottom: 4 }]}>{p.pregunta}</Text>
            <View style={s.resultBox}>
              <Text style={s.resultText}>{p.respuesta_modelo}</Text>
            </View>
          </View>
        ))}

        <Text style={s.sectionTitle}>Cierre grupal</Text>
        {o.cierre_grupal.map((co, i) => (
          <View key={i} style={s.listItem}>
            <Text style={s.bullet}>&#8226;</Text>
            <Text style={[s.body, { flex: 1 }]}>{co}</Text>
          </View>
        ))}

        <Text style={s.sectionTitle}>Preguntas de comprension</Text>
        {o.preguntas_comprension.map((p, i) => (
          <View key={i} style={s.numberedItem}>
            <Text style={s.number}>{i + 1}.</Text>
            <Text style={[s.body, { flex: 1 }]}>{p}</Text>
          </View>
        ))}

        <View style={s.footer} fixed>
          <Text style={s.footerText}>Kleo · {secTitulo} · Guia del profesor</Text>
          <Text style={s.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
    </Document>
  )
}

// ── Diapositivas PDF ──────────────────────────────────────────────

export function DiapositivasPDF({ slides, secTitulo }) {
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.bar} fixed />
        <Text style={s.title}>{secTitulo}</Text>
        <Text style={s.subtitle}>Diapositivas</Text>

        {slides.map((sl, i) => (
          <View key={i} style={s.slideCard} wrap={false}>
            <Text style={s.slideNumber}>
              {i + 1}/{slides.length}
            </Text>
            <Text style={s.cardTitle}>{sl.titulo}</Text>
            {sl.puntos.map((p, j) => (
              <View key={j} style={s.listItem}>
                <Text style={s.bullet}>&#8226;</Text>
                <Text style={[s.body, { flex: 1 }]}>{p}</Text>
              </View>
            ))}
            {sl.ejemplo && (
              <View style={s.exampleBox}>
                <Text style={s.exampleText}>
                  <Text style={{ fontWeight: 600 }}>Ejemplo: </Text>
                  {sl.ejemplo}
                </Text>
              </View>
            )}
          </View>
        ))}

        <View style={s.footer} fixed>
          <Text style={s.footerText}>Kleo · {secTitulo} · Diapositivas</Text>
          <Text style={s.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
    </Document>
  )
}
