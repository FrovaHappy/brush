import { brush } from '../../dist/web/index.js';

const template = {
  version: '1',
  title: 'Ejemplo HTML',
  w: 400,
  h: 300,
  bg_color: '#f0f0f0',
  layers: [
    {
      id: 'texto1',
      type: 'text',
      family: 'ScienceGothic',
      dx: 50,
      dy: 50,
      text: 'Hola desde HTML',
      size: 24,
      color: '#000000'
    },
    {
      id: 'forma1',
      type: 'shape',
      dx: 150,
      dy: 150,
      dw: 100,
      dh: 100,
      color: '#00ff00'
    }
  ]
};

async function init() {
  try {
    const canvas = await brush({
      template,
      images: {},
      filterText: {},
      castColor: undefined,
      fonts: [
        { url: '/example/html/ScienceGothic.ttf', name: 'ScienceGothic' }
      ]
    });
    document.getElementById('canvas-container').appendChild(canvas);
    console.log('Canvas renderizado exitosamente');
  } catch (error) {
    console.error('Error al renderizar:', error);
  }
}

init();