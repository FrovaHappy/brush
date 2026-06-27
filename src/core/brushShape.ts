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
  const sideMayor = Math.max(layer.w, layer.h)
  const sideMinor = Math.min(layer.w, layer.h)
  let reasonProportion = 0

  if (layer.w > layer.h) {
    reasonProportion = sideMayor / dimension.w
  } else {
    reasonProportion = sideMayor / dimension.h
  }
  const newWidth = (dimension.w * reasonProportion) * (layer.scale ?? 1)
  const newHeigh = (dimension.h * reasonProportion) * (layer.scale ?? 1)


  supportCtx.save()

  supportCtx.translate(layer.x, layer.y)
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
