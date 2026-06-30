import { describe, it } from 'vitest'
import { brush, setFonts } from '../node'
import type { Templete } from '../types'
import { writeFile, readFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import VAR from './template'

// Read package.json dynamically
const pkg = JSON.parse(
  await readFile(new URL('../../package.json', import.meta.url), 'utf-8')
)
const version: string = pkg.version ?? '0.0.0'
const nodeEngine: string = pkg.engines?.node ?? '>=20.0.0'

// ─── SVG helpers ──────────────────────────────────────────────────────────────
const SHAPES = VAR.GEOMETRIC_SHAPES

// ─── Template ─────────────────────────────────────────────────────────────────
const template: Templete = {
  version: '1',
  w: 900,
  h: 300,
  backgroundColor: '#0d1117',
  layerColor: 'hero_image',
  layers: [

    // ── Background gradient strip (left accent) ──────────────────────────────
    {
      id: 'accent_strip',
      type: 'shape',
      x: 0,
      y: 0,
      w: 340,
      h: 300,
      color: '{{pallete_DarkVibrant}}',
      filter: { opacity: '0.18' }
    },

    // ── Decorative blobs ─────────────────────────────────────────────────────
    {
      id: 'blob_tl',
      type: 'shape',
      svg: SHAPES.blob,
      x: -40,
      y: -30,
      w: 240,
      h: 240,
      color: '{{pallete_Vibrant}}',
      filter: { opacity: '0.12', blur: '18px' }
    },
    {
      id: 'blob_br',
      type: 'shape',
      svg: SHAPES.blob,
      x: 680,
      y: 100,
      w: 220,
      h: 220,
      color: '{{pallete_LightVibrant}}',
      filter: { opacity: '0.10', blur: '75px' }
    },

    // ── Text Vertical ───────────────────────────────────────────────────────────

    {
      id: 'verticaltext',
      type: 'text',
      fontFamily: 'Libre Barcode',
      text: 'ON FIRED',
      color: '{{pallete_LightVibrant}}',
      rotation: -90,
      x: 48,
      y: 270,
      fontSize: 54,
      textAlign: 'left',
      filter: {
        opacity: '0.2'
      }
    },

    // ── Hero image ───────────────────────────────────────────────────────────
    {
      id: 'hero_image',
      type: 'shape',
      image: '{{avatar}}',
      svg: SHAPES.hexagon,
      x: 55,
      y: 35,
      w: 230,
      h: 230,
      objectFit: 'cover',
      align: 'center center',
      color: 'auto',
      filter: {
        opacity: '0.95',
        'drop-shadow': '0px 8px 32px {{pallete_Vibrant}}'
      }
    },

    // ── Hexagon ring ─────────────────────────────────────────────────────────
    {
      id: 'hex_ring',
      type: 'shape',
      svg: SHAPES.hexagon,
      x: 47,
      y: 27,
      w: 246,
      h: 246,
      color: '{{pallete_LightVibrant}}',
      filter: { opacity: '0.35' }
    },

    // ── Small decorative shapes ──────────────────────────────────────────────
    {
      id: 'deco_star_1',
      type: 'shape',
      svg: SHAPES.star,
      x: 26,
      y: 18,
      w: 32,
      h: 32,
      color: '{{pallete_LightVibrant}}',
      filter: { opacity: '0.55' }
    },
    {
      id: 'deco_star_2',
      type: 'shape',
      svg: SHAPES.star,
      x: 298,
      y: 240,
      w: 22,
      h: 22,
      color: '{{pallete_Vibrant}}',
      filter: { opacity: '0.45' }
    },
    {
      id: 'deco_curvedStar',
      type: 'shape',
      svg: SHAPES.curvedStar,
      x: 820,
      y: 16,
      w: 55,
      h: 55,
      color: '{{pallete_Vibrant}}',
      filter: { opacity: '0.40' }
    },
    {
      id: 'deco_pinwheel',
      type: 'shape',
      svg: SHAPES.pinwheel,
      x: 852,
      y: 235,
      w: 46,
      h: 46,
      color: '{{pallete_LightMuted}}',
      filter: { opacity: '0.35' }
    },

    // ── Separator line ───────────────────────────────────────────────────────
    {
      id: 'separator',
      type: 'shape',
      x: 330,
      y: 20,
      w: 2,
      h: 260,
      color: '{{pallete_Vibrant}}',
      filter: { opacity: '0.25' }
    },

    // ── Package name ─────────────────────────────────────────────────────────
    {
      id: 'pkg_scope',
      type: 'text',
      text: '@frova_happy /',
      x: 360,
      y: 38,
      fontSize: 14,
      fontFamily: 'Roboto',
      color: '{{pallete_LightMuted}}',
      textAlign: 'left',
      textBaseline: 'middle',
    },
    {
      id: 'pkg_name',
      type: 'text',
      text: 'brush',
      x: 466,
      y: 38,
      fontSize: 14,
      fontFamily: 'Roboto',
      fontWeight: 'bold',
      color: '{{pallete_LightVibrant}}',
      textAlign: 'left',
      textBaseline: 'middle',
    },

    // ── Main title ───────────────────────────────────────────────────────────
    {
      id: 'title',
      type: 'text',
      text: 'Brush',
      x: 360,
      y: 100,
      fontSize: 58,
      fontFamily: 'Open Sans',
      fontWeight: 'bold',
      color: '#ffffff',
      textAlign: 'left',
      textBaseline: 'middle',
      filter: { 'drop-shadow': '0px 4px 18px {{pallete_Vibrant}}' }
    },

    // ── Tagline ──────────────────────────────────────────────────────────────
    {
      id: 'tagline',
      type: 'text',
      text: 'Canvas universal · Browser & Node.js',
      x: 358,
      y: 148,
      fontSize: 17,
      fontFamily: 'Roboto',
      color: '{{pallete_LightMuted}}',
      textAlign: 'left',
      textBaseline: 'middle',
    },

    // ── Version badge ────────────────────────────────────────────────────────
    {
      id: 'version_badge_bg',
      type: 'shape',
      x: 356,
      y: 172,
      w: 105,
      h: 28,
      color: '{{pallete_Vibrant}}',
      filter: { opacity: '0.20' }
    },
    {
      id: 'version_text',
      type: 'text',
      text: `v${version}`,
      x: 409,
      y: 186,
      fontSize: 13,
      fontFamily: 'Roboto',
      fontWeight: 'bold',
      color: '{{pallete_LightVibrant}}',
      textAlign: 'center',
      textBaseline: 'middle',
    },

    // ── Node engine badge ────────────────────────────────────────────────────
    {
      id: 'engine_badge_bg',
      type: 'shape',
      x: 472,
      y: 172,
      w: 120,
      h: 28,
      color: '{{pallete_Muted}}',
      filter: { opacity: '0.20' }
    },
    {
      id: 'engine_text',
      type: 'text',
      text: `Node ${nodeEngine}`,
      x: 532,
      y: 186,
      fontSize: 13,
      fontFamily: 'Roboto',
      color: '{{pallete_LightMuted}}',
      textAlign: 'center',
      textBaseline: 'middle',
    },

    // ── Bottom separator ─────────────────────────────────────────────────────
    {
      id: 'bottom_sep',
      type: 'shape',
      x: 358,
      y: 258,
      w: 510,
      h: 1,
      color: '{{pallete_Vibrant}}',
      filter: { opacity: '0.20' }
    },

    // ── Footer ───────────────────────────────────────────────────────────────
    {
      id: 'footer',
      type: 'text',
      text: 'github.com/FrovaHappy/brush · MIT License',
      x: 358,
      y: 278,
      fontSize: 11,
      fontFamily: 'Roboto',
      color: '{{pallete_DarkVibrant}}',
      textAlign: 'left',
      textBaseline: 'middle',
    },
  ]
}

describe('paint brush', () => {
  it('should paint a canvas based on the template', async () => {
    await setFonts(VAR.FONTS_FROM_LOCAL)
    const canvas = await brush({ template, filterText: VAR.FILTER_TEXT })
    const png = await canvas.encode('png')
    if (png.length === 0) throw new Error('Expected generated image to be non-empty')

    // Ensure output directory exists
    const outDir = './assets/images'
    if (!existsSync(outDir)) await mkdir(outDir, { recursive: true })
    await writeFile(`${outDir}/bg.png`, png)
  })
})