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
    color = filterText.pallete_Vibrant as string || '#000'
  }
  ctx.save() // save the current state of the canvas
  const fontSize = layer.fontSize ?? 16
  const fontWeight = layer.fontWeight ?? 'normal'
  ctx.font = `${fontWeight} ${fontSize}px ${family}`

  const posX = layer.x ?? 0
  const posY = layer.y ?? 0

  if (layer.rotation) {
    ctx.translate(posX, posY)
    ctx.rotate((layer.rotation * Math.PI) / 180)
    ctx.translate(-posX, -posY)
  }

  // Global Settings
  const textAlign = (layer.textAlign ?? 'start') as CanvasTextAlign
  const textBaseline = (layer.textBaseline ?? 'alphabetic') as CanvasTextBaseline
  ctx.textAlign = textAlign
  ctx.textBaseline = textBaseline
  ctx.fillStyle = color

  if (layer.strokeColor) {
    ctx.strokeStyle = layer.strokeColor
    ctx.lineWidth = layer.strokeWidth ?? 1
  }

  const filter = buildFilter(layer.filter)
  if (filter) ctx.filter = filter

  const maxW = layer.maxWidth ?? layer.w
  const lHeight = layer.lineHeight ?? (fontSize * 1.2)

  let lineX = posX
  if (maxW && maxW > 0) {
    if (textAlign === 'center') {
      lineX = posX + maxW / 2
    } else if (textAlign === 'right' || textAlign === 'end') {
      lineX = posX + maxW
    }
  }

  if (maxW && maxW > 0) {
    const words = layer.text.split(' ')
    let currentLine = ''
    let lineOffsetY = 0

    for (let n = 0; n < words.length; n++) {
      const testLine = currentLine ? `${currentLine} ${words[n]}` : words[n]
      const metrics = ctx.measureText(testLine)
      if (metrics.width > maxW && n > 0) {
        if (layer.strokeColor) {
          ctx.strokeText(currentLine, lineX, posY + lineOffsetY)
        }
        ctx.fillText(currentLine, lineX, posY + lineOffsetY)
        currentLine = words[n]
        lineOffsetY += lHeight
      } else {
        currentLine = testLine
      }
    }
    if (layer.strokeColor) {
      ctx.strokeText(currentLine, lineX, posY + lineOffsetY)
    }
    ctx.fillText(currentLine, lineX, posY + lineOffsetY)
  } else {
    if (layer.strokeColor) {
      ctx.strokeText(layer.text, lineX, posY)
    }
    ctx.fillText(layer.text, lineX, posY)
  }

  ctx.restore() // restore the previous state of the canvas
  return ctx
}
