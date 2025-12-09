// Exportar solo la implementación de Node.js
export type { Templete, Text, Shape, Filter } from './core/validate';
import brushCore from "./core";
import { Path2D, Canvas, loadImage, type Image } from '@napi-rs/canvas'
import type { Templete } from "./core/validate";

export async function getImages(imgUrl: string) {
  const img = loadImage(imgUrl);
  return img
}

export function brush(template: Templete, images: Record<string, Image>, filterText: Record<string, string | number | undefined>, castColor: string | undefined): Canvas {
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
