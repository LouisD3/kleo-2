# CLAUDE.md

## Commands

```bash
npm run dev       # Start Next.js dev server (frontend + API routes)
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run Biome linter
npm run lint:fix  # Run Biome linter with auto-fix
```

## Environment

- `.env.local`:
  - `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Supabase)
  - `ANTHROPIC_API_KEY` (server-side only)
  - `NEXT_PUBLIC_APP_URL` (public app URL, e.g. `https://kleo.education`)

## Product vision

**Kleo** is a Mexican educational platform for **math, 1o Secundaria, 100% Singapore method**.
Every lesson in the NEM curriculum has a Singapore-style tarea that guides the student through
the CPA path (Concreto -> Pictorico -> Abstracto) with a mastery gate between each step.
All UI copy is in Spanish (Mexican). Mobile-first, must work on low-end phones.

## Tech stack

- **Frontend**: Next.js 16 (App Router) + React 19 + Zustand + Tailwind CSS v3 + shadcn/ui + Lucide icons
- **Backend**: Next.js Route Handlers (`src/app/api/`)
- **Database**: Supabase (PostgreSQL + Auth + Row Level Security)
- **AI**: Anthropic Claude (`claude-sonnet-4-20250514`) via raw `fetch` (no SDK)
- **Validation**: Zod (`src/lib/schemas.ts`)
- **Data fetching**: TanStack React Query
- **Manipulables 2D**: `@dnd-kit/core` + `@dnd-kit/sortable` + `framer-motion`
- **Manipulables 3D**: `@react-three/fiber` + `@react-three/drei` (lazy-loaded, WebGL fallback to SVG)
- **Analytics**: PostHog | **Error tracking**: Sentry | **PDF**: `@react-pdf/renderer`
- **Build**: Turbopack | **Lint**: Biome

## Project structure

```
src/
  app/
    layout.tsx                     Root layout (AuthProvider)
    page.jsx                       Landing (role selection)
    (auth)/                        login, registro, acceso-alumno, verificar-correo, recuperar/restablecer-contrasena
    (profesor)/profesor/
      page.jsx                     DashboardProfesor (+ heatmap CPA)
      biblioteca/page.jsx          Browse & assign reference tareas
      generar/page.jsx             AI-generate custom tareas
      tarea/[tareaId]/page.jsx     DetalleTarea (results + CPA breakdown)
      clase/page.jsx               GestionClase
      ajustes/page.jsx             Settings (profile, password, danger zone)
    (alumno)/alumno/
      page.jsx                     DashboardAlumno
      tarea/[tareaId]/page.jsx     StepperCPA (Concreto->Pictorico->Abstracto)
      resultado/[tareaId]/page.jsx ResultadoCPA (score breakdown by step)
    api/ia/route.ts                AI endpoint (generar CPA + corregir CPA)
    legal/                         privacidad, terminos
  types/
    tarea-cpa.ts                   CPA tarea, scoring, attempt, progress types
    biblioteca.ts                  Biblioteca content types
  content/biblioteca/matematicas-1/
    secuencia-01.json ... secuencia-36.json   Per-lesson pedagogical content
    index.ts                       Helpers: getAllSecuencias, getSecuenciaById, loadSecuencia
  data/tareas-referencia/          Reference Singapore tareas (immutable, versioned in Git)
  components/
    manipulables/                  DulcesAgrupables, ManipulableDispatcher, (future: Chocolate, Bloques, Balanza)
    pictorico/                     ModeloBarras (SVG)
    alumno/StepperCPA.tsx          3-step mastery-gated student view
    alumno/RenderizadorPregunta.jsx  Question renderer (5 types)
    profesor/HeatmapCPA.tsx        Students x tareas heatmap by CPA step
    profesor/TablaTareas.jsx       Task list table
    profesor/TablaResultadosAlumnos.jsx  Per-task results with CPA scores
    profesor/TareaPDF.jsx          PDF export
    auth/                          AuthProvider, ProtectedRoute
    layout/NavBar.jsx              Navigation bar
    ui/                            Badge, Boton, MensajeError, Modal, Spinner, Toast + shadcn
    providers/                     QueryProvider, PostHogProvider
  store/
    useAuthStore.js                Teacher Supabase Auth + student code-based access
    useTareaStore.js               Tareas, students, results (Zustand + Supabase)
  hooks/
    useAnthropicAPI.js             Client-side /api/ia wrapper
    useTareas.js                   React Query hooks for tarea CRUD
  lib/                             supabase.js, schemas.ts, posthog.ts, utils.ts
  mock/pdas/matematicas_1.js       36 NEM PDAs (secuencia/titulo/pda/materia/grado)
```

## Database schema

