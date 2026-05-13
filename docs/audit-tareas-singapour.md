# Audit pédagogique — Tareas Singapour Kleo

> Analyse des 47 tareas de référence et des 16 manipulables sous l'angle de la méthode CPA (Concreto–Pictórico–Abstracto). Date : 2026-05-12.

---

## TL;DR

**Architecture solide, exécution inégale.** Les manipulables drag/tap (DulcesAgrupables, RectaNumerica, FichasPositivasNegativas, Cuadricula100) sont excellents. Le squelette CPA + mastery gate + scoring pondéré fonctionne. **Mais la promesse Singapour s'effondre dans 3 zones critiques :**

1. **Le bar model est faux/trivial dans ~40 % des tareas** — surtout en géométrie (sec 17, 25, 28) où on prétend représenter angles, aires ou Pythagore avec une somme linéaire de barres. Le bar model Singapour sert au part-whole, au comparison et aux ratios, **pas** à la géométrie.
2. **Le Geoplano est surchargé** (11/47 tareas) pour des concepts qu'il ne sait pas adresser (angles, médianes, bissectrices, aire). Le Concreto devient un prétexte.
3. **L'anchor task (contexte narratif) n'existe pas** malgré ce qu'indique la mémoire — pas de personnage récurrent, pas de transitions narratives entre C/P/A. Sans fil narratif, la pédagogie Singapour perd 50 % de sa force.

S'ajoutent des défauts secondaires : questions mal typées (`calculo` au lieu de `abierta`), `soluciones_validas` qui contredisent la pregunta, feedback binaire sans diagnostic, modèle en barres en lecture seule.

**Plan d'action** : 6 phases (A → F), ~6 semaines. Commencer par Phase A (quick wins, 1 session, faible risque) avant de toucher à la refonte du Pictórico.

---

## Inventaire

- **47 tareas de référence** pour 36 secuencias NEM (multi-versions A/B/C sur certaines)
- **16 manipulables** opérationnels
- **Architecture CPA** : Concreto (manipulable) → Pictórico (modelo de barras + 2 questions) → Abstracto (3 questions, progression facile/moyen/difficile)
- **Répartition des manipulables** :
  - Geoplano : 11 tareas (sec 11, 16-21, 25-28) — sur-utilisé
  - Dulces, Balanza, Bloques10, Recta numérica, Chocolate, Cuadrícula100, Compás, Histograma : 2-4 tareas chacun
  - Tiras_fracciones : **1 seule tarea** (sec 1b) — sous-utilisé alors que c'est l'outil canonique pour les fractions équivalentes
  - Tabla_verdad, Interruptores_binarios, Dados_ruleta, Patron_figuras : 1-2 tareas

---

## Défauts critiques (priorité haute)

### D1 — Le Pictórico est faux ou trivial dans ~40 % des tareas

Le modèle en barres est censé être le **pont** entre concret et abstrait, pas un récap décoratif. Or :

- **secuencia-25** (distance) : "Horizontal=4, Vertical=3, total=5" — le modelo en barres est **linéaire** mais on prétend y voir Pythagore. Une somme visuelle de barres ne peut pas représenter √(3²+4²).
- **secuencia-28** (aire) : barres Largo=4 + Ancho=3, total=12. Mais 4+3=7 visuellement, pas 12. L'aire n'est pas représentable par addition linéaire.
- **secuencia-17** (angles) : barres 45° / 90° / 135° avec total=180. 180 n'est pas la somme (45+90+135=270). Arbitraire.
- **secuencia-16** (parallèles) : "Recta A=4 / Recta B=4". Deux barres égales ne montrent rien sur le parallélisme. Identique pour des perpendiculaires.
- **secuencia-21** (paralelogramo) : 4 barres pour les 4 côtés — c'est un graphique de fréquence, pas un *bar model*.

**Le bar model Singapour** sert spécifiquement à : (a) part-whole, (b) comparison, (c) ratio, (d) before-after. Il ne sert PAS à la géométrie, aux angles, aux aires ou aux distances euclidiennes.

### D2 — Sur-utilisation du Geoplano comme couteau suisse géométrique

11/47 tareas utilisent le Geoplano pour : périmètres, angles, point milieu, médiatrice, bissectrice, classification figures, distance euclidienne, inégalité triangulaire, aire. **C'est trop.** Le Geoplano sait tracer un polygone, pas :

