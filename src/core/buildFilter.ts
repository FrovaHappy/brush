import type { Filter } from '../types'

// Validation functions based on MDN specifications
// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/filter

/** Validates blur filter (CSS <length>) - e.g., '5px', '10em' */
function isValidBlur(value: string): boolean {
  return /^[0-9]+(\.[0-9]+)?(px|em|rem|cm|mm|in|pt|pc|ex|ch|vw|vh|vmin|vmax)$/.test(value.trim())
}

/** Validates percentage or number filters (brightness, contrast, grayscale, invert, opacity, saturate, sepia) */
function isValidPercentageOrNumber(value: string): boolean {
  const trimmed = value.trim()
  // Matches: 100%, 1.5, 100, 1
  return /^[0-9]+(\.[0-9]+)?(%)?$/.test(trimmed) && parseFloat(trimmed) >= 0
}

/** Validates hue-rotate filter (CSS <angle>) - e.g., '90deg', '1.5rad', '100grad' */
function isValidHueRotate(value: string): boolean {
  return /^[0-9]+(\.[0-9]+)?(deg|rad|grad|turn)$/.test(value.trim())
}

/** Validates drop-shadow filter - e.g., '10px 10px 5px rgba(0,0,0,0.5)' */
function isValidDropShadow(value: string): boolean {
  const trimmed = value.trim()
  // Must contain at least 2 lengths (offset-x and offset-y) separated by spaces
  // Optional: blur-radius (length) and color
  const parts = trimmed.split(/\s+/)

  // Minimum: 2 values (offset-x, offset-y)
  if (parts.length < 2) return false

  // First two parts must be valid lengths
  const lengthPattern = /^[+-]?[0-9]+(\.[0-9]+)?(px|em|rem|cm|mm|in|pt|pc|ex|ch|vw|vh|vmin|vmax)$/

  if (!lengthPattern.test(parts[0])) return false
  if (!lengthPattern.test(parts[1])) return false

  // If there's a third value, it should be a valid length (blur-radius)
  if (parts.length > 2) {
    // The remaining parts form the color, which can be complex (e.g., 'rgb(0, 0, 0)' or 'rgba(0,0,0,0.5)')
    // For simplicity, we just check if we have at least 3 parts
    // The color validation is complex and would require a dedicated function
  }

  return true
}

export function buildFilter(filter: Filter | undefined) {
  if (!filter) return undefined

  const {
    'drop-shadow': dropShadow,
    blur,
    brightness,
    contrast,
    grayscale,
    'hue-rotate': hueRotate,
    invert,
    opacity,
    saturate,
    sepia,
  } = filter

  const filterString = []

  // Validate and add drop-shadow
  if (dropShadow && isValidDropShadow(dropShadow)) {
    filterString.push(`drop-shadow(${dropShadow})`)
  }

  // Validate and add blur
  if (blur && isValidBlur(blur)) {
    filterString.push(`blur(${blur})`)
  }

  // Validate and add brightness
  if (brightness && isValidPercentageOrNumber(brightness)) {
    filterString.push(`brightness(${brightness})`)
  }

  // Validate and add contrast
  if (contrast && isValidPercentageOrNumber(contrast)) {
    filterString.push(`contrast(${contrast})`)
  }

  // Validate and add grayscale
  if (grayscale && isValidPercentageOrNumber(grayscale)) {
    filterString.push(`grayscale(${grayscale})`)
  }

  // Validate and add hue-rotate
  if (hueRotate && isValidHueRotate(hueRotate)) {
    filterString.push(`hue-rotate(${hueRotate})`)
  }

  // Validate and add invert
  if (invert && isValidPercentageOrNumber(invert)) {
    filterString.push(`invert(${invert})`)
  }

  // Validate and add opacity
  if (opacity && isValidPercentageOrNumber(opacity)) {
    filterString.push(`opacity(${opacity})`)
  }

  // Validate and add saturate
  if (saturate && isValidPercentageOrNumber(saturate)) {
    filterString.push(`saturate(${saturate})`)
  }

  // Validate and add sepia
  if (sepia && isValidPercentageOrNumber(sepia)) {
    filterString.push(`sepia(${sepia})`)
  }

  return filterString.join(' ') || undefined
}
