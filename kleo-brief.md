# Brief Claude Code — Kleo

À lire avant toute action. Complète `CLAUDE.md` (contexte technique) et `kleo-context.md` / `kleo-strategy.md` (contexte produit/stratégie).

---

## Contexte stratégique à internaliser

**PMF asap = signer 2-3 contrats école pour la rentrée d'août 2026.** Calendrier scolaire mexicain contraint la fenêtre : achat école mars-juin, livraison août, renouvellement début 2027.

**Sell-then-build.** Le cofondateur (insider K-12 privé mexicain) ouvre les portes et vend dès maintenant sur sa relation + un demo crédible. Louis livre. On ne pré-construit pas pour un marché abstrait — chaque feature doit servir soit (a) un demo qui ferme une école, soit (b) une école déjà signée.

**Concurrent : Luca Edu** (bibliothèque statique 1 200 vidéos / 8 000 exercices, deal Santillana). On ne le bat ni sur la production value ni sur la couverture exhaustive du SEP. On le bat sur **la personnalisation IA par élève** et le **prix accessible** au tier 2-3.

**Le différenciateur n°1 qui ferme un demo** : la boucle intra-devoir (remédiation temps réel quand un élève se trompe). C'est ce qui se voit en 90 secondes face à une directrice et qui fait dire "Luca ne fait pas ça".

**Cible année 1** : écoles privées mexicaines tier 2-3, périmètre niveau/matières défini par les écoles qui signent (pas par la roadmap idéale).

---

## Manques actuels pour fermer un deal école et livrer en août

D'après `CLAUDE.md`, le codebase a déjà : génération devoirs IA (4 méthodologies — Feynman, Memorización activa, Resolución de problemas, Práctica directa), grading auto, gestion classes, intégration Google Classroom, export PDF/CSV, onboarding profs, alignement PDA (NEM).

Manques classés par ordre de priorité business :

1. **Boucle de remédiation intra-devoir** — feature démo qui ferme.
2. **Console admin école** — ce que la directrice veut voir avant de signer.
3. **Pipeline génération multi-passes** — qualité contenu institutionnellement défendable.
4. **Bibliothèque consultable par aprendizaje (NEM)** — ce que les profs demandent réellement (pas la génération à la demande).
5. **Conformité institutionnelle** (LFPDPPP, CFDI, formation profs documentée).

---

## Priorité 1 — Boucle de remédiation intra-devoir [Semaines 1-2]

**Objectif.** Quand un élève se trompe sur une question, le système intercepte, diagnostique le bug avec Haiku 4.5 en temps réel (~500ms-1s), insère 1-2 questions de remédiation ciblées, puis reprend le devoir.

**Côté élève** (`src/app/(alumno)/alumno/tarea/[tareaId]/page.jsx`) :
- Après chaque réponse, appel API de diagnostic avant de passer à la suivante.
- Si correcte → question suivante du devoir d'origine.
- Si incorrecte → transition courte ("Aclaremos esto rápido"), question de remédiation générée à la volée, jusqu'à 2 max.
- Après remédiation → reprise à la question suivante du devoir d'origine.

**Côté API** (`src/app/api/ia/route.ts`) :
- Nouveau type : `'diagnosticar_y_remediar'`.
- Input : `{ aprendizaje, pregunta_original, respuesta_elev, contexto_devoir, intento_remediation_n }`.
- Output : `{ es_correcta, diagnostico, lacune_detectee, pregunta_remediation? }`.
- Modèle : Haiku 4.5. Prompt en français. JSON strict avec extraction regex (pattern existant).

**Côté prof** (`/profesor/tarea/[tareaId]`) :
- Visualisation du parcours réel par élève : questions d'origine + remédiations + résultats.
- Lecture style timeline : *"Sofia a buté sur Q2, reçu 2 remédiations sur dénominateur commun, réussi la 2e, repris à Q3."*

**Schéma Supabase.** Ajouter `parcours` (jsonb) à `resultados`, ou nouvelle table `intentos` (resultado_id, pregunta_index, pregunta_original, respuesta_elev, diagnostico, remediacion, timestamp_at). Décide selon volume attendu (probablement table dédiée).

**Critère d'acceptation.** Demo de bout en bout : un prof crée un devoir, un élève se trompe volontairement à une question, voit la remédiation, la réussit, reprend, finit. Le prof voit le parcours complet dans le dashboard. Latence < 2s par diagnostic.

---

## Priorité 2 — Console admin école [Semaines 3-4]

**Objectif.** Permettre à une directrice / coordinatrice de voir l'usage et la performance Kleo sur toute son école — c'est ce qu'elle veut voir avant de signer un contrat.

**Schéma.** Nouvelle entité `escuelas`. Nouveau rôle `director` (extension de `profesores` ou table dédiée selon propreté). Liaison `escuelas` → `profesores` → `clases` → `alumnos`.

**Routes** : `/director` avec :
- Dashboard école : nb profs actifs, nb élèves, nb devoirs créés, nota moyenne par classe, temps total passé.
- Drill-down par classe : profs, devoirs, résultats agrégés.
- Drill-down par élève : profil de lacunes consolidé.
- Export PDF rapport mensuel école (partage CA / parents).

**Critère d'acceptation.** Cofondateur connecte une directrice fictive en demo, elle voit en 3 clics le rapport d'usage école, exporte un PDF présentable. Pas de placeholders, pas de chiffres bidons — données réelles depuis Supabase.

