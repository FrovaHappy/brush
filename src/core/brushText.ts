import type { FilterText, TextLayer } from '../types'
import { buildFilter } from './buildFilter'

interface PaintTextProps {
  ctx: CanvasRenderingContext2D
  layer: TextLayer
  filterText: FilterText
}

export default function brushText(options: PaintTextProps) {
  const { ctx, layer, filterText } = options
  // Prepare font settings before measuring text
  const fam = layer.fontFamily ?? 'sans-serif'
  const family = fam.includes(' ') ? `"${fam}"` : fam
  let color = layer.color
  if (color === 'auto') {
    color = filterText.ColorVibrant as string || '#000'
  }
  ctx.save() // save the current state of the canvas
  ctx.font = `${layer.fontWeight ?? 'normal'} ${layer.fontSize}px ${family}`

  if (layer.rotation) {
    ctx.translate(layer.x, layer.y)
    ctx.rotate((layer.rotation * Math.PI) / 180)
    ctx.translate(-layer.x, -layer.y)
  }

  // Global Settings
  ctx.textAlign = layer.textAlign ?? 'start'
  ctx.textBaseline = layer.textBaseline ?? 'alphabetic'
  ctx.fillStyle = color

  if (layer.strokeColor) {
    ctx.strokeStyle = layer.strokeColor
    ctx.lineWidth = layer.strokeWidth ?? 1
  }

  const filter = buildFilter(layer.filter)
  if (filter) ctx.filter = filter

  const maxW = layer.maxWidth ?? layer.w
  const lHeight = layer.lineHeight ?? (layer.fontSize * 1.2)

  if (maxW && maxW > 0) {
    const words = layer.text.split(' ')
    let currentLine = ''
    let lineOffsetY = 0

    for (let n = 0; n < words.length; n++) {
      const testLine = currentLine ? `${currentLine} ${words[n]}` : words[n]
      const metrics = ctx.measureText(testLine)
      if (metrics.width > maxW && n > 0) {
        if (layer.strokeColor) {
          ctx.strokeText(currentLine, layer.x, layer.y + lineOffsetY)
        }
        ctx.fillText(currentLine, layer.x, layer.y + lineOffsetY)
        currentLine = words[n]
        lineOffsetY += lHeight
      } else {
        currentLine = testLine
      }
    }
    if (layer.strokeColor) {
      ctx.strokeText(currentLine, layer.x, layer.y + lineOffsetY)
    }
    ctx.fillText(currentLine, layer.x, layer.y + lineOffsetY)
  } else {
    if (layer.strokeColor) {
      ctx.strokeText(layer.text, layer.x, layer.y)
    }
    ctx.fillText(layer.text, layer.x, layer.y)
  }

  ctx.restore() // restore the previous state of the canvas
  return ctx
}
