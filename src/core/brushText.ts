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

  // Global Settings
  ctx.textAlign = layer.textAlign ?? 'start'
  ctx.textBaseline = layer.textBaseline ?? 'alphabetic'
  ctx.fillStyle = color

  const filter = buildFilter(layer.filter)
  if (filter) ctx.filter = filter

  ctx.fillText(layer.text, layer.x, layer.y)

  ctx.restore() // restore the previous state of the canvas
  return ctx
}