- Mesurer un angle (sec 17) — le manipulable ne mesure rien
- Tracer une bissectrice (sec 19) — l'élève trace juste le triangle
- Identifier une médiane (sec 20) — la médiane reste invisible
- Vérifier l'inégalité triangulaire (sec 27) — l'élève trace un triangle valide, mais ne teste pas a+b>c

**Conséquence** : l'élève fait un acte simple (tracer un rectangle), puis tout le concept est introduit *seulement* dans l'Abstracto. Le C de CPA disparaît.

### D3 — Le champ `tipo` des questions est mal typé

Énormément de questions Pictórico Q2 et Abstracto Q3 commencent par *"Explica con tus palabras…"* mais sont taggées `tipo: 'calculo'` (sec 16, 17, 19, 22, 28). Conséquences :

- Le textarea affiche le placeholder *"Escribe tu procedimiento y resultado"* alors qu'on attend une explication
- L'IA correctrice reçoit le mauvais prompt pour évaluer (note les calculs au lieu de la compréhension)
- Le scoring ne reflète pas la vraie nature de la réponse

### D4 — Soluciones validas incohérentes

`secuencia-14a` accepte aussi `{ grupos: 4, por_grupo: 3 }` alors que la pregunta dit *"12 dulces para 3 niños"*. Un élève qui ferait 4 groupes de 3 verrait "Correcto !" en contradiction directe avec l'énoncé. Idem 14b. **Bug pédagogique direct.**

### D5 — Le contexte narratif (anchor task) annoncé n'existe pas

La mémoire de Claude indique que 14a/14b ont été refaits comme **anchor tasks** avec `contexto` (personaje, narrativa, transiciones). En réalité :

- Le type `TareaCPA` n'a aucun champ `contexto`
- Aucune tarea n'a de `contexto`
- StepperCPA n'affiche aucun BandeauContexto

Sans fil narratif persistant entre les 3 blocs, la pédagogie Singapour perd sa cohérence "un même problème, 3 angles".

### D6 — Pictórico = lecture seule

Le bar model est intégralement statique (`ModeloBarras.tsx` = SVG en lecture seule). Dans la pédagogie Singapour, le *bar modeling* est une **activité de construction**, pas de contemplation. Sur 47 tareas, l'élève **lit** 47 fois, ne **construit** jamais.

### D7 — Pas de feedback pédagogique sur la nature de l'erreur

Le concret valide en binaire (correct/incorrect). Aucun manipulable ne dit *"tu as fait 5 groupes au lieu de 3"* ou *"tu as sélectionné une pièce de trop pour 3/8"*. La pista est statique. L'élève apprend par tâtonnement aveugle.

---

## Défauts importants (priorité moyenne)

### D8 — Manipulables sous-utilisés ou mal-aiguillés

- **tiras_fracciones** : 1 seule tarea, alors que c'est l'outil canonique pour fractions équivalentes
- **compas_circulo** : "ajuster le rayon à 3" via slider, ce n'est pas "construire au compas"
- **balanza** : limitée à sec 12, pourrait servir aussi en sec 8 (distributive)
- **tabla_verdad** : trop abstracto, manque une métaphore physique (ampoules, circuits)

### D9 — Progression Abstracto incohérente

Le doc prévoit Q1 MC facile, Q2 calculo moyen, Q3 abierta difficile. Mais :

- Plusieurs Q2 sont des explications, pas des calculs
- Q3 abierta a souvent une `respuesta` longue, précise et formelle → l'IA va pénaliser les bonnes réponses formulées différemment
- Aucun champ `criterios_aceptacion` pour permettre une tolérance sémantique

### D10 — Auto-passage trop rapide

Concreto → Pictórico se fait 1500 ms après validation. L'élève n'a pas le temps de regarder son travail. Pas de récap *"Voilà ce que tu viens de découvrir"*.

### D11 — Réponses ouvertes trop longues

Les `respuesta` font 4-6 lignes avec vocabulaire d'enseignant. À 12-13 ans, l'élève écrit 1-2 phrases. L'IA va sous-noter systématiquement. **Il faut une réponse-type courte + 3-5 critères d'acceptation.**

### D12 — Pas de variation théorique (principe Singapour)

Pour les équations linéaires, 12a/12b/12c utilisent toutes la balanza. Or Singapour exige plusieurs représentations du **même** concept. Les fractions (1a/1b/1c) font bien ça (chocolate, tiras, recta numérica), pas les autres concepts.

### D13 — Manipulables avec input clavier ≠ "concret"

