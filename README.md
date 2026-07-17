# 🖌️ Brush

*Leer en [Español](README-Spanish.md).*

![Brush Banner](https://cdn.jsdelivr.net/npm/@frova_happy/brush@latest/banner.png)

A powerful and flexible **Universal Canvas** library designed to work perfectly in both the **Browser** and **Node.js**. It allows rendering dynamic templates composed of configurable shapes and image layers, adaptable texts, and advanced filters, facilitating the dynamic generation of images, banners, and visual assets.

The source code is available on GitHub: [FrovaHappy/brush](https://github.com/FrovaHappy/brush) and the package is published on npm: [@frova_happy/brush](https://www.npmjs.com/package/@frova_happy/brush).
Leave a star ⭐ if you like the project and help me improve it.

---

## 🚀 Main Features

* **Universal:** Same code and behavior on both client (Browser) and server (Node.js).
* **Flexible Layers:** Support for shape (`shape`) and text (`text`) layers.
* **Dynamic Palette Extraction:** Automatically extracts dominant and vibrant colors from a loaded image and allows using them in other layers via variables like `{{pallete_Vibrant}}`, `{{pallete_Muted}}`, etc.
* **SVG Clipping Masks:** Allows clipping shapes and images using any SVG path.
* **Fit and Scale:** Support for `objectFit` (`cover`, `contain`, `fill`) and transformations like rotations (`rotation`).
* **Dynamic Typography:** Preloads system fonts or remote fonts (`.ttf`, `.woff2` files, etc.) through a simple API.
* **CSS Filters:** Full support for styling filters (shadows, blurs, brightness, contrast, grayscale, opacity, saturation, sepia, and more) applied directly to layers.
* **Integrated Validation:** Robust runtime template schema validation using **Zod**.

---

## 🛠️ Technologies Used

The project uses a modern set of tools and libraries to ensure optimal performance and cross-platform compatibility:

* **Main Language:** [TypeScript](https://www.typescriptlang.org/) for strict and safe typing.
* **Server Canvas Engine:** [@napi-rs/canvas](https://github.com/brooooooklyn/canvas) for ultra-fast rendering in Node.js via native Rust bindings.
* **Color Extraction:** [colorthief](https://github.com/lokesh/color-thief) to analyze and extract harmonious color palettes from images.
* **Image Processing:** [Sharp](https://sharp.pixelplumbing.com/) for optimized image operations in Node.js.
* **Unit Testing:** [Vitest](https://vitest.dev/) to ensure expected behavior.
* **Code Quality:** [Biome](https://biomejs.dev/) for fast linting and formatting.

---

## ⚡ Quick Start

Install the library in your project:

```bash
npm install @frova_happy/brush
```

### Getting Started

Depending on your environment, import the corresponding module:

#### 🌐 In the Browser

You can see a complete example in the [example/html/index.html](https://github.com/FrovaHappy/brush/blob/main/example/html/index.html) file.

```javascript
import { brush, setFonts } from '@frova_happy/brush/browser';

// 1. Load custom fonts (optional)
await setFonts([
  { name: 'Text', url: 'https://fonts.gstatic.com/s/loversquarrel/v25/Yq6N-LSKXTL-5bCy8ksBzpQ_-wArabs.woff2' }
]);

// 2. Define the template
const template = {
  version: '1',
  w: 800,
  h: 400,
  backgroundColor: '#f3f4f6',
  layers: [
    {
      id: 'my-text',
      type: 'text',
      text: 'Hello {{name}}!',
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

// 3. Render on the canvas
const canvas = await brush({
  template,
  filterText: { name: 'Developer' }
});

document.body.appendChild(canvas);
```

#### 🟢 In Node.js

You can see a complete example in the [example/node/index.js](https://github.com/FrovaHappy/brush/blob/main/example/node/index.js) file.

```javascript
import { brush, setFonts } from '@frova_happy/brush/node';
import { writeFile } from 'node:fs/promises';

// Load fonts and render
await setFonts([{ name: 'Text', url: 'https://fonts.gstatic.com/...' }]);

const canvas = await brush({
  template, // Template structure
  filterText: { name: 'Developer' }
});

const buffer = await canvas.encode('png');
await writeFile('./output.png', buffer);
```

#### ⚛️ In React

You can explore an integrated example inside the [example/react](https://github.com/FrovaHappy/brush/blob/main/example/react) folder.

---

## 🔌 API

### `setFonts(fonts)`

Loads and registers external typographic fonts **before** calling `brush()`. Loaded fonts become available for use in `text` layers via the `fontFamily` property.

```typescript
type Font = {
  name: string; // Name to reference the font in fontFamily
  url: string;  // Remote URL (https://...) or local path relative to the process
}

setFonts(fonts: Font[]): Promise<void>
```

**Behavior:**

* If the font is already registered (Node.js), it skips without error.
* In the browser, it uses the `FontFace` API. In Node.js, it uses `@napi-rs/canvas`'s `GlobalFonts.register`.
* If a font fails to load, it emits a `console.warn` and continues with the others.

**Example:**

```javascript
import { setFonts, brush } from '@frova_happy/brush/browser';

await setFonts([
  { name: 'MyFont', url: 'https://example.com/fonts/MyFont.woff2' },
  { name: 'Roboto', url: '/static/fonts/Roboto-Regular.ttf' }
]);

const canvas = await brush({
  template: {
    version: '1',
    w: 800, h: 400,
    layers: [
      {
        id: 'title',
        type: 'text',
        text: 'Hello world',
        x: 400, y: 200,
        fontFamily: 'MyFont', // reference to the name registered in setFonts
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
> Always call `setFonts()` **before** `brush()`. If `brush()` is executed first, text layers will use system fonts as a fallback.

---

### `filterText`

`filterText` is a key-value object (`Record<string, string | undefined>`) passed to `brush()`. It acts as a **variable interpolation** system over the entire template.

Any string in the template containing `{{name}}` will be replaced by the corresponding value in `filterText` before rendering.

```typescript
type FilterText = Record<string, string | undefined>
```

**Basic Example:**

```javascript
const canvas = await brush({
  template: {
    version: '1',
    w: 600, h: 200,
    layers: [
      {
        id: 'greeting',
        type: 'text',
        text: 'Welcome, {{username}}! Level {{level}}',
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
// Result → "Welcome, FrovaHappy! Level 42"
```

#### **Color palette variables (`pallete_*`):**

If the template has a `layerColor` pointing to a layer with an image, `brush()` automatically extracts the palette from that image and injects it into `filterText` before rendering. The generated variables are:

| Variable | Description |
| :--- | :--- |
| `{{pallete_Vibrant}}` | Main vibrant color of the image. |
| `{{pallete_LightVibrant}}` | Light vibrant variant. |
| `{{pallete_DarkVibrant}}` | Dark vibrant variant. |
| `{{pallete_Muted}}` | Main muted color. |
| `{{pallete_LightMuted}}` | Light muted variant. |
| `{{pallete_DarkMuted}}` | Dark muted variant. |

These variables can be used in any string of the template, including layer colors, shadow filters, etc.
> [!IMPORTANT]
> Some colors might not be generated depending on the color range of the image. E.g., if an image is black and white, it might generate no more than two. The rest will be `#000000`.

```javascript
const template = {
  version: '1',
  w: 800, h: 400,
  backgroundColor: '{{pallete_LightVibrant}}', // dynamic background color
  layerColor: 'avatar',                          // extract palette from this layer
  layers: [
    {
      id: 'avatar',
      type: 'shape',
      image: 'https://example.com/avatar.png',
      x: 50, y: 100, w: 200, h: 200,
      color: 'auto'
    },
    {
      id: 'name',
      type: 'text',
      text: '{{username}}',
      x: 300, y: 200,
      fontSize: 40,
      color: '{{pallete_DarkVibrant}}', // use color extracted from image
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
> If a `{{name}}` variable is not found in `filterText`, it gets replaced with the string `null_sanitized` and a `console.warn` is emitted.

---

### `generateVariables(template, filterText)`

> added in version 0.4.1

Generates variables and sanitizes the template before drawing on the canvas. It is useful for retrieving the processed template and `filterText` (for example, if you need to extract `pallete_*` variables from `layerColor` without rendering the canvas immediately).

```typescript
generateVariables(template: Templete, filterText: FilterText): Promise<{ template: Templete, filterText: FilterText }>
```

**Example:**

```javascript
import { generateVariables } from '@frova_happy/brush/node'; // or /browser

const { template: processedTemplate, filterText: processedFilterText } = await generateVariables(
  template,
  { name: 'Developer' }
);
```

---

### `sanitizeTemplate(template, values, log)`

> added in version 0.6.0

Replaces all dynamic variables formatted as `{{variable_name}}` in the template object with the values provided in the `values` object. If a variable is not found in the values, it will be replaced with an empty string.

```typescript
sanitizeTemplate<T>(template: T, values: Record<string, string | number | undefined>, log?: boolean): T
```

**Parameters:**

* `template`: The template object to sanitize.
* `values`: A key-value dictionary representing the variable inputs to interpolate into the template.
* `log`: (Optional, default `false`) If set to `true`, a warning is logged to the console for any variable in the template that is not present in `values`.

**Example:**

```javascript
import { sanitizeTemplate } from '@frova_happy/brush/node'; // or /browser

const template = {
  version: '1',
  w: 800,
  layers: [
    {
      id: 'title',
      type: 'text',
      text: 'Welcome, {{name}}!'
    }
  ]
};

const sanitized = sanitizeTemplate(template, { name: 'Alice' });
// Result -> { version: '1', w: 800, layers: [ { id: 'title', type: 'text', text: 'Welcome, Alice!' } ] }
```

---

### `compileSVGPath(svg, resize)`

> added in version 0.5.1

Compiles an SVG XML string into a single path string `d` and extracts the width and height dimensions of the SVG. Basic shape elements such as `<rect>`, `<circle>`, `<ellipse>`, `<line>`, `<polygon>`, and `<polyline>` are automatically compiled and approximated as SVG path commands.

```typescript
compileSVGPath(svg: string | undefined, resize?: number): { d: string, w: number, h: number } | undefined
```

**Parameters:**

* `svg`: The SVG markup string to compile. Returns `undefined` if not provided.
* `resize`: (Optional) Proportional scaling target size. If provided, the compiled path commands and dimensions will be scaled so that the maximum dimension (width or height) matches this value.

**Example:**

```javascript
import { compileSVGPath } from '@frova_happy/brush/node'; // or /browser

const svg = `
<svg width="100" height="100" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="40" fill="red" />
</svg>
`;

const result = compileSVGPath(svg, 200);
// Result → { d: "M 20 100 A 80 80 0 1 0 180 100 A 80 80 0 1 0 20 100 Z", w: 200, h: 200 }
```

---

## 📖 Detailed Template Properties Reference

### 1. Main Template (`Templete`)

Represents the base configuration of the canvas and its main layers.
> [!Note]
> If you declare 'auto' in 'backgroundColor' or 'layer.color' and use 'layerColor', it uses the color obtained from '{{pallete_Vibrant}}'. If not found, it uses 'black'.

| Property | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `version` | `'1'` | Yes | Template structure version. |
| `w` | `number` | Yes | Canvas width in pixels. |
| `h` | `number` | Yes | Canvas height in pixels. |
| `backgroundColor` | `string` | No | General background color (supports HEX, RGB, HSL, gradients, or transparent). |
| `layerColor` | `string` | No | ID of the `shape` layer (containing an image) from which to extract the dynamic color palette. You can use them via {{value}} in the template, see [filterText](#color-palette-variables-pallete_). |
| `layers` | `Layer[]` | Yes | Array of layers making up the visual design. |

---

### 2. Shape / Image Layer (`ShapeLayer`)

Used to render rectangles, full images, or objects clipped by vector paths.

| Property | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | Yes | Unique layer identifier. Used to extract colors if associated with `layerColor`. |
| `type` | `'shape'` | Yes | Identifies the layer type. |
| `x` | `number` | Yes | Horizontal position on the canvas. |
| `y` | `number` | Yes | Vertical position on the canvas. |
| `w` | `number` | Yes | Width of the shape or image. |
| `h` | `number` | Yes | Height of the shape or image. |
| `image` | `string` | No | Image URL or path. If not provided, the layer acts as a flat rectangular shape. |
| `color` | `string` | Yes | Fill color or fallback. Supports common CSS colors, or `'auto'` to inherit the automatically extracted color. |
| `scale` | `number` | No | Internal image scaling factor. Defaults to `1`. |
| `objectFit` | `'cover' \| 'contain' \| 'fill'` | No | Fit and proportion of the image within the layer bounds. |
| `rotation` | `number` | No | Rotation angle of the layer in degrees (e.g., `45`). |
| `svg` | `string` | No | SVG XML string to use as a clipping mask. |
| `align` | `string` | No | SVG mask alignment. Example: `'center center'`, `'top left'`. |
| `filter` | `Filter` | No | CSS style filters applied to the shape. |

---

### 3. Text Layer (`TextLayer`)

Allows adding dynamic typographic elements with automatic line breaks and substitutions.

| Property | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | Yes | Unique layer identifier. |
| `type` | `'text'` | Yes | Identifies the layer type. |
| `text` | `string` | Yes | Text to display. Supports dynamic variables using `{{variable_name}}` syntax. |
| `x` | `number` | Yes | Horizontal position. |
| `y` | `number` | Yes | Vertical position. |
| `maxWidth` | `number` | No | Maximum allowed width before forcing an automatic line break. |
| `lineHeight` | `number` | No | Line height in pixels for multiline texts. |
| `rotation` | `number` | No | Rotation angle of the layer in degrees. |
| `fontSize` | `number` | No | Font size in pixels. Defaults to `16`. |
| `fontFamily` | `string` | No | Typography name. E.g., `'Arial'`. Must be registered beforehand if external. |
| `fontWeight` | `string` | No | Font weight. E.g., `'bold'`, `'normal'`, etc. |
| `color` | `string` | Yes | Text color. Supports CSS values or `'auto'`. |
| `strokeColor` | `string` | No | Stroke or outer outline color of the text. |
| `strokeWidth` | `number` | No | Outline stroke width in pixels. |
| `textAlign` | `'left' \| 'right' \| 'center' \| 'start' \| 'end'` | No | Horizontal text alignment. |
| `textBaseline` | `'top' \| 'hanging' \| 'middle' \| 'alphabetic' \| 'ideographic' \| 'bottom'` | No | Vertical text alignment relative to its base coordinate. E.g., `'middle'`. |
| `filter` | `Filter` | No | CSS style filters applied to the text. |

---

### 4. Filters Object (`Filter`)

Stylistic filters inspired by CSS Canvas specifications.

| Property | Type | Value Example | Description |
| :--- | :--- | :--- | :--- |
| `blur` | `string` | `'5px'` | Gaussian blur of the layer. |
| `brightness` | `string` | `'150%'` or `'1.5'` | Element brightness modification. |
| `contrast` | `string` | `'200%'` or `'2'` | Layer contrast. |
| `grayscale` | `string` | `'100%'` or `'1'` | Grayscale conversion. |
| `'hue-rotate'` | `string` | `'90deg'` | Color hue rotation. |
| `invert` | `string` | `'100%'` or `'1'` | Chromatic inversion. |
| `opacity` | `string` | `'0.5'` or `'50%'` | Opacity and transparency level. |
| `saturate` | `string` | `'200%'` or `'2'` | Chromatic saturation level. |
| `sepia` | `string` | `'100%'` or `'1'` | Sepia effect. |
| `'drop-shadow'` | `string` | `'10px 10px 5px rgba(0,0,0,0.5)'` | Drop shadows with coordinates, blur, and color. |

---

## 🤝 Collaboration and Contribution

Contributions are welcome! If you want to improve the library, fix a bug, or propose new features, please follow these steps:

1. **Fork** the repository.
2. Create a branch for your feature or fix: `git checkout -b feature/new-feature`
3. Install dependencies and ensure tests pass with `npm test` and the formatter with `npm run lint`.
4. Submit your changes via a **Pull Request** detailing the improvements made.

To resolve or ask questions, you can also open an [Issue on GitHub](https://github.com/FrovaHappy/brush/issues).

---

## 📄 License

This project is under the **MIT** license. See the [LICENSE](./LICENSE) file for more information.
