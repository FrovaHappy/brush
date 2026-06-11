import type { FilterText, Templete } from '../types'
import brushText from './brushText'
import brushShape from './brushShape'

interface BrushCanvasProps<C, G> {
  ctx: C extends CanvasRenderingContext2D ? C : any
  template: Templete
  filterText: FilterText
  images: Record<string, G extends HTMLImageElement ? G : any>
}
/**
 * Props.images is a Record<[id: string], HTMLImageElement | undefined>
 */
export default function brushCanvas<C, I>(props: BrushCanvasProps<C, I>) {
  const { ctx, template, filterText, images } = props
  const { layers, ...base } = template

  ctx.clearRect(0, 0, base.w, base.h) // reset canvas in the Frontend
  ctx.save()
  if (base.colors.background) {
    // save the current state of the canvas
    ctx.fillStyle = base.colors.background || 'transparent'
    ctx.fillRect(0, 0, base.w, base.h)
  }
  ctx.restore() // restore the previous state of the canvas
  for (const layer of layers) {
    if (layer.type === 'shape') brushShape({ ctx, layer, image: images[layer.id], filterText })
    if (layer.type === 'text') brushText({ ctx, layer, filterText })
  }
  return ctx
}
