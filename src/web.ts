import brushCore from "./core";
import type { Templete } from "./core/validate";
import { Font } from "./types";

export async function setFont(fonts: Font[], template: Templete): Promise<void> {
  if (!fonts || fonts.length === 0) return;
  const families = new Set<string>();
  const $fonts = document.fonts;
  template.layers.forEach(layer => {
    if ((layer as any).family) {
      families.add((layer as any).family);
    }
  });


  for (const font of fonts) {
    const { url, name } = font;
    if (!families.has(name)) continue;
    const parseName = name.includes(' ') ? `"${name}"` : name;
    try {
      const fontFace = new FontFace(name, `url(${url})`);
      await fontFace.load();
      $fonts.add(fontFace);
      console.log(await $fonts.load(`16px ${parseName}`));
    } catch (err) {
      console.warn(`Failed to load font ${name} from ${url}`, err);
    }
  }
}
interface BrushProps {
  template: Templete,
  images: Record<string, HTMLImageElement | undefined>,
  filterText: Record<string, string | number | undefined>,
  castColor: string | undefined,
  fonts?: Font[]
}

export async function brush(props: BrushProps): Promise<HTMLCanvasElement> {
  const { template, images, filterText, castColor, fonts = [] } = props;
  await setFont(fonts, template);
  const canvas = document.createElement('canvas');
  canvas.width = template.w;
  canvas.height = template.h;
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

export type { Templete, Text, Shape, Filter } from './core/validate';