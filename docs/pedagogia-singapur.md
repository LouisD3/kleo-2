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

### Composants cibles

| `tipo_concreto` | Composant React | Concept mathematique | Tech | Phase |
|---|---|---|---|---|
| `dulces_agrupables` | `DulcesAgrupables` | Razones, proportions | SVG + dnd-kit | 1 |
| `chocolate_secable` | `ChocolateSecable` | Fractions | SVG + dnd-kit | 2 |
| `bloques_base10` | `BloquesBase10` | Systeme decimal, operations | R3F (3D) + fallback SVG | 2 |
| `balanza` | `Balanza` | Equations lineaires | SVG + Framer Motion | 2 |
| `solidos_3d` | `Solidos3D` | Geometrie | R3F (3D) + fallback SVG | 3 |
| `dados_monedas` | `DadosMonedas` | Probabilites | SVG + animation | 3 |
| `histograma_construible` | `HistogramaConstruible` | Statistique | SVG + dnd-kit | 3 |

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

Guide pour choisir le `tipo_concreto` en fonction du theme mathematique.

| Secuencias | Theme | Manipulable suggere |
|---|---|---|
| 1 | Fractions et decimaux | `chocolate_secable` |
| 2-4 | Entiers negatifs, ordre | `bloques_base10` (adapte pour negatifs) |
| 5-8 | Operations, proprietes | `bloques_base10` |
| 9 | Suites arithmetiques | `dulces_agrupables` (patterns) |
| 10-11 | Algebre, perimetres | `balanza` |
| 12 | Equations lineaires | `balanza` |
| 13 | Pourcentages | `chocolate_secable` |
| 14-15 | Proportions, razones | `dulces_agrupables` |
| 16-17 | Droites, angles | `solidos_3d` (2D mode) |
| 18-21 | Constructions geometriques | `solidos_3d` |
| 22-24 | Cercle, circonference | `solidos_3d` |
| 25-28 | Distances, perimetre, aire | `solidos_3d` (2D mode) |
| 29-31 | Statistique | `histograma_construible` |
| 32-33 | Probabilites | `dados_monedas` |
| 34-35 | Logique | `balanza` (adapte) |
| 36 | Nombres binaires | `bloques_base10` (adapte base 2) |

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

## 10. TODO post-MVP

- [ ] Regenerer les Abstracto de toutes les tareas en style Singapour-aware
      (questions qui font reference au modele en barres vu en Pictorico)
- [ ] Construction interactive du modele en barres par l'eleve (Pictorico actif)
- [ ] Manipulables 3D pour geometrie (solidos_3d, phase 3)
- [ ] Statistique : histogramme construible
- [ ] Probabilites : des/monnaies/urnes interactifs
- [ ] VisorContenido pour le prof (orientacion, libro, diapositivas, video_script)
- [ ] Export PDF des tareas CPA
- [x] ~~Heatmap CPA dans le dashboard prof~~ (MVP Phase 8, voir CLAUDE.md)
