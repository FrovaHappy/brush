# 🖌️ Brush

*Read this in [English](README.md).*

![Brush Banner](https://cdn.jsdelivr.net/npm/@frova_happy/brush@latest/banner.png)

Una potente y flexible librería de **Canvas Universal** diseñada para funcionar perfectamente tanto en el **Navegador (Browser)** como en **Node.js**. Permite renderizar plantillas dinámicas compuestas por capas de formas e imágenes configurables, textos adaptables y filtros avanzados, facilitando la generación dinámica de imágenes, banners y recursos visuales.

El código fuente está disponible en GitHub: [FrovaHappy/brush](https://github.com/FrovaHappy/brush) y el paquete está publicado en npm: [@frova_happy/brush](https://www.npmjs.com/package/@frova_happy/brush).
Deja tu estrella ⭐ si te gusta el proyecto y ayúdame a mejorarlo.

---

## 🚀 Características Principales

* **Universal:** Mismo código y comportamiento tanto en el cliente (Browser) como en el servidor (Node.js).
* **Capas Flexibles:** Soporte para capas de formas (`shape`) y de texto (`text`).
* **Extracción de Paletas Dinámicas:** Permite extraer automáticamente los colores dominantes y vibrantes de una imagen cargada y utilizarlos en otras capas a través de variables como `{{pallete_Vibrant}}`, `{{pallete_Muted}}`, etc.
* **Máscaras de Recorte SVG:** Permite recortar formas e imágenes utilizando cualquier trazado SVG.
* **Ajuste y Escalado:** Soporte para `objectFit` (`cover`, `contain`, `fill`) y transformaciones como rotaciones (`rotation`).
* **Tipografías Dinámicas:** Carga previa de fuentes del sistema o fuentes remotas (archivos `.ttf`, `.woff2`, etc.) mediante una API sencilla.
* **Filtros CSS:** Soporte completo de filtros de estilo (sombras, desenfoques, brillo, contraste, escala de grises, opacidad, saturación, sepia y más) aplicados directamente a las capas.
* **Validación Integrada:** Validación robusta del esquema de plantillas en tiempo de ejecución con **Zod**.

---

## 🛠️ Tecnologías Utilizadas

El proyecto utiliza un conjunto moderno de herramientas y librerías para garantizar un rendimiento óptimo y una compatibilidad multiplataforma:

* **Lenguaje Principal:** [TypeScript](https://www.typescriptlang.org/) para un tipado estricto y seguro.
* **Motor Canvas en Servidor:** [@napi-rs/canvas](https://github.com/brooooooklyn/canvas) para un renderizado ultra-rápido en Node.js mediante bindings nativos en Rust.
* **Extracción de Colores:** [colorthief](https://github.com/lokesh/color-thief) para analizar y extraer paletas de color armoniosas desde imágenes.
* **Procesamiento de Imágenes:** [Sharp](https://sharp.pixelplumbing.com/) para operaciones optimizadas de imágenes en Node.js.
* **Pruebas unitarias:** [Vitest](https://vitest.dev/) para asegurar el comportamiento esperado.
* **Calidad de Código:** [Biome](https://biomejs.dev/) para linting y formateo rápido.

---

## ⚡ Implementación Rápida

Instala la librería en tu proyecto:

```bash
npm install @frova_happy/brush
```

### Guía de Inicio

Dependiendo de tu entorno, importa el módulo correspondiente:

#### 🌐 En el Navegador (Browser)

Puedes ver un ejemplo completo en el archivo [example/html/index.html](https://github.com/FrovaHappy/brush/blob/main/example/html/index.html).

```javascript
import { brush, setFonts } from '@frova_happy/brush/browser';

// 1. Cargar fuentes personalizadas (opcional)
await setFonts([
  { name: 'Text', url: 'https://fonts.gstatic.com/s/loversquarrel/v25/Yq6N-LSKXTL-5bCy8ksBzpQ_-wArabs.woff2' }
]);

// 2. Definir la plantilla
const template = {
  version: '1',
  w: 800,
  h: 400,
  backgroundColor: '#f3f4f6',
  layers: [
    {
      id: 'mi-texto',
      type: 'text',
      text: '¡Hola {{name}}!',
      x: 400,
      y: 200,
      fontSize: 48,
      fontFamily: 'Text',
      color: '#1e3a8a',
      align: 'center',
      baseline: 'middle'
    }
  ]
};

// 3. Renderizar en el canvas
const canvas = await brush({
  template,
  filterText: { name: 'Desarrollador' }
});

document.body.appendChild(canvas);
```

#### 🟢 En Node.js

Puedes ver un ejemplo completo en el archivo [example/node/index.js](https://github.com/FrovaHappy/brush/blob/main/example/node/index.js).

```javascript
import { brush, setFonts } from '@frova_happy/brush/node';
import { writeFile } from 'node:fs/promises';

// Cargar fuentes y renderizar
await setFonts([{ name: 'Text', url: 'https://fonts.gstatic.com/...' }]);

const canvas = await brush({
  template, // Estructura de plantilla
  filterText: { name: 'Desarrollador' }
});

const buffer = await canvas.encode('png');
await writeFile('./output.png', buffer);
```

#### ⚛️ En React

Puedes explorar un ejemplo integrado dentro de la carpeta [example/react](https://github.com/FrovaHappy/brush/blob/main/example/react).

---

## 🔌 API

### `setFonts(fonts)`

Carga y registra fuentes tipográficas externas **antes** de llamar a `brush()`. Las fuentes cargadas quedan disponibles para ser utilizadas en capas de tipo `text` mediante la propiedad `fontFamily`.

```typescript
type Font = {
  name: string; // Nombre con el que se referenciará la fuente en fontFamily
  url: string;  // URL remota (https://...) o ruta local relativa al proceso
}

setFonts(fonts: Font[]): Promise<void>
```

**Comportamiento:**

* Si la fuente ya fue registrada (Node.js), se omite sin error.
* En el navegador usa la API `FontFace`. En Node.js usa `GlobalFonts.register` de `@napi-rs/canvas`.
* Si falla la carga de alguna fuente, emite un `console.warn` y continúa con las demás.

**Ejemplo:**

```javascript
import { setFonts, brush } from '@frova_happy/brush/browser';

await setFonts([
  { name: 'MiFuente', url: 'https://example.com/fonts/MiFuente.woff2' },
  { name: 'Roboto',   url: '/static/fonts/Roboto-Regular.ttf' }
]);

const canvas = await brush({
  template: {
    version: '1',
    w: 800, h: 400,
    layers: [
      {
        id: 'titulo',
        type: 'text',
        text: 'Hola mundo',
        x: 400, y: 200,
        fontFamily: 'MiFuente', // referencia al nombre registrado en setFonts
        fontSize: 48,
        color: '#ffffff',
        textAlign: 'center',
        textBaseline: 'middle'
      }
    ]
  },
  filterText: {}
});
```

> [!IMPORTANT]
> Siempre llama a `setFonts()` **antes** de `brush()`. Si `brush()` se ejecuta primero, las capas de texto usarán fuentes del sistema como fallback.

---

### `filterText`

`filterText` es un objeto de pares clave–valor (`Record<string, string | undefined>`) que se pasa a `brush()`. Funciona como un sistema de **interpolación de variables** sobre toda la plantilla.

Cualquier string de la plantilla que contenga `{{nombre}}` será reemplazado por el valor correspondiente en `filterText` antes de renderizar.

```typescript
type FilterText = Record<string, string | undefined>
```

**Ejemplo básico:**

```javascript
const canvas = await brush({
  template: {
    version: '1',
    w: 600, h: 200,
    layers: [
      {
        id: 'saludo',
        type: 'text',
        text: 'Bienvenido, {{username}}! Nivel {{level}}',
        x: 10, y: 100,
        fontSize: 24,
        color: '#000000'
      }
    ]
  },
  filterText: {
    username: 'FrovaHappy',
    level: '42'
  }
});
// Resultado → "Bienvenido, FrovaHappy! Nivel 42"
```

#### **Variables de paleta de colores (`pallete_*`):**

Si la plantilla tiene `layerColor` apuntando a una capa con imagen, `brush()` extrae automáticamente la paleta de esa imagen y la inyecta al `filterText` antes de renderizar. Las variables generadas son:

| Variable | Descripción |
| :--- | :--- |
| `{{pallete_Vibrant}}` | Color vibrante principal de la imagen. |
| `{{pallete_LightVibrant}}` | Variante vibrante clara. |
| `{{pallete_DarkVibrant}}` | Variante vibrante oscura. |
| `{{pallete_Muted}}` | Color apagado principal. |
| `{{pallete_LightMuted}}` | Variante apagada clara. |
| `{{pallete_DarkMuted}}` | Variante apagada oscura. |

Estas variables pueden usarse en cualquier string del template, incluyendo colores de capas, filtros de sombra, etc.
> [!IMPORTANT]
> Algunos de los colores pueden no generarse, esto depende del rango de colores que maneje la imagen, ej: si una imagen esta en blanco y negro solo generara no mas de dos. el resto serán #000000

```javascript
const template = {
  version: '1',
  w: 800, h: 400,
  backgroundColor: '{{pallete_LightVibrant}}', // color de fondo dinámico
  layerColor: 'avatar',                          // extrae paleta de esta capa
  layers: [
    {
      id: 'avatar',
      type: 'shape',
      image: 'https://example.com/avatar.png',
      x: 50, y: 100, w: 200, h: 200,
      color: 'auto'
    },
    {
      id: 'nombre',
      type: 'text',
      text: '{{username}}',
      x: 300, y: 200,
      fontSize: 40,
      color: '{{pallete_DarkVibrant}}', // usa color extraído de la imagen
      textAlign: 'center',
      textBaseline: 'middle',
      filter: {
        'drop-shadow': '0px 4px 8px {{pallete_Muted}}'
      }
    }
  ]
};
```

> [!NOTE]
> Si una variable `{{nombre}}` no se encuentra en `filterText`, se reemplaza con el string `null_sanitized` y se emite un `console.warn`.

---

### `generateVariables(template, filterText)`

> añadido en version 0.4.1

Genera las variables y sanitiza la plantilla antes de dibujar en el canvas. Es útil para obtener la plantilla y el `filterText` ya procesado (por ejemplo, si necesitas extraer las variables `pallete_*` a partir de `layerColor` sin tener que renderizar el lienzo inmediatamente).

```typescript
generateVariables(template: Templete, filterText: FilterText): Promise<{ template: Templete, filterText: FilterText }>
```

**Ejemplo:**

```javascript
import { generateVariables } from '@frova_happy/brush/node'; // o /browser

const { template: processedTemplate, filterText: processedFilterText } = await generateVariables(
  template,
  { name: 'Desarrollador' }
);
```

---

### `compileSVGPath(svg, resize)`

> añadido en la versión 0.5.1

Compila una cadena XML de SVG en una única cadena de trazado `d` y extrae las dimensiones de ancho (`w`) y alto (`h`) del SVG. Las formas geométricas básicas como `<rect>`, `<circle>`, `<ellipse>`, `<line>`, `<polygon>` y `<polyline>` se compilan y aproximan automáticamente en comandos de rutas SVG (paths).

```typescript
compileSVGPath(svg: string | undefined, resize?: number): { d: string, w: number, h: number } | undefined
```

**Parámetros:**

* `svg`: La cadena XML del SVG a compilar. Retorna `undefined` si no se provee.
* `resize`: (Opcional) Tamaño de destino para el redimensionamiento proporcional. Si se proporciona, los comandos de la ruta compilada y las dimensiones resultantes se escalarán para que la dimensión máxima (ya sea ancho o alto) coincida con este valor.

**Ejemplo:**

```javascript
import { compileSVGPath } from '@frova_happy/brush/node'; // o /browser

const svg = `
<svg width="100" height="100" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="40" fill="red" />
</svg>
`;

const result = compileSVGPath(svg, 200);
// Resultado → { d: "M 20 100 A 80 80 0 1 0 180 100 A 80 80 0 1 0 20 100 Z", w: 200, h: 200 }
```

---

## 📖 Referencia Detallada de Propiedades del Templete

### 1. Plantilla principal (`Templete`)

Representa la configuración base del lienzo o canvas y sus capas principales.
> [!Note]
> Si declaras 'auto', en 'backgroundColor' o 'layer.color' y usa 'layerColor' este usa el color obtenido de '{{pallete_Vibrant}}' si no encuentra usara 'black'

| Propiedad | Tipo | Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| `version` | `'1'` | Sí | Versión de la estructura de plantilla. |
| `w` | `number` | Sí | Ancho del lienzo en píxeles. |
| `h` | `number` | Sí | Alto del lienzo en píxeles. |
| `backgroundColor` | `string` | No | Color de fondo general (soporta HEX, RGB, HSL, gradientes o transparente). |
| `layerColor` | `string` | No | ID de la capa de tipo `shape` (que contenga una imagen) de la cual se desea extraer la paleta de colores dinámicos, los cuales puedes usar usando {{valor}} en el templete, véase [filterText](#variables-de-paleta-de-colores-pallete_) |
| `layers` | `Layer[]` | Sí | Array de capas que componen el diseño visual. |

---

### 2. Capa de Forma / Imagen (`ShapeLayer`)

Utilizada para renderizar rectángulos, imágenes completas u objetos recortados por trazados vectoriales.

| Propiedad | Tipo | Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `string` | Sí | Identificador único de la capa. Utilizado para extraer colores si se asocia a `layerColor`. |
| `type` | `'shape'` | Sí | Identifica el tipo de capa. |
| `x` | `number` | Sí | Posición horizontal en el lienzo. |
| `y` | `number` | Sí | Posición vertical en el lienzo. |
| `w` | `number` | Sí | Ancho de la forma o imagen. |
| `h` | `number` | Sí | Alto de la forma o imagen. |
| `image` | `string` | No | URL o ruta de la imagen. Si no se provee, la capa actuará como una forma rectangular plana. |
| `color` | `string` | Sí | Color de relleno o fallback. Soporta colores CSS habituales, o `'auto'` si se desea heredar el color extraído automáticamente del fondo o capa anterior. |
| `scale` | `number` | No | Factor de escala de la imagen interna. Por defecto es `1`. |
| `objectFit` | `'cover' \| 'contain' \| 'fill'` | No | Ajuste y proporción de la imagen dentro de los límites de la capa. |
| `rotation` | `number` | No | Ángulo de rotación de la capa en grados (ej: `45`). |
| `svg` | `string` | No | Cadena XML de SVG para utilizar como máscara de recorte (clipping path). |
| `align` | `string` | No | Alineación de la máscara SVG. Ejemplo: `'center center'`, `'top left'`. |
| `filter` | `Filter` | No | Filtros de estilo CSS aplicados a la forma. |

---

### 3. Capa de Texto (`TextLayer`)

Permite añadir elementos tipográficos dinámicos con soporte para saltos de línea automáticos y sustituciones.

| Propiedad | Tipo | Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `string` | Sí | Identificador único de la capa. |
| `type` | `'text'` | Sí | Identifica el tipo de capa. |
| `text` | `string` | Sí | Texto a mostrar. Soporta variables dinámicas utilizando la sintaxis `{{nombre_variable}}`. |
| `x` | `number` | Sí | Posición horizontal. |
| `y` | `number` | Sí | Posición vertical. |
| `maxWidth` | `number` | No | Ancho máximo permitido antes de forzar un salto de línea automático. |
| `lineHeight` | `number` | No | Altura de la línea en píxeles para textos multilinea. |
| `rotation` | `number` | No | Ángulo de rotación de la capa en grados. |
| `fontSize` | `number` | No | Tamaño de la fuente en píxeles. Por defecto `16`. |
| `fontFamily` | `string` | No | Nombre de la tipografía. Ej: `'Arial'`. Debe registrarse previamente si es externa. |
| `fontWeight` | `string` | No | Grosor de la fuente. Ej: `'bold'`, `'normal'`, etc. |
| `color` | `string` | Sí | Color del texto. Admite valores CSS o `'auto'`. |
| `strokeColor` | `string` | No | Color del trazado o contorno exterior del texto. |
| `strokeWidth` | `number` | No | Ancho del trazado de contorno en píxeles. |
| `textAlign` | `'left' \| 'right' \| 'center' \| 'start' \| 'end'` | No | Alineación horizontal del texto. |
| `textBaseline` | `'top' \| 'hanging' \| 'middle' \| 'alphabetic' \| 'ideographic' \| 'bottom'` | No | Alineación vertical del texto respecto a su coordenada base. Ej: `'middle'`. |
| `filter` | `Filter` | No | Filtros de estilo CSS aplicados al texto. |

---

### 4. Objeto de Filtros (`Filter`)

Filtros estilísticos inspirados en las especificaciones CSS Canvas.

| Propiedad | Tipo | Ejemplo de Valor | Descripción |
| :--- | :--- | :--- | :--- |
| `blur` | `string` | `'5px'` | Desenfoque gaussiano de la capa. |
| `brightness` | `string` | `'150%'` o `'1.5'` | Modificación del brillo del elemento. |
| `contrast` | `string` | `'200%'` o `'2'` | Contraste de la capa. |
| `grayscale` | `string` | `'100%'` o `'1'` | Conversión a escala de grises. |
| `'hue-rotate'` | `string` | `'90deg'` | Rotación de tono del color. |
| `invert` | `string` | `'100%'` o `'1'` | Inversión cromática. |
| `opacity` | `string` | `'0.5'` o `'50%'` | Nivel de opacidad y transparencia. |
| `saturate` | `string` | `'200%'` o `'2'` | Nivel de saturación cromática. |
| `sepia` | `string` | `'100%'` o `'1'` | Efecto sepia. |
| `'drop-shadow'` | `string` | `'10px 10px 5px rgba(0,0,0,0.5)'` | Sombras proyectadas con coordenadas, desenfoque y color. |

---

## 🤝 Colaboración y Contribución

¡Las contribuciones son bienvenidas! Si deseas mejorar la librería, corregir un error o proponer nuevas características, por favor sigue estos pasos:

1. Realiza un **Fork** del repositorio.
2. Crea una rama para tu feature o fix: `git checkout -b feature/nueva-caracteristica`
3. Instala dependencias y asegúrate de pasar los tests con `npm test` y el formateador con `npm run lint`.
4. Envía tus cambios mediante un **Pull Request** detallando las mejoras realizadas.

Para resolver o consultar dudas, también puedes abrir un [Issue en GitHub](https://github.com/FrovaHappy/brush/issues).

---

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**. Consulta el archivo [LICENSE](./LICENSE) para obtener más información.
