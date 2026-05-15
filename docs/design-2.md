# Kleo — Design System

Direction visuelle pour Kleo : **chaud, accueillant, mature**. Inspiration "education dashboard" Dribbble (fond crème + cards blanches rounded-3xl + bouton noir + jaune en accent minimal).

> Ce doc est la source de vérité pour le redesign. Avant de toucher au CSS, lis tout. Les tokens et patterns ici remplacent les choix actuels du projet.

---

## 1. Vision

| Axe | Direction |
|---|---|
| Mood | Chaud, posé, premium discret — **pas** corporate froid, **pas** kid-flashy |
| Référence | Dashboards type Notion / Apple / education Dribbble (fond crème, cards blanches très rounded) |
| Densité | Aérée. Beaucoup de whitespace. Mieux vaut 4 cards lisibles que 12 entassées |
| Hiérarchie | Par **taille de card** et **espace**, pas par couleur saturée |
| Couleur | Le jaune doit représenter **<3%** de l'écran (badges, état actif, micro-interactions). Le noir est le primary |

---

## 2. Palette

### Couleurs sémantiques (à mettre dans `src/index.css`)

```css
:root {
  /* Surfaces */
  --background: #F5F1E8;        /* Crème chaud — fond principal */
  --card: #FFFFFF;               /* Cards blanches sur le crème */
  --card-foreground: #1A1A1A;
  --popover: #FFFFFF;
  --popover-foreground: #1A1A1A;

  /* Texte */
  --foreground: #1A1A1A;         /* Texte principal — quasi noir */
  --muted: #F5F1E8;              /* Backgrounds muted = même que body */
  --muted-foreground: #737373;   /* Texte secondaire */

  /* Primary = NOIR (pas le jaune) */
  --primary: #1A1A1A;
  --primary-foreground: #FAFAFA;

  /* Secondary = surface alternative */
  --secondary: #EFEAE0;          /* Crème un cran plus foncé */
  --secondary-foreground: #1A1A1A;

  /* Accent = JAUNE (highlights uniquement) */
  --accent: #FFD93D;             /* Jaune chaud, légèrement plus orangé que l'amarillo actuel */
  --accent-foreground: #1A1A1A;

  /* Destructive */
  --destructive: #DC2626;

  /* Borders / inputs / ring */
  --border: #E8E2D5;             /* Bordure très douce, ton crème */
  --input: #E8E2D5;
  --ring: #1A1A1A;               /* Focus ring noir */

  --radius: 1rem;                /* 16px — passe de 0.625rem à 1rem */
}
```

### `tailwind.config.js` — couleurs custom à conserver/ajouter

```js
colors: {
  // Garder amarillo pour rétrocompat mais aligné sur le nouvel accent
  amarillo: '#FFD93D',
  'amarillo-hover': '#F5C800',

  // Nouveaux tokens crème
  crema: {
    50: '#FBF8F2',
    100: '#F5F1E8',  // = background
    200: '#EFEAE0',  // = secondary
    300: '#E8E2D5',  // = border
    400: '#D4CCB8',
    500: '#A8A092',
  },

  // Tinta = échelle noire pour le texte
  tinta: {
    DEFAULT: '#1A1A1A',
    50: '#FAFAFA',
    100: '#F5F5F5',
    400: '#737373',
    600: '#404040',
    900: '#1A1A1A',
  },

  // ...garder les variables shadcn (background, foreground, card, etc.)
}
```

---

## 3. Design tokens

| Token | Valeur | Quand l'utiliser |
|---|---|---|
| `rounded-2xl` (16px) | Inputs, badges, petits boutons | Default pour la plupart des éléments |
| `rounded-3xl` (24px) | **Toutes les cards** | C'est ce qui fait le style |
| `rounded-full` | Pills (tabs, chips), avatars, icon buttons | Sidebar icons, tabs nav, badges status |
| `p-6` à `p-8` | Padding cards | Jamais moins de `p-6` sur une card |
| `gap-6` à `gap-8` | Espace entre cards | Aéré, pas tassé |
| `shadow-sm` ou `shadow-none` | Ombres | Très subtiles ou aucune. **Pas** de `shadow-lg` |
| `border border-crema-300` | Bordures | Préférer une fine bordure crème à une grosse ombre |

