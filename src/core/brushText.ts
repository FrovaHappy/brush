import type { Text } from './validate'
import { buildFilter } from './buildFilter'
import { replaceAllValues } from '../platforms/utils'

interface PaintTextProps {
  ctx: CanvasRenderingContext2D
  layer: Text
  filterText: Record<string, string | number | undefined>
  castColor: string | undefined
}

export default function brushText(options: PaintTextProps) {
  const { ctx, layer, filterText, castColor } = options
  const color = !!castColor && layer.color === 'auto' ? castColor : layer.color
  let text = replaceAllValues(layer.text, filterText)
  // Prepare font settings before measuring text
  const fam = layer.family ?? 'sans-serif'
  const family = fam.includes(' ') ? `"${fam}"` : fam
  const weight = layer.weight ?? 400
  const size = layer.size ?? 16
  ctx.save() // save the current state of the canvas
  ctx.font = `${weight} ${size}px ${family}`
  let widthText = ctx.measureText(text).width

  if (layer.maxWidth !== 0 && layer.maxWidth) {
    while (widthText > layer.maxWidth || widthText < 0) {
      text = text.slice(0, -1)
      widthText = ctx.measureText(text).width
    }
  }
  // Global Settings
  ctx.globalAlpha = layer.globalAlpha ?? 1
  ctx.textAlign = layer.align ?? 'start'
  ctx.textBaseline = layer.baseline ?? 'alphabetic'
  ctx.fillStyle = color ?? '#000'

  const filter = buildFilter(layer.filter)
  if (filter) ctx.filter = filter

  ctx.fillText(text, layer.dx, layer.dy)

  ctx.restore() // restore the previous state of the canvas
  return ctx
}
