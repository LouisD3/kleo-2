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

- `.env.local`: `VITE_API_URL=/api` (frontend)
- `ANTHROPIC_API_KEY`: Server-side only, set in Vercel dashboard (never in repo)

## Architecture

**Kleo** is a Mexican educational AI platform for teachers and students. Teachers generate AI-powered assignments; students complete them and receive instant AI grading and feedback.

### Tech Stack
- **Frontend**: React 18 + React Router v6 + Zustand + Tailwind CSS v3
- **Backend**: Single Vercel serverless function (`api/ia.js`)
- **AI**: Anthropic Claude (`claude-sonnet-4-20250514`) via direct API calls
- **Build**: Vite

### Data Flow

All application state lives in Zustand (in-memory only — no persistence, data resets on page reload):

- **`usePerfilStore`** (`src/store/usePerfilStore.js`): active role (`'profesor'` | `'alumno'` | null) and selected student
- **`useTareaStore`** (`src/store/useTareaStore.js`): tasks array, students array, and all student results

Pre-loaded mock data from `src/mock/` provides two sample tasks and three hardcoded students (Sofía, Carlos, Mia) for demo purposes.

### Task Lifecycle

Tasks move through three states: `'borrador'` → `'en_curso'` (published) → `'completada'` (all students submitted).

### API Endpoint (`api/ia.js`)

Single endpoint accepting `{ type, payload }`:
- `type: 'generar'` — generates questions for a task from subject/difficulty/methodology parameters
- `type: 'corregir'` — grades student responses, returns score (0–10) + per-question feedback

Claude returns JSON embedded in text; the backend extracts it with a regex (`/\{[\s\S]*\}/`).

### Routes

```
/                        → SeleccionarPerfil (role/student selection)
/profesor                → DashboardProfesor
/profesor/generar        → GenerarTarea (AI task generation form)
/profesor/tarea/:tareaId → DetalleTarea (task detail + all student results)
/alumno                  → DashboardAlumno
/alumno/tarea/:tareaId   → RealizarTarea (answer questions)
/alumno/resultado/:tareaId → ResultadoTarea (grade + feedback display)
```

### Custom Tailwind Theme

- Colors: `amarillo` (#FFD700), `amarillo-hover` (#F0C800)
- Animations: `fade-in`, `slide-up`, `nota-pop` (grade reveal animation)
