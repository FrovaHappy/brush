import { brush } from '@frova_happy/brush';
import { writeFileSync } from 'fs';

const template = {
  version: '1',
  title: 'Ejemplo Node.js',
  w: 400,
  h: 300,
  bg_color: '#ffffff',
  layers: [
    {
      id: 'texto1',
      type: 'text',
      dx: 50,
      dy: 50,
      text: 'Hola desde Node.js',
      size: 24,
      color: '#000000'
    },
    {
      id: 'forma1',
      type: 'shape',
      dx: 100,
      dy: 100,
      dw: 100,
      dh: 100,
      color: '#ff0000'
    }
  ]
};

async function main() {
  try {
    const canvas = await brush(template, {}, {}, undefined);
    // En Node.js, canvas es un objeto Canvas de @napi-rs/canvas
    const buffer = canvas.toBuffer('image/png');
    writeFileSync('output.png', buffer);
    console.log('Imagen guardada como output.png');
  } catch (error) {
    console.error('Error:', error);
  }
}

main();