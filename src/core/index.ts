import type { FilterText, Templete } from '../types'
import brushText from './brushText'
import brushShape from './brushShape'

interface BrushCanvasProps<C extends CanvasRenderingContext2D, G extends HTMLImageElement | undefined> {
  ctx: C
  supportCtx: C
  template: Templete
  filterText: FilterText
  images: Record<string, G>
}
/**
 * Props.images is a Record<[id: string], HTMLImageElement | undefined>
 */
export default function brushCanvas<C extends CanvasRenderingContext2D, I extends HTMLImageElement | undefined>(props: BrushCanvasProps<C, I>) {
  const { ctx, supportCtx, template, filterText, images } = props
  const { layers, ...base } = template
  let color = base.backgroundColor
  if (color === 'auto') {
    color = filterText.pallete_Vibrant || '#000'
  }

  ctx.clearRect(0, 0, base.w, base.h) // reset canvas in the Frontend
  ctx.save()
  // save the current state of the canvas
  ctx.fillStyle = color || 'transparent'
  ctx.fillRect(0, 0, base.w, base.h)

  ctx.restore() // restore the previous state of the canvas
  for (const layer of layers) {
    ctx.save()
    supportCtx.save()
    if (layer.type === 'shape') {
      supportCtx.clearRect(0, 0, base.w, base.h)
      brushShape({ ctx, layer, image: images[layer.id], filterText, supportCtx })
    }
    if (layer.type === 'text') brushText({ ctx, layer, filterText })
  }
  return ctx
}