8/16 manipulables sont semi-abstraits : Balanza, AzulejosAlgebra, BloquesBase10 (steppers), PatronFiguras (stepper), HistogramaConstruible (stepper), DadosRuleta (bouton lanzar), TablaVerdad, InterruptoresBinarios. La sensation kinétique manque.

### D14 — Pas de transitions narratives entre les blocs

Quand l'élève passe de Concreto à Pictórico, il ne sait **pas pourquoi**. Il devrait y avoir : *"Tu as réparti les dulces en 3 groupes égaux. Regardons maintenant ça avec un modèle en barres pour mieux voir la razón."* Aujourd'hui : transition silencieuse.

---

## Défauts mineurs (priorité basse)

- **D15** Accessibilité ARIA minimale sur la plupart des manipulables
- **D16** Pas de mode "essai libre" / sandbox
- **D17** La gate Pictórico accepte des réponses < 3 caractères pour calculo/abierta (un "a" passe)
- **D18** Pas de PDF imprimable de la tarea CPA pour le prof (mentionné en TODO post-MVP)

---

## Synthèse — Top 5 priorités

| Rang | Défaut | Impact |
|------|--------|--------|
| 1 | **D1** Bar models faux/trivialisés (géométrie, aires, distances) | Anéantit la promesse pédagogique CPA |
| 2 | **D2** Geoplano surchargé sur 11 tareas | Le Concreto devient un prétexte vide |
| 3 | **D5** Anchor task absent malgré annonce | Perte du fil narratif Singapour |
| 4 | **D4** Soluciones_validas qui contredisent la pregunta | Bug pédagogique direct (faux "Correcto") |
| 5 | **D3** Mauvais typage `calculo` vs `abierta` | Mauvaise notation IA + mauvais placeholder UI |

---

## Plan d'action pour Claude Code

6 phases autonomes, livrables individuels. Chaque phase doit être validée avant de passer à la suivante.

### Phase A — Audit & corrections de cohérence (1 session, faible risque)

**Objectif** : nettoyer les bugs évidents sans toucher à l'architecture.

- **A1** Corriger `soluciones_validas` ambigus dans 14a/14b/15a/15b (1 seule solution conforme à la pregunta)
- **A2** Re-typer toutes les questions `calculo` qui demandent une explication → `abierta` (grep "Explica" + `tipo: 'calculo'`)
- **A3** Raccourcir les `respuesta` ouvertes à max 3 phrases + ajouter un champ `criterios_aceptacion?: string[]` au type `PreguntaAbstracto` (3-5 mots-clés requis)
- **A4** Tightening de la validation pictorico — refuser les réponses < 3 caractères pour calculo/abierta dans StepperCPA
- **A5** Étendre la durée d'auto-passage Concreto→Pictórico à 3000 ms et ajouter un récap visuel *"Acabas de…"* entre les étapes

**Livrable** : 1 PR. Tests : passage manuel sur 5 tareas représentatives.

### Phase B — Refonte du Bloque Pictórico (1-2 sessions, moyen risque) ✅ DONE

**Objectif** : faire du Pictórico un vrai pont, ou utiliser un autre support quand le bar model n'est pas adapté.

- **B1** Introduire dans `BloquePictorico` une union :
  ```ts
  representacion: ModeloBarrasSpec | DiagramaGeometricoSpec | TablaSpec
  ```
  - Bar model → arithmétique, ratios, fractions, équations
  - Diagramme géométrique annoté → angles, distances, point milieu, médiatrice
  - Tableau → logique, statistiques, probabilités

- **B2** Créer `DiagramaGeometrico.tsx` : SVG annoté (angles avec arc, segments avec mesures, points nommés). Utilisé par sec 16-22, 25-28
- **B3** Réécrire le bloque pictórico pour chaque tarea concernée par D1 :
  - sec 17 (angles) → DiagramaGeometrico avec 3 angles, arcs colorés
  - sec 25 (distance) → triangle rectangle annoté + a²+b²=c²
  - sec 28 (aire) → grille m×n unité-carrée
  - sec 16 (parallèles) → 2 droites + marqueur parallélisme

**Livrable** : 1 PR par groupe (arithmétique inchangé, géométrie refait).

### Phase C — Système d'anchor task / contexte narratif (1 session) ✅ DONE

**Objectif** : remettre la promesse *"un même problème, 3 angles"* au cœur du flux.