6 tables with RLS:
- `profesores` — teacher profiles (linked to auth.users)
- `clases` — classrooms per teacher
- `alumnos` — students per class (6-char access code, no Supabase auth)
- `tareas` — tasks per class. Key fields: `contenido_cpa` JSONB (CPA structure), `secuencia_ref` INT (link to reference tarea), `estado` ('borrador'|'en_curso'|'completada'), `fecha_limite`
- `resultados` — aggregated best result per student per task. Key fields: `calificacion` (best global score), `scores_cpa` JSONB, `calificacion_manual`, `numero_intentos`, `ultima_tentativa_at`
- `intentos` — every attempt by a student on a task. Key fields: `numero`, `inicio_at`, `fin_at`, `tiempo_concreto_ms`/`pictorico`/`abstracto`, `concreto` JSONB, `pictorico` JSONB, `abstracto` JSONB, `scores_cpa` JSONB

## CPA architecture

### Tarea structure (contenido_cpa JSONB)
```
{ concreto: { manipulable: ManipulableSpec, intentos_para_pista: 3 },
  pictorico: { modelo_barras: ModeloBarrasSpec, preguntas: [...] },
  abstracto: { preguntas: [...] } }
```

### Mastery gate
Student must validate step N to access N+1. Unlimited retries. Hint after N failed attempts (default 3). Teacher can force-unlock a student ("Marcar como completado").

### Scoring
- Concreto: `max(10 - (attempts-1)*2, 2)` (auto-check client-side)
- Pictorico/Abstracto: `(correct/total) * 10` (AI grading for open questions)
- Global: `concreto*0.20 + pictorico*0.30 + abstracto*0.50`

### Reference tareas vs custom
- **Reference tareas** live in `src/data/tareas-referencia/` (TS/JSON, immutable, Git-versioned). When a teacher assigns one, a copy is inserted in `tareas` with `secuencia_ref` pointing to the source.
- **Custom tareas** are AI-generated via `/api/ia` (type: 'generar') for needs outside the standard curriculum. Same CPA structure.

### Student progress persistence
CPA progress is stored in `localStorage` (`kleo_progreso_{tareaId}_{alumnoId}`) so students can resume after closing the browser. Cleared on attempt submission.

### Heatmap CPA (MVP Phase 8)
Teacher dashboard includes a heatmap: students x tareas grid, color-coded green/yellow/red per CPA step (Concreto/Pictorico/Abstracto). Component: `HeatmapCPA.tsx`.

## Auth flow

- **Teachers**: Supabase Auth (email/password) -> auto-creates `profesores` row + default class
- **Students**: 6-char alphanumeric access code -> lookup in `alumnos`, no Supabase auth. Session stored in Zustand + localStorage.

## API route (`/api/ia`)

POST `{ type, payload }`:
- `type: 'generar'` — generates a CPA tarea (concreto + pictorico + abstracto) from PDA/difficulty
- `type: 'corregir'` — grades pictorico + abstracto responses, returns per-step scores + feedback
- `type: 'modificar'` — modifies a single question

## Routes

```
/                              Landing (role selection)
/login, /registro              Teacher auth
/acceso-alumno                 Student code entry
/verificar-correo, /recuperar-contrasena, /restablecer-contrasena
/profesor                      Dashboard (+ CPA heatmap)
/profesor/biblioteca           Browse & assign reference tareas
/profesor/generar              AI-generate custom CPA tareas
/profesor/tarea/[tareaId]      Task detail + results + CSV + manual grading
/profesor/clase                Class & student management
/profesor/ajustes              Settings (profile, password, danger zone)
/alumno                        Student dashboard
/alumno/tarea/[tareaId]        CPA stepper (Concreto->Pictorico->Abstracto)
/alumno/resultado/[tareaId]    Score breakdown by CPA step
/legal/privacidad, /legal/terminos
```

## Biblioteca content

`src/content/biblioteca/matematicas-1/` contains 36 JSON files (one per NEM secuencia) with:
- `evaluacion` — 5 pre-made questions (base for Bloque Abstracto)
- `orientacion` — teacher guide (actividad_inicio, desarrollo, cierre)
- `libro` — student reading material (conceptos, ejemplos, ejercicios)
- `diapositiva` — 8 slides per lesson
- `video_script` — video lesson script

This content is for teacher/student consultation, NOT part of the CPA tarea flow.

## Pedagogical reference

See `docs/pedagogia-singapur.md` for full CPA specs: manipulable JSON formats, bar model specs, auto-check criteria, AI prompt directives, scoring details, secuencia-to-manipulable mapping.

## Custom Tailwind theme

- Colors: `amarillo` (#FFD700), `amarillo-hover` (#F0C800)
- Animations: `fade-in`, `slide-up`, `nota-pop`
