# Pedagogia Singapur — Referencia tecnica

Documento de referencia pour le developpement de Kleo. Decrit l'approche CPA,
les specs JSON des manipulables et modeles en barres, les criteres d'auto-check,
et les directives pour le prompt IA Singapur.

## 1. L'approche CPA (Concreto-Pictorico-Abstracto)

### Principes fondamentaux

La methode Singapour repose sur la progression **CPA** :

1. **Concreto** — L'eleve manipule des objets (physiques ou numeriques) pour
   construire une intuition du concept. Dans Kleo, ce sont des composants
   interactifs (drag & drop SVG ou 3D).

2. **Pictorico** — L'eleve lit un modele visuel (modele en barres) qui fait
   le pont entre le concret et l'abstrait. Il repond a 1-2 questions courtes
   sur le modele.

3. **Abstracto** — L'eleve travaille avec des nombres et symboles
   mathematiques. Questions classiques (opcion multiple, calculo, abierta).

### Mastery gate

L'eleve **doit** valider l'etape N avant d'acceder a N+1. Pas de saut.
- Essais illimites sur chaque etape
- Indice optionnel apres N echecs (defaut : 3, configurable dans `intentos_para_pista`)
- Override prof : bouton "Marcar como completado" pour debloquer un eleve

### Principes pedagogiques cles

- **Mastery** : on ne passe a la suite que quand le concept est acquis
- **Number bonds** : decomposition des nombres en parties (3 + 7 = 10)
- **Variation theorique** : varier la representation d'un meme concept
- **Resolution de problemes au centre** : chaque tarea part d'un probleme
  contextualise, pas d'un exercice abstrait

---

## 2. Bibliotheque de manipulables (Bloque Concreto)

### Architecture

Le JSON d'une tarea specifie le type de manipulable via `tipo_concreto`.
Un dispatcher React (`ManipulableDispatcher.tsx`) selectionne le composant.

### Catalogue complet des manipulables

Chaque manipulable correspond a une activite concrete reelle de la methode Singapour.

