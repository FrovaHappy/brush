import type { FilterText, ShapeLayer } from '../types'
import compileSVG from './compileSVG'

interface PaintShapeProps<G, I> {
  ctx: G extends CanvasRenderingContext2D ? G : any
  layer: ShapeLayer
  image: I extends HTMLImageElement ? I : any
  filterText: FilterText
}

export default function brushShape<G, I>(props: PaintShapeProps<G, I>) {
  const { ctx, layer, image, filterText } = props
  let color = layer.color
  if (color === 'auto') {
    color = filterText.ColorVibrant || '#000'
  }
  ctx.save()

  // obtain dimensions and scale of the image
  const dimension = {
    h: layer.h ?? image?.height ?? 100,
    w: layer.w ?? image?.width ?? 100,
  }
  ctx.translate(layer.x, layer.y)

  if (layer.svg) {
    const patch = { ...compileSVG(layer.svg || '<svg></svg>'), align: layer.align }
    ctx.save()
    // Scale the clip path according to the shape dimensions
    const scaleX = dimension.w / patch.w
    const scaleY = dimension.h / patch.h
    ctx.scale(scaleX, scaleY)
    ctx.clip(new Path2D(patch.d))
    ctx.fillStyle = color ?? 'transparent'
    ctx.fillRect(0, 0, patch.w, patch.h)

    if (image) {
      // Fit image into the clip patch while preserving aspect ratio
      const scale = Math.min(patch.w / image.width, patch.h / image.height)
      const scaleImage = {
        w: Math.round(image.width * scale),
        h: Math.round(image.height * scale),
      }
      const offsetX = Math.round((patch.w - scaleImage.w) / 2)
      const offsetY = Math.round((patch.h - scaleImage.h) / 2)
      const aligns: Record<string, [number, number]> = {
        top: [offsetX, 0],
        bottom: [offsetX, patch.h - scaleImage.h],
        left: [0, offsetY],
        right: [patch.w - scaleImage.w, offsetY],
        center: [offsetX, offsetY],
        'top-left': [0, 0],
        'top-right': [patch.w - scaleImage.w, 0],
        'bottom-left': [0, patch.h - scaleImage.h],
        'bottom-right': [patch.w - scaleImage.w, patch.h - scaleImage.h],
      }

      const chosen = aligns[patch.align ?? 'center'] || aligns.center
      ctx.drawImage(image, chosen[0], chosen[1], scaleImage.w, scaleImage.h)
    }
    ctx.restore()
  } else {
    ctx.fillStyle = color ?? 'transparent'
    ctx.fillRect(0, 0, dimension.w, dimension.h)
    if (image) ctx.drawImage(image, 0, 0, dimension.w, dimension.h)
  }

  ctx.restore()
}
