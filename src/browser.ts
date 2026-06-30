import { includePalettes, sanitizeTemplate } from "./platforms/utils";
import type { FilterText, Font, ShapeLayer, Templete } from "./types";
import brushCanvas from "./core";

function loadImageBrowser(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = url;
  });
}

async function getImages(template: Templete): Promise<Record<string, HTMLImageElement>> {
  const images: Record<string, HTMLImageElement> = {};
  for (const layer of template.layers) {
    if (layer.type === 'shape' && layer.image) {
      try {
        images[layer.id] = await loadImageBrowser(layer.image);
      } catch (err) {
        console.warn(`Failed to load image for layer ${layer.id} from ${layer.image}`, err);
      }
    }
  }
  return images;
}

export async function setFonts(fonts: Font[]) {
  const $fonts = document.fonts as any;
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
  let template = sanitizeTemplate(props.template, props.filterText);
  const imageLayer = template.layers.find(l => l.id === template.layerColor && l.type === 'shape') as ShapeLayer | undefined;

  let loadedImage: HTMLImageElement | null = null;
  if (imageLayer?.image) {
    try {
      loadedImage = await loadImageBrowser(imageLayer.image);
    } catch (err) {
      console.warn(`Failed to load image for palette extraction: ${imageLayer.image}`, err);
    }
  }

  const filterText = await includePalettes(loadedImage, props.filterText);
  template = sanitizeTemplate(props.template, filterText);
  const images = await getImages(template);

  const canvas = document.createElement('canvas');
  canvas.width = template.w;
  canvas.height = template.h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D context from canvas');

  const supportCanvas = document.createElement('canvas');
  supportCanvas.width = template.w;
  supportCanvas.height = template.h;
  const supportCtx = supportCanvas.getContext('2d');
  if (!supportCtx) throw new Error('Could not get 2D support context from canvas');

  brushCanvas({ ctx, supportCtx, template, images, filterText });

  return canvas;
}