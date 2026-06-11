
import { Canvas, loadImage, type Image, GlobalFonts, Path2D } from '@napi-rs/canvas'
// biome-ignore lint/style/useNodejsImportProtocol: conflicts with bundler module resolution
import { Buffer } from 'buffer';
import brushCore from "./core";
import type { FilterText, Font, ShapeLayer, Templete } from './types';
import { includePalettes, sanitizeTemplate } from "./platforms/utils";
import { Vibrant } from "node-vibrant/node";

// polyfill Path2D for node-canvas
(globalThis as any).Path2D = Path2D as unknown as typeof globalThis.Path2D;

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
    // check if the path is valid
    if (!/^https?:\/\//.test(url) && !/^\/|^[a-zA-Z]:\\/.test(url)) {
      console.warn(`Invalid font URL: ${url}`);
      continue;
    }
    const fontData = await fetch(url).then(res => res.arrayBuffer()).then(buf => Buffer.from(buf));
    GlobalFonts.register(fontData, name);
  }
}

interface BrushProps {
  template: Templete,
  filterText: FilterText,
}

export async function brush(props: BrushProps): Promise<Canvas> {
  const imageLayer = props.template.layers.find(l => l.id === props.template.layerColor && l.type === 'shape') as ShapeLayer | undefined;
  const filterText = await includePalettes(imageLayer?.image, props.filterText, Vibrant);
  const template = sanitizeTemplate(props.template, filterText);
  const images = await getImages(template);
  const canvas = new Canvas(template.w, template.h);
  const ctx = canvas.getContext('2d');
  brushCore({
    ctx: ctx as unknown as CanvasRenderingContext2D,
    template,
    images: images as unknown as Record<string, HTMLImageElement | undefined>,
    filterText,
  });
  return canvas;
}
