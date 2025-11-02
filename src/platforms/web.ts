import brushCore from "../core";
import type { Templete } from "../core/validate";

export async function brush(config: { width: number; height: number }, template: Templete, images: Record<string, HTMLImageElement | undefined>, filterText: Record<string, string | number | undefined>, castColor: string | undefined): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  canvas.width = config.width;
  canvas.height = config.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D context from canvas');
  brushCore({
    ctx,
    template,
    Path2D: window.Path2D,
    images,
    filterText,
    castColor
  });
  return canvas;
}