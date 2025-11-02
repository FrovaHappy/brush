
/**
 * 
 * @param template 
 * @param values 
 * @returns This replace an variable in text.
 * input: 'hello {{var1}}! {{name}}'
 * 
 * params: {var1: 'hello', name: 'alf'}
 * 
 * output: 'hello hello! alf'
 */
export function replaceAllValues(
  template: string,
  values: Record<string, string | number | undefined>
): string {
  let result = template;
  for (const [key, value] of Object.entries(values)) {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
  }
  return result;
}