- **C1** Ajouter au type `TareaCPA` :
  ```ts
  contexto?: {
    personaje: string         // "Maria"
    escenario: string         // "En la jarra de limonada"
    emoji?: string            // "🍋"
    hilo_narrativo: {
      concreto: string        // "Maria reparte 12 limones..."
      pictorico: string       // "Veamos cómo Maria organizaria..."
      abstracto: string       // "Maria quiere generalizar..."
    }
  }
  ```
- **C2** Composant `BandeauContexto.tsx` : bannière ambre persistante au-dessus du stepper
- **C3** Composant `TransicionNarrativa.tsx` : carte de transition entre étapes (*"Ahora pasamos al modelo en barras porque…"*)
- **C4** Backfill : ajouter `contexto` aux 47 tareas (script seed semi-automatique)

**Livrable** : 1 PR. Tests : 3 tareas avec contexte visible bout-en-bout.

### Phase D — Refonte des Concretos faibles (2 sessions, gros impact) ✅ DONE

**Objectif** : éliminer les Concretos qui sont des prétextes.

- **D1** Sec 17 (angles) — créer manipulable `transportador` : rapporteur SVG draggable pour mesurer l'angle
- **D2** Sec 19 (bissectrice) — étendre Geoplano avec mode *"trazar bisectriz"*
- **D3** Sec 27 (inégalité triangulaire) — créer `varillas_triangulo` : 3 sliders + animation qui montre si le triangle se ferme ou s'aplatit
- **D4** Sec 8 (propriété distributive) — proposer la balanza en alternative aux azulejos (variation Singapour)

**Livrable** : 1 PR par manipulable (4 PR).

### Phase E — Feedback adaptatif (1 session) ✅ DONE

**Objectif** : remplacer le validate/invalidate binaire par un coaching ciblé.

- **E1** Ajouter au contrat `onValidado` un argument `diagnostico?: string` (*"3 groupes au lieu de 4"*, *"5 piezas au lieu de 3"*)
- **E2** Chaque manipulable produit ce diagnostic
- **E3** StepperCPA affiche le diagnostic dans une bulle non-bloquante après chaque essai raté
- **E4** Pistes adaptatives : `pistas: Pista[]` avec déclencheurs (`{ si: "demasiados_grupos", mensaje: "..." }`)

**Livrable** : 1 PR. Tests : 3 manipulables (Dulces, Chocolate, Balanza) avec diagnostic riche.

### Phase F — Pictórico actif & accessibilité (1-2 sessions) ✅ DONE (F2+F3)

**Objectif** : terminer la promesse Singapour (modeling actif).

- **F1** Mode *"Pictórico construible"* pour bar models simples : l'élève glisse des segments unitaires pour reconstruire le modèle
- **F2** Audit ARIA des 16 manipulables (rôles, labels, navigation clavier)
- **F3** Contraste WCAG AA sur tous les manipulables

**Livrable** : 1 PR.

---

## Séquence recommandée

```
Semaine 1 : Phase A (quick wins)
Semaine 2 : Phase B (le plus gros impact pédagogique)
Semaine 3 : Phase C (narratif + cohérence)
Semaine 4 : Phase D (Concretos refaits)
Semaine 5 : Phase E (feedback adaptatif)
Semaine 6 : Phase F (Pictórico actif + a11y)
```

**Premier prompt à donner à Claude Code** :

> "Lance la **Phase A** du plan d'amélioration des tareas Singapour (`docs/audit-tareas-singapour.md`). 5 étapes (A1 à A5). Pour A1, vérifie chaque tarea avec plusieurs `soluciones_validas` et garde seulement celle qui correspond à la pregunta. Pour A2, grep `tipo: 'calculo'` et regarde si le texte commence par "Explica". Commit séparé par étape."

---

## Annexe — Manipulables top 3 / flop 5

**Top 3 (pédagogiquement solides)** :
1. **RectaNumerica** — fidélité parfaite, drag fluide, feedback omniprésent, mobile-friendly
2. **FichasPositivasNegativas** — métaphore physique (annulation), animation riche, bouton restaurer
3. **DulcesAgrupables** — drag/drop robuste, multiples solutions, state persistant

**Flop 5 (à refaire en priorité)** :
1. **AzulejosAlgebra** — input clavier au lieu de drag des tuiles
2. **ChocolateSecable** — pseudo-concret (juste cliquer), pas de drag/détachement physique
3. **TablaVerdad** — trop abstracto, aucune métaphore CPA
4. **PatronFiguras** — stepper sans guidage du pattern
5. **HistogramaConstruible** — stepper au lieu de drag-to-build