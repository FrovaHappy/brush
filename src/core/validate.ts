import { ZodError } from 'zod'
import * as z from 'zod/mini'
export const LAST_VERSION = '1'

const filterSchema = z.object({
  blur: z.optional(z.number().check(z.gte(0), z.lte(100), z.multipleOf(1))),
  brightness: z.optional(z.number().check(z.gte(-100), z.lte(100), z.multipleOf(1))),
  contrast: z.optional(z.number().check(z.gte(-100), z.lte(100), z.multipleOf(1))),
  dropShadow: z.optional(
    z.object({
      offsetX: z.optional(z.number().check(z.gte(0))),
      offsetY: z.optional(z.number().check(z.gte(0))),
      blurRadius: z.optional(z.number().check(z.gte(0))),
      color: z.string().check(z.regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/)),
    })
  ),
  grayscale: z.optional(z.number().check(z.gte(0), z.lte(100), z.multipleOf(1))),
  hueRotate: z.optional(z.number().check(z.gte(-360), z.lte(360), z.multipleOf(1))),
  invert: z.optional(z.number().check(z.gte(0), z.lte(100), z.multipleOf(1))),
  opacity: z.optional(z.number().check(z.gte(0), z.lte(100), z.multipleOf(1))),
  saturate: z.optional(z.number().check(z.gte(-100), z.lte(100), z.multipleOf(1))),
  sepia: z.optional(z.number().check(z.gte(0), z.lte(100), z.multipleOf(1))),
})
/* Features Futures
  - support for gradient
*/
const textSchema = z.object({
  id: z.string().check(z.minLength(1), z.maxLength(100)),
  type: z.literal('text'),
  dx: z.number().check(z.gte(0)),
  dy: z.number().check(z.gte(0)),
  text: z.string().check(z.minLength(1)),
  size: z.optional(z.number().check(z.gte(10))),
  family: z.optional(z.string().check(z.minLength(1), z.maxLength(100))),
  color: z.optional(z.union([z.string().check(z.regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/)), z.literal('auto')])),
  globalAlpha: z.optional(z.number().check(z.gte(0), z.lte(1), z.multipleOf(0.01))),
  letterSpacing: z.optional(z.number().check(z.gte(0))),
  maxWidth: z.optional(z.number().check(z.gte(1))),
  weight: z.optional(z.number().check(z.gte(200), z.lte(1000), z.multipleOf(100))),
  align: z.optional(
    z.union([
      z.literal('start'),
      z.literal('end'),
      z.literal('left'),
      z.literal('right'),
      z.literal('center'),
    ])
  ),
  baseline: z.optional(
    z.union([
      z.literal('top'),
      z.literal('hanging'),
      z.literal('middle'),
      z.literal('alphabetic'),
      z.literal('ideographic'),
      z.literal('bottom'),
    ])
  ),
  filter: z.optional(filterSchema),
})
const shapeSchema = z
  .object({
    id: z.string().check(z.minLength(1), z.maxLength(100)),
    type: z.literal('shape'),
    color: z.optional(z.union([z.string().check(z.regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/)), z.literal('auto')])),
    dx: z.number().check(z.gte(0)),
    dy: z.number().check(z.gte(0)),
    dh: z.optional(z.number().check(z.gte(0))),
    dw: z.optional(z.number().check(z.gte(0))),
    image: z.optional(z.string().check(z.minLength(1), z.maxLength(1000))),
    // imageSmoothingEnabled: z.boolean().optional(), // TODO: for implement
    // imageSmoothingQuality: z.union([z.literal('low'), z.literal('medium'), z.literal('high')]).optional(), // TODO: for implement
    clip: z.optional(
      z.object({
        svg: z.optional(z.string().check(z.minLength(1), z.maxLength(100000))),
        align: z.optional(
          z.union([
            z.literal('top'),
            z.literal('left'),
            z.literal('right'),
            z.literal('center'),
            z.literal('bottom'),
            z.literal('top-left'),
            z.literal('top-right'),
            z.literal('bottom-left'),
            z.literal('bottom-right'),
          ])
        ),
      })
    ),
    filter: z.optional(filterSchema),
  })

const COLOR_REGEX = /^(#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})|rgba?\(.+\)|hsl?\(.+\))$/
const colorBaseSchema = z.union([z.string().check(z.regex(COLOR_REGEX)), z.literal('transparent')])
const colorsBaseSchema = z.object({
  primary: z.optional(colorBaseSchema),
  secondary: z.optional(colorBaseSchema),
  accent: z.optional(colorBaseSchema),
  background: z.optional(colorBaseSchema),
  foreground: z.optional(colorBaseSchema),
})

const colorSchema = z.optional(z.union([z.keyof(colorsBaseSchema), colorBaseSchema]))

const canvasSchema = z.object({
  id: z.optional(z.string().check(z.minLength(10), z.maxLength(100))),
  version: z.literal('1'),
  title: z.string().check(z.minLength(1), z.maxLength(100)),
  author: z.optional(z.string().check(z.minLength(10), z.maxLength(100))),
  forked: z.optional(z.string().check(z.minLength(1), z.maxLength(100))),
  visibility: z.optional(z.union([z.literal('public'), z.literal('private')])),
  h: z.number().check(z.gte(0)),
  w: z.number().check(z.gte(0)),
  colors: colorsBaseSchema,
  layers: z.array(z.union([textSchema, shapeSchema])),
})

// this canvas type is used to validate the canvas data input from the user
export type Templete = z.infer<typeof canvasSchema>
export type Text = z.infer<typeof textSchema>
export type Shape = z.infer<typeof shapeSchema>
export type Filter = z.infer<typeof filterSchema>
export type Colors = z.infer<typeof colorsBaseSchema>
export type Color = z.infer<typeof colorSchema>


export function isText(layer: Text | Shape): layer is Text {
  return layer.type === 'text'
}
export function isShape(layer: Text | Shape): layer is Shape {
  return layer.type === 'shape'
}

export function validateCanvas(data: unknown) {
  let canvas: Templete | null = null
  try {
    canvas = canvasSchema.parse(data)
  } catch (error: unknown) {
    return {
      ok: false,
      errors: error instanceof ZodError ? error.issues : undefined,
      data: null,
    }
  }
  return {
    ok: true,
    errors: undefined,
    data: canvas,
  }
}
