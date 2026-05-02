# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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
  - `NEXT_PUBLIC_SUPABASE_URL` (Supabase project URL)
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Supabase anonymous key)
  - `SUPABASE_SERVICE_ROLE_KEY` (server-side only, for GC token storage bypassing RLS)
  - `ANTHROPIC_API_KEY` (server-side only, set in Vercel dashboard)
  - `GOOGLE_CLIENT_ID` (Google Cloud OAuth2 client ID)
  - `GOOGLE_CLIENT_SECRET` (Google Cloud OAuth2 client secret)
  - `GOOGLE_REDIRECT_URI` (OAuth2 callback URL, e.g. `https://yourdomain.com/api/gc/callback`)
  - `NEXT_PUBLIC_APP_URL` (public app URL for GC links, e.g. `https://kleo.education`)

## Architecture

**Kleo** is a Mexican educational AI platform for teachers and students (secondary/preparatory level in Mexico). Teachers generate AI-powered assignments; students complete them and receive instant AI grading and feedback. All UI copy is in Spanish (Mexican).

### Tech Stack
- **Frontend**: Next.js 16 (App Router) + React 19 + Zustand + Tailwind CSS v3
- **Backend**: Next.js Route Handler (`src/app/api/ia/route.ts`)
- **Database**: Supabase (PostgreSQL + Auth + Row Level Security)
- **AI**: Anthropic Claude (`claude-sonnet-4-20250514`) via direct API calls (raw `fetch`, no SDK)
- **Build**: Next.js + Turbopack
- **Linting**: Biome

### Project Structure

```
src/
  app/                         — Next.js App Router
    layout.tsx                 — Root layout (AuthProvider wrapper)
    page.jsx                   — Landing page (role selection)
    (auth)/                    — Public auth routes (route group, no layout)
      login/page.jsx
      registro/page.jsx
      acceso-alumno/page.jsx
      verificar-correo/page.tsx
      recuperar-contrasena/page.jsx
      restablecer-contrasena/page.jsx
    (profesor)/                — Protected profesor routes (layout with auth guard)
      layout.tsx               — ProtectedRoute requiere="profesor"
      profesor/
        page.jsx               — DashboardProfesor
        generar/page.jsx       — GenerarTarea (AI task generation)
        tarea/[tareaId]/page.jsx — DetalleTarea
        clase/page.jsx         — GestionClase
    (alumno)/                  — Protected alumno routes (layout with auth guard)
      layout.tsx               — ProtectedRoute requiere="alumno"
      alumno/
        page.jsx               — DashboardAlumno
        tarea/[tareaId]/page.jsx — RealizarTarea
        resultado/[tareaId]/page.jsx — ResultadoTarea
    legal/
      privacidad/page.tsx      — AvisoPrivacidad (Server Component)
      terminos/page.tsx        — TerminosUso (Server Component)
    api/
      ia/route.ts              — AI endpoint (task generation + grading)
      gc/                      — Google Classroom integration
        auth/route.ts          — Generate OAuth2 URL
        callback/route.ts      — OAuth2 redirect handler
        courses/route.ts       — List teacher's GC courses
        sync/route.ts          — Import students from GC course
        publish/route.ts       — Publish task as GC coursework
        grades/route.ts        — Push grades back to GC
        disconnect/route.ts    — Disconnect GC account
  lib/supabase.js              — Supabase client init
  lib/google-classroom.ts      — Google Classroom OAuth2 + API helpers
  store/
    useAuthStore.js            — Auth state (teacher Supabase Auth + student code-based)
    useTareaStore.js           — Tasks, students, results state (backed by Supabase)
  components/
    auth/
      AuthProvider.jsx         — Root auth initializer (wraps app)
      ProtectedRoute.jsx       — Role-based route guard
    layout/NavBar.jsx          — Shared navigation bar
    ui/                        — Reusable UI: Badge, Boton, MensajeError, Modal, Spinner
    alumno/RenderizadorPregunta.jsx — Question renderer for student task view
    profesor/
      TablaTareas.jsx          — Task list table
      TablaResultadosAlumnos.jsx — Per-task student results table
      GoogleClassroomPanel.jsx — GC connection + student import UI
      GoogleClassroomActions.jsx — GC publish + grade sync per task
  hooks/useAnthropicAPI.js     — Client-side hook for /api/ia calls
  hooks/useGoogleClassroom.js  — Client-side hooks for GC integration
  mock/pdas/                   — PDA library data (NEM curriculum)
```

