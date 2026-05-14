# Sprint 4 — Prompt pour Claude Code

> Prompt à coller dans une session Claude (Opus 4.6 recommandé) sur un worktree de la branche `audit/phase-a`. Fix le composant `DiagramaGeometrico`, débugue 2 tareas cassées du Sprint 3, polish 2 autres, et ajoute 3 dernières tareas pour finir la couverture NEM.

---

Tu es développeur sur Kleo, plateforme éducative mexicaine de mathématiques 1° secundaria méthode Singapour (CPA). Tu vas faire 4 missions consécutives.

## Contexte technique

**Worktree** : assure-toi d'être sur `audit/phase-a` (dernier commit `6552400`, qui a ajouté 7 nouvelles tareas Sprint 3).

**État actuel** : 66 tareas (36 secuencias toutes couvertes). 2 tareas Sprint 3 sont cassées visuellement (sec 22b, sec 24b). 3 secuencias mono ont encore un "y" dans le titre (sec 6, 29, 36).

**Fichiers à connaître** :

- `src/types/tarea-cpa.ts` — type `TareaCPA` et toutes les specs
- `src/components/pictorico/DiagramaGeometrico.tsx` — composant SVG actuel
- `src/data/tareas-referencia/` — 66 fichiers `.ts`
- `src/data/tareas-referencia/index.ts` — registre

Lis ces fichiers AVANT de commencer.

---

## Mission 1 — Étendre `DiagramaGeometrico` avec cercles + arcs (priorité bloquante)

**Problème** : Le composant `DiagramaGeometrico.tsx` ne sait pas dessiner de cercles ou d'arcs. Conséquence : les tareas sec 22b (cuerdas du cercle) et sec 24b (sector vs segmento) sont visuellement vides — l'élève voit des segments mais pas de cercle.

### 1.1 — Étendre le type `DiagramaGeometricoSpec`

Dans `src/types/tarea-cpa.ts`, ajoute deux champs optionnels à `DiagramaGeometricoSpec` :

```ts
export interface DiagramaGeometricoSpec {
  tipo_representacion: 'diagrama_geometrico'
  ancho: number
  alto: number
  puntos: Array<{ id: string; x: number; y: number; label?: string }>
  segmentos?: Array<{ tipo: 'segmento' | 'recta'; desde: string; hasta: string; color?: string; label?: string; estilo?: 'lleno' | 'punteado' }>
  angulos?: Array<{ vertice: string; lado_a: string; lado_b: string; medida: string; color?: string }>
  poligonos?: Array<{ puntos: string[]; color?: string; relleno?: boolean }>
  cuadricula?: boolean

  // NOUVEAUX champs (Sprint 4)
  circulos?: Array<{
    centro_id: string         // ref vers un punto
    radio: number             // en unités du diagramme
    color?: 'azul' | 'verde' | 'rojo' | 'amarillo' | 'morado' | 'gris'
    estilo?: 'lleno' | 'borde' | 'punteado'
    label?: string
  }>

  arcos?: Array<{
    centro_id: string         // ref vers un punto
    radio: number
    desde_grados: number      // 0° = est, 90° = nord (sens trigo)
    hasta_grados: number
    color?: 'azul' | 'verde' | 'rojo' | 'amarillo' | 'morado' | 'gris'
    relleno?: boolean         // si true, dessine un secteur plein
    label?: string
  }>

  titulo?: string
}
```

### 1.2 — Mettre à jour `DiagramaGeometrico.tsx`

Rendre les nouveaux éléments en SVG :

- **Cercle** : `<circle cx={cx} cy={cy} r={r} fill={...} stroke={...} strokeDasharray={...} />`. Si `estilo === 'punteado'` → `strokeDasharray="4 2"`. Si `estilo === 'lleno'` → fill coloré opaque ~30%. Si `estilo === 'borde'` → fill="none" stroke coloré.
- **Arc / secteur** : path SVG. Convertir les degrés en coordonnées :
  - `x = cx + r * cos(rad)`, `y = cy - r * sin(rad)` (attention : y inversé en SVG, et conserve la convention 0° = est, sens trigo)
  - Path `M cx cy L x1 y1 A r r 0 [largeArc] [sweep] x2 y2 Z` si `relleno` → secteur plein. Sinon path simple `M x1 y1 A r r 0 [largeArc] [sweep] x2 y2` → juste l'arc.
  - `largeArc = (hasta - desde) > 180 ? 1 : 0`
  - `sweep = 0` (sens trigo standard)
- **Ordre de rendu** : cuadricula → circulos (fond) → arcos → poligonos → segmentos → angulos → puntos (avant-plan). Pour que les labels et points restent lisibles.
- **Palette de couleurs** : réutilise la palette existante (`amarillo: #FFD700`, `azul: #3B82F6`, `rojo: #EF4444`, `verde: #10B981`, `morado: #8B5CF6`, `gris: #6B7280`).
- **Accessibilité ARIA** : `<title>` pour chaque circulo/arco avec son label, role="img" si label présent.

