# Refonte Dashboard Professeur — "Biblio-first, à la Luca"

> Prompt à coller dans une session Claude (Opus 4.6 recommandé) sur un worktree de la branche `audit/phase-a`. Refonte complète de l'expérience prof : passer d'un dashboard SaaS B2B à un outil pédagogique inspiré de Luca (parcours visuel, cartes, jamais de tableau).

---

Tu es développeur sur Kleo, plateforme éducative mexicaine de mathématiques pour 1° secundaria, méthode Singapour (CPA). Tu vas refondre l'expérience professeur en 4 missions.

## Contexte du produit

**État actuel** : 69 tareas de référence couvrant tout le programme NEM (36 secuencias). L'UX prof actuel est un dashboard SaaS classique avec tableaux, filtres et boutons top-bar. Le contenu Biblioteca (cœur du produit) est relégué à un bouton secondaire.

**Vision** : Le prof ouvre Kleo et VOIT son programme. Pas de tableau. Pas de filtre avant affichage. Cartes visuelles, parcours linéaire NEM, focus du jour clair. Inspiré de Luca (l'app de soutien scolaire FR) et Duolingo pour la structure visuelle du parcours.

**Principes** :
1. Une question par page (jamais "page fourre-tout")
2. Cartes, jamais tableaux (sauf heatmap CPA qui est une matrice)
3. Pas de filtre avant affichage
4. La Biblioteca = la maison, pas un onglet
5. UI 100% Mexican Spanish
6. Mobile-first (test à 375px width minimum)

## Stack & fichiers à connaître

- **Next.js 16 App Router** dans `src/app/`
- **Routes prof actuelles** : `src/app/(profesor)/profesor/page.jsx` (dashboard), `biblioteca/page.jsx`, `clase/page.jsx`, `ajustes/page.jsx`, `tarea/[tareaId]/page.jsx`, `generar/page.jsx`
- **Components** : `src/components/` — réutiliser `ui/` (shadcn), `profesor/HeatmapCPA.tsx`, etc.
- **Auth** : `src/store/useAuthStore.js` + `src/components/auth/ProtectedRoute.tsx`
- **Données tareas** : `src/store/useTareaStore.js` + `src/hooks/useTareas.js`
- **Reference content** : `src/data/tareas-referencia/` (69 tareas) + `src/content/biblioteca/matematicas-1/` (36 secuencias avec orientación, libro, video, diapositiva)
- **PDA NEM** : `src/mock/pdas/matematicas_1.js` (36 entrées avec `secuencia`, `titulo`, `pda`)
- **Design tokens** : Tailwind v3, couleur primaire `amarillo: #FFD700`, animations `fade-in/slide-up`. Icons Lucide.

Lis tous ces fichiers AVANT de commencer.

## Périmètre

- **Zone affectée** : tout `/profesor/*`
- **Zones intactes** : `/alumno/*`, `/(auth)/*`, `/legal/*`, `/api/*`, le student flow entier
- **Ne casse pas** : les flows déjà testés (création tarea, accès résultats, login prof)

---

## Mission 1 — Nouvelle navigation : sidebar fixe (gauche)

### 1.1 — Créer `src/components/layout/SidebarProfesor.tsx`

Sidebar fixe gauche, 240px width desktop, repliable en bottom-bar fixe sur mobile (<768px).

```
┌──────────────────┐
│  Kleo            │  ← logo + nom
│                  │
│  🏠  Hoy         │  ← /profesor (route par défaut, nouveau)
│  📚  Programa    │  ← /profesor/programa (ex-biblioteca, refondue)
│  👥  Mi clase    │  ← /profesor/clase (refondue, heatmap par défaut)
│                  │
│  ─────           │
│                  │
│  ⚙️  Ajustes     │  ← /profesor/ajustes (inchangée)
│  🚪  Salir       │  ← logout action
└──────────────────┘
```

**Specs** :
- Active state : background `bg-amarillo/20`, texte `text-gray-900 font-medium`, barre gauche `border-l-4 border-amarillo`
- Hover state : `bg-gray-100`
- Icons Lucide : `Home`, `BookOpen`, `Users`, `Settings`, `LogOut`
- Mobile (<768px) : sidebar disparaît, remplacée par bottom navigation bar avec les 4 items principaux (sans Ajustes/Salir, qui passent dans un menu burger en haut-droit)
- En haut de la sidebar (sous le logo), afficher l'avatar prof + nom (récupéré de `useAuthStore`)

### 1.2 — Wrapper de layout `src/app/(profesor)/layout.tsx`

Modifier le layout pour intégrer la sidebar. Structure :

```
<ProtectedRoute>
  <div className="flex min-h-screen">
    <SidebarProfesor />  ← desktop
    <main className="flex-1 ml-0 md:ml-60">
      {children}
    </main>
    <BottomNavProfesor /> ← mobile only
  </div>
</ProtectedRoute>
```

### 1.3 — Supprimer la barre navigation actuelle

Le composant `NavBar.jsx` était la navigation top-bar. Si elle n'est plus utilisée côté prof, garde-la pour les pages publiques (landing, auth) mais ne l'affiche pas dans le layout prof.

**Commit 1** : `Add SidebarProfesor + mobile BottomNav for prof routes`

---

## Mission 2 — Page "Hoy" (route par défaut `/profesor`)

Refonte complète de `src/app/(profesor)/profesor/page.jsx`. Cette page remplace "Mis tareas".

### Structure de la page

```
┌──────────────────────────────────────────────────────────────┐
│  Buenos días, {nombre} 👋                                    │
│  Hoy es {jueves 14 de mayo}                                  │
│                                                              │
│  [Bloque "Alumnos bloqueados"] — visible si >0               │
│                                                              │
│  Tareas en curso                                             │
│  [grid de TareaCardCompact]                                  │
│                                                              │
│  Sugerencia                                                  │
│  [SuggestionCard]                                            │
└──────────────────────────────────────────────────────────────┘
```

### 2.1 — Composant `AlumnosBloqueadosBanner.tsx`

**Condition d'affichage** : au moins 1 alumno avec une tarea non-finie depuis +3 jours.

**Source de données** : combiner `intentos` table (via Supabase, hook à créer si pas existant `useAlumnosBloqueados()`) + `tareas` actives. Un alumno est "bloqué" si :
- a un intento commencé il y a +3 jours sur une tarea encore en curso
- ET son dernier intento sur cette tarea est `null` ou échec (pas de validation Concreto, ou validation Concreto mais pas Pictórico)

**Rendu** :
- Background `bg-orange-50`, bordure `border-orange-200`
- Icône `AlertTriangle` Lucide en `text-orange-600`
- Titre : "{N} alumnos bloqueados desde hace 3+ días"
- Liste max 3 alumnos affichés (avec "Ver {N-3} más" si plus) :
  - `{nombre} — {nombre tarea}, etapa {Concreto|Pictórico|Abstracto}`
  - Clic → fiche élève `/profesor/clase/[alumnoId]` (à créer en Mission 4)

Si 0 bloqués, ne rien afficher (pas même la zone).

### 2.2 — Composant `TareaCardCompact.tsx`

Carte compacte pour une tarea en curso. **3 par ligne sur desktop, 1 par ligne sur mobile.**

```
┌─────────────────────┐
│  📐 Razones         │ ← icône matière + titre court
│  Sec 14a            │ ← secuencia ref
│                     │
│  [progress bar]     │ ← % completos
│  8/12 completaron   │
│                     │
│  [Ver detalle →]    │ ← lien vers /profesor/tarea/{id}
└─────────────────────┘
```

**Specs** :
- Background blanc, bordure `border-gray-200`, hover `border-amarillo shadow-md`
- Progress bar : barre Tailwind native, `bg-amarillo` width = `(completados/total)*100%`
- Récupérer les tareas actives via `useTareas()` filtrées sur `estado === 'en_curso'`

### 2.3 — Composant `SuggestionCard.tsx`

**Logique de suggestion** :
- Trouver la dernière secuencia complétée (estado completada) par la classe principale du prof
- Proposer la secuencia suivante dans l'ordre NEM si pas déjà assignée
- Si aucune secuencia complétée, proposer Sec 1 (Fracciones)

**Rendu** :
```
┌──────────────────────────────────────────────────┐
│  ✨ Sugerencia                                   │
│                                                  │
│  Tu clase está lista para empezar Sec 15         │
│  (Proporcionalidad).                             │
│                                                  │
│  [Asignar →]                                     │
└──────────────────────────────────────────────────┘
```

Clic "Asignar" → ouvre une modale rapide ou redirige vers `/profesor/programa/15`.

**Commit 2** : `Refactor /profesor page to "Hoy" focus view`

---

## Mission 3 — Page "Programa" (route `/profesor/programa`)

Refonte complète de `src/app/(profesor)/profesor/biblioteca/page.jsx`. Renommer la route en `/profesor/programa` (créer le nouveau dossier `programa/`, garder `biblioteca/` en redirect temporaire qui pousse vers `programa/`).

### 3.1 — Vue parcours par bloque NEM

Les 36 secuencias NEM peuvent être groupées en bloques. Crée la mapping suivante dans `src/lib/bloques-nem.ts` :

```ts
export const BLOQUES_NEM = [
  { id: 1, titulo: 'Números', secuencias: [1, 2, 3, 4, 5, 6], emoji: '🔢' },
  { id: 2, titulo: 'Álgebra', secuencias: [7, 8, 9, 10, 11, 12], emoji: '🧮' },
  { id: 3, titulo: 'Proporcionalidad', secuencias: [13, 14, 15], emoji: '⚖️' },
  { id: 4, titulo: 'Geometría básica', secuencias: [16, 17, 18, 19, 20, 21], emoji: '📐' },
  { id: 5, titulo: 'Círculo y distancias', secuencias: [22, 23, 24, 25, 26, 27, 28], emoji: '⭕' },
  { id: 6, titulo: 'Estadística y probabilidad', secuencias: [29, 30, 31, 32, 33], emoji: '📊' },
  { id: 7, titulo: 'Lógica y binarios', secuencias: [34, 35, 36], emoji: '🔣' },
]
```

(Adapte si tu trouves un découpage NEM officiel plus précis dans `src/mock/pdas/matematicas_1.js` ou `src/content/biblioteca`.)

### 3.2 — Composant `BloquePrograma.tsx`

Affiche un bloque avec son titre + grille de cartes secuencia (6 par ligne desktop, 2 par ligne mobile).

```
Bloque 1 · Números 🔢
┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐
│  1  │ │  2  │ │  3  │ │  4  │ │  5  │ │  6  │
│ ✅  │ │ ✅  │ │ 📍  │ │     │ │ ✅  │ │     │
└─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘
Frac.   Ent.    Comp.   Dens.   Suma    Mult.
3 tar.  1 tar.  1 tar.  1 tar.  3 tar.  2 tar.
```

### 3.3 — Composant `SecuenciaCard.tsx`

**Specs** :
- Carré 100×100 desktop, 80×80 mobile
- Numéro de secuencia en gros centré
- Badge status en haut-droite :
  - ✅ vert : toutes les tareas complétées par au moins une classe
  - 📍 amarillo : au moins une tarea en curso
  - ⬜ gris : aucune tarea assignée
- Sous la carte : titre court + nombre de tareas disponibles
- Hover : élévation + `border-amarillo`
- Clic → `/profesor/programa/[secuencia]`

### 3.4 — Page détail secuencia `/profesor/programa/[secuencia]/page.tsx` (NOUVELLE)

```
┌──────────────────────────────────────────────────────────────┐
│  ← Programa                                                  │
│                                                              │
│  Secuencia 14 — Razones                                      │
│  Una razón compara dos cantidades relacionadas.              │
│                                                              │
│  📋 Tareas disponibles (2)                                   │
│  ┌────────────────────────────────────────────────────┐     │
│  │ 14a · Maria y los limones (reparto)                │     │
│  │       Concreto: Dulces agrupables                  │     │
│  │       [Vista previa]  [Asignar a una clase]       │     │
│  └────────────────────────────────────────────────────┘     │
│  ┌────────────────────────────────────────────────────┐     │
│  │ 14b · Don Pedro y los chiles (comparación)         │     │
│  │       [Vista previa]  [Asignar a una clase]       │     │
│  └────────────────────────────────────────────────────┘     │
│                                                              │
│  📚 Recursos                                                 │
│  [📖 Libro alumno] [🎬 Video] [👨‍🏫 Guía profe] [📊 Slides]   │
│                                                              │
│  💡 Necesitas algo distinto?                                 │
│  [+ Generar tarea personalizada con IA]                      │
└──────────────────────────────────────────────────────────────┘
```

**Specs** :
- Récupère les tareas via `getTareasReferencia(secuencia)` (helper existant)
- Récupère le contenu Biblioteca (libro, video, guía, diapositiva) via les fichiers JSON dans `src/content/biblioteca/matematicas-1/secuencia-XX.json`
- Bouton "Vista previa" → ouvre une modale `<TareaPreviewModal>` qui montre la tarea comme l'élève la verrait (réutiliser `StepperCPA` en mode preview readonly si possible)
- Bouton "Asignar a una clase" → ouvre `<AsignarTareaModal>` (déjà existant ou à créer) avec liste des classes du prof + bouton confirm
- Bouton "Generar tarea personalizada" → redirige vers `/profesor/generar?secuencia=14` (pré-remplir avec le contexte)

### 3.5 — Retirer le bouton "Generar tarea personalizada" du top-bar

Il était proéminent dans l'ancienne navigation. Maintenant il vit dans la page détail secuencia comme un fallback. Tu peux garder la route `/profesor/generar` accessible (pour les liens directs depuis la page secuencia), mais elle ne doit plus être un item de navigation.

**Commit 3** : `Add /profesor/programa with NEM bloques view + secuencia detail page`

---

## Mission 4 — Page "Mi clase" avec heatmap par défaut

Refonte de `src/app/(profesor)/profesor/clase/page.jsx`.

### 4.1 — Heatmap CPA en vue principale

Plus jamais dans un onglet caché. **C'est la page entière.**

Réutiliser `src/components/profesor/HeatmapCPA.tsx` existant. L'élargir si nécessaire pour qu'il occupe toute la largeur du contenu.

### 4.2 — Sélecteur de classe en haut (pas un filtre obligatoire)

Si le prof a 1 seule classe, ne pas afficher de sélecteur (vue directe).
Si plusieurs classes, dropdown discret en haut-droite avec sélection. Par défaut : la classe avec le plus d'alumnos actifs.

### 4.3 — Bouton "+ Agregar alumno" en haut-droite

Visible mais discret (ghost button). Clic → modale d'ajout d'alumno (réutiliser le composant existant).

### 4.4 — Cliquer sur un alumno → fiche détaillée (NOUVELLE PAGE)

Créer `src/app/(profesor)/profesor/clase/[alumnoId]/page.tsx`.

```
┌──────────────────────────────────────────────────────────────┐
│  ← Mi clase                                                  │
│                                                              │
│  Camila Rodríguez                                            │
│  Código de acceso: 7K3M9P                                    │
│                                                              │
│  📊 Progreso global                                          │
│  ████████░░░░░░░  53% del programa                          │
│                                                              │
│  ⚠️ Bloqueada                                                │
│  Tarea Razones — etapa Concreto desde el 11 de mayo (3 días)│
│  Intentos: 7. Pista usada: Sí.                              │
│  [Ver intentos detallados]  [Marcar como completado]        │
│                                                              │
│  📋 Tareas asignadas                                         │
│  [Liste cards : tarea + estado + score]                     │
│                                                              │
│  📈 Historial                                                │
│  [Sparkline des scores semaine par semaine]                 │
└──────────────────────────────────────────────────────────────┘
```

**Specs minimales pour MVP** :
- Header avec nom + código de acceso
- Section "Bloqueada" si applicable (réutiliser logique de la Mission 2)
- Liste des tareas assignées avec leur statut et score
- Historial : si trop complexe, version v1 = simple liste chronologique des tareas terminées avec date + score

**Commit 4** : `Refactor /profesor/clase to heatmap-first view + add /clase/[alumnoId] detail page`

---

## Mission 5 — Polish & cohérence visuelle

### 5.1 — Couleurs et tokens

Inspiration Luca = palette douce. Compléter `tailwind.config.js` si nécessaire :

```js
extend: {
  colors: {
    amarillo: '#FFD700',
    'amarillo-hover': '#F0C800',
    'amarillo-soft': '#FFF8E1',  // background subtil pour highlights
  }
}
```

### 5.2 — Vide d'espace

Augmenter les paddings/margins. Sur desktop, contenir le contenu dans `max-w-7xl mx-auto px-8 py-8`. Pas de contenu collé aux bords.

### 5.3 — Typographie

- Titres de page : `text-3xl font-bold text-gray-900`
- Sous-titres : `text-lg text-gray-600`
- Body : `text-base text-gray-700`
- Petite info : `text-sm text-gray-500`

### 5.4 — Animations

Réutiliser `animate-fade-in` sur le montage des pages (déjà dans Tailwind config).

### 5.5 — Responsive

Tester chaque page à 375px (iPhone SE), 768px (tablet), 1280px (desktop). Tout doit être utilisable sans scroll horizontal.

**Commit 5** : `Polish visual cohesion across prof dashboard`

---

## Règles strictes

1. **Ne casse rien** : tous les flows existants (login, création tarea, accès résultats, alumno) doivent continuer de marcher. Test manuel en fin de chaque mission.
2. **UI en Mexican Spanish** : tout le texte UI en espagnol mexicain. Aucun mot en anglais ou français.
3. **Pas de tableaux** : sauf le heatmap CPA qui reste. Si tu es tenté d'utiliser un `<table>` pour autre chose, c'est un signal qu'il faut repenser en cards.
4. **Pas de filtre avant affichage** : chaque page doit montrer du contenu utile dès le premier rendu, même sans interaction.
5. **Mobile-first** : développe en pensant 375px d'abord, élargis ensuite.
6. **Aria & accessibilité** : tous les boutons ont des labels accessibles, les icônes seules ont des `aria-label`.
7. **Réutilise les composants shadcn/ui existants** dans `src/components/ui/`. N'invente pas un système de design parallèle.
8. **Ne supprime PAS** les routes existantes brutalement : crée les nouvelles routes, fais des redirects 301 depuis les anciennes pendant 1 sprint, supprime après. Exception : la page `/profesor` actuelle peut être réécrite directement (c'est la racine).

## Ordre de travail recommandé

1. **Mission 1** (sidebar) en premier — ça rendra les autres pages immédiatement plus claires
2. **Mission 4** (Mi clase + heatmap) avant Mission 3 — moins de surface fonctionnelle, te permet de chauffer
3. **Mission 3** (Programa) — le plus gros chantier
4. **Mission 2** (Hoy) — dernière car elle agrège les données des autres pages
5. **Mission 5** (polish) — passage final

Chaque mission = 1 commit. 5 commits au total.

## Workflow

À chaque mission :
1. Lis les fichiers concernés
2. Identifie ce qui doit être créé vs modifié vs supprimé
3. Implémente
4. Run `npm run build` + `npm run lint`
5. Test manuel : `npm run dev` puis vérifier la page concernée + qu'aucun flow existant n'est cassé
6. Commit avec message court et descriptif

## Livrable attendu

- Sidebar fixe à 4 items (Hoy / Programa / Mi clase / Ajustes)
- 4 pages refondues + 2 nouvelles pages détail (secuencia, alumno)
- Aucun tableau hors heatmap CPA
- Build et lint clean
- Mobile-first respecté
- 5 commits propres

## Hors-périmètre (ne fais PAS)

- Pas de refonte de la zone `/alumno` (côté élève) — c'est un autre chantier
- Pas de refonte des manipulables ou des tareas — c'est fait
- Pas de gamification (badges, points, streaks) — sera un sprint dédié
- Pas de notifications push ou email — séparé
- Pas de mode "présentation classe" / fullscreen projection — futur sprint
- Pas de comparatif inter-classes — futur sprint

Si tu vois une opportunité d'amélioration hors-périmètre, NOTE-LA dans un fichier `docs/dashboard-ideas-followup.md` à la fin, mais ne l'implémente pas.

---

## Vision rappel

Le prof ouvre Kleo le matin et voit en une page : **qui bloque, ce qui tourne, ce qui vient ensuite**. Il clique sur "Programa" et voit son programme NEM comme un parcours visuel avec son avancée. Il clique sur "Mi clase" et voit immédiatement le heatmap CPA de ses élèves. Pas de tableau, pas de filtre, pas de bouton flottant aléatoire. Tout est à sa place.

Si à la fin de ton travail un prof peut faire son cours en 5 clics, c'est gagné.