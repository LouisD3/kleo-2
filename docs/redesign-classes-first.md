Voici le prompt complet, copie-le directement depuis le chat :

---

# Refonte Dashboard — "Classes-First" architecture (style Luca)

> Prompt à coller dans Claude Code (Opus 4.6 recommandé) sur la branche `audit/phase-a`. Refonte structurelle complète du dashboard prof selon une architecture multi-classes où "Mis clases" est la home. Total : ~7 jours.

---

Tu es développeur sur Kleo, plateforme éducative mexicaine de maths 1° secundaria méthode Singapour (CPA). Tu vas refondre l'architecture du dashboard prof selon une hiérarchie **classes-first** inspirée de Luca.

## Contexte du produit

**État actuel** : Le dashboard prof a 4 pages (Hoy / Programa / Mi clase / Ajustes) refondues "à la Luca" lors d'un sprint précédent. Le problème : la structure traite les classes comme un filtre, pas comme l'entité primaire. Un prof avec 4 classes vit mal le dashboard actuel.

**Insight clé** : Sur Luca (référence FR de soutien scolaire), **"Mis clases" est la première section**. Le prof entre par les classes, choisit visuellement laquelle traiter, puis plonge dedans. C'est cette hiérarchie qu'on va implémenter.

**Vision** :
```
Niveau 1 : Mis clases (vue d'ensemble multi-classes)
   ↓
Niveau 2 : DANS une classe (alumnos + progreso + tareas)
   ↓
Niveau 3 : Détail (un élève, une tarea, une secuencia)
```

## Stack & fichiers à connaître

- **Next.js 16 App Router** dans `src/app/`
- **Routes prof actuelles** : `src/app/(profesor)/profesor/page.jsx` (Hoy), `programa/page.jsx`, `clase/page.jsx`, `clase/[alumnoId]/page.jsx`, `ajustes/page.jsx`, `tarea/[tareaId]/page.jsx`, `generar/page.jsx`, `biblioteca/page.jsx` (redirect)
- **Layout** : `src/app/(profesor)/layout.tsx`
- **Sidebar** : `src/components/layout/SidebarProfesor.tsx` + `BottomNavProfesor.tsx`
- **Heatmap** : `src/components/profesor/HeatmapCPA.tsx`
- **Hook bloqués** : `src/hooks/useAlumnosBloqueados.js`
- **Auth & store** : `src/store/useAuthStore.js`, `src/store/useTareaStore.js`
- **NEM bloques** : `src/lib/bloques-nem.ts`
- **Design tokens** : Tailwind v3, `amarillo: #FFD700`, `amarillo-soft: #FFF8E1`. Icons Lucide.

Lis ces fichiers AVANT de commencer chaque mission.

## Périmètre

- **Affecté** : tout `/profesor/*`
- **Intact** : `/alumno/*`, `/(auth)/*`, `/legal/*`, `/api/*`
- **Ne casse pas** : login, création tarea, accès résultats, flow élève complet

## Décisions de design figées

1. **Tab par défaut quand on entre dans une classe** : `Alumnos`. Cohérent classes-first / Luca.
2. **Vista por mis clases dans Programa** : Activée. Pour le prof multi-classes c'est crucial.
3. **Page "Hoy"** : Disparaît. Ses fonctions migrent dans la page classe.

---

## Mission 1 — Sidebar refondue à 3 zones

### 1.1 — Modifier `SidebarProfesor.tsx`

Nouvelle structure :
- 🔍 SearchBar avec raccourci ⌘K en haut
- 🎓 Mis clases (route `/profesor`, icône `GraduationCap`)
- 📚 Programa (route `/profesor/programa`, icône `BookOpen`)
- 🎬 Recursos (route `/profesor/recursos`, icône `Film` ou `Library`)
- Séparateur
- ⚙️ Ajustes, 🚪 Salir
- Bouton `+ Acción rápida` en bas

**Supprimer l'item "Mi clase"** (la classe est maintenant accessible via Mis clases).

### 1.2 — Modifier `BottomNavProfesor.tsx`

