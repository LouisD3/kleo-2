# Kleo — Tareas con IA

Plataforma educativa mexicana para generar y corregir tareas escolares usando inteligencia artificial (Claude de Anthropic).

## Stack

- **Frontend:** Vite + React + Tailwind CSS + React Router v6 + Zustand
- **Backend:** Vercel Serverless Function (`api/ia.js`)
- **IA:** Claude Sonnet (`claude-sonnet-4-20250514`) vía Anthropic API

---

## Configuración local

### 1. Instalar dependencias

```bash
npm install
```

### 2. Variables de entorno

Crea un archivo `.env.local` en la raíz (ya incluido en el repo, sin la clave):

```
VITE_API_URL=/api
```

Para desarrollo local, necesitas exponer la Serverless Function. Instala Vercel CLI:

```bash
npm install -g vercel
vercel dev
```

Esto levanta el frontend en `http://localhost:3000` y las funciones en `/api/*`.

Agrega `ANTHROPIC_API_KEY` a tu entorno local:

```bash
vercel env pull .env.local
```

O crea un archivo `.env` con:

```
ANTHROPIC_API_KEY=sk-ant-...
```

> **Nunca** subas la clave al repositorio.

---

## Despliegue en Vercel

### 1. Conectar el repositorio

```bash
vercel --prod
```

O importa el repositorio desde [vercel.com](https://vercel.com).

### 2. Variables de entorno en Vercel

En el panel de Vercel → Settings → Environment Variables, agrega:

| Nombre | Valor | Entorno |
|--------|-------|---------|
| `ANTHROPIC_API_KEY` | `sk-ant-...` | Production, Preview |

> La clave **nunca** va en el código ni en el repositorio. Solo existe como variable de entorno del servidor.

### 3. Build

Vercel detecta automáticamente Vite. El comando de build es `npm run build` y el directorio de salida es `dist`.

---

## Estructura del proyecto

```
api/
└── ia.js                    ← Serverless Function (única puerta de acceso a Anthropic)

src/
├── pages/
│   ├── SeleccionarPerfil.jsx
│   ├── profesor/
│   │   ├── DashboardProfesor.jsx
│   │   ├── GenerarTarea.jsx
│   │   └── DetalleTarea.jsx
│   └── alumno/
│       ├── DashboardAlumno.jsx
│       ├── RealizarTarea.jsx
│       └── ResultadoTarea.jsx
├── components/
│   ├── ui/                  ← Boton, Badge, Spinner, Modal, MensajeError
│   ├── layout/              ← NavBar
│   ├── profesor/            ← TablaTareas, TablaResultadosAlumnos
│   └── alumno/              ← RenderizadorPregunta
├── store/
│   ├── usePerfilStore.js    ← Perfil activo + alumno seleccionado
│   └── useTareaStore.js     ← Tareas, resultados, promedios
├── hooks/
│   └── useAnthropicAPI.js   ← Llamadas al backend /api/ia
└── mock/
    ├── tareas.js            ← 2 tareas pre-cargadas
    └── alumnos.js           ← 3 alumnos ficticios
```

---

## Flujo de usuario

### Profesor
1. Selecciona "Soy Profesor" en la pantalla de inicio
2. Ve el dashboard con todas las tareas y estadísticas del grupo
3. Genera una nueva tarea configurando materia, dificultad, metodología y tipos de ejercicio
4. Revisa y publica la tarea generada por IA
5. Consulta el detalle de cada tarea: preguntas, respuestas correctas y resultados por alumno

### Alumno
1. Selecciona "Soy Alumno" y elige su perfil (Sofía, Carlos o Mia)
2. Ve su dashboard personal con tareas pendientes y promedio
3. Realiza una tarea respondiendo cada pregunta con la interfaz adecuada (opción múltiple, verdadero/falso, texto abierto, completar espacios)
4. Recibe retroalimentación instantánea con nota animada, comentario por pregunta y áreas de mejora

---

## Limitaciones conocidas

- **Sin autenticación:** Cualquier persona puede acceder a cualquier perfil. No hay contraseñas ni sesiones reales.
- **Sin persistencia en base de datos:** Todos los datos viven en el estado de Zustand (en memoria). Al recargar la página, los datos mock se restauran y los resultados nuevos se pierden.
- **Un solo grupo de alumnos:** La plataforma está diseñada para un grupo fijo de 3 alumnos (Sofía, Carlos y Mia). No hay gestión de múltiples grupos o salones.
- **Sin historial de versiones:** Las tareas generadas no tienen historial; solo se conserva la versión publicada.
- **Sin modo offline:** Todas las funciones de generación y corrección requieren conexión a internet y una clave de API válida.
- **Límites de la API de Anthropic:** La generación y corrección de tareas consume tokens. Costos y límites de velocidad aplican según el plan de Anthropic.
