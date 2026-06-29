import type { FilterText, ShapeLayer } from '../types'
import { buildFilter } from './buildFilter'
import compileSVG from './compileSVG'

interface PaintShapeProps<G extends CanvasRenderingContext2D, I extends HTMLImageElement | undefined> {
  ctx: G
  supportCtx: G
  layer: ShapeLayer
  image: I
  filterText: FilterText
}

export default function brushShape<G extends CanvasRenderingContext2D, I extends HTMLImageElement | undefined>(props: PaintShapeProps<G, I>) {
  const { ctx, layer, image, filterText, supportCtx } = props
  let color = layer.color
  if (color === 'auto') {
    color = filterText.ColorVibrant || '#000'
  }

  const dimension = {
    h: image?.height ?? layer.h,
    w: image?.width ?? layer.w,
  }

  let newWidth = layer.w
  let newHeigh = layer.h

  if (layer.objectFit === 'cover') {
    const scaleFactor = Math.max(layer.w / dimension.w, layer.h / dimension.h) * (layer.scale ?? 1)
    newWidth = dimension.w * scaleFactor
    newHeigh = dimension.h * scaleFactor
  } else if (layer.objectFit === 'contain') {
    const scaleFactor = Math.min(layer.w / dimension.w, layer.h / dimension.h) * (layer.scale ?? 1)
    newWidth = dimension.w * scaleFactor
    newHeigh = dimension.h * scaleFactor
  } else if (layer.objectFit === 'fill') {
    newWidth = layer.w * (layer.scale ?? 1)
    newHeigh = layer.h * (layer.scale ?? 1)
  } else {
    const sideMayor = Math.max(layer.w, layer.h)
    let reasonProportion = 0
    if (layer.w > layer.h) {
      reasonProportion = sideMayor / dimension.w
    } else {
      reasonProportion = sideMayor / dimension.h
    }
    newWidth = (dimension.w * reasonProportion) * (layer.scale ?? 1)
    newHeigh = (dimension.h * reasonProportion) * (layer.scale ?? 1)
  }

  const sideMinor = Math.min(layer.w, layer.h)

  supportCtx.save()

  const centerX = layer.x + layer.w / 2
  const centerY = layer.y + layer.h / 2

  if (layer.rotation) {
    supportCtx.translate(centerX, centerY)
    supportCtx.rotate((layer.rotation * Math.PI) / 180)
    supportCtx.translate(-layer.w / 2, -layer.h / 2)
  } else {
    supportCtx.translate(layer.x, layer.y)
  }

  supportCtx.fillStyle = color ?? 'transparent'

  const patch = compileSVG(layer.svg, sideMinor)
  if (patch) {
    supportCtx.clip(new Path2D(patch.d))
    supportCtx.fillRect(0, 0, patch.w, patch.h)
  } else {
    const rect = compileSVG(
      `<svg width="${layer.w}" height="${layer.h}">
        <rect width="${layer.w}" height="${layer.h}"/>
      </svg>
      `
    )
    supportCtx.clip(new Path2D(rect!.d))
    supportCtx.fillRect(0, 0, rect!.w, rect!.h)
  }

  if (image) {
    const position: Record<string, number> = {
      top: 0,
      left: 0,
      right: layer.w - newWidth,
      bottom: layer.h - newHeigh,
      xCenter: (layer.w / 2) - (newWidth / 2),
      yCenter: (layer.h / 2) - (newHeigh / 2),
    }
    const [strY, strX] = (layer.align || 'center center').split(' ')
    const x = position[strX] ?? position.xCenter
    const y = position[strY] ?? position.yCenter
    supportCtx.drawImage(image, x, y, newWidth, newHeigh)
  }

  ctx.save()
  const filter = buildFilter(layer.filter)
  if (filter) ctx.filter = filter
  ctx.drawImage(supportCtx.canvas, 0, 0)
  ctx.restore()
  supportCtx.restore()
}
