import type { FilterText } from "../types";
import { getSwatches } from 'colorthief'

/**
 * Sanitizes a template by replacing variables with provided values.
 * @param template
 * default template is a JSON object that may contain variables in the format of {{varName}}. This function will replace the variables with the values provided in the values parameter. If the variable is not found in the values parameter, it will be replaced with an empty string.
 * @param values
 * A record of variable names and their corresponding values to replace in the template. The keys should match the variable names used in the template (without the curly braces).
 * @returns
 * A new template object with the variables replaced by their corresponding values. If the template is not a valid JSON object or if there is an error during the replacement process, the original template will be returned.
 * @example
 * const template = {
 *  //...,
 *  layers: [
 *   {
 *     id: 'layer1',
 *     type: 'text',
 *     text: 'Hello {{var1}}!',
 *    //...
 *   }
 *  ]
 * }
 * const values = {
 *   var1: 'World',
 * };
 * const sanitized = sanitizeTemplate(template, values);
 * console.log(sanitized.layers[0].text); // Output: 'Hello World!'
 * 
 */
export function sanitizeTemplate<T>(template: T, values: Record<string, string | number | undefined>): T {
  try {
    let result = JSON.stringify(template);
    for (const [key, value] of Object.entries(values)) {
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
    }
    for (const match of result.matchAll(/{{(.*?)}}/g)) {
      console.warn(`Variable ${match[0]} not found in values, replacing with empty string`);
      result = result.replace(new RegExp(match[0], 'g'), 'null_sanitized');
    }
    return JSON.parse(result) as T;
  }
  catch {
    console.warn('Failed to sanitize template, returning original template');
    return template;
  }
}

/**
 * Includes palette colors extracted from the image into the filterText for template variable replacement. The palette colors are added with keys in the format of ColorVibrant, ColorLightVibrant, ColorDarkVibrant, ColorMuted, ColorLightMuted, and ColorDarkMuted. If the image is not provided or if there is an error during palette extraction, the original filterText will be returned without modification.
 */
export async function includePalettes(image: HTMLImageElement | Buffer | null, filterText: FilterText): Promise<FilterText> {
  try {
    if (!image) return filterText;
    const palette = await getSwatches(image)
    const result: Record<string, string> = {};
    for (const [key, swatch] of Object.entries(palette)) {
      if (swatch) {
        result[`pallete_${key}`] = swatch.color.hex();
      }
    }
    return { ...filterText, ...result };
  } catch (err) {
    console.warn(`Failed to extract palette from image ${image}`, err);
    return filterText;
  }
}


export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (_e) {
    return false;
  }
}