### Typographie

```css
/* Garder le system font stack actuel, ajouter line-heights généreux */
html {
  font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
}
```

| Usage | Classes |
|---|---|
| Page title (H1) | `text-3xl font-bold text-tinta tracking-tight` |
| Section title (H2) | `text-xl font-semibold text-tinta` |
| Card title | `text-lg font-semibold text-tinta` |
| Body | `text-sm text-tinta-600` |
| Muted | `text-sm text-tinta-400` |
| Numbers/stats | `text-4xl font-bold text-tinta tabular-nums` |

---

## 4. Principes visuels

### 4.1 Asymétrie du grid
**JAMAIS** une grille uniforme de cards identiques. Toujours :
- 1 "hero card" (greeting, CTA principal, ou featured content) qui prend plus de place
- 2-3 cards de taille moyenne
- Plusieurs petites cards alignées

Exemple grid dashboard :
```jsx
<div className="grid grid-cols-12 gap-6">
  <div className="col-span-12 lg:col-span-8">{/* Hero */}</div>
  <div className="col-span-12 lg:col-span-4">{/* Calendar/stats */}</div>
  <div className="col-span-12 lg:col-span-7">{/* Latest tarea */}</div>
  <div className="col-span-12 lg:col-span-5">{/* Tasks board */}</div>
  <div className="col-span-6 lg:col-span-3">{/* Mini card */}</div>
  {/* etc. */}
</div>
```

### 4.2 Hiérarchie par taille, pas par couleur
- La card "Hello, prof 👋" est grande, donc elle attire l'œil — pas besoin qu'elle soit jaune
- Une stat importante : `text-4xl font-bold` suffit, pas besoin de fond coloré
- Un badge "En curso" : fond jaune **petit** (px-2 py-0.5 rounded-full), pas une grosse pastille

### 4.3 Photos / illustrations > blocs de texte
Le crème + le blanc peuvent vite devenir plats. Casser la monotonie avec :
- **Avatars** des élèves (initiales colorées sur cercle) dans les listes
- **Aperçus visuels** des manipulables (mini-illustrations dulces, chocolate, balanza) dans les cards de tarea
- **Mini-graphes** (sparklines) plutôt que des chiffres bruts
- **Bar models** miniatures comme preview dans les cards Pictorico
- Émojis pour les états émotionnels uniquement (pas pour décorer)

### 4.4 Le noir est le primary
- Bouton "Nueva tarea" → **noir** (`bg-tinta text-tinta-50 hover:bg-tinta-600`)
- Tab actif → fond noir, texte blanc
- Sidebar icon actif → fond noir circulaire
- Le jaune n'apparaît QUE pour : badge de statut, date sélectionnée dans calendrier, focus discret, indicateur de notification (point jaune)

---

## 5. Composants types

### 5.1 Card (le composant fondamental)

```jsx
<div className="bg-card rounded-3xl p-8 border border-crema-300">
  <div className="flex items-start justify-between mb-4">
    <div>
      <h3 className="text-lg font-semibold text-tinta">Titre</h3>
      <p className="text-sm text-tinta-400 mt-1">Sous-titre</p>
    </div>
    <button className="...">Action</button>
  </div>
  {/* Contenu */}
</div>
```

### 5.2 Bouton primary (noir)

```jsx
<button className="
  inline-flex items-center gap-2
  bg-tinta text-tinta-50
  px-5 py-2.5 rounded-full
  text-sm font-medium
  hover:bg-tinta-600 transition-colors
">
  <Plus className="w-4 h-4" />
  Nueva tarea
</button>
```

### 5.3 Bouton secondary (blanc bordé)

```jsx
<button className="
  inline-flex items-center gap-2
  bg-white text-tinta border border-crema-300
  px-5 py-2.5 rounded-full
  text-sm font-medium
  hover:bg-crema-50 transition-colors
">
  Filtros
</button>
```

### 5.4 Pills tabs (style barre du haut Dribbble)

