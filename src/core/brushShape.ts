import type { FilterText, ShapeLayer } from '../types'
import { buildFilter } from './buildFilter'
import compileSVG from './compileSVG'

interface PaintShapeProps<G extends CanvasRenderingContext2D, I extends HTMLImageElement | undefined> {
  ctx: G
  layer: ShapeLayer
  image: I
  filterText: FilterText
}

export default function brushShape<G extends CanvasRenderingContext2D, I extends HTMLImageElement | undefined>(props: PaintShapeProps<G, I>) {
  const { ctx, layer, image, filterText } = props
  let color = layer.color
  if (color === 'auto') {
    color = filterText.ColorVibrant || '#000'
  }
  ctx.save()

  // obtain dimensions and scale of the image
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
  const newWidth = (dimension.w * reasonProportion) * (layer.scale ?? 1);
  const newHeigh = (dimension.h * reasonProportion) * (layer.scale ?? 1);



  ctx.translate(layer.x, layer.y)
  const filter = buildFilter(layer.filter)
  if (filter) ctx.filter = filter
  ctx.fillStyle = color ?? 'transparent'

  const patch = compileSVG(layer.svg, sideMinor)
  if (patch) {
    ctx.clip(new Path2D(patch.d))
    ctx.fillRect(0, 0, patch.w, patch.h)
  } else {
    const rect = compileSVG(
      `<svg width="${layer.w}" height="${layer.h}">
        <rect width="${layer.w}" height="${layer.h}"/>
      </svg>
      `
    )
    ctx.clip(new Path2D(rect!.d))
    ctx.fillRect(0, 0, rect!.w, rect!.h)
  }

  if (image) {
    const position: Record<string, number> = {
      top: 0,
      left: 0,
      right: layer.w - newWidth,
      bottom: layer.h - newHeigh,
      xCenter: (layer.w / 2) - (newWidth / 2),
      yCenter: (layer.h / 2) - (newHeigh / 2)
    }
    const [strY, strX] = (layer.align || 'center center').split(' ')
    const x = position[strX] ?? position.xCenter
    const y = position[strY] ?? position.yCenter
    ctx.drawImage(image, x, y, newWidth, newHeigh)
  }

  // if (layer.svg) {
  //   const patch = { ...compileSVG(layer.svg || '<svg></svg>'), align: layer.align }
  //   ctx.save()
  //   // Scale the clip path according to the shape dimensions
  //   const scaleX = dimension.w / patch.w
  //   const scaleY = dimension.h / patch.h
  //   ctx.scale(scaleX, scaleY)
  //   ctx.clip(new Path2D(patch.d))
  //   ctx.fillStyle = color ?? 'transparent'
  //   ctx.fillRect(0, 0, patch.w, patch.h)

  //   if (image) {
  //     // Fit image into the clip patch while preserving aspect ratio
  //     const scale = Math.min(patch.w / image.width, patch.h / image.height)
  //     const scaleImage = {
  //       w: Math.round(image.width * scale),
  //       h: Math.round(image.height * scale),
  //     }
  //     const offsetX = Math.round((patch.w - scaleImage.w) / 2)
  //     const offsetY = Math.round((patch.h - scaleImage.h) / 2)
  //     const aligns: Record<string, [number, number]> = {
  //       top: [offsetX, 0],
  //       bottom: [offsetX, patch.h - scaleImage.h],
  //       left: [0, offsetY],
  //       right: [patch.w - scaleImage.w, offsetY],
  //       center: [offsetX, offsetY],
  //       'top-left': [0, 0],
  //       'top-right': [patch.w - scaleImage.w, 0],
  //       'bottom-left': [0, patch.h - scaleImage.h],
  //       'bottom-right': [patch.w - scaleImage.w, patch.h - scaleImage.h],
  //     }

  //     const chosen = aligns[patch.align ?? 'center'] || aligns.center
  //     ctx.drawImage(image, chosen[0], chosen[1], scaleImage.w, scaleImage.h)
  //   }
  //   ctx.restore()
  // } else {
  //   ctx.fillStyle = color ?? 'transparent'
  //   ctx.fillRect(0, 0, dimension.w, dimension.h)
  //   if (image) ctx.drawImage(image, 0, 0, dimension.w, dimension.h)
  // }

  ctx.restore()
}
