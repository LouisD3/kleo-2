# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server (frontend only, no serverless functions)
vercel dev        # Start full local dev environment (frontend + /api serverless functions)
npm run build     # Production build → dist/
npm run preview   # Preview production build locally
```

There are no test or lint scripts configured.

The Vite dev server proxies `/api/*` requests to `http://localhost:3001` (Vercel CLI default port).

## Environment

- `.env.local`:
  - `VITE_API_URL=/api` (frontend API proxy)
  - `VITE_SUPABASE_URL` (Supabase project URL)
  - `VITE_SUPABASE_ANON_KEY` (Supabase anonymous key)
- `ANTHROPIC_API_KEY`: Server-side only, set in Vercel dashboard (never in repo)

## Architecture

**Kleo** is a Mexican educational AI platform for teachers and students. Teachers generate AI-powered assignments; students complete them and receive instant AI grading and feedback.

### Tech Stack
- **Frontend**: React 18 + React Router v6 + Zustand + Tailwind CSS v3
- **Backend**: Single Vercel serverless function (`api/ia.js`)
- **Database**: Supabase (PostgreSQL + Auth + Row Level Security)
- **AI**: Anthropic Claude (`claude-sonnet-4-20250514`) via direct API calls
- **Build**: Vite

### Data Flow

Application state uses Zustand as a cache layer backed by Supabase:

- **`useAuthStore`** (`src/store/useAuthStore.js`): Supabase auth for teachers (email/password), code-based access for students, active role/session
- **`useTareaStore`** (`src/store/useTareaStore.js`): tasks, students, results — all persisted to Supabase, loaded into Zustand on mount

### Database Schema (`supabase-schema.sql`)

5 tables with RLS policies:
- `profesores` — teacher profiles (linked to Supabase auth.users)
- `clases` — classrooms per teacher
- `alumnos` — students per class (access via 6-char alphanumeric code)
- `tareas` — tasks per class (with optional `fecha_limite` deadline)
- `resultados` — student results (supports `calificacion_manual` override)

### Auth Flow

- **Teachers**: email/password registration via Supabase Auth → creates `profesores` row + default class
- **Students**: enter 6-character access code → looked up in `alumnos` table, no Supabase auth account needed

### Task Lifecycle

Tasks move through three states: `'borrador'` → `'en_curso'` (published) → `'completada'` (all students submitted).

### API Endpoint (`api/ia.js`)

Single endpoint accepting `{ type, payload }`:
- `type: 'generar'` — generates questions for a task from subject/difficulty/methodology parameters
- `type: 'corregir'` — grades student responses, returns score (0–10) + per-question feedback

Claude returns JSON embedded in text; the backend extracts it with a regex (`/\{[\s\S]*\}/`).

### Routes

```
/                          → SeleccionarPerfil (role selection landing)
/login                     → Login (teacher email/password)
/registro                  → Registro (teacher registration)
/acceso-alumno             → AccesoAlumno (student code entry)
/profesor                  → DashboardProfesor (protected)
/profesor/generar          → GenerarTarea (AI task generation form)
/profesor/tarea/:tareaId   → DetalleTarea (task detail + results + CSV export + manual grading)
/profesor/clase            → GestionClase (class & student management)
/alumno                    → DashboardAlumno (protected)
/alumno/tarea/:tareaId     → RealizarTarea (answer questions)
/alumno/resultado/:tareaId → ResultadoTarea (grade + feedback display)
/legal/privacidad          → AvisoPrivacidad
/legal/terminos            → TerminosUso
```

### Teacher Features
- Deadline (`fecha_limite`) on tasks, shown to students with overdue indicator
- Manual grade override (`calificacion_manual`) per student per task
- CSV export of results per task
- Class management: create classes, add/remove students, view access codes

### Custom Tailwind Theme

- Colors: `amarillo` (#FFD700), `amarillo-hover` (#F0C800)
- Animations: `fade-in`, `slide-up`, `nota-pop` (grade reveal animation)