```jsx
<div className="flex items-center gap-2 bg-crema-100 p-1 rounded-full">
  <button className="px-5 py-2 rounded-full bg-tinta text-tinta-50 text-sm font-medium">
    Todas
  </button>
  <button className="px-5 py-2 rounded-full text-tinta-600 text-sm font-medium hover:bg-white">
    En curso
  </button>
  <button className="px-5 py-2 rounded-full text-tinta-600 text-sm font-medium hover:bg-white">
    Completadas
  </button>
</div>
```

### 5.5 Badge

```jsx
{/* Badge accent (jaune) — pour status "actif" / "design" */}
<span className="inline-flex items-center px-2.5 py-1 rounded-full bg-amarillo text-tinta text-xs font-medium">
  En curso
</span>

{/* Badge neutre */}
<span className="inline-flex items-center px-2.5 py-1 rounded-full bg-crema-200 text-tinta-600 text-xs font-medium">
  Borrador
</span>
```

### 5.6 Sidebar verticale (si on l'ajoute)

```jsx
<aside className="fixed left-4 top-4 bottom-4 w-16 bg-white rounded-3xl border border-crema-300 flex flex-col items-center py-6 gap-3">
  <button className="w-10 h-10 rounded-full bg-tinta text-tinta-50 flex items-center justify-center">
    <Home className="w-5 h-5" />
  </button>
  <button className="w-10 h-10 rounded-full text-tinta-400 hover:bg-crema-100 flex items-center justify-center">
    <Library className="w-5 h-5" />
  </button>
  {/* etc. */}
</aside>
```

### 5.7 Avatar élève (initiale sur cercle coloré)

```jsx
<div className="w-10 h-10 rounded-full bg-amarillo text-tinta flex items-center justify-center font-semibold text-sm">
  {nombre[0]}
</div>
```

Pour distinguer plusieurs élèves, alterner entre 3-4 backgrounds chauds : `bg-amarillo`, `bg-crema-200`, `bg-tinta`, `bg-orange-200`.

---

## 6. Migration concrète

### 6.1 Fichiers à toucher en priorité

1. **`src/index.css`** — remplacer les variables `:root` par celles de la section 2
2. **`tailwind.config.js`** — ajouter les palettes `crema` et `tinta` (garder le reste)
3. **`src/components/ui/Boton.jsx`** — vérifier que la variante `primary` utilise `bg-tinta` (noir) et pas `bg-amarillo`
4. **`src/index.css` `.card`** — passer `rounded-2xl` → `rounded-3xl`, `border-gray-100` → `border-crema-300`

### 6.2 Anti-patterns à éliminer activement

| ❌ À retirer | ✅ Remplacer par |
|---|---|
| `bg-yellow-*`, `bg-amarillo` sur de gros éléments (boutons, fonds de section) | `bg-tinta` pour CTAs, garder amarillo pour badges/highlights |
| `shadow-lg`, `shadow-xl` | `shadow-sm` ou `border border-crema-300` |
| `rounded-md`, `rounded-lg` sur cards | `rounded-3xl` sur cards, `rounded-full` sur pills |
| `bg-gray-50` partout | `bg-crema-100` (= `bg-background`) |
| Padding `p-4` sur cards | `p-6` minimum, `p-8` pour hero cards |
| Grilles `grid-cols-3` uniformes | Asymétrie via `col-span-*` |
| Couleurs vives multiples (rouge + bleu + vert + jaune) | Palette restreinte : crème + noir + jaune. Rouge uniquement pour `destructive` |

---

## 7. Pilote — Dashboard prof

**Fichier** : [src/app/(profesor)/profesor/page.jsx](src/app/(profesor)/profesor/page.jsx)

### Layout cible (asymétrique, mobile-first)