3 items principaux : Mis clases / Programa / Recursos. Le burger menu à droite contient Ajustes + Salir.

### 1.3 — Loupe + ⌘K sur mobile

Sur mobile, la `SearchBar` n'est pas dans la sidebar (qui n'existe pas) — elle est en haut de chaque page, comme icône loupe ouvrant un modal de recherche.

**Commit 1** : `Refactor sidebar to classes-first 3-zone structure`

---

## Mission 2 — Page "Mis clases" (nouvelle home)

Remplace complètement la page "Hoy" actuelle. Route `/profesor` réécrite.

### 2.1 — Structure de la page

- Header : `Hola, {nombre} 👋` + sous-titre `{N} grupos · {N} alumnos · esta semana`
- Grille 2 colonnes (1 mobile) de cards classes
- Bouton `+ Crear nueva clase` en bas

### 2.2 — Composant `ClaseCard.tsx`

Crée `src/components/profesor/ClaseCard.tsx`. Specs :

**Props** : `{ clase, alumnos, tareas, intentos }` (ou un objet enrichi via hook)

**Affichage** :
- Header : nom classe + emoji (placeholder 🎓 si absent)
- Sous-header : `{N} alumnos`
- Section centrale :
  - Bloque NEM actuel (calculé : le dernier bloque où la classe a des tareas en curso ou complétées)
  - Progress bar global : % moyen des tareas complétées sur l'ensemble du programme
- Section alertes :
  - Si élèves bloqués : `⚠️ {N} alumnos necesitan atención` en orange
  - Sinon : `✓ Todo en orden` en vert
- Footer :
  - Última actividad (timestamp humain : "hace 2 horas", "ayer", "hace 3 días")
  - Bouton "Entrar →" qui navigue vers `/profesor/clase/{clase.id}`

**Styling** :
- Background blanc, bordure `border-gray-200`, rounded-xl, padding p-6
- Hover : `shadow-lg`, légère élévation, `border-amarillo`
- Animation `animate-fade-in` au montage
- Grid : 2 cols desktop, 1 col mobile

### 2.3 — Hook `useClasesEnriched()`

Crée `src/hooks/useClasesEnriched.js` qui retourne pour chaque classe : alumnosCount, tareasActivas, tareasCompletadas, bloqueActual, progressPct, alumnosBloqueadosCount, ultimaActividad. Batch via Supabase pour éviter N+1.

### 2.4 — Empty state

Si 0 classes : "Aún no tienes clases. ¡Crea tu primera para empezar el viaje! 🗺️" + bouton "Crear mi primera clase".

### 2.5 — Bouton "Crear nueva clase"

En bas de la grille. Ouvre une modale `CrearClaseModal` avec champ nom + emoji picker.

**Commit 2** : `Add /profesor "Mis clases" home page with class cards`

---

## Mission 3 — Page détail classe `/profesor/clase/[claseId]`

Création de la nouvelle route hiérarchique.

### 3.1 — Structure de la page

- Breadcrumb `← Mis clases` (lien vers `/profesor`)
- Nom de la classe + emoji centré
- **Switcher de classe** `[Matematica 2A ▾]` : dropdown qui liste les autres classes du prof. Clic = navigation vers `/profesor/clase/{otraClaseId}` en gardant la même tab active. Composant à créer : `ClaseSwitcher.tsx`
- Menu `[⋯]` : Renombrar / Cambiar emoji / Archivar clase
- Sous-titre : `{N} alumnos · Bloque {X} · {Y}% del programa`
- Bannière alumnos bloqueados (réutiliser logique existante, filtrée à la classe)
- 3 tabs internes : **Alumnos** (par défaut) / **Progreso** / **Tareas**

### 3.2 — Tab Alumnos (par défaut)

- Filtres chips : Todos / Bloqueados / Avanzando / Sin actividad
- Bouton "+ Agregar alumno" à gauche
- Bouton "Asignar tarea ›" à droite
- Grille `AlumnoCard.tsx` (4 par ligne desktop, 2 mobile)

