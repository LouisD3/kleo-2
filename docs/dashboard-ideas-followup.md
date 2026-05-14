# Dashboard Redesign — Follow-up Ideas

Ideas spotted during the biblio-first redesign but out of scope for this sprint.

## UX improvements
- **Sparkline scores** on alumno detail page — week-by-week trend of CPA scores
- **Notification badges** on sidebar items (e.g. "3" on Mi clase when students are blocked)
- **Quick-assign modal** from suggestion card instead of redirect
- **Search on Programa page** — filter secuencias by keyword
- **Drag-to-reorder** NEM bloques for teachers who follow a custom sequence

## Data enrichment
- **Blocked student detection** could be more precise: check `intentos` table for failed attempts, not just missing `resultados`
- **Class comparison view** — multi-class heatmap overlay
- **Weekly digest email** with blocked students + progress summary

## Design
- **Empty states illustrations** — custom SVGs for empty heatmap, no tareas, no alumnos
- **Animated transitions** between pages using View Transitions API
- **Dark mode** support via Tailwind dark variant
