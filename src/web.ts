import brushCore from "./core";
import { isShape, type Templete } from "./core/validate";
import { replaceAllValues } from "./platforms/utils";
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
  filterText: Record<string, string | number | undefined>,
  fonts?: Font[]
}

export async function brush(props: BrushProps): Promise<HTMLCanvasElement> {
  const { template, filterText, fonts = [] } = props;
  await setFont(fonts, template);
  const canvas = document.createElement('canvas');
  canvas.width = template.w;
  canvas.height = template.h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D context from canvas');

  const images: Record<string, HTMLImageElement | undefined> = {};
  for (const layer of template.layers) {
    if (isShape(layer) && layer.image) {
      try {
        const img = new Image();
        const url = replaceAllValues(layer.image, filterText);
        img.src = url;
        await img.decode();
        images[layer.id] = img;
      } catch (error) {
        console.error(`Failed to load image for layer ${layer.id}:`, error);
      }
    }
  }
  brushCore({
    ctx,
    template,
    Path2D: window.Path2D,
    images,
    filterText,
  });
  return canvas;
}

export { type Templete, type Text, type Shape, type Filter, isShape, isText } from './core/validate';