# Dashboard Fixes — Sprint correctif

> Prompt à coller dans Claude Code (Opus 4.6 recommandé) sur la branche `audit/phase-a`. 4 fixes ciblés post-refonte dashboard prof. Total estimé : ~2h30.

---

Tu es développeur sur Kleo. Le dashboard prof vient d'être refondu (commits `3c143c5` → `434b885`). Un audit a identifié 4 problèmes à corriger avant utilisation en classe. Mission : tous les fixer en 4 commits séparés.

## Contexte

- **Branche** : `audit/phase-a` (worktree principal : `/Users/louisdecavel/Desktop/DEV/Kleo-3/`)
- **Build doit rester clean** : `npm run build` + `npm run lint` à chaque commit
- **Aucune nouvelle feature** : que des fixes ciblés sur l'existant

---

## Fix 1 — Bug filtrage page détail élève 🔴

**Fichier** : `src/app/(profesor)/profesor/clase/[alumnoId]/page.jsx` (ou .tsx)

**Problème** : Autour des lignes 22-25, le code filtre `tareasAlumno` par `clase?.id` (la classe actuellement sélectionnée dans le store). Conséquence : si on consulte un élève dont la classe n'est pas la classe active, ses tareas n'apparaissent jamais.

**Fix** : Filtrer par `alumno.clase_id` directement (la classe à laquelle appartient l'élève), pas par la classe active du store.

Cherche dans le fichier l'endroit où `tareasAlumno` est calculé et remplace la condition. Si nécessaire, charge l'objet `clase` correspondant à `alumno.clase_id` pour l'afficher dans le header.

**Test manuel** :
1. Crée 2 classes avec chacune 1 élève
2. Sélectionne la classe A dans la sidebar
3. Va sur la page détail de l'élève de la classe B
4. Vérifie que ses tareas s'affichent bien

**Commit 1** : `Fix tarea filtering on alumno detail page — use alumno.clase_id`

---

## Fix 2 — Section "Bloqueada" sur la fiche élève 🔴

**Fichier** : `src/app/(profesor)/profesor/clase/[alumnoId]/page.jsx` (ou .tsx)

**Problème** : La page détail élève n'a pas de section signalant qu'un élève est bloqué. C'était pourtant le cœur pédagogique de cette page.

**Fix** : Ajouter sous le header (avant la liste des tareas) un bloc conditionnel "Bloqueada" qui apparaît si l'élève a une tarea avec un `intento` en cours depuis 3+ jours sans validation.

### Logique de détection (à coder)

Pour l'élève courant, parmi ses tareas en curso :
1. Charger ses `intentos` (table Supabase `intentos`, filtrer par `alumno_id`)
2. Pour chaque intento : si `inicio_at` ≥ 3 jours ET (`fin_at` est null OU `scores_cpa` montre une étape pas validée), c'est un blocage
3. Identifier la **première** tarea bloquante (la plus ancienne)
4. Sur cette tarea, identifier l'étape bloquante : `Concreto` si pas de `concreto.validado`, sinon `Pictórico` si pas de `pictorico.validado`, sinon `Abstracto`

### Rendu du bloc

```
┌─────────────────────────────────────────────────────────────┐
│  ⚠️ Bloqueada                                               │
│  Tarea {tarea.titulo} — etapa {etapa}                       │
│  Desde el {fecha inicio_at, format dd 'de' MMMM}            │
│  Intentos: {numero_intentos}. Pista usada: {Sí|No}.        │
│                                                             │
│  [Ver intentos detallados]  [Marcar como completado]       │
└─────────────────────────────────────────────────────────────┘
```

**Specs visuelles** :
- Background `bg-orange-50`, bordure `border-orange-200`, padding `p-6`, rounded-xl
- Icône `AlertTriangle` Lucide en `text-orange-600` à gauche du titre
- 2 boutons :
  - "Ver intentos detallados" → `outline` ghost. Si tu n'as pas de page dédiée, fais-le pointer vers `/profesor/tarea/{tareaId}` (page résultats existante)
  - "Marcar como completado" → bouton `amarillo`. Au clic : update `resultados.calificacion_manual = 10` pour cet alumno + cette tarea (via Supabase). Hook existant peut-être dans `useTareaStore`. Toast de confirmation.

### Texte Mexican Spanish (avec accents)

Utilise exactement : "Bloqueada", "Tarea", "etapa", "Desde el", "Intentos:", "Pista usada:", "Sí", "No", "Ver intentos detallados", "Marcar como completado".

**Commit 2** : `Add "Bloqueada" section on alumno detail page`

---

## Fix 3 — Logique "alumno bloqué" sur la page Hoy 🟡

**Fichier** : `src/app/(profesor)/profesor/page.jsx`

**Problème** : La bannière "Alumnos bloqueados" sur la page d'accueil détecte les blocages en regardant `tarea.created_at`. Conséquence : tout élève qui n'a pas commencé une tarea ancienne est marqué "bloqué", même s'il n'a jamais tenté la tarea. Beaucoup de faux positifs.

**Fix** : Remplacer la détection pour utiliser la table `intentos` :

```ts
// Un alumno est "bloqué" sur une tarea si :
// - Il a au moins 1 intento commencé il y a 3+ jours
// - ET son dernier intento sur cette tarea n'est pas terminé (fin_at null)
//   OU son dernier intento est terminé mais le scores_cpa montre une étape non validée
// - ET la tarea elle-même est encore en_curso
```

### Implémentation

1. Récupérer tous les intentos en cours pour le prof courant (via Supabase, joint sur `tareas.profesor_id`)
2. Filtrer ceux dont `inicio_at` < (now - 3 jours) ET `fin_at` IS NULL
3. Grouper par `alumno_id` + `tarea_id`, prendre le plus récent par paire
4. Mapper vers le format attendu par l'UI : `{ alumnoNombre, tareaTitulo, etapa }`

### Rendu affecté

Sur la page Hoy, la bannière affiche désormais aussi l'étape précise :
- `{alumno.nombre} — {tarea.titulo}, etapa {Concreto|Pictórico|Abstracto}`

Si tu n'as pas de hook existant, crée `src/hooks/useAlumnosBloqueados.js` qui retourne `{ data, isLoading }`.

**Commit 3** : `Improve alumnos bloqueados detection — use intentos table instead of tarea age`

---

## Fix 4 — Sweep accents espagnols 🟡

**Problème** : Toute l'UI prof manque les accents mexicains. Sweep + replace sur les nouveaux fichiers du dashboard.

### Mots à remplacer (Mexican Spanish)

| Sans accent | Avec accent |
|---|---|
| dias | días |
| Mas | Más |
| aun | aún |
| Codigo | Código |
| Si (interjection oui) | Sí |
| Guia | Guía |
| Numeros | Números |
| Algebra | Álgebra |
| Geometria | Geometría |
| Circulo | Círculo |
| Estadistica | Estadística |
| Logica | Lógica |
| matematicas | matemáticas |
| despues | después |
| ultimo | último |
| ultima | última |
| facil | fácil |
| dificil | difícil |
| asignacion | asignación |
| sesion | sesión |
| accion | acción |
| informacion | información |
| validacion | validación |
| comparacion | comparación |
| explicacion | explicación |
| operacion | operación |
| descomposicion | descomposición |
| publico | público |
| medico | médico |

### Périmètre du sweep

Limite-toi à ces fichiers/dossiers (ne touche PAS aux tareas de référence) :
- `src/lib/bloques-nem.ts`
- `src/app/(profesor)/**/*.jsx` et `*.tsx`
- `src/components/layout/SidebarProfesor.tsx`
- `src/components/layout/BottomNavProfesor.tsx`
- `src/components/profesor/**/*.tsx` et `*.jsx`

### Méthode

Grep les chaînes texte (entre quotes) suspectes, propose des remplacements ciblés. **Attention** : ne remplace pas dans des noms de variables, slugs, ou identifiants techniques (uniquement dans des chaînes affichées à l'utilisateur).

Exemples à NE PAS toucher :
- `tipo: 'comparacion'` (identifiant technique)
- `tipo_concreto: 'multiplicacion'` (identifiant)
- Nom de variable `informacionAlumno` (var name)

Exemples à toucher :
- `"Buenos dias"` → `"Buenos días"`
- `header: "Codigo de acceso"` → `header: "Código de acceso"`
- `titulo: 'Geometria basica'` → `titulo: 'Geometría básica'`

**Commit 4** : `Add Mexican Spanish accents across prof dashboard UI`

---

## Workflow

1. Fix 1 (15 min) — un seul fichier, un seul commit
2. Fix 2 (1h-1h30) — page détail élève, nouvelle section + logique
3. Fix 3 (1h) — page Hoy, hook ou logique inline
4. Fix 4 (10-15 min) — sweep accents

À chaque commit : `npm run build` + `npm run lint` doivent passer.

## Livrable attendu

- 4 commits séparés sur `audit/phase-a`
- Tests manuels :
  - Fix 1 : page élève d'une autre classe affiche bien ses tareas
  - Fix 2 : bloc orange "Bloqueada" apparaît pour les élèves vraiment bloqués (3+ jours sans avancer)
  - Fix 3 : la bannière Hoy n'affiche plus de faux positifs
  - Fix 4 : pas de mot espagnol sans accent visible à l'œil dans les pages prof
- Build clean

## Hors-périmètre

Pas de refonte de composants en sous-composants extraits (le résumé précédent annonçait `AlumnosBloqueadosBanner`, `TareaCardCompact`, etc. comme composants séparés — peu importe, l'inlined fonctionne).

Pas de différenciation des 4 cards "Recursos" (Libro/Video/Guía/Slides) — sera un sprint dédié.

Si tu identifies un autre bug en cours de route, NOTE-LE dans `docs/dashboard-followup-bugs.md` à la fin mais ne le fixe pas.