**AlumnoCard.tsx** :
- Avatar (initiale dans cercle, couleur générée depuis le nom)
- Nom
- Indicateur CPA : 3 points (C/P/A) pour la tarea actuelle
- Secuencia en cours
- Última actividad
- Clic → `/profesor/clase/{claseId}/alumno/{alumnoId}`

### 3.3 — Tab Progreso

- Sub-toggle Heatmap / Curvas semanales
- HeatmapCPA filtré sur cette classe (réutiliser composant existant)
- Curvas : V2, juste afficher "Próximamente" pour MVP

### 3.4 — Tab Tareas

- Bouton "Asignar nueva tarea" en haut
- Liste des tareas groupées par estado (en_curso, completada, borrador)
- Card de tarea : nom, secuencia, progression (X/N completaron), fecha_limite, lien vers `/profesor/clase/{claseId}/tarea/{tareaId}`

**Commit 3** : `Add /profesor/clase/[claseId] hierarchical class detail page with 3 tabs`

---

## Mission 4 — Programa avec "Vista por mis clases"

### 4.1 — Toggle en haut

`[Vista del programa] [Vista por mis clases]`

### 4.2 — Vista del programa (existante)

Inchangé.

### 4.3 — Vista por mis clases (nouvelle)

Même structure visuelle, mais sur chaque carte secuencia, afficher les avatars/emojis des classes actuellement à cette étape.

Logique : pour chaque classe, déterminer où elle "est" (dernière secuencia avec tareas en curso, ou la plus avancée complétée). Afficher son emoji sur cette case.

Composant : `SecuenciaCardConClases.tsx` qui prend `secuencia` + `clasesEnEstaSec`.

### 4.4 — Multi-class assign

Sur `/profesor/programa/[secuencia]/page.jsx`, bouton "Asignar a una clase" → modale avec liste cocheable des classes. Le prof peut sélectionner 1, 2, ou toutes ses classes en un clic.

**Commit 4** : `Add "Vista por mis clases" toggle on Programa + multi-class assign`

---

## Mission 5 — Migration des routes

L'ancienne `/profesor/clase/[alumnoId]/page.jsx` devient `/profesor/clase/[claseId]/alumno/[alumnoId]/page.jsx`.

### 5.1 — Nouvelle structure

```
src/app/(profesor)/profesor/clase/
├── page.jsx                    ← redirect vers /profesor
├── [claseId]/
│   ├── page.jsx                ← Mission 3
│   ├── alumno/
│   │   └── [alumnoId]/
│   │       └── page.jsx        ← détail élève migré
│   └── tarea/
│       └── [tareaId]/
│           └── page.jsx        ← détail tarea migré
```

### 5.2 — Redirects

- `/profesor/clase/[alumnoId]` → redirect vers `/profesor/clase/{alumno.clase_id}/alumno/{alumnoId}`
- `/profesor/tarea/[tareaId]` → redirect vers `/profesor/clase/{tarea.clase_id}/tarea/{tareaId}`
- `/profesor/clase` (sans param) → redirect vers `/profesor`

### 5.3 — Liens internes

Grep + remplace dans tous les fichiers pour mettre à jour les liens vers la nouvelle hiérarchie.

**Commit 5** : `Migrate routes to /profesor/clase/[claseId]/[alumno|tarea] hierarchy`

---

## Mission 6 — Search global ⌘K + Acción rápida

### 6.1 — `SearchGlobalModal.tsx`

Trigger : raccourci `⌘K` (ou `Ctrl+K`) ou clic sur la barre search.

UI : modale centrée (max 600px), input large en haut, résultats groupés en dessous.

**Catégories** :
- 👥 Alumnos (search par nom)
- 📚 Secuencias (search par numéro ou titre)
- 📋 Tareas (search par titre)
- 🎯 Acciones rápidas (text : "asignar tarea", "agregar alumno")

Navigation clavier : ↑↓, Enter, Esc.

Lib recommandée : `cmdk`. Installer si pas présent.

### 6.2 — `AccionRapidaMenu.tsx`

Trigger : clic sur `+ Acción rápida` ou raccourci `⌘N`.

