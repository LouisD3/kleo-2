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

const colors = {
  primary: '#111827',
  secondary: '#6B7280',
  accent: '#FFD700',
  border: '#E5E7EB',
  lightBg: '#F9FAFB',
  correctBg: '#F0FDF4',
  correctBorder: '#BBF7D0',
  correctText: '#15803D',
}

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Inter',
    fontSize: 10,
    color: colors.primary,
    paddingTop: 50,
    paddingBottom: 60,
    paddingHorizontal: 50,
  },
  // Header
  headerBar: {
    backgroundColor: colors.accent,
    height: 4,
    marginBottom: 20,
    borderRadius: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    color: colors.primary,
    maxWidth: '70%',
  },
  metaBadge: {
    backgroundColor: colors.lightBg,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  metaBadgeText: {
    fontSize: 8,
    fontWeight: 600,
    color: colors.secondary,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  metaItem: {
    fontSize: 9,
    color: colors.secondary,
  },
  metaLabel: {
    fontWeight: 600,
    color: colors.primary,
  },
  // Student name line
  studentLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  studentLabel: {
    fontSize: 10,
    fontWeight: 600,
    color: colors.secondary,
    marginRight: 8,
  },
  studentBlank: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
    borderBottomStyle: 'dotted',
    height: 14,
  },
  // Questions
  questionBlock: {
    marginBottom: 14,
    padding: 12,
    backgroundColor: colors.lightBg,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  questionNumber: {
    backgroundColor: colors.primary,
    color: '#FFFFFF',
    width: 20,
    height: 20,
    borderRadius: 10,
    textAlign: 'center',
    lineHeight: 20,
    fontSize: 9,
    fontWeight: 700,
    marginRight: 8,
  },
  questionType: {
    fontSize: 7,
    fontWeight: 600,
    color: colors.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  questionText: {
    fontSize: 10.5,
    lineHeight: 1.5,
    marginBottom: 8,
    fontWeight: 600,
  },
  // Options (multiple choice)
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  optionItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FFFFFF',
  },
  optionItemCorrect: {
    borderColor: colors.correctBorder,
    backgroundColor: colors.correctBg,
  },
  optionCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginRight: 6,
  },
  optionCircleCorrect: {
    borderColor: colors.correctText,
    backgroundColor: colors.correctText,
  },
  optionText: {
    fontSize: 9,
    flex: 1,
  },
  optionTextCorrect: {
    fontWeight: 600,
    color: colors.correctText,
  },
  // True/False
  tfRow: {
    flexDirection: 'row',
    gap: 10,
  },
  tfOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FFFFFF',
  },
  tfOptionCorrect: {
    borderColor: colors.correctBorder,
    backgroundColor: colors.correctBg,
  },
  tfText: {
    fontSize: 9,
    marginLeft: 6,
  },
  tfTextCorrect: {
    fontWeight: 600,
    color: colors.correctText,
  },
  // Answer box (for corrigé)
  answerBox: {
    marginTop: 6,
    padding: 8,
    backgroundColor: colors.correctBg,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.correctBorder,
  },
  answerLabel: {
    fontSize: 7,
    fontWeight: 700,
    color: colors.correctText,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  answerText: {
    fontSize: 9,
    color: colors.correctText,
    lineHeight: 1.4,
  },
  // Blank lines for student answers
  answerLines: {
    marginTop: 6,
  },
  answerLine: {
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
    height: 20,
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 50,
    right: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
  },
  footerText: {
    fontSize: 7,
    color: colors.secondary,
  },
  pageNumber: {
    fontSize: 7,
    color: colors.secondary,
    fontWeight: 600,
  },
})

const typeLabels = {
  opcion_multiple: 'Opción múltiple',
  verdadero_falso: 'Verdadero / Falso',
  abierta: 'Pregunta abierta',
  espacios: 'Completar espacios',
  calculo: 'Cálculo',
}

function QuestionMC({ pregunta, showAnswers }) {
  return (
    <View style={styles.optionsGrid}>
      {pregunta.opciones?.map((op, j) => {
        const letter = op.charAt(0)
        const isCorrect = showAnswers && letter === pregunta.respuesta
        return (
          <View key={j} style={[styles.optionItem, isCorrect && styles.optionItemCorrect]}>
            <View style={[styles.optionCircle, isCorrect && styles.optionCircleCorrect]} />
            <Text style={[styles.optionText, isCorrect && styles.optionTextCorrect]}>{op}</Text>
          </View>
        )
      })}
    </View>
  )
}

