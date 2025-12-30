# Brush

Una librería de canvas universal que funciona tanto en el navegador como en Node.js. Permite renderizar plantillas de dibujo con capas de texto y formas en un contexto de canvas.

El código fuente ya está disponible en GitHub: https://github.com/FrovaHappy/brush

Puedes abrir issues, crear pull requests o hacer fork para contribuir. Si te gusta el proyecto, considera darle star.

> Importante: la validación de url solo comprueba que sea string y no valida que la url sea segura o accesible.

## Instalación

```bash
npm install @frova_happy/brush

# o usando unpkg
import { brush } from 'https://unpkg.com/@frova_happy/brush@0.1.1/dist/web/index.js';
```

### En el Navegador

```javascript
import { brush } from '@frova_happy/brush/web'; // importa la versión web

const template = { /* ... */ };


const canvas = await brush({
  template,                 // plantilla (obligatorio)
  filterText: {},           // valores para plantillas (opcional)
  fonts: [                  // array de fuentes para preload (opcional)
    { name: 'Science-Gothic', url: '/example/html/ScienceGothic.ttf' }
  ]
});

document.body.appendChild(canvas); // agrega el canvas al DOM úsalo como necesites
```

### En Node.js

```javascript
import { brush } from '@frova_happy/brush'; // importa la versión de Node.js este utiliza '@napi-rs/canvas' internamente para renderizar
import { writeFileSync } from 'fs';

const template = { /* ... */ };

try {
  const canvas = await brush({
    template,
    filterText: {},
    fonts: [
      { name: 'Science-Gothic', url: 'https://.../Science-Gothic.woff2' }
    ]
  });
} catch (error) {
  // el error puede ser de validación o de renderizado
  console.error('Error al renderizar el canvas:', error);
  process.exit(1);
}

writeFileSync('output.png', canvas.toBuffer('image/png'));
```
## Tipos TypeScript

La librería incluye definiciones de tipos completas para TypeScript. Puedes importar los tipos de las siguientes maneras:

```typescript
// Importar tipos desde el paquete principal
import type { Templete, Text, Shape, Filter } from '@frova_happy/brush';
```

## Estructura de la Plantilla

La plantilla es un objeto que define el canvas y sus capas:

```typescript
interface Template {
  version: '1';
  title: string;
  w: number; // ancho
  h: number; // alto
  // Paleta de colores reutilizables para la plantilla. Las keys válidas son:
  // `primary`, `secondary`, `accent`, `background`, `foreground`.
  // Cada key puede ser un color en formato hexadecimal (#RGB, #RRGGBB, #RRGGBBAA),
  // `rgb(...)` / `rgba(...)`, `hsl(...)` / `hsla(...)` o la cadena `transparent`.
  // Las `layers` pueden usar una de estas keys (p. ej. color: 'primary') o
  // proporcionar directamente un color en cualquiera de los formatos anteriores.
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    foreground?: string;
    auto?: string;
  };
  layers: Array<TextLayer | ShapeLayer>;
}

Ejemplo de `colors` en la plantilla y uso en una capa:

```javascript
const template = {
  version: '1',
  title: 'Ejemplo',
  w: 800,
  h: 600,
  colors: {
    background: '#ffffff',
    primary: '#1e90ff',
    accent: '#ff6b6b'
  },
  layers: [
    { id: 't1', type: 'text', dx: 100, dy: 100, text: 'Hola', color: 'primary' }
  ]
};
```
```

### Capa de Texto

```typescript
interface TextLayer {
  id: string;
  type: 'text';
  dx: number; // posición x
  dy: number; // posición y
  text: string;
  size?: number; // tamaño de fuente (default: 16)
  family?: string; // familia de fuente (default: 'Arial')
  color?: string; // color (clave de `colors` como 'primary', color directo como '#fff' o 'auto')
  weight?: number; // peso de fuente (default: 400)
  align?: 'start' | 'end' | 'left' | 'right' | 'center';
  baseline?: 'top' | 'hanging' | 'middle' | 'alphabetic' | 'ideographic' | 'bottom';
  globalAlpha?: number; // opacidad (0-1)
  letterSpacing?: number;
  maxWidth?: number;
  filter?: Filter; // filtros CSS
}
```

### Capa de Forma

```typescript
interface ShapeLayer {
  id: string;
  type: 'shape';
  dx: number; // posición x
  dy: number; // posición y
  dw?: number; // ancho
  dh?: number; // alto
  color?: string; // color de relleno (clave de `colors`, color directo como '#fff' o 'auto')
  image?: string; // URL de imagen o placeholder
  clip?: {
    svg?: string; // SVG para recorte
    align?: string; // alineación del clip
  };
  filter?: Filter; // filtros CSS
}
```

## Filtros

Los filtros CSS se pueden aplicar tanto a texto como a formas:

```typescript
interface Filter {
  blur?: number;
  brightness?: number;
  contrast?: number;
  dropShadow?: {
    offsetX?: number;
    offsetY?: number;
    blurRadius?: number;
    color: string;
  };
  grayscale?: number;
  hueRotate?: number;
  invert?: number;
  opacity?: number;
  saturate?: number;
  sepia?: number;
}
```

## Validación

La librería incluye validación automática de plantillas usando Zod, el lo utiliza internamente antes de renderizar esto puede probocar error si la plantilla no es válida. También puedes usar la función `validateCanvas` para validar plantillas manualmente:

```javascript
import { validateCanvas } from '@frova_happy/brush';

const result = validateCanvas(template);
if (!result.ok) {
  console.error('Errores de validación:', result.errors);
} else {
  console.log('Plantilla válida:', result.data);
}
```



### `brush` (Web / Node)

La función `brush` recibe un objeto de opciones y devuelve un `HTMLCanvasElement` en el navegador o un `Canvas` en Node.js.

```typescript
# BrushOptions
type BrushOptions = {
  template: Template;
  filterText?: Record<string, string | number | undefined>;
  fonts?: Array<{ name: string; url: string }>;
}

async function brush(options: BrushOptions): Promise<HTMLCanvasElement | Canvas> | throws Error;
```

## Dependencias

La librería incluye todas las dependencias necesarias automáticamente. No se requieren instalaciones adicionales.

## Limitaciones
- Imágenes soportadas: PNG, JPG, JPEG (no se testeo con otros formatos)
- Colores en formato hexadecimal (#RGB, #RRGGBB, #RRGGBBAA)

## Contribuir

1. Clona el repositorio
2. Instala dependencias: `npm install`
3. Ejecuta tests: `npm test`
4. Construye:
    - `npm run build` para construir la librería
    - `npm run dev:html` para correr el ejemplo HTML
    - `npm run dev:react` para correr el ejemplo React
    - `npm run dev:node` para correr el ejemplo Node.js

## Licencia

Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.
