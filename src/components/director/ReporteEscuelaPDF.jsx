'use client'

import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: 'Helvetica' },
  header: { marginBottom: 20 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  subtitle: { fontSize: 11, color: '#666', marginBottom: 16 },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', marginBottom: 8, color: '#333' },
  statsRow: { flexDirection: 'row', gap: 20, marginBottom: 16 },
  statBox: { flex: 1, padding: 10, backgroundColor: '#f9fafb', borderRadius: 4 },
  statValue: { fontSize: 16, fontWeight: 'bold', marginBottom: 2 },
  statLabel: { fontSize: 9, color: '#666' },
  table: { marginTop: 4 },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    padding: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  col1: { flex: 2 },
  col2: { flex: 1 },
  col3: { flex: 1 },
  col4: { flex: 1 },
  headerText: { fontSize: 8, fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase' },
  cellText: { fontSize: 9, color: '#374151' },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#9ca3af',
  },
})

export default function ReporteEscuelaPDF({ escuela, stats, clasesConStats, fecha }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>{escuela.nombre}</Text>
          <Text style={styles.subtitle}>Reporte mensual de uso — {fecha}</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{stats.totalProfesores}</Text>
            <Text style={styles.statLabel}>Profesores activos</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{stats.totalAlumnos}</Text>
            <Text style={styles.statLabel}>Alumnos</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{stats.totalTareas}</Text>
            <Text style={styles.statLabel}>Tareas creadas</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>
              {stats.promedioGeneral != null ? `${stats.promedioGeneral}/10` : '—'}
            </Text>
            <Text style={styles.statLabel}>Promedio general</Text>
          </View>
        </View>

        {/* Classes table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rendimiento por clase</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.headerText, styles.col1]}>Clase</Text>
              <Text style={[styles.headerText, styles.col2]}>Profesor</Text>
              <Text style={[styles.headerText, styles.col3]}>Alumnos</Text>
              <Text style={[styles.headerText, styles.col4]}>Promedio</Text>
            </View>
            {clasesConStats.map((clase) => (
              <View key={clase.id} style={styles.tableRow}>
                <Text style={[styles.cellText, styles.col1]}>
                  {clase.nombre} {clase.grado ? `(${clase.grado})` : ''}
                </Text>
                <Text style={[styles.cellText, styles.col2]}>{clase.profesor_nombre}</Text>
                <Text style={[styles.cellText, styles.col3]}>{clase.total_alumnos}</Text>
                <Text style={[styles.cellText, styles.col4]}>
                  {clase.promedio != null ? `${clase.promedio}/10` : '—'}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <Text style={styles.footer}>Generado por Kleo · {fecha}</Text>
      </Page>
    </Document>
  )
}
