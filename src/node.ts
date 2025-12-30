// Exportar solo la implementación de Node.js
export { type Templete, type Text, type Shape, type Filter, isShape, isText } from './core/validate';
export type { Font } from './types';

import brushCore from "./core";
import { Path2D, Canvas, loadImage, type Image, GlobalFonts } from '@napi-rs/canvas'
import { isShape, type Templete } from "./core/validate";
import type { Font } from './types';
import { replaceAllValues } from './platforms/utils';


async function getImages(imgUrl: string) {
  const img = loadImage(imgUrl);
  return img
}

export async function setFont(fonts: Font[], template: Templete): Promise<void> {
  const families = new Set<string>();
  template.layers.forEach(layer => {
    if ((layer as any).family) {
      families.add((layer as any).family);
    }
  });
  for (const font of fonts) {
    const { url, name } = font;
    if (!families.has(name)) continue;
    if (GlobalFonts.has(name)) continue;
    const fontData = await fetch(url).then(res => res.arrayBuffer()).then(buf => Buffer.from(buf));

    GlobalFonts.register(fontData, name);
  }
}

interface BrushProps {
  template: Templete,
  filterText: Record<string, string | number | undefined>,
  fonts?: Font[]
}

export async function brush(props: BrushProps): Promise<Canvas> {
  const { template, filterText, fonts = [] } = props;

  const images: Record<string, Image> = {};
  for (const layer of template.layers) {
    if (isShape(layer) && layer.image) {
      try {
        const url = replaceAllValues(layer.image, filterText);
        const img = await getImages(url);
        images[layer.id] = img;
      } catch (error) {
        console.error(`Failed to load image for layer ${layer.id}:`, error);
      }
    }
  }
  await setFont(fonts, template);
  const canvas = new Canvas(template.w, template.h);
  const ctx = canvas.getContext('2d');
  brushCore({
    ctx: ctx as unknown as CanvasRenderingContext2D,
    template,
    Path2D: Path2D as unknown as typeof globalThis.Path2D,
    images: images as unknown as Record<string, HTMLImageElement | undefined>,
    filterText,
  });
  return canvas;
}
