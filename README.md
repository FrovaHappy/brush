# Brush

Una librería de canvas universal que funciona tanto en el navegador como en Node.js. Permite renderizar plantillas de dibujo con capas de texto y formas en un contexto de canvas.

> ⚠️ **Aviso Importante**: Este proyecto está lejos de estar terminado y se mantiene únicamente en mis tiempos libres. Puede contener bugs, funcionalidades incompletas y cambios significativos en futuras versiones. Úsalo bajo tu propio riesgo. En próximos updates dejaré el código disponible en GitHub.

## Instalación

```bash
npm install @frova_happy/brush
```

## Tipos TypeScript

La librería incluye definiciones de tipos completas para TypeScript. Puedes importar los tipos de las siguientes maneras:

```typescript
// Importar tipos desde el paquete principal
import type { Templete, Text, Shape, Filter } from '@frova_happy/brush';

// Importar tipos desde entry points específicos
import type { Templete } from '@frova_happy/brush/web';
import type { Templete } from '@frova_happy/brush/node';

// También puedes importar la función de validación con tipos
import { validateCanvas } from '@frova_happy/brush';
import type { Templete } from '@frova_happy/brush';
```

## Uso Básico

### En el Navegador

```javascript
import { brush } from '@frova_happy/brush/web';

// Definir una plantilla
const template = {
  version: '1',
  title: 'Mi Dibujo',
  w: 800,
  h: 600,
  bg_color: '#ffffff',
  layers: [
    {
      id: 'texto1',
      type: 'text',
      dx: 100,
      dy: 100,
      text: 'Hola Mundo',
      size: 24,
      color: '#000000'
    },
    {
      id: 'forma1',
      type: 'shape',
      dx: 200,
      dy: 200,
      dw: 100,
      dh: 100,
      color: '#ff0000'
    }
  ]
};

// Renderizar en canvas
const canvas = await brush(
  template,
  {}, // imágenes (opcional)
  {}, // filtros de texto (opcional)
  undefined // color de capa (opcional)
);

// Agregar al DOM
document.body.appendChild(canvas);
```

### En Node.js

```javascript
import { brush, getImages } from '@frova_happy/brush/node';

// Definir una plantilla
const template = {
  version: '1',
  title: 'Mi Dibujo',
  w: 800,
  h: 600,
  bg_color: '#ffffff',
  layers: [
    {
      id: 'texto1',
      type: 'text',
      dx: 100,
      dy: 100,
      text: 'Hola Mundo',
      size: 24,
      color: '#000000'
    }
  ]
};

// Cargar imágenes si es necesario
const images = {};
// const images = { 'imagen1': await getImages('https://example.com/image.png') };

// Renderizar en canvas
const canvas = await brush(
  template,
  images,
  {},
  undefined
);

// Guardar como imagen
const fs = require('fs');
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('output.png', buffer);
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

La librería incluye validación automática de plantillas usando Zod:

```javascript
import { validateCanvas } from '@frova_happy/brush';

const result = validateCanvas(template);
if (!result.ok) {
  console.error('Errores de validación:', result.errors);
} else {
  console.log('Plantilla válida:', result.data);
}
```

## API

### brush (Core)

```typescript
function brush<Context extends CanvasRenderingContext2D>(props: {
  ctx: Context;
  template: Template;
  Path2D: typeof Path2D;
  images: Record<string, HTMLImageElement | undefined>;
  filterText: Record<string, string | number | undefined>;
  castColor?: string;
}): Context
```

### brush (Web)

```typescript
async function brush(
  template: Template,
  images: Record<string, HTMLImageElement | undefined>,
  filterText: Record<string, string | number | undefined>,
  castColor?: string
): Promise<HTMLCanvasElement>
```

### brush (Node)

```typescript
async function brush(
  template: Template,
  images: Record<string, Image>,
  filterText: Record<string, string | number | undefined>,
  castColor?: string
): Promise<Canvas>
```

## Dependencias

- **Navegador**: Ninguna dependencia adicional
- **Node.js**: Requiere `@napi-rs/canvas` para renderizado de canvas

## Limitaciones

- Ancho y alto máximo del canvas: 2000px
- Máximo 50 capas por plantilla
- Imágenes soportadas: PNG, JPG, JPEG, WebP, GIF, SVG
- Colores en formato hexadecimal (#RGB, #RRGGBB, #RRGGBBAA)

## Contribuir

1. Clona el repositorio
2. Instala dependencias: `npm install`
3. Ejecuta tests: `npm test`
4. Construye: `npm run build`

## Publicación

Este proyecto utiliza GitHub Actions para publicar automáticamente a npm cuando se crea un tag de versión.

### Configuración Inicial

1. Ve a la configuración del repositorio en GitHub (Settings > Secrets and variables > Actions).
2. Agrega un nuevo secreto llamado `NPM_TOKEN` con tu token de autenticación de npm.
   - Obtén tu token en [npmjs.com](https://www.npmjs.com/settings/tokens) (tipo: Automation).

### Crear una Nueva Versión

1. Actualiza la versión en `package.json` (ej: `"version": "1.0.0"`).
2. Crea un commit con los cambios: `git add . && git commit -m "Release v1.0.0"`.
3. Crea un tag anotado: `git tag -a v1.0.0 -m "Release v1.0.0"`.
4. Sube el tag: `git push origin v1.0.0`.

El workflow de GitHub Actions se activará automáticamente y publicará el paquete a npm.

## Licencia

Ver archivo LICENSE para detalles.
