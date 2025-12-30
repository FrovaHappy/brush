import { type Templete, isShape, isText, validateCanvas } from './validate'
import brushShape from './brushShape'
import brushText from './brushText'

interface PaintCanvasProps<Context = CanvasRenderingContext2D> {
  ctx: Context
  template: Templete
  Path2D: typeof Path2D
  images: Record<string, HTMLImageElement | undefined>
  filterText: Record<string, string | number | undefined>
}
/**
 * Props.images is a Record<[id: sting], HTMLImageElement | undefined>
 */
export default function brush<Context extends CanvasRenderingContext2D>(props: PaintCanvasProps<Context>) {
  const { ctx, template, Path2D, filterText, images } = props
  const { layers, ...base } = template
  // validate template 
  const validation = validateCanvas(template)
  if (!validation.ok) {
    throw new Error(`Invalid template: ${JSON.stringify(validation.errors)}`)
  }

  ctx.clearRect(0, 0, base.w, base.h) // reset canvas in the Frontend
  ctx.save()
  if (base.colors.background) {
    // save the current state of the canvas
    ctx.fillStyle = base.colors.background || 'transparent'
    ctx.fillRect(0, 0, base.w, base.h)
  }
  ctx.restore() // restore the previous state of the canvas
  for (const layer of layers) {
    if (isShape(layer)) brushShape({ ctx, layer, Path2D, image: images[layer.id], colors: template.colors })
    if (isText(layer)) brushText({ ctx, layer, filterText, colors: template.colors })
  }
  return ctx
}
