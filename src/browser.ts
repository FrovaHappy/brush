import { includePalettes, sanitizeTemplate } from "./platforms/utils";
import type { FilterText, Font, ShapeLayer, Templete } from "./types";
import { Vibrant } from 'node-vibrant/browser';
import brushCanvas from "./core";

export async function setFonts(fonts: Font[]) {
  const $fonts = document.fonts;
  for (const font of fonts) {
    const { url, name } = font;
    const parseName = name.includes(' ') ? `"${name}"` : name;
    try {
      const fontFace = new FontFace(name, `url(${url})`);
      await fontFace.load();
      $fonts.add(fontFace);
      if (!$fonts.check(`12px ${parseName}`)) {
        console.warn(`Font ${name} loaded but is not available for use`);
      }
    } catch (err) {
      console.warn(`Failed to load font ${name} from ${url}`, err);
    }
  }
}

interface BrushProps {
  template: Templete,
  filterText: FilterText,
}

export async function brush(props: BrushProps): Promise<HTMLCanvasElement> {
  const imageLayer = props.template.layers.find(l => l.id === props.template.layerColor && l.type === 'shape') as ShapeLayer | undefined;

  const filterText = await includePalettes(imageLayer?.image, props.filterText, Vibrant);
  const template = sanitizeTemplate(props.template, filterText);
  const canvas = document.createElement('canvas');
  canvas.width = template.w;
  canvas.height = template.h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D context from canvas');

  brushCanvas({ ctx, template, filterText, images: {} });

  return canvas;
}