
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
    background: '#dddada'
  },
  layerColor: 'layer2',
  layers: [
    {
      id: 'layer2',
      type: 'shape',
      image: '{{avatar}}', //toma el color dominante de la imagen
      svg: '<svg xmlns="http://www.w3.org/2000/svg" fill="#000000" width="800px" height="800px" viewBox="0 0 32 32" version="1.1">< title > star </title>< path d="M3.488 13.184l6.272 6.112-1.472 8.608 7.712-4.064 7.712 4.064-1.472-8.608 6.272-6.112-8.64-1.248-3.872-7.808-3.872 7.808z" /></svg>',
      x: 100,
      y: 100,
      w: 200,
      h: 200,
      scale: 1.5,
      align: 'bottom left',
      color: 'auto',
      filter: {
        opacity: '0.7',
        "drop-shadow": '0px 0px 20px {{ColorVibrant}}'
      }
    },
    {
      // recorted whith start svg
      id: 'start',
      type: 'shape',
      svg: '<svg xmlns="http://www.w3.org/2000/svg" fill="#000000" width="800px" height="800px" viewBox="0 0 32 32" version="1.1">< title > star </title>< path d="M3.488 13.184l6.272 6.112-1.472 8.608 7.712-4.064 7.712 4.064-1.472-8.608 6.272-6.112-8.64-1.248-3.872-7.808-3.872 7.808z" /></svg>',
      color: '{{ColorLightVibrant}}',
      x: 50,
      y: 50,
      w: 100,
      h: 100,
      filter: {
        "opacity": '1',
        "drop-shadow": '30px 10px 4px {{ColorVibrant}}'
      }
    },
    {
      type: 'text',
      color: 'auto', // tomo el color de la imagen este puede ser el avatar
      'fontFamily': 'Bitcount Grid Double Regular', //no funciona
      'fontSize': 32,
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
    const filterText = {
      avatar: 'https://i.pinimg.com/736x/6a/47/1d/6a471daf6a30e5fffd90c5470b5d6789.jpg',
      username: 'pedro'
    }
    const canvas = await brush({ template, filterText })
    const png = await canvas.encode('png')
    if (png.length === 0) throw new Error('Expected generated image to be non-empty')
    await writeFile('test.png', png)
  })
})