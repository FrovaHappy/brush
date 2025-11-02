import { type Templete, isShape, isText } from './validate'
import brushShape from './brushShape'
import brushText from './brushText'

interface PaintCanvasProps<Context = CanvasRenderingContext2D> {
  ctx: Context
  template: Templete
  Path2D: typeof Path2D
  images: Record<string, HTMLImageElement | undefined>
  filterText: Record<string, string | number | undefined>
  castColor: string | undefined
}
/**
 * Props.images is a Record<[id: sting], HTMLImageElement | undefined>
 */
export default function brush<Context extends CanvasRenderingContext2D>(props: PaintCanvasProps<Context>) {
  const { ctx, template, Path2D, filterText, images, castColor } = props
  const { layers, ...base } = template
  ctx.clearRect(0, 0, base.w, base.h) // reset canvas in the Frontend
  ctx.save()
  if (base.bg_color) {
    // save the current state of the canvas
    ctx.fillStyle = !!castColor && base.bg_color === 'auto' ? castColor : base.bg_color
    ctx.fillRect(0, 0, base.w, base.h)
  }
  ctx.restore() // restore the previous state of the canvas
  for (const layer of layers) {
    if (isShape(layer)) brushShape({ ctx, layer, Path2D, image: images[layer.id], castColor })
    if (isText(layer)) brushText({ ctx, layer, filterText, castColor })
  }
  return ctx
}
