# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Brush is a universal canvas library that works in both browser and Node.js environments. It renders drawing templates with layers of text and shapes on a canvas context. The library uses TypeScript with Zod for runtime validation and is built as dual CJS/ESM packages with platform-specific entry points.

## Build System & Commands

### Build Commands
- `npm run build` - Full build: cleans, builds CJS, ESM, and type definitions
- `npm run build:cjs` - Build CommonJS modules using esbuild
- `npm run build:esm` - Build ES modules using esbuild
- `npm run build:types` - Generate TypeScript declarations using tsc
- `npm run clean` - Remove dist directory

### Development Commands
- `npm run dev` - Watch mode: rebuilds on file changes (ESM format)
- `npm run lint` - Lint code using Biome

### Testing & Publishing
- `npm test` - No tests currently defined
- `npm run prepublishOnly` - Runs full build before publishing

### Platform-Specific Entry Points
The library has three separate entry points:
- `@frova_happy/brush` - Core types and validation only
- `@frova_happy/brush/web` - Browser implementation
- `@frova_happy/brush/node` - Node.js implementation (requires @napi-rs/canvas)

## Code Architecture

### Core Rendering Engine (`src/core/`)

**`core/index.ts`** - Main rendering orchestrator
- Exports `brush()` function that takes a generic CanvasRenderingContext2D
- Iterates through template layers and delegates to specialized renderers
- Handles canvas setup (clearing, background color, save/restore state)

**`core/validate.ts`** - Template validation using Zod schemas
- Defines `Templete`, `Text`, `Shape`, and `Filter` types
- Enforces constraints: max 2000px canvas dimensions, max 50 layers
- Validates colors (hex format), image URLs, and filter values
- Exports `validateCanvas()` function and type guards `isText()`, `isShape()`

**`core/brushText.ts`** - Text layer renderer
- Handles text rendering with fonts, alignment, baseline, opacity
- Supports text truncation via `maxWidth` property
- Applies filters and supports variable replacement via `filterText` record
- Handles `auto` color resolution using `castColor`

**`core/brushShape.ts`** - Shape layer renderer
- Renders rectangles with optional images
- Supports SVG clip paths with alignment options
- Handles image scaling and positioning within shapes
- Applies CSS filters to shapes

**`core/buildFilter.ts`** - CSS filter string builder
- Converts filter object to CSS filter string
- Supports blur, brightness, contrast, drop-shadow, grayscale, hue-rotate, invert, opacity, saturate, sepia

**`core/compileSVG.ts`** - SVG path extractor
- Parses SVG strings to extract path data for clipping

### Platform Adapters (`src/platforms/`)

**`platforms/web.ts`** - Browser implementation
- Creates HTMLCanvasElement using `document.createElement('canvas')`
- Uses native `window.Path2D` and browser canvas context
- Returns HTMLCanvasElement that can be appended to DOM

**`platforms/node.ts`** - Node.js implementation
- Uses `@napi-rs/canvas` for Canvas and Image types
- Exports `getImages()` helper to load images via URL
- Returns Canvas object that can be converted to buffer (e.g., `canvas.toBuffer('image/png')`)

**`platforms/utils.ts`** - Shared utilities
- Contains `replaceAllValues()` for text variable substitution

### Entry Points

- `src/index.ts` - Exports validation and types only
- `src/web.ts` - Re-exports web platform implementation
- `src/node.ts` - Re-exports node platform implementation

## Key Architectural Patterns

### Platform Abstraction
The core renderer is platform-agnostic and accepts any `CanvasRenderingContext2D`-compatible context. Platform adapters in `platforms/` handle environment-specific canvas creation and pass the context to core.

### Layer-Based Rendering
Templates define an array of layers that are rendered sequentially. Each layer has a unique `id` and `type` ('text' or 'shape'). The core renderer uses type guards to delegate to the appropriate specialized renderer.

### Color Casting
The `castColor` parameter allows dynamic color substitution. When a layer's color is set to `'auto'`, it will use the provided `castColor` value. This enables theming and dynamic color schemes.

### Image Management
Images are passed as a `Record<string, Image>` where keys match layer IDs. The shape renderer looks up images by layer ID. Supported placeholders: `{{user_avatar}}`, `{{user_banner}}`, `{{server_avatar}}`, `{{server_banner}}`.

### Text Filtering
The `filterText` record allows variable substitution in text layers. Text content can include placeholders that are replaced at render time using `replaceAllValues()`.

## TypeScript Configuration

- Target: ES2020
- Strict mode enabled with all checks
- Generates declarations and source maps
- Two tsconfigs: main config for compilation, `tsconfig.types.json` for declaration-only builds

## Linting (Biome)

Configuration in `biome.json`:
- Unused variables treated as errors
- Non-null assertions allowed (off)
- Explicit `any` generates warnings
- Only lints `src/**/*` files

## Build Output Structure

```
dist/
├── cjs/          # CommonJS modules (Node.js)
├── esm/          # ES modules (modern bundlers)
└── types/        # TypeScript declarations
```

## Development Notes

### Adding New Layer Types
1. Define Zod schema in `core/validate.ts`
2. Add union type to `canvasSchema.layers`
3. Create renderer in `core/brushLayerType.ts`
4. Add type guard function (e.g., `isLayerType()`)
5. Update core renderer to handle new type

### Adding New Filters
1. Add property to `filterSchema` in `core/validate.ts`
2. Update `buildFilter()` in `core/buildFilter.ts` to generate CSS filter string
3. Filters apply to both text and shape layers

### Testing in Browser vs Node
- Browser: Use `@frova_happy/brush/web`, test in HTML file
- Node.js: Use `@frova_happy/brush/node`, requires `@napi-rs/canvas` peer dependency
- Core validation can be tested independently without platform-specific code

### Constraints to Remember
- Canvas max dimensions: 2000x2000px (defined in `MAX_WIDTH_CANVAS`)
- Max 50 layers per template
- Colors must be hex format: #RGB, #RRGGBB, or #RRGGBBAA
- Font weights must be multiples of 100 (200-1000)
- Supported image formats: PNG, JPG, JPEG, WebP, GIF, SVG
