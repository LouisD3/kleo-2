# Sprint 3 — Prompt pour Claude Code

> Prompt à coller dans une session Claude (Opus 4.6 recommandé) sur un worktree de la branche `audit/phase-a`. Crée 7 nouvelles tareas pour les secuencias mono-concept restantes.

---

Tu es développeur sur Kleo, une plateforme éducative mexicaine de mathématiques pour 1° secundaria suivant la méthode Singapour (CPA : Concreto → Pictórico → Abstracto). Tu vas créer 7 nouvelles tareas de référence pour compléter le programme NEM.

## Contexte technique

**Worktree** : assure-toi d'être sur la branche `audit/phase-a` (dernier commit `e5e5a85`).

**Structure** : chaque tarea est un fichier TypeScript dans `src/data/tareas-referencia/secuencia-XX.ts`. Le type est `TareaCPA` défini dans `src/types/tarea-cpa.ts` — lis-le AVANT de commencer.

**Pattern à suivre** : lis attentivement 3-4 tareas existantes pour comprendre la structure exacte avant d'écrire. Recommandé :

- `secuencia-14a.ts` (anchor task narrative bien faite, manipulable dulces, modelo_barras)
- `secuencia-18.ts` (diagrama_geometrico bien fait)
- `secuencia-34.ts` (tabla de verdad)
- `secuencia-20.ts` (geoplano + diagrama_geometrico pour triangle)

**Index** : à la fin, mettre à jour `src/data/tareas-referencia/index.ts` pour importer + enregistrer les 7 nouvelles tareas. Garder l'ordre numérique.

## Objectif — Sprint 3 : 7 nouvelles tareas

Le but est de couvrir des secuencias qui n'ont qu'une seule tarea alors que leur titre/contenu NEM couvre plusieurs concepts.

### 1. `secuencia-07b.ts` — Propiedad asociativa

- **Concept** : (a+b)+c = a+(b+c), grouper différemment donne le même résultat
- **Manipulable** : `bloques_base10` avec `numero_objetivo: 18`, soluciones_validas multiples ({6+5+7} par 6+(5+7) ou (6+5)+7 = 18)
- **Pictórico** : `modelo_barras` avec 3 barres (6, 5, 7) groupées de 2 façons visuellement
- **Anchor task** : personnage récurrent qui empile des cubes en 2 ordres différents

### 2. `secuencia-19b.ts` — Ángulos congruentes

- **Concept** : Dos ángulos son congruentes si tienen la misma medida
- **Manipulable** : `transportador` avec `angulo_objetivo: 60`, tolerancia 5
- **Pictórico** : `diagrama_geometrico` montrant 2 ángulos de 60° en positions différentes (rotation) avec marca de congruencia ≅
- **Anchor task** : personnage qui découvre que des ángulos en positions différentes peuvent être "iguales"

### 3. `secuencia-21b.ts` — Cuadriláteros

- **Concept** : Diferenciar trapecio, rombo, paralelogramo, cuadrado, rectángulo
- **Manipulable** : `geoplano` 5x5 avec figura_objetivo = trapecio (3 puntos formant un trapèze isocèle)
- **Pictórico** : `tabla` listant 4 cuadriláteros × leurs propriétés (lados iguales / paralelos / ángulos)
- **Anchor task** : élève qui classe des figures de son entourage

### 4. `secuencia-16b.ts` — Perpendicularidad

- **Concept** : Dos rectas son perpendiculares si forman un ángulo de 90°
- **Manipulable** : `geoplano` avec 2 rectas (horizontal + vertical) à tracer
- **Pictórico** : `diagrama_geometrico` avec rectas perpendiculaires correctement positionnées (ATTENTION : vérifie que les angles 90° sont géométriquement justes — voir le bug historique sec 16)
- **Anchor task** : personnage qui voit la perpendicularité dans son environnement

### 5. `secuencia-22b.ts` — Cuerdas y secantes

- **Concept** : Cuerda (segment entre 2 puntos del círculo) vs secante (recta que corta el círculo en 2 puntos)
- **Manipulable** : `compas_circulo` avec radio 4 + elementos_a_trazar = ['cuerda']
- **Pictórico** : `diagrama_geometrico` montrant cercle + cuerda + secante avec labels
- **Anchor task** : exploration géométrique

### 6. `secuencia-24b.ts` — Sector vs segmento circular

