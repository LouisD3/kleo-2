import { readFileSync, writeFileSync } from 'fs';

const filePath = '/Users/louisdecavel/Desktop/DEV/kleo-2/src/content/biblioteca/matematicas-1.json';
const data = JSON.parse(readFileSync(filePath, 'utf8'));

const replacements = {
  13: {
    "contenidos_especificos": [
      "Concepto de porcentaje como razon con denominador 100",
      "Conversion entre fracciones, decimales y porcentajes",
      "Calculo de porcentajes: descuentos, aumentos (IVA), proporciones",
      "Problemas cotidianos con porcentajes en contexto mexicano"
    ],
    "actividad_inicio": [
      "Mostrar recortes de folletos comerciales reales con descuentos (Buen Fin, tiendas de autoservicio).",
      "Preguntar: \"Si un producto cuesta $500 y tiene 30% de descuento, ¿cuanto pagarias?\" — registrar respuestas en el pizarron.",
      "Guiar la discusion hacia la idea de que porcentaje significa \"por cada 100\".",
      "Pedir que mencionen otros contextos donde han visto porcentajes (propinas, IVA, calificaciones, estadisticas deportivas).",
      "Presentar el objetivo de la sesion: dominar el calculo de porcentajes en situaciones de la vida diaria."
    ],
    "desarrollo": [
      {
        "titulo": "Conversiones entre porcentaje, decimal y fraccion",
        "diapositiva": "1-2",
        "libro": "Seccion '¿Que es un porcentaje?' y 'Conversiones clave'",
        "video": null,
        "descripcion": "Explicar formalmente que el porcentaje es una fraccion con denominador 100. Demostrar las tres conversiones: porcentaje a decimal (dividir entre 100), porcentaje a fraccion (simplificar sobre 100) y viceversa. Los alumnos practican con 5 conversiones rapidas en su cuaderno.",
        "tip": "Use codigo de colores en el pizarron: verde para porcentaje, azul para decimal, rojo para fraccion. Esto ayuda a alumnos visuales a distinguir las tres formas."
      },
      {
        "titulo": "Tres tipos de problemas con porcentajes",
        "diapositiva": "3-5",
        "libro": "Seccion '¿Como calcular el porcentaje de una cantidad?' y ejemplos 1-3",
        "video": "min 1:30-4:00",
        "descripcion": "Resolver en el pizarron tres problemas de complejidad creciente: (1) calcular el porcentaje de una cantidad (descuento del 20%), (2) encontrar que porcentaje representa una parte respecto a un total (12 de 40 alumnos), (3) encontrar el valor original conociendo el porcentaje y el resultado (el 15% es $45). Enfatizar la formula: Resultado = Cantidad x (Porcentaje / 100).",
        "tip": null
      },
      {
        "titulo": "Practica en parejas con contextos mexicanos",
        "diapositiva": "6-8",
        "libro": "Problemas del libro: descuento, IVA, proporcion",
        "video": null,
        "descripcion": "En parejas, los alumnos resuelven dos problemas con contextos mexicanos: (a) precio con IVA del 16% y (b) descuento del Buen Fin. Cada pareja presenta su procedimiento al grupo. Reforzar el atajo: para descuento del 30%, multiplicar por 0.70 directamente.",
        "tip": "Para alumnos con rezago, proporcione cuadriculas de 10x10 donde coloreen el porcentaje pedido como apoyo visual concreto. Para avanzados, proponga porcentajes encadenados (descuento + IVA)."
      }
    ],
    "cierre_individual": {
      "reflexiona": "¿Por que decimos que el porcentaje es una de las matematicas mas utiles en la vida diaria? Piensa en al menos tres situaciones donde lo usas sin darte cuenta.",
      "profundiza": [
        {
          "pregunta": "Si un producto sube 50% de precio y luego baja 50%, ¿regresa a su precio original? Justifica con un ejemplo numerico.",
          "respuesta_modelo": "R.M. No regresa al precio original. Si algo costaba $100, sube 50% a $150, y luego baja 50% queda en $75. Esto sucede porque el 50% de aumento se calcula sobre $100, pero el 50% de descuento se calcula sobre $150, que es una cantidad mayor."
        },
        {
          "pregunta": "En una tienda, un articulo tiene 25% de descuento y ademas te dan un 10% adicional sobre el precio ya rebajado. ¿Es lo mismo que un 35% de descuento directo?",
          "respuesta_modelo": "R.M. No es lo mismo. Con un producto de $100: descuento 25% = $75, luego 10% adicional = $75 x 0.90 = $67.50. Con descuento directo del 35%: $100 x 0.65 = $65. El descuento encadenado resulta menor que el descuento directo."
        }
      ]
    },
    "cierre_grupal": [
      "Socializar las respuestas de las parejas; un voluntario explica su procedimiento completo en el pizarron.",
      "Construir entre todos un cuadro con los tres tipos de problemas: calcular parte, calcular porcentaje, calcular total.",
      "Discutir: ¿por que no es lo mismo subir y luego bajar el mismo porcentaje?",
      "Reforzar que 'de' en un problema de porcentajes significa multiplicar.",
      "Asignar tarea: encontrar 3 ejemplos de porcentajes en su entorno (recibos, etiquetas, noticias) y calcular los valores correspondientes."
    ],
    "preguntas_comprension": [
      "¿Que significa la expresion '25% de 480'? ¿Que operacion debes hacer?",
      "Si un pantalon cuesta $600 con 30% de descuento, ¿cual es el precio final y como lo calculas de dos formas distintas?",
      "¿Como conviertes 0.16 a porcentaje y a fraccion simplificada?",
      "En tu salon hay 40 alumnos y 14 sacaron 10. ¿Que porcentaje representa?",
      "¿Por que dividir entre 100 convierte un porcentaje a decimal? Explicalo con tus palabras."
    ]
  },
  14: {
    "contenidos_especificos": [
      "Concepto de relacion proporcional vs. no proporcional",
      "Constante de proporcionalidad k y su interpretacion en contexto",
      "Representacion tabular y grafica de relaciones proporcionales",
      "Verificacion de proporcionalidad mediante cocientes y/x"
    ],
    "actividad_inicio": [
      "Plantear dos situaciones en el pizarron: (1) 'Cada lapiz cuesta $5, ¿cuanto cuestan 2, 3, 4, 5?' y (2) 'Un servicio de internet cobra $200 de instalacion + $150/mes, ¿cuanto pagas en 1, 2, 3, 4 meses?'",
      "Pedir que completen ambas tablas en su cuaderno.",
      "Preguntar: '¿En cual de las dos el costo por unidad siempre es el mismo?'",
      "Introducir que la primera es proporcional y la segunda no.",
      "Conectar con la vida diaria: precio de gasolina (proporcional) vs. tarifa de taxi (no proporcional)."
    ],
    "desarrollo": [
      {
        "titulo": "Formalizacion: cociente constante y constante k",
        "diapositiva": "1-3",
        "libro": "Seccion '¿Que es una relacion proporcional?' y tabla de mangos",
        "video": "min 0:30-2:30",
        "descripcion": "Formalizar que una relacion es proporcional cuando y/x es siempre el mismo valor (constante de proporcionalidad k). Mostrar como verificarlo en la tabla calculando y/x para cada par de datos. Contrastar con la tabla no proporcional donde y/x cambia.",
        "tip": "Use colores: verde si el cociente es siempre igual, rojo si cambia. Esto da retroalimentacion visual inmediata."
      },
      {
        "titulo": "Representacion grafica: recta por el origen vs. recta desplazada",
        "diapositiva": "4-5",
        "libro": "Seccion '¿Como identificarla en una grafica?'",
        "video": "min 2:30-4:00",
        "descripcion": "Graficar ambas situaciones del inicio en el pizarron usando papel cuadriculado. La proporcional da una recta que pasa por (0,0); la no proporcional da una recta que NO pasa por el origen. Enfatizar que proporcional = recta por el origen.",
        "tip": null
      },
      {
        "titulo": "Trabajo en equipos: clasificar tablas de datos",
        "diapositiva": "6-8",
        "libro": "Ejemplos 1, 2 y 3 del libro",
        "video": null,
        "descripcion": "Formar equipos de 3-4 alumnos. Entregar 4 tablas de datos. Cada equipo debe: (a) calcular y/x para cada par, (b) decidir si es proporcional o no, (c) graficar al menos una relacion en papel cuadriculado. Circular entre los equipos para verificar y guiar.",
        "tip": "Para alumnos con rezago, proporcione tablas parcialmente completadas y guie el calculo paso a paso. Para avanzados, pida que inventen sus propias situaciones y escriban la ecuacion algebraica."
      }
    ],
    "cierre_individual": {
      "reflexiona": "¿Toda relacion donde los numeros crecen de forma constante es proporcional? Piensa en un ejemplo donde la diferencia entre valores consecutivos sea constante pero la relacion NO sea proporcional.",
      "profundiza": [
        {
          "pregunta": "Un coche recorre 80 km en 1 hora, 160 km en 2 horas y 240 km en 3 horas. ¿Es proporcional? ¿Cual es la constante k y que significa en este contexto?",
          "respuesta_modelo": "R.M. Si es proporcional porque y/x = 80 en todos los casos. La constante k = 80 km/h, que representa la velocidad constante del coche."
        },
        {
          "pregunta": "¿La relacion entre la edad de una persona y su estatura es proporcional? Justifica tu respuesta.",
          "respuesta_modelo": "R.M. No es proporcional. Un bebe de 1 ano mide aproximadamente 75 cm, pero un nino de 2 anos no mide 150 cm (el doble). Ademas, si fuera proporcional, una persona de 0 anos mediria 0 cm, lo cual no es real. El cociente estatura/edad cambia a lo largo de la vida."
        }
      ]
    },
    "cierre_grupal": [
      "Cada equipo presenta una de sus tablas al grupo explicando como determinaron si es proporcional o no.",
      "Elaborar juntos un cuadro comparativo en el pizarron: proporcional (cociente constante, pasa por el origen, y = kx) vs. no proporcional (cociente variable, no pasa por el origen, y = mx + b).",
      "Discutir: ¿por que calcular diferencias NO sirve para verificar proporcionalidad?",
      "Reforzar que k tiene unidades y significado real (precio por unidad, velocidad, tasa).",
      "Asignar tarea: identificar en su entorno dos relaciones proporcionales y dos no proporcionales, justificando con calculos."
    ],
    "preguntas_comprension": [
      "¿Como verificas si una tabla de datos representa una relacion proporcional?",
      "Si 3 kg de manzanas cuestan $45 y la relacion es proporcional, ¿cuanto cuestan 7 kg? Muestra el procedimiento.",
      "¿Que caracteristica tiene la grafica de una relacion proporcional que la distingue de cualquier otra recta?",
      "¿Por que la tarifa de un taxi con cobro base NO es proporcional aunque sea lineal?",
      "Si en una tabla y/x da 5, 5, 5, 5, ¿que puedes concluir sobre la relacion?"
    ]
  },
  15: {
    "contenidos_especificos": [
      "Ecuacion y = kx como modelo de relaciones proporcionales",
      "Constante de proporcionalidad positiva: crecimiento conjunto",
      "Constante de proporcionalidad negativa: decrecimiento",
      "Despeje de variables en ecuaciones proporcionales"
    ],
    "actividad_inicio": [
      "Recordar brevemente la clase anterior: relacion proporcional = cociente constante = recta por el origen.",
      "Plantear: 'Un tinaco tiene 200 litros y se vacia perdiendo 10 litros por hora.' Pedir que hagan la tabla de perdida acumulada para las horas 0 a 5.",
      "Preguntar: '¿El cociente perdida/hora es constante? ¿Es proporcional?'",
      "Guiar hacia la respuesta: si, pero k = -10 (negativa porque se pierde agua).",
      "Presentar el objetivo: escribir la ecuacion y = kx con k positiva y negativa para modelar situaciones reales."
    ],
    "desarrollo": [
      {
        "titulo": "Formalizacion de y = kx con k positiva",
        "diapositiva": "1-3",
        "libro": "Seccion 'La ecuacion y = kx' y 'Constante positiva'",
        "video": "min 0:30-2:00",
        "descripcion": "Formalizar la ecuacion y = kx. Resolver el ejemplo del trabajador que gana $150/hora: y = 150x. Calcular para x = 3, 6 y 8 horas. Graficar la recta que sube y pasa por el origen. Enfatizar que k positiva significa que ambas cantidades crecen juntas.",
        "tip": "Pida a los alumnos que propongan sus propias situaciones con k positiva antes de pasar a k negativa."
      },
      {
        "titulo": "Constante negativa y su significado",
        "diapositiva": "4-5",
        "libro": "Seccion 'Constante negativa (k < 0)' y ejemplo del tanque",
        "video": "min 2:00-3:30",
        "descripcion": "Introducir y = -5x para el tinaco del inicio. Graficar junto a y = 5x en los mismos ejes para comparar. Enfatizar: k negativa = recta que baja, una cantidad crece mientras la otra disminuye. Discutir que la magnitud de k indica que tan empinada es la recta.",
        "tip": null
      },
      {
        "titulo": "Trabajo en equipos: modelar situaciones reales",
        "diapositiva": "6-8",
        "libro": "Ejemplo 3 (resorte) y seccion 'Despejar x'",
        "video": null,
        "descripcion": "Dividir al grupo en equipos. Entregar una tarjeta por equipo con una situacion: ahorro semanal constante (k+), gasto de gasolina por km (k-), llenado de piscina (k+), derretimiento de hielo (k-). Cada equipo debe: identificar k, escribir la ecuacion, calcular dos valores, graficar y despejar x para un caso dado.",
        "tip": "Para alumnos con rezago, proporcione tablas con la columna y/x ya preparada. Para avanzados, proponga encontrar k a partir de la grafica leyendo dos puntos."
      }
    ],
    "cierre_individual": {
      "reflexiona": "¿Que informacion te da el signo de k sobre una situacion real? ¿Y que te dice su magnitud (valor absoluto)?",
      "profundiza": [
        {
          "pregunta": "Un globo pierde 3 cm cubicos de aire por minuto. Escribe la ecuacion, calcula la perdida en 15 minutos y explica que significa el resultado negativo.",
          "respuesta_modelo": "R.M. La ecuacion es y = -3x. En 15 minutos: y = -3(15) = -45. El resultado -45 significa que el globo ha perdido 45 cm cubicos de aire. El signo negativo indica disminucion."
        },
        {
          "pregunta": "Compara y = 2x y y = 8x. ¿Cual recta es mas empinada y por que? ¿En cual la y crece mas rapido?",
          "respuesta_modelo": "R.M. La recta y = 8x es mas empinada porque su constante k = 8 es mayor en magnitud que k = 2. Esto significa que por cada unidad que aumenta x, y aumenta 8 unidades en la primera ecuacion contra solo 2 en la segunda. La y crece mas rapido en y = 8x."
        }
      ]
    },
    "cierre_grupal": [
      "Cada equipo comparte su ecuacion y grafica al grupo.",
      "Reforzar que el signo de k da informacion crucial: positivo = crecimiento, negativo = decrecimiento.",
      "Comparar graficas de distintos equipos: ¿cual tiene la recta mas empinada? ¿Por que?",
      "Construir entre todos una tabla resumen: k > 0 (sube, crecimiento) vs. k < 0 (baja, decrecimiento).",
      "Asignar tarea: identificar dos situaciones de su vida diaria que se modelen con y = kx y determinar si k es positiva o negativa."
    ],
    "preguntas_comprension": [
      "¿Cual es el valor de y cuando x = 4 en la ecuacion y = -3x?",
      "Si un trabajador gano $1,200 a $150/hora, ¿como despejas x para encontrar cuantas horas trabajo?",
      "¿Que diferencia hay en la grafica entre y = kx con k positiva y k negativa?",
      "Un tanque pierde 5 litros por hora. ¿Por que la constante k es -5 y no 5?",
      "Si dos ecuaciones tienen k = 3 y k = 10, ¿cual produce una recta mas empinada y por que?"
    ]
  },
  16: {
    "contenidos_especificos": [
      "Conceptos fundamentales: punto, recta, semirrecta (rayo) y segmento",
      "Notacion geometrica correcta para cada elemento",
      "Posicion relativa de rectas: paralelas, secantes y perpendiculares",
      "Identificacion de rectas en objetos y situaciones cotidianas"
    ],
    "actividad_inicio": [
      "Pedir a los alumnos que observen el salon y mencionen objetos que les recuerden a rectas (borde de la pizarra, union pared-techo, cable de luz).",
      "Anotar las respuestas en el pizarron y preguntar: '¿Estas lineas tienen final o se podrian extender para siempre?'",
      "Estirar un hilo entre dos manos: 'Esto es un segmento. Si pudiera seguir para siempre en ambas direcciones, seria una recta.'",
      "Preguntar: '¿Las vias del tren se cruzan alguna vez? ¿Y las hojas de las tijeras?'",
      "Presentar el objetivo: aprender a nombrar, notar y clasificar rectas y sus posiciones relativas."
    ],
    "desarrollo": [
      {
        "titulo": "Punto, recta, semirrecta y segmento con notacion",
        "diapositiva": "1-3",
        "libro": "Seccion 'Punto, recta, semirrecta y segmento'",
        "video": "min 0:20-2:30",
        "descripcion": "Presentar formalmente los cuatro conceptos con su notacion: punto (letra mayuscula), recta (letra minuscula o dos puntos con flecha doble), semirrecta (un extremo, una flecha), segmento (dos extremos, barra encima). Dibujar cada uno en el pizarron y pedir que los alumnos los reproduzcan en su cuaderno con notacion correcta.",
        "tip": "Enfatice que las rectas SIEMPRE llevan flechas en ambos extremos y los segmentos NO llevan flechas. Este es el error mas comun."
      },
      {
        "titulo": "Posicion relativa: paralelas, secantes y perpendiculares",
        "diapositiva": "4-6",
        "libro": "Secciones 'Rectas paralelas', 'Rectas secantes' y 'Rectas perpendiculares'",
        "video": "min 2:30-4:30",
        "descripcion": "Abordar la posicion relativa de dos rectas en el plano: paralelas (nunca se cruzan, simbolo ||), secantes (se cruzan en un punto), perpendiculares (secantes a 90 grados, simbolo T invertida). Usar dos reglas o estambres de colores para demostrar fisicamente cada caso. Enfatizar: toda perpendicular es secante, pero no al reves.",
        "tip": null
      },
      {
        "titulo": "Practica en parejas: dibujar y clasificar",
        "diapositiva": "7-8",
        "libro": "Ejemplos 1 y 2 del libro",
        "video": null,
        "descripcion": "En parejas, dibujar en su hoja: dos rectas paralelas, dos secantes, dos perpendiculares, un segmento AB y una semirrecta con origen en C, todo con notacion correcta. Luego, mostrar imagenes cotidianas (vias del tren, tijeras, esquina de mesa) y clasificar que tipo de rectas representan.",
        "tip": "Para alumnos con rezago, proporcione tarjetas con los simbolos y definiciones como referencia constante. Para avanzados, proponga investigar rectas oblicuas en el espacio (3D)."
      }
    ],
    "cierre_individual": {
      "reflexiona": "¿Por que es importante distinguir entre una recta y un segmento si visualmente se parecen mucho? Piensa en como afecta esto a la solucion de un problema geometrico.",
      "profundiza": [
        {
          "pregunta": "Si dos rectas en un plano no son paralelas, ¿que puedes concluir sobre ellas? ¿Necesariamente son perpendiculares?",
          "respuesta_modelo": "R.M. Si dos rectas en un plano no son paralelas, entonces necesariamente son secantes (se cruzan en un punto). Pero NO necesariamente son perpendiculares, porque podrian cruzarse formando angulos distintos de 90 grados. Las perpendiculares son un caso especial de secantes."
        },
        {
          "pregunta": "En la vida real, ¿es posible que dos lineas no se crucen y tampoco sean paralelas? Piensa en el espacio tridimensional.",
          "respuesta_modelo": "R.M. Si, en el espacio 3D existen las rectas alabeadas u oblicuas: no se cruzan y no son paralelas porque estan en planos distintos. Ejemplo: el borde delantero del piso de un salon y el borde lateral del techo."
        }
      ]
    },
    "cierre_grupal": [
      "Pedir a voluntarios que identifiquen rectas paralelas, secantes y perpendiculares en objetos del salon.",
      "Construir entre todos una tabla de clasificacion con definicion, simbolo y ejemplo cotidiano de cada tipo.",
      "Discutir: '¿Toda recta perpendicular es secante? ¿Toda secante es perpendicular?' — aclarar con un diagrama de Venn.",
      "Reforzar la notacion: recta (flechas), segmento (barra), semirrecta (una flecha).",
      "Asignar tarea: encontrar en su casa o camino a la escuela un ejemplo de cada tipo de rectas y dibujarlos con notacion correcta."
    ],
    "preguntas_comprension": [
      "¿Cual es la diferencia fundamental entre una recta y un segmento?",
      "¿Que simbolo se usa para indicar que dos rectas son paralelas? ¿Y perpendiculares?",
      "Si dos rectas se cruzan formando un angulo de 45 grados, ¿son secantes, perpendiculares o paralelas?",
      "¿Por que toda recta perpendicular es secante pero no toda secante es perpendicular?",
      "Dibuja y nombra correctamente: un segmento AB, una recta l y una semirrecta con origen en P."
    ]
  },
  17: {
    "contenidos_especificos": [
      "Concepto de angulo: abertura entre dos semirrectas con vertice comun",
      "Clasificacion de angulos: agudo, recto, obtuso, llano y completo",
      "Angulos formados al intersecar dos rectas: opuestos por el vertice y adyacentes (suplementarios)",
      "Uso del transportador para medir y trazar angulos"
    ],
    "actividad_inicio": [
      "Mostrar las manecillas del reloj a distintas horas: 3:00 (90 grados), 6:00 (180 grados), 1:00 (aprox. 30 grados).",
      "Preguntar: '¿Que tan abierto esta el angulo en cada caso? ¿Como lo medirian?'",
      "Introducir que un angulo mide la abertura entre dos semirrectas con el mismo vertice.",
      "Mostrar el transportador y explicar brevemente como se usa: centrar en el vertice, alinear un lado con 0 grados, leer donde cae el otro lado.",
      "Presentar el objetivo: clasificar angulos y descubrir las propiedades de los angulos cuando dos rectas se cruzan."
    ],
    "desarrollo": [
      {
        "titulo": "Clasificacion de angulos",
        "diapositiva": "1-2",
        "libro": "Secciones '¿Que es un angulo?' y 'Clasificacion de angulos'",
        "video": "min 0:20-1:30",
        "descripcion": "Clasificar angulos por su medida: agudo (0-90 grados), recto (90 grados), obtuso (90-180 grados), llano (180 grados), completo (360 grados). Dibujar un ejemplo de cada uno en el pizarron. Los alumnos practican midiendo 3 angulos pre-dibujados con el transportador y clasificandolos.",
        "tip": "Insista en que verifiquen si el angulo parece agudo u obtuso ANTES de leer el transportador, para elegir la escala correcta (interior o exterior). Este es el error mas frecuente."
      },
      {
        "titulo": "Propiedades: opuestos por el vertice y suplementarios",
        "diapositiva": "3-6",
        "libro": "Seccion '¿Que pasa cuando dos rectas se cruzan?' y ejemplos 1-3",
        "video": "min 1:30-4:30",
        "descripcion": "Dibujar dos rectas que se intersecan y nombrar los 4 angulos. Asignar un valor al angulo 1 (55 grados) y preguntar: '¿Cuanto vale el angulo 2? ¿Y el 3? ¿Y el 4?' Guiar el descubrimiento: opuestos por el vertice son iguales, adyacentes suman 180 grados. Verificar que los 4 suman 360 grados. Resolver el caso especial de rectas perpendiculares (4 angulos de 90 grados).",
        "tip": null
      },
      {
        "titulo": "Practica en parejas: medir y calcular",
        "diapositiva": "7-8",
        "libro": "Problema de calculo del libro",
        "video": null,
        "descripcion": "En parejas, trazar dos rectas que se corten, medir un angulo con el transportador y calcular los otros tres sin medir. Luego verificar midiendo. Repetir con un segundo par de rectas. Usar dos tiras de carton unidas con un broche mariposa para formar angulos y medirlos.",
        "tip": "Para alumnos con rezago, proporcione diagramas pre-dibujados con angulos numerados y una tabla: 'Si angulo 1 = ___, entonces angulo 2 = 180 - ___ = ___'. Para avanzados, proponga tres rectas cruzandose en un mismo punto (6 angulos)."
      }
    ],
    "cierre_individual": {
      "reflexiona": "Si conoces un solo angulo de los cuatro que se forman cuando dos rectas se cruzan, ¿por que puedes calcular los otros tres? ¿Que propiedades usas?",
      "profundiza": [
        {
          "pregunta": "Dos rectas se intersecan y uno de los angulos mide 90 grados. ¿Cuanto miden los otros tres? ¿Que tipo de rectas son?",
          "respuesta_modelo": "R.M. Los cuatro angulos miden 90 grados cada uno, porque el opuesto es 90 grados y los adyacentes son 180 - 90 = 90 grados. Las rectas son perpendiculares."
        },
        {
          "pregunta": "¿Por que los angulos opuestos por el vertice siempre son iguales? Explicalo usando la propiedad de angulos suplementarios.",
          "respuesta_modelo": "R.M. Si el angulo 1 + angulo 2 = 180 grados (suplementarios) y el angulo 2 + angulo 3 = 180 grados (tambien suplementarios), entonces angulo 1 = 180 - angulo 2 y angulo 3 = 180 - angulo 2. Como ambos se obtienen restando el mismo valor, angulo 1 = angulo 3."
        }
      ]
    },
    "cierre_grupal": [
      "Socializar resultados: '¿Se cumplio que los opuestos por el vertice son iguales? ¿Que los adyacentes suman 180 grados?'",
      "Confirmar que son propiedades generales, no coincidencias de un dibujo particular.",
      "Construir un resumen visual: diagrama de interseccion con las dos propiedades senaladas.",
      "Discutir el caso especial: si un angulo es recto, todos lo son (rectas perpendiculares).",
      "Asignar tarea: encontrar en su entorno una interseccion de lineas, estimar el angulo y calcular los cuatro angulos formados."
    ],
    "preguntas_comprension": [
      "Si dos rectas se intersecan y un angulo mide 65 grados, ¿cuanto mide el angulo opuesto por el vertice?",
      "¿Cuanto suman siempre dos angulos adyacentes formados por la interseccion de dos rectas?",
      "Clasifica un angulo de 135 grados: ¿es agudo, recto, obtuso o llano?",
      "¿Por que el largo de los lados de un angulo NO afecta su medida en grados?",
      "Si los cuatro angulos de una interseccion son iguales, ¿cuanto mide cada uno y que tipo de rectas son?"
    ]
  },
  18: {
    "contenidos_especificos": [
      "Punto medio de un segmento: definicion y calculo",
      "Mediatriz: recta perpendicular al segmento que pasa por su punto medio",
      "Propiedad de equidistancia de la mediatriz",
      "Construccion con regla y compas: punto medio y mediatriz"
    ],
    "actividad_inicio": [
      "Dibujar un segmento AB de 16 cm en el pizarron y preguntar: '¿Como encontrarian el punto exactamente a la mitad?'",
      "Validar la respuesta de medir y dividir entre 2 (M a 8 cm).",
      "Plantear el reto: '¿Y si no tuvieran regla con numeros, solo un compas y una regla sin marcas?'",
      "Demostrar brevemente como funciona el compas para quienes no esten familiarizados.",
      "Presentar el objetivo: aprender a construir el punto medio y la mediatriz con regla y compas, y descubrir la propiedad de equidistancia."
    ],
    "desarrollo": [
      {
        "titulo": "Construccion paso a paso de la mediatriz",
        "diapositiva": "1-5",
        "libro": "Secciones 'Punto medio', 'Mediatriz' y 'Construccion paso a paso'",
        "video": "min 1:00-3:30",
        "descripcion": "Demostrar en el pizarron la construccion completa: (1) dibujar segmento AB, (2) abrir compas mas de la mitad de AB, (3) trazar arco desde A (arriba y abajo), (4) sin cambiar abertura, trazar arco desde B, (5) unir intersecciones con regla. Pedir a los alumnos que repliquen con un segmento de 12 cm. Circular verificando los tres puntos criticos: abertura mayor a la mitad, misma abertura en ambos arcos, punta del compas bien anclada.",
        "tip": "Pida que verifiquen con la regla que M este efectivamente en la mitad (6 cm de cada extremo). Esto les da confianza en la construccion."
      },
      {
        "titulo": "Propiedad de equidistancia",
        "diapositiva": "6-7",
        "libro": "Seccion '¿Para que sirve la mediatriz?'",
        "video": "min 3:30-4:30",
        "descripcion": "Pedir que elijan cualquier punto P sobre la mediatriz que construyeron y midan PA y PB. Preguntar: '¿Que notan?' (Son iguales.) Repetir con otro punto. Formalizar: todo punto sobre la mediatriz equidista de ambos extremos del segmento. Discutir aplicacion: ubicar un hospital equidistante de dos pueblos.",
        "tip": null
      },
      {
        "titulo": "Segunda construccion y practica",
        "diapositiva": "8",
        "libro": "Ejemplos resueltos 1 y 2 del libro",
        "video": null,
        "descripcion": "Repetir la construccion con un segmento de longitud diferente (9 cm) para consolidar. Si el tiempo lo permite, introducir brevemente la bisectriz de un angulo como construccion analoga. Para alumnos avanzados, trazar las tres mediatrices de un triangulo y descubrir que se cruzan en un solo punto (circuncentro).",
        "tip": "Para alumnos con rezago, proporcione instrucciones paso a paso en una tarjeta impresa con diagramas. Antes de usar el compas, pida que doblen una tira de papel a la mitad para encontrar el punto medio — esto da la intuicion antes de la formalizacion."
      }
    ],
    "cierre_individual": {
      "reflexiona": "¿Para que serviria en la vida real encontrar un punto que este a la misma distancia de dos lugares? Piensa en al menos dos aplicaciones practicas.",
      "profundiza": [
        {
          "pregunta": "Un segmento AB mide 10 cm. M es su punto medio. Un punto P esta sobre la mediatriz a 8 cm de M. ¿Cuanto mide la distancia de P a A? (Pista: triangulo rectangulo.)",
          "respuesta_modelo": "R.M. AM = 5 cm. El triangulo AMP es rectangulo (la mediatriz es perpendicular a AB). Por Pitagoras: PA al cuadrado = AM al cuadrado + PM al cuadrado = 25 + 64 = 89. PA = raiz de 89 = 9.43 cm aproximadamente."
        },
        {
          "pregunta": "¿Que error cometes si abres el compas MENOS de la mitad del segmento? ¿Por que no funciona la construccion?",
          "respuesta_modelo": "R.M. Si la abertura del compas es menor a la mitad del segmento, los arcos trazados desde A y desde B no se cruzan, porque no alcanzan a encontrarse. Sin puntos de interseccion, no puedes trazar la mediatriz."
        }
      ]
    },
    "cierre_grupal": [
      "Preguntar: '¿Para que serviria en la vida real encontrar un punto equidistante de dos lugares?' (hospital, fuente en un parque, antena de senal).",
      "Verificar en grupo que la propiedad de equidistancia se cumplio en todas las construcciones.",
      "Discutir los errores mas comunes: abertura insuficiente, cambio de abertura, punta que resbala.",
      "Reforzar la diferencia: punto medio es un PUNTO, mediatriz es una RECTA.",
      "Reto para la proxima clase: trazar un triangulo y construir las 3 mediatrices para descubrir el circuncentro."
    ],
    "preguntas_comprension": [
      "¿Que propiedad tiene todo punto que pertenece a la mediatriz de un segmento AB?",
      "Describe los pasos para trazar la mediatriz con regla y compas.",
      "¿Por que es indispensable que la abertura del compas sea mayor a la mitad del segmento?",
      "Si AB mide 14 cm, ¿cuanto mide AM donde M es el punto medio?",
      "¿Cual es la diferencia entre punto medio y mediatriz?"
    ]
  }
};

for (const item of data) {
  if (replacements[item.secuencia]) {
    item.orientacion = replacements[item.secuencia];
  }
}

writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log('Done. Weeks 13-18 orientacion fields replaced with structured objects.');