| `tipo_concreto` | Objet reel | Concept | Interaction | Statut |
|---|---|---|---|---|
| `chocolate_secable` | Tablette de chocolat a casser | Fractions (partie d'un tout) | Cliquer des morceaux | OK |
| `tiras_fracciones` | Bandes de papier pliees | Fractions equivalentes | Selectionner bandes equivalentes | OK |
| `recta_numerica` | Droite numerique au sol | Decimaux, ordre, fractions | Glisser un curseur | OK |
| `bloques_base10` | Cubes, barres, plaques | Systeme decimal, operations | Stepper +/- | OK |
| `fichas_positivas_negativas` | Jetons bicolores (+/-) | Entiers, operations avec signes | Annuler des paires | OK |
| `patron_figuras` | Allumettes/cubes en patron | Sucesiones aritmeticas | Placer des pieces | OK |
| `balanza` | Balance a deux plateaux | Equations simples | Input x, balance animee | OK |
| `azulejos_algebra` | Tuiles d'algebre (barres x + carres) | Equations, expressions | Manipuler tuiles, entrer x | OK |
| `cuadricula_100` | Grille de 100 cases | Porcentajes | Colorier des cases | OK |
| `dulces_agrupables` | Bonbons/objets a repartir | Razones, reparto | Drag & drop en groupes | OK |
| `geoplano` | Clous + elastiques | Geometrie, perimetres, aires | Cliquer des clous, tracer | OK |
| `dados_ruleta` | Des, roulette, pieces | Probabilites | Lancer, observer, calculer | OK |
| `histograma_construible` | Cartes a trier en colonnes | Statistique | Empiler des barres | Future |
| `solidos_3d` | Solides en plastique | Geometrie 3D | Rotation 3D | Future |

### Spec JSON : `DulcesAgrupables` (Phase 1)

```json
{
  "tipo_concreto": "dulces_agrupables",
  "cantidad": 12,
  "grupos_objetivo": 3,
  "soluciones_validas": [
    { "grupos": 3, "por_grupo": 4 }
  ],
  "pregunta": "Agrupa los dulces para que cada nino reciba la misma cantidad.",
  "pista": "Intenta repartir los dulces uno por uno entre los 3 ninos."
}
```

**Rendu** : 12 dulces (SVG circles/icons) draggables dans des zones de depot.
L'eleve cree des groupes en glissant les dulces.

**Auto-check** : le composant valide quand la configuration correspond a une
des `soluciones_validas`. Validation = chaque groupe a exactement `por_grupo`
elements et il y a exactement `grupos` groupes.

### Spec JSON : `ChocolateSecable`

```json
{
  "tipo_concreto": "chocolate_secable",
  "filas": 2,
  "columnas": 4,
  "fraccion_objetivo": "3/8",
  "soluciones_validas": [
    { "piezas_seleccionadas": 3 }
  ],
  "pregunta": "Selecciona la fraccion 3/8 de la tableta.",
  "pista": "La tableta tiene 8 piezas en total. Cuantas debes seleccionar?"
}
```

**Rendu** : grille de rectangles cliquables. L'eleve clique pour
selectionner/deselectionner des morceaux.

**Auto-check** : nombre de pieces selectionnees == `piezas_seleccionadas`.

### Spec JSON : `BloquesBase10`

```json
{
  "tipo_concreto": "bloques_base10",
  "numero_objetivo": 235,
  "unidades_disponibles": { "unidades": 20, "barras": 10, "cuadrados": 5 },
  "soluciones_validas": [
    { "unidades": 5, "barras": 3, "cuadrados": 2 }
  ],
  "pregunta": "Representa el numero 235 con los bloques.",
  "pista": "Recuerda: cada cuadrado vale 100, cada barra vale 10."
}
```

**Rendu 3D** (React Three Fiber) : cubes unitaires, barres de 10, carres de 100.
L'eleve drag & drop pour construire le nombre.

**Fallback SVG** : meme logique en vue isometrique SVG pour telephones sans WebGL.

**Auto-check** : `unidades * 1 + barras * 10 + cuadrados * 100 == numero_objetivo`
ET la decomposition correspond a une des solutions valides.

### Spec JSON : `Balanza`

```json
{
  "tipo_concreto": "balanza",
  "lado_izquierdo": [
    { "tipo": "x", "valor": 1 },
    { "tipo": "constante", "valor": 3 }
  ],
  "lado_derecho": [
    { "tipo": "constante", "valor": 7 }
  ],
  "solucion": 4,
  "pregunta": "Encuentra el valor de x que equilibra la balanza.",
  "pista": "Que debes quitar de chaque cote pour isoler x?"
}
```

**Rendu** : balance SVG animee (Framer Motion). L'eleve ajoute/retire des poids.

**Auto-check** : la valeur entree/manipulee == `solucion`.

### Criteres d'auto-check generaux

1. **Solutions multiples** : le champ `soluciones_validas` est un tableau.
   Toute configuration qui y figure est acceptee.
2. **Scoring par essais** : note Concreto = `max(10 - (intentos - 1) * 2, 2)`.
   Premier essai = 10, deuxieme = 8, troisieme = 6, ..., plancher a 2.
3. **Transition** : quand l'auto-check valide, animation de felicitation
   (confetti/flash) + auto-passage au Pictorico apres 1.5s.
4. **Indice** : apres `intentos_para_pista` echecs, afficher `pista` dans
   une bulle. L'utilisation de la pista est enregistree dans l'intento.

---

## 3. Modeles en barres (Bloque Pictorico)

### Spec JSON : `ModeloBarrasSpec`

```json
{
  "barras": [
    { "label": "Ana", "valor": 4, "color": "amarillo", "subdivisiones": 4 },
    { "label": "Luis", "valor": 8, "color": "azul", "subdivisiones": 4 }
  ],
  "total": { "valor": 12, "visible": true },
  "incognita": { "posicion": "total", "label": "?" },
  "orientacion": "horizontal"
}
```

### Rendu SVG

- Barres horizontales empilees verticalement (ou vice versa selon `orientacion`)
- Chaque barre proportionnelle a sa `valor`
- `subdivisiones` trace des lignes verticales dans la barre
- `label` affiche au debut de la barre
- `total` optionnel, affiche comme accolade ou ligne sous les barres
- `incognita` marque avec "?" l'element a trouver
- Couleurs : `amarillo` (#FFD700), `azul` (#3B82F6), `rojo` (#EF4444),
  `verde` (#10B981), `morado` (#8B5CF6)
- Lecture seule — l'eleve ne manipule pas le modele (MVP)

### Questions Pictorico

1-2 questions courtes qui testent la lecture du modele :
- "Que vaut chaque carre du modele ?" → `calculo`
- "Combien Ana a-t-elle ?" → `opcion_multiple`
- "Le total est-il visible dans le modele ?" → `verdadero_falso`

Correction : meme logique que l'Abstracto (comparaison directe ou appel IA
pour les questions ouvertes).

---

## 4. Exemple complet : tarea "Razones y proporciones" (secuencia 14)

```json
{
  "secuencia_ref": 14,
  "concreto": {
    "manipulable": {
      "tipo_concreto": "dulces_agrupables",
      "cantidad": 12,
      "grupos_objetivo": 3,
      "soluciones_validas": [
        { "grupos": 3, "por_grupo": 4 }
      ],
      "pregunta": "En una fiesta hay 12 dulces y 3 ninos. Agrupa los dulces para que cada nino reciba la misma cantidad.",
      "pista": "Intenta repartir los dulces uno por uno entre los 3 ninos."
    },
    "intentos_para_pista": 3
  },
  "pictorico": {
    "modelo_barras": {
      "barras": [
        { "label": "Nino 1", "valor": 4, "color": "amarillo", "subdivisiones": 4 },
        { "label": "Nino 2", "valor": 4, "color": "azul", "subdivisiones": 4 },
        { "label": "Nino 3", "valor": 4, "color": "verde", "subdivisiones": 4 }
      ],
      "total": { "valor": 12, "visible": true },
      "orientacion": "horizontal"
    },
    "preguntas": [
      {
        "pregunta": "Segun el modelo, cual es la razon de dulces por nino?",
        "tipo": "opcion_multiple",
        "opciones": ["A) 3:12", "B) 12:3", "C) 4:1", "D) 1:4"],
        "respuesta": "C"
      },
      {
        "pregunta": "Si hubiera 5 ninos en vez de 3, cuantos dulces necesitarias en total para mantener la misma razon?",
        "tipo": "calculo",
        "respuesta": "20, porque la razon es 4 dulces por nino, entonces 4 x 5 = 20."
      }
    ]
  },
  "abstracto": {
    "preguntas": [
      {
        "tipo": "opcion_multiple",
        "pregunta": "En una receta se usan 2 tazas de harina por cada 3 huevos. Si se usan 6 tazas de harina, cuantos huevos se necesitan?",
        "opciones": ["A) 6", "B) 9", "C) 12", "D) 4"],
        "respuesta": "B"
      },
      {
        "tipo": "calculo",
        "pregunta": "Un coche recorre 150 km en 2 horas. Es proporcional la relacion distancia-tiempo? Si es asi, calcula la constante de proporcionalidad y cuantos km recorreria en 5 horas.",
        "respuesta": "Si es proporcional. k = 150/2 = 75 km/h. En 5 horas: 75 x 5 = 375 km."
      },
      {
        "tipo": "abierta",
        "pregunta": "Explica con tus propias palabras la diferencia entre una relacion proporcional y una que no lo es. Da un ejemplo de cada una.",
        "respuesta": "Una relacion proporcional es cuando al dividir una cantidad entre la otra siempre se obtiene el mismo valor (constante). Ejemplo proporcional: precio y cantidad de manzanas a $5 cada una (5, 10, 15...). Ejemplo no proporcional: edad y estatura de una persona."
      }
    ]
  }
}
```

---

## 5. Directives pour le prompt IA Singapur

### Prompt de generation CPA (type: 'generar')

Le prompt systeme doit forcer la structure 3 blocs :

```
Eres un experto en el metodo Singapur para matematicas de secundaria en Mexico.
Genera una tarea con la estructura CPA (Concreto-Pictorico-Abstracto).

REGLAS ESTRICTAS:
1. Concreto: especifica un manipulable interactivo. Usa el formato JSON con
   tipo_concreto, cantidad, grupos_objetivo, soluciones_validas, pregunta, pista.
   El manipulable debe ser contextualizado (dulces, frutas, objetos cotidianos).
   SIEMPRE incluye multiples soluciones validas si aplica.

2. Pictorico: crea un modelo en barras SVG que represente visualmente el
   problema del Concreto. Incluye 1-2 preguntas que obliguen al alumno a
   LEER e INTERPRETAR el modelo. Las preguntas deben hacer el puente entre
   lo concreto y lo abstracto.

3. Abstracto: 3-5 preguntas matematicas clasicas. Al menos 1 de tipo calculo,
   1 de tipo opcion_multiple, y 1 de tipo abierta. Las preguntas deben
   hacer referencia al concepto trabajado en Concreto/Pictorico.

FORMATO: JSON valide unicamente, sans texte additionnel.
IDIOMA: Espanol mexicano pour tout le contenu.
PDA: {pda_text}
DIFICULTAD: {dificultad}
```

### Prompt de correction CPA (type: 'corregir')

```
Corrige las respuestas del alumno para cada bloque CPA.

BLOQUE CONCRETO: ya fue evaluado automaticamente (auto-check). Score: {score_concreto}/10.

BLOQUE PICTORICO: evalua las {n} respuestas sobre el modelo en barras.
- Preguntas objetivas: comparacion directe.
- Preguntas ouvertes: evaluation semantique.

BLOQUE ABSTRACTO: evalua las {n} respuestas matematicas.
- opcion_multiple / verdadero_falso / espacios: comparaison directe.
- calculo: verifica procedimiento ET resultado.
- abierta: evaluation semantique, exige precision mathematique.

SCORING:
- Pictorico: note sur 10 proportionnelle aux reponses correctes.
- Abstracto: note sur 10 proportionnelle aux reponses correctes.
- Global: moyenne ponderee (Concreto 20%, Pictorico 30%, Abstracto 50%).

FORMATO RESPUESTA:
{
  "pictorico": {
    "calificacion": number,
    "retroalimentacion": [{ "indice_pregunta": number, "correcta": boolean, "comentario": string }]
  },
  "abstracto": {
    "calificacion": number,
    "retroalimentacion": [{ "indice_pregunta": number, "correcta": boolean, "comentario": string }],
    "areas_de_mejora": string[]
  },
  "global": number
}
```

---

## 6. Scoring detaille

### Par etape

| Etape | Methode | Calcul |
|---|---|---|
| Concreto | Auto-check cote client | `max(10 - (intentos - 1) * 2, 2)` |
| Pictorico | Comparaison directe + IA pour ouvertes | `(correctes / total) * 10` |
| Abstracto | Comparaison directe + IA pour ouvertes/calculo | `(correctes / total) * 10` |

### Note globale

`global = concreto * 0.20 + pictorico * 0.30 + abstracto * 0.50`

### Tentatives multiples

- L'eleve peut refaire la tarea autant de fois qu'il veut
- Chaque tentative est stockee dans la table `intentos` (voir schema DB)
- `resultados.calificacion` = meilleure note globale de toutes les tentatives
- `resultados.scores_cpa` = scores de la tentative avec la meilleure note globale

---

## 7. Mapping secuencias NEM -> manipulables

Guide pour choisir le `tipo_concreto` en fonction du theme.
Base sur les manipulables reels de la methode Singapour.

| Sec | Theme | Manipulable principal | Alternative | Objet reel equivalent |
|---|---|---|---|---|
| 1 | Fractions et decimaux | `chocolate_secable` | `tiras_fracciones`, `recta_numerica` | Tablette, bandes papier, droite au sol |
| 2-4 | Entiers, ordre | `fichas_positivas_negativas` | `recta_numerica` | Jetons bicolores, droite numerique |
| 5-6 | Operaciones con signo | `fichas_positivas_negativas` | `bloques_base10` | Jetons, cubes base 10 |
| 7-8 | Proprietes, jerarquia | `bloques_base10` | | Cubes, barres, plaques |
| 9 | Sucesiones | `patron_figuras` | | Allumettes, cubes colores |
| 10-11 | Algebre, perimetres | `azulejos_algebra` | `geoplano` | Tuiles d'algebre, geoplano |
| 12 | Ecuaciones lineales | `azulejos_algebra` | `balanza` | Tuiles d'algebre, balance |
| 13 | Porcentajes | `cuadricula_100` | | Grille de 100 cases |
| 14-15 | Razones, proporcionalidad | `dulces_agrupables` | | Objets a repartir |
| 16-17 | Rectas, angulos | `geoplano` | | Geoplano, regle, rapporteur |
| 18-21 | Construcciones geometricas | `geoplano` | | Geoplano, compas, regle |
| 22-24 | Circunferencia | `geoplano` | | Geoplano, compas |
| 25-28 | Distancia, perimetro, area | `geoplano` | | Geoplano, grille |
| 29-31 | Estadistica | `histograma_construible` | | Cartes a trier (future) |
| 32-33 | Probabilidades | `dados_ruleta` | | Des, roulette, pieces |
| 34-35 | Logica | `balanza` | | Balance (adapte) |
| 36 | Numeros binarios | `bloques_base10` | | Cubes base 10 (adapte) |

---

## 8. Persistance de la progression eleve

La progression CPA est persistee en `localStorage` sous la cle
`kleo_progreso_{tarea_id}_{alumno_id}`.

Structure : voir `ProgresoCPA` dans `src/types/tarea-cpa.ts`.

Restauration au chargement : si une progression existe, le stepper CPA reprend
a l'etape et l'etat sauvegardes. L'etat du manipulable (positions des objets,
groupes en cours) est inclus dans `concreto_estado.estado_manipulable`.

Nettoyage : la progression est supprimee quand la tentative est soumise
(l'intento est stocke en DB).

---

## 9. 3D et fallback

### React Three Fiber (R3F)

Utilise pour `bloques_base10` et `solidos_3d`. Lazy-loaded via `React.lazy()`
+ `dynamic(() => import(...), { ssr: false })`.

### Feature detection WebGL

Au mount du composant 3D :
```ts
function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl') || canvas.getContext('webgl2'))
  } catch {
    return false
  }
}
```

Si `supportsWebGL()` retourne `false`, le dispatcher charge le composant
SVG isometrique a la place (meme logique, rendu 2D).

---

## 10. Guide de creation de tareas de reference

### Principes fondamentaux

1. **Un concept par tarea** — Chaque tarea CPA cible un seul sous-concept,
   formule dans le champ `concepto_clave`. Les 3 blocs (C, P, A) travaillent
   exclusivement ce sous-concept. L'Abstracto ne doit JAMAIS introduire une
   notion absente du Concreto et du Pictorico.

2. **Plusieurs tareas par secuencia** — Un PDA NEM couvre souvent plusieurs
   sous-concepts. On cree une tarea distincte pour chacun. Exemple : la
   secuencia 1 (fracciones y decimales) genere 3 tareas : representation,
   equivalences, conversion.

3. **Fil conceptuel unique C->P->A** — Le Concreto pose le probleme avec des
   objets. Le Pictorico le represente visuellement avec le modele en barres.
   L'Abstracto le formalise avec des nombres. Les 3 etapes utilisent le MEME
   scenario ou un scenario tres proche.

4. **Progression de difficulte dans l'Abstracto** :
   - Q1 : FACILE — opcion_multiple, application directe du concept, meme
     contexte que C/P
   - Q2 : MOYEN — calculo, 1-2 etapes, contexte nouveau mais meme concept
   - Q3 : DIFFICILE — abierta, raisonnement/explication, comprehension profonde

5. **Pictorico = pont** — Les questions Pictorico doivent faire le lien entre
   le manipulable et le formel. Q1 : lecture directe du modele. Q2 : question
   "et si..." qui prepare l'Abstracto.

6. **Langage** — Espanol mexicano, vocabulaire adapte a 1o Secundaria (12-13 ans).
   Contextes de la vie quotidienne (dulces, chocolate, tienda, amigos).

### Mapping secuencias -> sous-concepts -> tareas

Chaque ligne = une tarea de reference distincte.

| ID | Sec | Sous-concept (concepto_clave) | Manipulable | Spec cle |
|---|---|---|---|---|
| 1A | 1 | Representar una fraccion como parte de un todo | `chocolate_secable` | 2x4, seleccionar 3/8 |
| 1B | 1 | Encontrar fracciones equivalentes | `chocolate_secable` | 2x8 (16 piezas), seleccionar 6/16 = 3/8 |
| 1C | 1 | Convertir una fraccion a decimal dividiendo | `chocolate_secable` | 2x5 (10 piezas), seleccionar 3/10 = 0.3 |
| 5A | 5 | Descomponer un numero en centenas, decenas y unidades | `bloques_base10` | representar 235 |
| 5B | 5 | Sumar dos numeros con reagrupacion | `bloques_base10` | construir 148 + 87 = 235 |
| 5C | 5 | Restar como operacion inversa de la suma | `bloques_base10` | de 235 quitar 148 = 87 |
| 9A | 9 | Identificar el patron en una sucesion aritmetica | `dulces_agrupables` | 10 dulces, patron 2+2+3+3 |
| 9B | 9 | Predecir terminos de una sucesion aritmetica | `dulces_agrupables` | 12 dulces, grupos crecientes 1,2,3,... |
| 12A | 12 | Resolver ecuaciones de la forma x + a = b | `balanza` | x + 3 = 7 |
| 12B | 12 | Resolver ecuaciones de la forma ax = b | `balanza` | 2x = 8 |
| 12C | 12 | Resolver ecuaciones de la forma ax + b = c | `balanza` | 2x + 1 = 7 |
| 13A | 13 | Encontrar el porcentaje de una cantidad | `chocolate_secable` | 2x5, seleccionar 30% de 10 |
| 13B | 13 | Calcular un descuento con porcentajes | `chocolate_secable` | 2x5, quitar 20% de 10 |
| 14A | 14 | Repartir en partes iguales (razon como reparto) | `dulces_agrupables` | 12 dulces entre 3 ninos |
| 14B | 14 | Comparar dos razones diferentes | `dulces_agrupables` | 12 dulces, comparar 3 vs 4 grupos |
| 15A | 15 | Encontrar la constante de proporcionalidad | `dulces_agrupables` | 15 galletas entre 5 amigos |
| 15B | 15 | Usar la constante para predecir | `dulces_agrupables` | 15 galletas, predecir para 8 amigos |

### Checklist avant de valider une tarea

- [ ] Le `concepto_clave` est formule en une phrase
- [ ] Le Concreto manipule des objets en lien direct avec le concept
- [ ] Le Pictorico Q1 est une lecture directe du modele en barres
- [ ] Le Pictorico Q2 fait le pont vers l'Abstracto (meme contexte)
- [ ] L'Abstracto Q1 est facile, meme contexte, opcion_multiple
- [ ] L'Abstracto Q2 est moyen, nouveau contexte, calculo 1-2 etapes
- [ ] L'Abstracto Q3 est difficile, abierta, explication du concept
- [ ] AUCUNE question n'introduit un concept absent du Concreto
- [ ] Le langage est adapte a 1o Secundaria, espanol mexicano

---

## 11. TODO post-MVP

- [ ] Regenerer les Abstracto de toutes les tareas en style Singapour-aware
      (questions qui font reference au modele en barres vu en Pictorico)
- [ ] Construction interactive du modele en barres par l'eleve (Pictorico actif)
- [ ] Manipulables 3D pour geometrie (solidos_3d, phase 3)
- [ ] Statistique : histogramme construible
- [ ] Probabilites : des/monnaies/urnes interactifs
- [ ] VisorContenido pour le prof (orientacion, libro, diapositivas, video_script)
- [ ] Export PDF des tareas CPA
- [x] ~~Heatmap CPA dans le dashboard prof~~ (MVP Phase 8, voir CLAUDE.md)