### 1.3 — Tests visuels

Crée une page de test temporaire `/test-diagrama` ou utilise la Biblioteca pour vérifier visuellement que :

- Un cercle de rayon 4 centré en (5,5) s'affiche bien rond (pas elliptique)
- Un secteur de 0° à 90° forme bien un quart de cercle plein
- Un arc seul (sans `relleno`) s'affiche comme une courbe
- Plusieurs cercles + segments + polígonos se superposent correctement

Si tu peux supprimer la page de test après vérification, fais-le.

---

## Mission 2 — Réécrire sec 22b et sec 24b avec les nouveaux cercles

### 2.1 — `secuencia-22b.ts` (Cuerdas y secantes)

Réécris le `pictorico.representacion` pour :

- **Dessiner un cercle visible** de rayon 4 centré en O(5,5), couleur `gris`, estilo `borde`
- **Tracer la cuerda PQ** entre 2 points sur le cercle (par ex. P sur l'angle 200° et Q sur 340° du cercle) en couleur `azul`, label "Cuerda PQ"
- **Tracer la secante** : une recta qui coupe le cercle en 2 points, par ex. R(0,3) et S(10,3) si la recta horizontale y=3 coupe le cercle aux bons endroits. **Vérifie le math** : avec O(5,5) et r=4, la recta y=3 coupe le cercle aux points où (x-5)² + (3-5)² = 16, donc (x-5)² = 12, x = 5 ± 2√3 ≈ 5±3.46. Donc R(1.54, 3) et S(8.46, 3) sont les vrais points d'intersection. Ajuste tes points.
- **Garde un radio visible** O→P en pointillé pour rappeler le centre

Supprime les points orphelins (R, S non utilisés dans l'ancienne version).

### 2.2 — `secuencia-24b.ts` (Sector vs segmento circular)

Réécris le `pictorico.representacion` pour :

- **Cercle** rayon 4 centré en O(5,5), couleur `gris`, estilo `borde`
- **Sector** : utilise `arcos` avec `relleno: true` de 0° à 120° (radii OA et OB + arc AB rempli en `azul` translucide). Label "Sector"
- **Segmento circular** : il faut visualiser la "lune" entre la cuerda et l'arc. Dessine une cuerda CD (de 200° à 340° sur le cercle) + l'arc CD coloré différemment. Label "Segmento". Si dessiner exactement la lune est complexe, contente-toi de :
  - tracer la cuerda en `verde`, estilo `punteado`
  - tracer l'arc en `verde`, sans `relleno`
  - labelliser "Segmento (entre cuerda y arco)"

Vérifie que le math reste juste (area du secteur, longueurs de cuerda).

### 2.3 — Vérification visuelle finale

Affiche les 2 tareas dans la Biblioteca et vérifie que :

- Le cercle est visible
- Sector ressemble vraiment à un quart/tiers de pizza
- Cuerda est bien à l'intérieur du cercle
- Secante traverse le cercle

---

## Mission 3 — Polish Sprint 3

### 3.1 — `secuencia-21b.ts` : ajouter Rombo à la tabla

Le Q1 Abstracto utilise "Rombo" comme option mais la `tabla` du pictorico ne le liste pas. Ajoute une ligne :

```ts
{ figura: 'Rombo', lados_iguales: '4 iguales', lados_paralelos: '2 pares', angulos: 'opuestos iguales' }
```

(adapte les clés selon la structure existante de la tabla).

### 3.2 — Vérification : aucun point orphelin dans les diagrama_geometrico

Grep tous les `.ts` de tareas-referencia pour les `diagrama_geometrico`. Pour chaque, vérifie que chaque `id` dans `puntos` est utilisé au moins une fois dans `segmentos`, `angulos`, `poligonos`, `circulos`, ou `arcos`. Liste les orphelins et supprime-les.

---

## Mission 4 — 3 nouvelles tareas (les "y" du titre encore manquants)

### 4.1 — `secuencia-06b.ts` — Multiplicación de enteros

- **Concept** : (+2)·(+3)=+6, (+2)·(-3)=-6, (-2)·(-3)=+6 (règle des signes)
- **Manipulable** : `fichas_positivas_negativas` avec `positivas: 6, negativas: 0, resultado_objetivo: 6` pour modéliser (+2)·(+3) = 3 groupes de 2 positives. **Note** : le manipulable ne sait pas modéliser la règle des signes complète — utilise-le pour le cas positif, puis explique les autres cas dans le Pictórico/Abstracto.
- **Pictórico** : `tabla` 3×3 avec règles des signes (+×+=+, +×-=-, -×+=-, -×-=+)
- **Anchor task** : Carlos (personnage de sec 6) découvre la multiplication d'entiers
- **Note importante** : le titre NEM dit "Multiplicación y división" — couvre principalement la multiplication ici. La division est implicite (opération inverse).

### 4.2 — `secuencia-29b.ts` — Gráfica circular (pastel)

- **Concept** : Représenter des fréquences relatives sur un cercle (chaque catégorie = secteur proportionnel)
- **Manipulable** : `histograma_construible` avec 4 catégories (réutilise les datos de sec 29 : Futbol=8, Basquet=5, Natacion=4, Otro=3, total 20) — l'élève reconstruit l'histograma puis Q3 Abstracto demande de convertir en gráfica circular
- **Pictórico** : `diagrama_geometrico` avec un cercle découpé en 4 arcs colorés via les nouveaux `arcos` (utilise Mission 1 !). Sectores : Futbol 144° (8/20 × 360°), Basquet 90°, Natacion 72°, Otro 54°
- **Anchor task** : reprend Profesor García (sec 29) qui veut afficher les résultats différemment
- **Abstracto** : conversion fréquence relative → degrés, lecture d'une gráfica circular existante, choix du type de gráfique selon le contexte

### 4.3 — `secuencia-36b.ts` — Binario → decimal

- **Concept** : Convertir un nombre binaire (par ex. 10110) en décimal en sommant les puissances de 2 actives
- **Manipulable** : `interruptores_binarios` avec valeur cible décimale (par ex. 22 = 10110) — l'élève allume les bons interrupteurs
- **Pictórico** : `modelo_barras` ou `tabla` montrant les positions (16, 8, 4, 2, 1) et l'addition des bits actifs
- **Anchor task** : Tomas (sec 36) inverse l'exercice — partant d'un binaire, retrouver le décimal
- **Abstracto** : Q1 conversion simple (1011 → 11), Q2 conversion plus longue (110100 → 52), Q3 explica pourquoi le système binaire fonctionne (puissances de 2)

---

## Règles strictes (rappel)

1. **Manipulable = source de vérité**. Écris-le en premier, puis aligne `contexto.narrativa` / `valores_clave` / `pregunta_central` / `transiciones` dessus.
2. **Math correct** : refais tous les calculs (probabilités, angles, fréquences, conversions binaires) à la main.
3. **Tipo `abierta`** + `criterios_aceptacion` (3-5 mots-clés) pour toute pregunta commençant par "Explica/Por qué/Compara/Describe".
4. **Tipo `calculo`** : seulement si résultat numérique précis avec procédure.
5. **Respuesta abierta** : max 3 phrases, langage 12-13 ans.
6. **Pas de hors-niveau NEM 1° secundaria**.
7. **Bar model** uniquement pour part-whole/comparison/ratio/before-after. Géométrie → `diagrama_geometrico`. Stats/logique → `tabla`.
8. **Difficulté progressive** Q1 (opcion_multiple, facile) → Q2 (calculo, moyen) → Q3 (abierta, difficile) dans Abstracto.
9. **Diagrama_geometrico** : si `medida: '90°'`, vérifie produit scalaire = 0. Si tu déclares un cercle de rayon r centré en C, vérifie que les points "sur le cercle" satisfont (x-Cx)² + (y-Cy)² = r².
10. **Cohérence textes** : pas de "modelo de barras" dans la pregunta si la `tipo_representacion` est `tabla` ou `diagrama_geometrico`.

---

## Workflow

1. **Mission 1** : extend type + composant + tests visuels. Commit séparé `Add cercles + arcs to DiagramaGeometrico`.
2. **Mission 2** : réécris 22b et 24b. Vérifie visuellement. Commit séparé `Fix sec 22b + 24b — visible cercles via new DiagramaGeometrico primitives`.
3. **Mission 3** : polish 21b + cleanup orphelins. Commit `Polish Sprint 3 — add Rombo to sec 21b table, remove orphan points`.
4. **Mission 4** : 3 nouvelles tareas. Update `index.ts`. Commit `Add Sprint 4 — 3 final tareas for multi-concept secuencias (6b, 29b, 36b)`.

À chaque étape : `npm run build` + `npm run lint` clean.

## Livrable attendu

- 1 composant React enrichi (+ types)
- 2 tareas réécrites visuellement (22b, 24b)
- 1 tarea polishée (21b)
- 3 nouvelles tareas (6b, 29b, 36b)
- 4 commits séparés
- Build & lint clean

## Résultat attendu

**69 tareas, 28/36 secuencias multi (78 %), 0 tarea cassée, composant DiagramaGeometrico complet pour la géométrie circulaire**.

Si tu rencontres un problème en cours de route (math qui ne tombe pas juste, composant qui ne rend pas comme prévu), arrête-toi et signale-le dans le message de commit ou dans un fichier `docs/sprint-4-notes.md`. Ne livre PAS de tarea visuellement cassée. Mieux vaut 2 tareas livrées + 1 bloquée documentée que 3 buggées.
