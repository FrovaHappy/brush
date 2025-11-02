# Brush 🎨

Una librería de canvas universal que funciona tanto en el navegador como en Node.js, proporcionando una API consistente para dibujar gráficos 2D.

## Características

- ✅ **Universal**: Funciona en navegador y Node.js
- ✅ **TypeScript**: Completamente tipado
- ✅ **Dual Package**: Soporta ESM y CommonJS
- ✅ **API Consistente**: Misma interfaz en ambos entornos
- ✅ **Canvas Nativo**: Usa HTMLCanvasElement en el navegador
- ✅ **Canvas de Alto Rendimiento**: Usa @napi-rs/canvas en Node.js

## Instalación

```bash
npm install brush
```

Para usar en Node.js, también necesitas instalar la dependencia de canvas:

```bash
npm install @napi-rs/canvas
```

## Uso Básico

### En el Navegador

```typescript
import { createWebBrush } from 'brush/web';

// Crear un nuevo canvas
const brush = await createWebBrush({ width: 800, height: 600 });

// O usar un canvas existente
const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
const brush = await createWebBrush(canvas);

// Dibujar formas
brush.rect(50, 50, 200, 150, '#ff0000');
brush.circle(400, 200, 80, '#0000ff');
brush.line(100, 300, 600, 400, '#00ff00', 5);

// Montar en el DOM
brush.mount(document.body);

// Descargar como imagen
brush.download('mi-dibujo.png');
```

### En Node.js

```typescript
import { createNodeBrush } from 'brush/node';

// Crear un nuevo canvas
const brush = await createNodeBrush({ width: 800, height: 600 });

// Dibujar formas
brush.rect(50, 50, 200, 150, '#ff0000');
brush.circle(400, 200, 80, '#0000ff');
brush.line(100, 300, 600, 400, '#00ff00', 5);

// Guardar como archivo
await brush.saveAs('./output.png');

// O obtener como buffer
const buffer = brush.toBuffer('image/jpeg');
```

### Detección Automática de Entorno

```typescript
import { createBrush } from 'brush';

// Se selecciona automáticamente la implementación correcta
const brush = await createBrush({ width: 800, height: 600 });

// API consistente en ambos entornos
brush.rect(10, 10, 100, 100, '#purple');
brush.circle(200, 200, 50, '#orange');
```

## API Reference

### Métodos de Dibujo

#### `rect(x, y, width, height, fillColor?)`
Dibuja un rectángulo.

- `x, y`: Posición
- `width, height`: Dimensiones
- `fillColor`: Color de relleno (opcional, si no se especifica dibuja solo el contorno)

#### `circle(x, y, radius, fillColor?)`
Dibuja un círculo.

- `x, y`: Centro del círculo
- `radius`: Radio
- `fillColor`: Color de relleno (opcional)

#### `line(x1, y1, x2, y2, strokeColor?, lineWidth?)`
Dibuja una línea.

- `x1, y1`: Punto inicial
- `x2, y2`: Punto final
- `strokeColor`: Color de la línea (opcional)
- `lineWidth`: Grosor de la línea (opcional)

### Métodos de Configuración

#### `setFillColor(color)`
Establece el color de relleno por defecto.

#### `setStrokeColor(color)`
Establece el color de trazo por defecto.

#### `clear()`
Limpia todo el canvas.

### Métodos Específicos del Navegador

#### `mount(container)`
Monta el canvas en un elemento del DOM.

#### `download(filename?, type?)`
Descarga el canvas como imagen.

#### `toDataURL(type?, quality?)`
Obtiene el canvas como data URL.

### Métodos Específicos de Node.js

#### `saveAs(filepath, type?)`
Guarda el canvas como archivo de imagen.

#### `toBuffer(type?)`
Obtiene el canvas como buffer de imagen.

## Ejemplos

### Ejemplo Completo para el Navegador

```html
<!DOCTYPE html>
<html>
<head>
    <title>Brush Example</title>
</head>
<body>
    <script type="module">
        import { createWebBrush } from 'brush/web';
        
        async function main() {
            const brush = await createWebBrush({ width: 600, height: 400 });
            
            // Dibujar un paisaje simple
            brush.rect(0, 300, 600, 100, '#90EE90'); // Pasto
            brush.circle(500, 100, 50, '#FFD700');   // Sol
            brush.rect(200, 200, 80, 100, '#8B4513'); // Tronco
            brush.circle(240, 150, 60, '#228B22');   // Copa del árbol
            
            brush.mount(document.body);
        }
        
        main();
    </script>
</body>
</html>
```

### Ejemplo Completo para Node.js

```javascript
const { createNodeBrush } = require('brush/node');

async function generateChart() {
    const brush = await createNodeBrush({ width: 800, height: 600 });
    
    // Fondo blanco
    brush.rect(0, 0, 800, 600, '#ffffff');
    
    // Datos de ejemplo
    const data = [30, 45, 60, 25, 80, 40];
    const barWidth = 100;
    const spacing = 20;
    
    // Dibujar gráfico de barras
    data.forEach((value, index) => {
        const x = index * (barWidth + spacing) + 50;
        const y = 500 - (value * 4); // Escalar valor
        const height = value * 4;
        
        const hue = (index * 60) % 360;
        const color = `hsl(${hue}, 70%, 50%)`;
        
        brush.rect(x, y, barWidth, height, color);
    });
    
    await brush.saveAs('./chart.png');
    console.log('Gráfico guardado como chart.png');
}

generateChart();
```

## Estructura del Proyecto

```
brush/
├── src/
│   ├── core/
│   │   └── base.ts          # Clases e interfaces base
│   ├── platforms/
│   │   ├── web.ts           # Implementación para navegador
│   │   └── node.ts          # Implementación para Node.js
│   ├── index.ts             # Entrada principal con detección automática
│   ├── web.ts               # Entrada específica para web
│   └── node.ts              # Entrada específica para Node.js
├── examples/
│   ├── web/
│   │   └── index.html       # Ejemplo para navegador
│   └── node/
│       └── basic.js         # Ejemplo para Node.js
└── dist/                    # Archivos compilados
```

## Scripts de Desarrollo

```bash
# Instalar dependencias
npm install

# Compilar el proyecto
npm run build

# Desarrollo con watch mode
npm run dev

# Linting
npm run lint

# Limpiar dist
npm run clean
```

## Compatibilidad

- **Node.js**: 16.0.0 o superior
- **Navegadores**: Todos los navegadores modernos con soporte para Canvas API
- **TypeScript**: 5.0 o superior

## Licencia

MIT

## Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## Roadmap

- [ ] Soporte para más tipos de formas (polígonos, elipses, etc.)
- [ ] Gradientes y patrones
- [ ] Transformaciones (rotación, escala, etc.)
- [ ] Soporte para texto
- [ ] Animaciones
- [ ] Filtros y efectos
- [ ] Soporte para SVG export