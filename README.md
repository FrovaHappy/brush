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
  castColor: undefined,     // color de capa (opcional)
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
    castColor: undefined,
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
  bg_color?: string; // color de fondo (hex o 'transparent')
  layer_cast_color?: string; // color de capa opcional
  layers: Array<TextLayer | ShapeLayer>;
}
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
  color?: string; // color (hex o 'auto')
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
  color?: string; // color de relleno (hex o 'auto')
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
  castColor?: string | undefined;
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