function QuestionTF({ pregunta, showAnswers }) {
  const options = [
    { label: 'Verdadero', value: true },
    { label: 'Falso', value: false },
  ]
  return (
    <View style={styles.tfRow}>
      {options.map((opt) => {
        const isCorrect = showAnswers && pregunta.respuesta === opt.value
        return (
          <View key={opt.label} style={[styles.tfOption, isCorrect && styles.tfOptionCorrect]}>
            <View style={[styles.optionCircle, isCorrect && styles.optionCircleCorrect]} />
            <Text style={[styles.tfText, isCorrect && styles.tfTextCorrect]}>{opt.label}</Text>
          </View>
        )
      })}
    </View>
  )
}

function QuestionOpen({ pregunta, showAnswers, lines = 4 }) {
  if (showAnswers && pregunta.respuesta) {
    return (
      <View style={styles.answerBox}>
        <Text style={styles.answerLabel}>Respuesta modelo</Text>
        <Text style={styles.answerText}>{pregunta.respuesta}</Text>
      </View>
    )
  }
  return (
    <View style={styles.answerLines}>
      {Array.from({ length: lines }).map((_, i) => (
        <View key={i} style={styles.answerLine} />
      ))}
    </View>
  )
}

function QuestionEspacios({ pregunta, showAnswers }) {
  if (showAnswers && pregunta.respuesta) {
    return (
      <View style={styles.answerBox}>
        <Text style={styles.answerLabel}>Respuesta</Text>
        <Text style={styles.answerText}>{pregunta.respuesta}</Text>
      </View>
    )
  }
  return null
}

function Question({ pregunta, index, showAnswers }) {
  return (
    <View style={styles.questionBlock} wrap={false}>
      <View style={styles.questionHeader}>
        <Text style={styles.questionNumber}>{index + 1}</Text>
        <Text style={styles.questionType}>{typeLabels[pregunta.tipo] ?? pregunta.tipo}</Text>
      </View>
      <Text style={styles.questionText}>{pregunta.pregunta}</Text>

      {pregunta.tipo === 'opcion_multiple' && (
        <QuestionMC pregunta={pregunta} showAnswers={showAnswers} />
      )}
      {pregunta.tipo === 'verdadero_falso' && (
        <QuestionTF pregunta={pregunta} showAnswers={showAnswers} />
      )}
      {pregunta.tipo === 'abierta' && (
        <QuestionOpen pregunta={pregunta} showAnswers={showAnswers} />
      )}
      {pregunta.tipo === 'espacios' && (
        <QuestionEspacios pregunta={pregunta} showAnswers={showAnswers} />
      )}
      {pregunta.tipo === 'calculo' && (
        <QuestionOpen pregunta={pregunta} showAnswers={showAnswers} lines={6} />
      )}
    </View>
  )
}

export default function TareaPDF({ tarea, claseNombre, showAnswers = false }) {
  const fecha = new Date(tarea.created_at).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Accent bar */}
        <View style={styles.headerBar} fixed />

        {/* Title + badge */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>{tarea.nombre}</Text>
          {showAnswers && (
            <View style={styles.metaBadge}>
              <Text style={styles.metaBadgeText}>CORRIGÉ · SOLO PROFESOR</Text>
            </View>
          )}
        </View>

        {/* Meta info */}
        <View style={styles.metaRow}>
          {claseNombre && (
            <Text style={styles.metaItem}>
              <Text style={styles.metaLabel}>Clase: </Text>
              {claseNombre}
            </Text>
          )}
          <Text style={styles.metaItem}>
            <Text style={styles.metaLabel}>Materia: </Text>
            {tarea.materia}
          </Text>
          <Text style={styles.metaItem}>
            <Text style={styles.metaLabel}>Dificultad: </Text>
            {tarea.dificultad}
          </Text>
          <Text style={styles.metaItem}>
            <Text style={styles.metaLabel}>Fecha: </Text>
            {fecha}
          </Text>
        </View>

        {/* Student name line (only on student version) */}
        {!showAnswers && (
          <View style={styles.studentLine}>
            <Text style={styles.studentLabel}>Nombre del alumno:</Text>
            <View style={styles.studentBlank} />
          </View>
        )}

        {/* Questions */}
        {tarea.preguntas?.map((p, i) => (
          <Question key={i} pregunta={p} index={i} showAnswers={showAnswers} />
        ))}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            {tarea.nombre} · {tarea.materia}
          </Text>
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  )
}
