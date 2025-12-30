import { describe, it, expect } from 'vitest';
import { getColor } from './utils';
import { Colors } from '../core/validate';

describe('getColor', () => {
  const mockColors: Colors = {
    primary: '#ff0000',
    secondary: '#0000ff',
    background: '#00ff00'
  };

  it('should return default black color when color is undefined', () => {
    const result = getColor(undefined, mockColors);
    expect(result).toBe('#000000');
  });

  it('should return default black color when color is empty string', () => {
    const result = getColor('', mockColors);
    expect(result).toBe('#000000');
  });

  it('should return color value from colors object when color exists', () => {
    const result = getColor('transparent', mockColors);
    expect(result).toBe('transparent');
  });

  it('should return the original color string when color not found in colors object', () => {
    const result = getColor('#ffffff', mockColors);
    expect(result).toBe('#ffffff');
  });

  it('should return the original color string when color is not in colors object', () => {
    const result = getColor('background', mockColors);
    expect(result).toBe('#00ff00');
  });

  it('should return rgb() and hsl() strings unchanged', () => {
    const rgb = 'rgb(255, 0, 0)'
    const hsl = 'hsl(120, 100%, 50%)'

    expect(getColor(rgb, mockColors)).toBe(rgb)
    expect(getColor(hsl, mockColors)).toBe(hsl)
  })
});