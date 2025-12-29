import type { Shape } from './validate'
import { buildFilter } from './buildFilter'
import compileSVG from './compileSVG'

interface PaintShapeProps {
  ctx: CanvasRenderingContext2D
  layer: Shape
  image: HTMLImageElement | undefined
  castColor: string | undefined
  Path2D: typeof Path2D
}

export default function brushShape(props: PaintShapeProps) {
  const { ctx, layer, Path2D, image, castColor } = props
  const color = !!castColor && layer.color === 'auto' ? castColor : layer.color
  const clip = layer.clip
  const filter = buildFilter(layer.filter)
  ctx.save()

  // obtain dimensions and scale of the image
  const dimension = {
    h: layer.dh ?? image?.height ?? 100,
    w: layer.dw ?? image?.width ?? 100,
  }

  if (filter) ctx.filter = filter
  ctx.translate(layer.dx, layer.dy)

  if (clip) {
    const patch = { ...compileSVG(clip.svg || '<svg></svg>'), align: clip.align }
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