### Data Flow

Application state uses Zustand as a cache layer backed by Supabase:

- **`useAuthStore`** (`src/store/useAuthStore.js`): Supabase auth for teachers (email/password), code-based access for students, active role/session. On init, auto-creates missing `profesores` row and default class if needed.
- **`useTareaStore`** (`src/store/useTareaStore.js`): tasks, students, results — all persisted to Supabase, loaded into Zustand on mount. Student access codes generated with `Math.random()` (6-char alphanumeric, excludes ambiguous chars).

### Database Schema (`supabase-schema.sql`)

5 tables with RLS policies:
- `profesores` — teacher profiles (linked to Supabase auth.users), optional `gc_refresh_token` + `gc_connected` for Google Classroom
- `clases` — classrooms per teacher, optional `gc_course_id` linking to GC course
- `alumnos` — students per class (access via 6-char alphanumeric code), optional `gc_user_id` for GC identity
- `tareas` — tasks per class (with optional `fecha_limite` deadline, optional `pda` field for NEM curriculum alignment, optional `gc_coursework_id` for GC)
- `resultados` — student results (supports `calificacion_manual` override)

### Auth Flow

- **Teachers**: email/password registration via Supabase Auth → creates `profesores` row + default class
- **Students**: enter 6-character access code → looked up in `alumnos` table, no Supabase auth account needed. Student sessions are stored in Zustand only (not persisted across page reloads).

### Task Lifecycle

Tasks move through three states: `'borrador'` → `'en_curso'` (published) → `'completada'` (all students submitted).

### API Route (`src/app/api/ia/route.ts`)

Single POST endpoint accepting `{ type, payload }`:
- `type: 'generar'` — generates questions for a task from subject/difficulty/methodology/PDA parameters. Supports 3 pedagogical methodologies: Feynman, Memorización activa, Resolución de problemas. Question types: opcion_multiple, verdadero_falso, abierta, espacios, calculo.
- `type: 'corregir'` — grades student responses, returns score (0–10) + per-question feedback + areas_de_mejora

Claude returns JSON embedded in text; the backend extracts it with a regex (`/\{[\s\S]*\}/`).

### Google Classroom Integration

Optional integration allowing teachers to connect their Google Classroom account:
- **OAuth2 flow**: Teacher connects via `/api/gc/auth` → Google consent → `/api/gc/callback` stores refresh token
- **Student import**: Fetch student roster from a GC course and create `alumnos` rows with `gc_user_id`
- **Task publishing**: When a task is published (`en_curso`), it's automatically created as coursework in the linked GC course
- **Grade sync**: Push `calificacion` (or `calificacion_manual` override) back to GC gradebook
- **DB migration**: Run `supabase-schema-gc.sql` after the base schema to add GC columns
- **Service role key**: GC token storage requires `SUPABASE_SERVICE_ROLE_KEY` to bypass RLS on the `gc_refresh_token` column

### Routes

```
/                              → Landing (role selection)
/login                         → Login (teacher email/password)
/registro                      → Registro (teacher registration)
/acceso-alumno                 → AccesoAlumno (student code entry)
/verificar-correo              → VerificarCorreo
/recuperar-contrasena          → RecuperarContrasena
/restablecer-contrasena        → RestablecerContrasena
/profesor                      → DashboardProfesor (protected)
/profesor/generar              → GenerarTarea (AI task generation form)
/profesor/tarea/[tareaId]      → DetalleTarea (task detail + results + CSV export + manual grading)
/profesor/clase                → GestionClase (class & student management)
/alumno                        → DashboardAlumno (protected)
/alumno/tarea/[tareaId]        → RealizarTarea (answer questions)
/alumno/resultado/[tareaId]    → ResultadoTarea (grade + feedback display)
/legal/privacidad              → AvisoPrivacidad
/legal/terminos                → TerminosUso
```

### Teacher Features
- PDA (Proceso de Desarrollo del Aprendizaje) alignment with NEM curriculum for task generation
- Deadline (`fecha_limite`) on tasks, shown to students with overdue indicator
- Manual grade override (`calificacion_manual`) per student per task
- CSV export of results per task
- Class management: create classes, add/remove students, view access codes

### Custom Tailwind Theme

- Colors: `amarillo` (#FFD700), `amarillo-hover` (#F0C800)
- Animations: `fade-in`, `slide-up`, `nota-pop` (grade reveal animation)