```
┌──────────────────────────────────────────────────────┐
│ NavBar (sticky top, fond crème)                      │
├──────────────────────────────────────────────────────┤
│ ┌──────────────────────────────┐ ┌───────────────┐  │
│ │ Hero card                    │ │ Calendrier    │  │
│ │ "Hola, [profesor] 👋"        │ │ Semaine en    │  │
│ │ "¿Qué quieres enseñar hoy?"  │ │ cours +       │  │
│ │ [+ Nueva tarea] (noir)       │ │ prochaine     │  │
│ │ [Biblioteca] (blanc bordé)   │ │ tarea         │  │
│ │ Stats: X tareas, Y completadas│ └───────────────┘  │
│ └──────────────────────────────┘                     │
│                                                      │
│ ┌─── Pills tabs: Todas | En curso | Completadas ──┐ │
│ └──────────────────────────────────────────────────┘ │
│                                                      │
│ ┌──────────────────────┐ ┌─────────────────────────┐│
│ │ Última tarea (large) │ │ Heatmap CPA             ││
│ │ Aperçu manipulable + │ │ (existing component,    ││
│ │ titre + classe + CTA │ │  juste restylé)         ││
│ └──────────────────────┘ └─────────────────────────┘│
│                                                      │
│ ┌─── Liste des tareas (cards plus petites) ───────┐ │
│ │ [Card] [Card] [Card]                            │ │
│ │ [Card] [Card] [Card]                            │ │
│ └──────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

### Composants à créer pour ce pilote

- `src/components/profesor/HeroProfesor.jsx` — card greeting + CTAs
- `src/components/profesor/AgendaSemana.jsx` — mini-calendrier (semaine en cours, jour highlighté en jaune)
- `src/components/profesor/CardTarea.jsx` — card individuelle de tarea avec preview manipulable
- `src/components/profesor/PillsTabs.jsx` — composant tabs réutilisable

### À conserver
- Logique métier (`useTareasProfesor`, `useEliminarTarea`, etc.) — ne touche pas
- Composant `HeatmapCPA` — restyler son wrapper (rounded-3xl, p-8) mais garder la heatmap interne
- `NavBar` — adapter au nouveau fond crème

### À NE PAS faire dans le pilote
- Ne pas redesigner les autres pages encore (alumno, biblioteca, generar) — on attend validation
- Ne pas changer le schéma de DB ou la logique CPA
- Ne pas toucher aux manipulables ou au StepperCPA — ils ont leur propre univers visuel

---

## 8. Phases d'application

| Phase | Scope | Bloqueur ? |
|---|---|---|
| **P1** | Tokens (index.css + tailwind.config) + composants UI de base (Boton, Badge) | Oui — toute la suite en dépend |
| **P2** | Pilote dashboard prof | Validation utilisateur avant de continuer |
| **P3** | Pages prof restantes (biblioteca, generar, tarea/[id], clase, ajustes) | Après validation P2 |
| **P4** | Pages alumno (dashboard, tarea, resultado) — **prudence** : public différent (ados), garder le côté ludique des manipulables intacts | Après P3 |
| **P5** | Pages auth + landing | Dernier |

**Règle** : à la fin de chaque phase, faire `npm run dev` et vérifier visuellement avant de passer à la suivante.

---

## 9. Checklist de validation par page

Avant de considérer une page "done" :

- [ ] Fond `bg-background` (crème), pas `bg-gray-50`
- [ ] Toutes les cards en `rounded-3xl` avec `p-6` minimum
- [ ] Aucun `shadow-lg`/`shadow-xl` — uniquement `shadow-sm` ou bordure
- [ ] Bouton primary = noir (`bg-tinta text-tinta-50`), pas jaune
- [ ] Jaune utilisé uniquement sur badges, états actifs, micro-highlights (<3% de la surface)
- [ ] Au moins 1 grid asymétrique (col-span variables)
- [ ] Photos/avatars/illustrations présents — pas que du texte
- [ ] Mobile : testé sur 375px de large, tout reste lisible et aéré
- [ ] Aucun élément cassé sur le golden path utilisateur

---

## 10. Référence visuelle

Inspiration : style "Quest dashboard" Dribbble — fond crème, cards blanches très rounded, sidebar circulaire, pills noires/blanches en haut, accent jaune minimal sur badges et dates.

Mots-clés à retenir : **crème, noir, asymétrique, aéré, jaune ponctuel, photos chaudes**.