---

## Priorité 3 — Pipeline génération multi-passes [Semaines 4-5]

**Objectif.** Qualité contenu institutionnellement défendable. Permet aussi de pré-générer un seed library de qualité.

**Refactor de `/api/ia` mode `'generar'` en pipeline 4 passes** :

1. **Génération** (Sonnet 4.6) — comportement actuel.
2. **Validation factuelle** (Haiku 4.5) — *"L'exercice est-il factuellement correct ? Les réponses sont-elles justes ? Score 0-10."*
3. **Critique méthodologique** (Haiku 4.5) — *"L'exercice respecte-t-il la méthodologie [Feynman / Memorización / Resolución / Práctica] ? Score 0-10."*
4. **Refinement** (Sonnet 4.6, conditionnel) — si scores < 7, régénération avec retours en contexte.

**Optimisations à mettre en place dès le départ** :
- **Prompt caching** sur les parties contextuelles (aprendizaje, méthodologie, règles de format) → -90% sur les passes 2-3 (cache reads à 0.1× input).
- **Batch API** pour la pré-génération de bibliothèque (50% de remise, async 24h).
- Fallback à 1 passe si timeout > 30s (génération à la demande pendant un cours).

**Critère d'acceptation.** Eval set de 100 exercices "gold standard" (à constituer avec 2 profs mexicains payés). Pipeline doit scorer >7/10 moyenne sur passes 2-3 sur cet eval. Si non atteint, itérer prompts. Eval set re-roulé à chaque modification de prompt majeure (CI pédagogique).

---

## Priorité 4 — Bibliothèque consultable par aprendizaje [Semaines 5-6]

**Objectif.** Répondre à la vraie demande des profs (qui n'aiment PAS la génération à la demande car ils ont déjà ChatGPT) : trouver du contenu prêt à l'emploi, organisé par programme officiel.

**Route `/profesor/biblioteca`** :
- Search par PDA (NEM) ou thème.
- Résultats en cards : type (exercice, fiche, problème, quiz), niveau, méthodologie, preview.
- Actions par card : *"Usar tal cual"* (ajouter à un devoir), *"Adaptar a mi clase"* (déclenche pipeline avec contexte classe — lacunes de ses élèves, niveau moyen), *"Ver vista previa"*.
- Favoris.

**Pré-génération en batch.** Script `scripts/seed-library.ts` :
- Input : liste de PDA visés par les écoles signées (ou design partner).
- Génère 5-10 ressources par PDA × méthodologie via pipeline 4-passes en mode Batch API.
- Validation humaine spot-check (10% du batch par les profs payés).

**Critère d'acceptation.** Un prof signé tape *"fracciones equivalentes 5° primaria"* le matin de son cours et trouve 20 ressources prêtes en 5 secondes. ≥ 80% utilisables sans retouche.

---

## Priorité 5 — Conformité institutionnelle [Semaines 6-8]

Checklist achat école. Sans ces éléments, le contrat ne se signe pas.

- Page `/legal/lfpdppp` : aviso de privacidad conforme loi mexicaine (LFPDPPP).
- Facturation CFDI : intégration Facturama ou équivalent pour factures fiscales mexicaines.
- Doc formation prof : 5-10 pages PDF + 3-5 vidéos courtes Loom.
- Support : email + canal Slack/WhatsApp interne réactif.
- Backup : exports Supabase quotidiens, rétention 30j.

---

## Anti-objectifs (NE PAS construire avant traction)

- Pré-génération exhaustive du SEP/NEM K-12. Génération réactive sur les niveaux/matières des écoles signées uniquement.
- Production de vidéos pédagogiques propriétaires. Si demandé : curation YouTube + quiz IA par-dessus.
- App mobile native. Web responsive suffit.
- Multi-tenancy complexe avant la 3e école payante.
- Marketplace prof-prof. Gamification poussée. Chat parents.
- Réécriture du store Zustand. Il fait le job.

---

## Conventions à respecter

- Architecture multi-fichiers : pages, components, store, hooks, utils, mock séparés. Pas de single-file.
- Prompts IA **en français** (pas en espagnol même si l'app cible le Mexique).
- API key Anthropic uniquement côté serveur (Route Handlers Next.js). Jamais en frontend.
- `max_tokens` calibré par tâche, pas une valeur globale.
- Parsing JSON sécurisé avec extraction regex (pattern actuel `/\{[\s\S]*\}/`).
- À chaque modification de prompt majeure : ré-évaluer sur l'eval set (ne pas merger sans).
- Biome lint avant commit.

---

## Première tâche

1. Lire `CLAUDE.md`, `kleo-context.md`, `kleo-strategy.md` pour aligner contexte.
2. Implémenter **Priorité 1 — Boucle de remédiation intra-devoir**.
3. Avant de coder, produire une revue d'architecture courte (5-10 lignes) : fichiers touchés, risques, dépendances Supabase, impact sur les types existants.
4. Coder en respectant les conventions ci-dessus. Pas de demo-quality. Pas de raccourcis sur la sécurité ou la séparation frontend/serveur.
5. À la fin : un demo reproductible (un compte prof + un compte élève seedés, un devoir d'exemple où l'élève peut se tromper et déclencher la remédiation).