- **Concept** : Sector = porción limitée par 2 radios + arco. Segmento = porción limitée par cuerda + arco
- **Manipulable** : `compas_circulo` avec elementos_a_trazar = ['sector']
- **Pictórico** : `diagrama_geometrico` avec cercle découpé en sector colorié (90°) ET segmento colorié — comparaison
- **Anchor task** : pizza coupée vs pizza mangée

### 7. `secuencia-33b.ts` — Eventos independientes

- **Concept** : P(A et B) = P(A) × P(B) quand les eventos sont indépendants
- **Manipulable** : `dados_ruleta` avec 2 monedas (lanzar 2 fois)
- **Pictórico** : `tabla` 2×2 montrant les 4 résultats possibles (cara-cara, cara-cruz, cruz-cara, cruz-cruz)
- **Anchor task** : élève qui lance 2 monedas et compte

## Règles strictes (apprises des audits précédents)

1. **Anchor task** : `contexto.narrativa`, `valores_clave`, `pregunta_central`, `transiciones` DOIVENT être alignés avec les valeurs réelles du `manipulable`. Source de vérité = manipulable. Écris le manipulable EN PREMIER, puis le contexto.

2. **Math** : refais chaque calcul à la main avant de l'écrire. Vérifie distances, angles, fréquences relatives, sommes, probabilités.

3. **Tipo `abierta`** : si la pregunta commence par "Explica", "Por qué", "Compara", "Describe" → `tipo: 'abierta'` + ajouter `criterios_aceptacion: ['mot-clé 1', 'mot-clé 2', ...]` (3-5 éléments).

4. **Tipo `calculo`** : uniquement si on attend un résultat numérique précis avec procédure.

5. **Respuesta `abierta`** : max 3 phrases, langage adapté à 12-13 ans (pas de vocabulaire formel d'enseignant).

6. **Pas de hors-niveau NEM 1° secundaria** : pas d'incentro, baricentro 2:1, formule `tn = a+(n-1)d`, théorèmes avancés.

7. **Bar model** : utilise `modelo_barras` UNIQUEMENT pour part-whole, comparison, ratio, before-after. Pour géométrie (angles, distances, aires), utilise `diagrama_geometrico`. Pour stats/logique, utilise `tabla`.

8. **Difficulté progressive** dans Abstracto : Q1 (opcion_multiple, facile) → Q2 (calculo, moyen) → Q3 (abierta, difficile).

9. **Diagrama_geometrico** : si tu déclares un angle avec `medida: '90°'`, vérifie que les vecteurs `vertice→lado_a` et `vertice→lado_b` font effectivement 90° (produit scalaire = 0). Bug historique : sec 16 avait un angle 90° géométriquement à 56°.

10. **Cohérence textes** : ne dis pas "modelo de barras" dans la pregunta si la `tipo_representacion` est `tabla` ou `diagrama_geometrico`.

## Workflow

1. Lis `src/types/tarea-cpa.ts` + 4 tareas exemple
2. Pour chaque tarea du Sprint 3, écris le manipulable d'abord, puis vérifie le math, puis écris le contexto aligné, puis le pictórico, puis l'abstracto
3. Ajoute les 7 imports + entrées dans `index.ts` (avec commentaires de section)
4. Run `npm run build` pour valider TypeScript
5. Run `npm run lint` pour Biome
6. Commit unique avec message :

```
Add Sprint 3 — 7 new tareas for multi-concept secuencias

- 7b: Propiedad asociativa (bloques_base10)
- 16b: Perpendicularidad (geoplano)
- 19b: Ángulos congruentes (transportador)
- 21b: Cuadriláteros (geoplano)
- 22b: Cuerdas y secantes (compas_circulo)
- 24b: Sector vs segmento (compas_circulo)
- 33b: Eventos independientes (dados_ruleta)

59→66 tareas. Multi-tarea secuencias: 18→25 (50%→69%).
```

## Livrable attendu

7 nouveaux fichiers `.ts` + `index.ts` mis à jour + build clean + 1 commit propre.

Ne touche à AUCUN autre fichier (pas de modification des tareas existantes, pas de refacto, pas de nouveaux manipulables — réutilise uniquement ceux du catalogue actuel listé dans `src/components/manipulables/`).

Si tu vois un problème dans une tarea existante pendant ton exploration, NOTE-LE dans la conclusion mais ne le fixe pas. Reste focused sur les 7 nouvelles.