// Exportar solo la implementación de Node.js
export type { Templete, Text, Shape, Filter } from './core/validate';
export type { Font } from './types';

import brushCore from "./core";
import { Path2D, Canvas, loadImage, type Image, GlobalFonts } from '@napi-rs/canvas'
import type { Templete } from "./core/validate";
import type { Font } from './types';


export async function getImages(imgUrl: string) {
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

    GlobalFonts.register( fontData, name );
  }
}

interface BrushProps {
  template: Templete,
  images: Record<string, Image>,
  filterText: Record<string, string | number | undefined>,
  castColor: string | undefined,
  fonts?: Font[]
}

export async function brush(props: BrushProps): Promise<Canvas> {
  const { template, images, filterText, castColor, fonts = [] } = props;
  await setFont(fonts, template);
  const canvas = new Canvas(template.w, template.h);
  const ctx = canvas.getContext('2d');
  brushCore({
    ctx: ctx as unknown as CanvasRenderingContext2D,
    template,
    Path2D: Path2D as unknown as typeof globalThis.Path2D,
    images: images as unknown as Record<string, HTMLImageElement | undefined>,
    filterText,
    castColor
  });
  return canvas;
}
