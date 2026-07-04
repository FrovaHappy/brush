
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

// Helper function to load images in Node.js environment
async function getImages(template: Templete): Promise<Record<string, Image>> {

  const images: Record<string, Image> = {};
  for (const layer of template.layers) {
    if (layer.type === 'shape' && layer.image) {
      try {
        images[layer.id] = await loadImage(layer.image);
      } catch (err) {
        console.warn(`Failed to load image for layer ${layer.id} from ${layer.image}`, err);
      }
    }
  }
  return images;
}

export async function setFonts(fonts: Font[]) {
  for (const font of fonts) {
    const { url, name } = font;
    if (GlobalFonts.has(name)) continue;
    let archive: ArrayBuffer
    try {
      if (isValidUrl(url)) {
        archive = await (await fetch(url)).arrayBuffer()
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
      const data = await (await fetch(image)).arrayBuffer()
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

export async function brush(props: BrushProps): Promise<Canvas> {
  let template = sanitizeTemplate(props.template, props.filterText);
  const imageLayer = template.layers.find(l => l.id === template.layerColor && l.type === 'shape') as ShapeLayer | undefined;
  const imageBuffer = await getImageBuffer(imageLayer?.image)
  const filterText = await includePalettes(imageBuffer, props.filterText);
  template = sanitizeTemplate(props.template, filterText, true);
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
