
import { Canvas, loadImage, type Image, GlobalFonts, Path2D } from '@napi-rs/canvas'
import { Buffer } from 'node:buffer';
import brushCore from "./core";
import type { FilterText, Font, ShapeLayer, Templete } from './types';
import { includePalettes, isValidUrl, sanitizeTemplate } from "./platforms/utils";
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export type * from './types'


// polyfill Path2D for node-canvas
(globalThis as Record<string, unknown>).Path2D = Path2D as unknown as typeof globalThis.Path2D;

const BROWSER_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

async function fetchWithUserAgent(url: string) {
  return fetch(url, {
    headers: {
      'User-Agent': BROWSER_USER_AGENT
    },
    signal: AbortSignal.timeout(5000)
  });
}

// Helper function to load images in Node.js environment
async function getImages(template: Templete): Promise<Record<string, Image>> {

  const images: Record<string, Image> = {};
  for (const layer of template.layers) {
    if (layer.type === 'shape' && layer.image) {
      try {
        let imageSource: string | Buffer = layer.image;
        if (isValidUrl(layer.image)) {
           const response = await fetchWithUserAgent(layer.image);
           const arrayBuffer = await response.arrayBuffer();
           imageSource = Buffer.from(arrayBuffer);
        } else {
           const rutaAbsoluta = path.resolve(process.cwd(), layer.image);
           imageSource = await readFile(rutaAbsoluta);
        }
        images[layer.id] = await loadImage(imageSource);
      } catch (err) {
        console.warn(`Failed to load image for layer ${layer.id} from ${layer.image}`, err);
      }
    }
  }
  return images;
}

/**
 * Loads and registers custom typography fonts in the Node.js environment.
 * The loaded fonts will be registered globally via `@napi-rs/canvas`
 * and become available for use in text layers referencing them by name.
 * Supports loading from remote URLs or local file paths.
 * 
 * @param fonts An array of font configuration objects containing the font name and remote URL or path.
 * @returns A promise that resolves when the fonts are registered.
 */
export async function setFonts(fonts: Font[]) {
  for (const font of fonts) {
    const { url, name } = font;
    if (GlobalFonts.has(name)) continue;
    let archive: ArrayBuffer
    try {
      if (isValidUrl(url)) {
        archive = await (await fetchWithUserAgent(url)).arrayBuffer()
      } else {
        const rutaAbsoluta = path.resolve(process.cwd(), url);
        // Lee el archivo como Buffer (nativo de Node)
        const nodeBuffer = await readFile(rutaAbsoluta);

        // Convierte a ArrayBuffer
        archive = nodeBuffer.buffer.slice(
          nodeBuffer.byteOffset,
          nodeBuffer.byteOffset + nodeBuffer.byteLength
        );

      }
      GlobalFonts.register(Buffer.from(archive), name);
    } catch {
      console.log(`error load ${url}`)
    }
  }
}

async function getImageBuffer(image: string | undefined) {
  if (!image) return null
  try {
    if (isValidUrl(image)) {
      const data = await (await fetchWithUserAgent(image)).arrayBuffer()
      return Buffer.from(data)
    } else {
      const data = (await readFile(image)).buffer
      return Buffer.from(data)
    }
  } catch {
    return null
  }
}

interface BrushProps {
  template: Templete,
  filterText: FilterText,
}

/**
 * Resolves template variables and dynamic color palettes based on the provided template and input text.
 * 
 * This processes the template, extracts dominant/vibrant colors from the specified target image layer,
 * interpolates those colors and text variables (`{{variableName}}`) into the template, and returns
 * the fully resolved template and filter values.
 * 
 * @param template The template schema containing layout, layers, and configuration.
 * @param filterText A key-value dictionary representing template variable inputs for interpolation.
 * @returns A promise resolving to an object with the sanitized and fully resolved `template` and `filterText`.
 */
export async function generateVariables(template: Templete, filterText: FilterText) {
  const temp_template = sanitizeTemplate(template, filterText);
  const imageLayer = temp_template.layers.find(l => l.id === template.layerColor && l.type === 'shape') as ShapeLayer | undefined;
  const imageBuffer = await getImageBuffer(imageLayer?.image)
  filterText = await includePalettes(imageBuffer, filterText);
  template = sanitizeTemplate(template, filterText, true);
  return {
    template, filterText
  }
}

/**
 * Renders the provided template onto a Canvas object in Node.js using `@napi-rs/canvas`.
 * 
 * This function processes the template variables, loads all required images from local paths or URLs
 * asynchronously, prepares the canvas context, and draws the layers (shapes, images, texts, filters)
 * as defined in the template.
 * 
 * @param props Configuration properties containing the template and filter inputs.
 * @param props.template The canvas template to render.
 * @param props.filterText A dictionary of variable values to interpolate into the template.
 * @returns A promise that resolves with the rendered Canvas instance.
 */
export async function brush(props: BrushProps): Promise<Canvas> {
  const { template, filterText } = await generateVariables(props.template, props.filterText);
  const images = await getImages(template);

  const canvas = new Canvas(template.w, template.h);
  const ctx = canvas.getContext('2d');
  const supportCanvas = new Canvas(template.w, template.h)
  const supportCtx = supportCanvas.getContext('2d')

  brushCore({
    ctx: ctx as unknown as CanvasRenderingContext2D,
    supportCtx: supportCtx as unknown as CanvasRenderingContext2D,
    template,
    images: images as unknown as Record<string, HTMLImageElement | undefined>,
    filterText,
  });
  return canvas;
}

export { compileSVGPath } from './core/compileSVGPath';
