
import { describe, it } from 'vitest'
import { brush, setFonts } from '../node'
import type { Templete } from '../types'
import { writeFile } from 'node:fs/promises'
import VAR from './template'


const template: Templete = {
  version: '1',
  w: 800,
  h: 400,
  colors: {
    background: '#d1d1d1fa'
  },
  layerColor: 'layer2',
  layers: [
    {
      id: 'layer2',
      type: 'shape',
      image: '{{avatar}}', //toma el color dominante de la imagen
      svg: VAR.GEOMETRIC_SHAPES.circle,
      x: 100,
      y: 100,
      w: 200,
      h: 200,
      scale: 1.5,
      rotation: 45,
      objectFit: 'fill',
      align: 'bottom left',
      color: 'auto',
      filter: {
        opacity: '0.7',
        "drop-shadow": '0px 0px 20px {{pallete_Vibrant}}'
      }
    },
    {
      // recorted whith start svg
      id: 'start',
      type: 'shape',
      svg: VAR.GEOMETRIC_SHAPES.circle,
      color: '{{pallete_LightVibrant}}',
      x: 50,
      y: 50,
      w: 100,
      h: 100,
      filter: {
        "opacity": '1',
        "drop-shadow": '30px 10px 4px {{pallete_Vibrant}}'
      }
    },
    {
      type: 'text',
      color: 'auto',
      'fontFamily': 'Updock',
      'fontSize': 32,
      maxWidth: 50,
      rotation: -90,
      x: 400,
      y: 100,
      id: 'text1',
      text: 'hola {{username}}',
    }
  ]
}

describe('paint brush', () => {
  it('should paint a canvas based on the template', async () => {
    await setFonts(VAR.FONTS_FROM_LOCAL)
    const canvas = await brush({ template, filterText: VAR.FILTER_TEXT })
    const png = await canvas.encode('png')
    if (png.length === 0) throw new Error('Expected generated image to be non-empty')
    await writeFile('test.png', png)
  })
})