Menu :
- `+ Asignar tarea` (si dans une classe : modale directe ; sinon : demande la classe d'abord)
- `+ Agregar alumno` (demande la classe)
- `+ Tomar nota` (v2, désactivé)
- `📊 Exportar reporte` (v2, désactivé)

**Commit 6** : `Add ⌘K global search + Acción rápida quick menu`

---

## Mission 7 — Page Recursos (nouvelle)

### 7.1 — Route `/profesor/recursos/page.jsx`

Affiche les ressources de la Biblioteca **transversalement**.

- Search en haut
- Filtres par type : Todos / 📖 Libros / 🎬 Videos / 📊 Slides / 👨‍🏫 Guías
- Groupage par bloque NEM
- Clic sur une ressource → modale ou page lecture (réutiliser `src/content/biblioteca/matematicas-1/`)

### 7.2 — MVP minimal

Si tu manques de temps : liste flat de toutes les secuencias avec leurs 4 ressources, sans filtre. Le filtre par type viendra en V2.

**Commit 7** : `Add /profesor/recursos transversal Biblioteca browser`

---

## Règles strictes

1. **Ne casse rien** : flows existants doivent marcher. Test manuel après chaque mission.
2. **UI Mexican Spanish** avec accents corrects (días, Números, Álgebra).
3. **Pas de tableaux** sauf HeatmapCPA. Toujours en cards.
4. **Mobile-first** : test à 375px.
5. **Réutilise les composants existants** : SidebarProfesor, HeatmapCPA, modales d'asignation, hooks de data.
6. **Routes hiérarchiques** : la classe est dans l'URL dès qu'on est dans son contexte.
7. **Migrations en douceur** : redirects depuis les anciennes routes.
8. **Build clean** : `npm run build` + `npm run lint` à chaque commit.

---

## Workflow

7 commits dans cet ordre :

| # | Mission | Durée | Pré-requis |
|---|---|---|---|
| 1 | Sidebar 3 zones | 0.5j | — |
| 2 | Page Mis clases (home) | 1.5j | M1 |
| 3 | Page détail classe (3 tabs) | 2j | M2 |
| 4 | Programa "Vista por mis clases" | 1j | M2 |
| 5 | Migration routes | 1j | M3 |
| 6 | ⌘K + Acción rápida | 1j | M1, M2 |
| 7 | Page Recursos | 0.5j | — |

**Total ~7 jours.** Sérialise M1→M2→M3→M5. M4, M6, M7 peuvent partir après M2.

---

## Hors-périmètre (NE FAIS PAS)

- Pas de gamification, badges, streaks
- Pas de notifications push
- Pas de mode présentation classe
- Pas de comparatif inter-classes
- Pas de WhatsApp integration
- Pas de page parents

Si tu identifies une opportunité hors-périmètre, NOTE-LA dans `docs/dashboard-classes-followup.md` mais ne l'implémente pas.

---

## Livrable attendu

- 7 commits propres sur `audit/phase-a`
- Nouvelle home `/profesor` = Mis clases avec cartes-classes
- Sidebar à 3 zones (Mis clases / Programa / Recursos)
- Routes hiérarchiques `/profesor/clase/[claseId]/...`
- Switcher de classe dans le header
- ⌘K search globale fonctionnel
- Bouton "+ Acción rápida" global
- Page Recursos transversale
- Vista por mis clases dans Programa
- Tous les flows existants opérationnels
- Build clean, lint clean
- Mobile-first respecté

---

## Vision finale

Verónica ouvre Kleo le matin :

1. Voit ses **4 classes côte à côte** d'un coup d'œil
2. Clique sur Matematica 2A → arrive sur Alumnos, voit Camila bloquée
3. Clique sur Camila → fiche élève dans le contexte de sa classe
4. Veut changer de classe → dropdown header, choisit 2B, navigation instantanée
5. Veut assigner → `+ Acción rápida` → choisit classe + secuencia → done
6. Veut chercher un recurso → ⌘K, tape "modelo barras" → trouve en 2s

**Tout est à 2 clics ou moins. Hiérarchie classes > élèves > activités.**

