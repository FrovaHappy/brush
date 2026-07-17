import { includePalettes, sanitizeTemplate } from "./platforms/utils";
import type { FilterText, Font, ShapeLayer, Templete } from "./types";
import brushCanvas from "./core";

export type * from './types'

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


/**
 * Loads and registers custom typography fonts in the Browser environment.
 * The loaded fonts will be registered within the document's font face set
 * and become available for use in text layers referencing them by name.
 * 
 * @param fonts An array of font configuration objects containing the font name and remote URL or path.
 * @returns A promise that resolves when the fonts are loaded and registered.
 */
export async function setFonts(fonts: Font[]) {
  const $fonts = document.fonts;
  for (const font of fonts) {
    const { url, name } = font;
    const parseName = name.includes(' ') ? `"${name}"` : name;
    try {
      const fontFace = new FontFace(name, `url(${url})`);
      await fontFace.load();
      ($fonts as any).add(fontFace);
      if (!$fonts.check(`12px ${parseName}`)) {
        console.warn(`Font ${name} loaded but is not available for use`);
      }
    } catch (err) {
      console.warn(`Failed to load font ${name} from ${url}`, err);
    }
  }
}

/**
 * Resolves template variables and dynamic color palettes based on the provided template and input text.
 * 
 * This processes the template, extracts dominant/vibrant colors from the specified target image layer,
 * interpolates those colors and text variables (`{{variableName}}`) into the template, and returns
 * the fully resolved template and filter values.
 * 
 * @param template The template schema containing layout, layers, and configuration.
 * @param filterText A key-value dictionary representing template variable inputs for interpolation.
 * @returns A promise resolving to an object with the sanitized and fully resolved `template` and `filterText`.
 */
export async function generateVariables(template: Templete, filterText: FilterText) {
  const temp_template = sanitizeTemplate(template, filterText);
  const imageLayer = temp_template.layers.find(l => l.id === template.layerColor && l.type === 'shape') as ShapeLayer | undefined;
  let loadedImage: HTMLImageElement | null = null;
  if (imageLayer?.image) {
    try {
      loadedImage = await loadImageBrowser(imageLayer.image);
    } catch (err) {
      console.warn(`Failed to load image for palette extraction: ${imageLayer.image}`, err);
    }
  }
  filterText = await includePalettes(loadedImage, filterText);
  template = sanitizeTemplate(template, filterText, true);
  return {
    template, filterText
  }
}

interface BrushProps {
  template: Templete,
  filterText: FilterText,
}

/**
 * Renders the provided template onto an HTML5 Canvas element in the Browser.
 * 
 * This function processes the template variables, loads all required images asynchronously,
 * prepares the 2D canvas context, and draws the layers (shapes, images, texts, filters)
 * as defined in the template.
 * 
 * @param props Configuration properties containing the template and filter inputs.
 * @param props.template The canvas template to render.
 * @param props.filterText A dictionary of variable values to interpolate into the template.
 * @returns A promise that resolves with the rendered HTMLCanvasElement.
 */
export async function brush(props: BrushProps): Promise<HTMLCanvasElement> {
  const { template, filterText } = await generateVariables(props.template, props.filterText);
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
export { compileSVGPath } from './core/compileSVGPath';
export { sanitizeTemplate } from './platforms/utils';