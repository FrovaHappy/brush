import { brush, setFonts } from '@frova_happy/brush/node';
import { writeFile } from 'node:fs/promises';

// Definición de una plantilla simple para renderizar en el canvas
const template = {
  version: '1',
  w: 800,
  h: 400,
  backgroundColor: '{{pallete_LightVibrant}}',

  layerColor: 'image',
  layers: [
    // Capa de forma decorativa (círculo)
    {
      id: 'image',
      type: 'shape',
      image: 'https://i.pinimg.com/control1/736x/6d/18/e6/6d18e61870f5282c93af93372266b7f3.jpg',
      svg: '<svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 24 24" width="512" height="512"><path d="M13 0h6a5 5 0 0 1 5 5v6H13Zm-2 0h-.959L0 10.041V11h3.172L11 3.172Zm2 18 5-5h-5Zm11-5h-3.172L13 20.828V24h.959L24 13.959Zm-13 0H0v6a5 5 0 0 0 5 5h6Zm0-7-5 5h5Zm5.787 18H19a5 5 0 0 0 5-5v-2.213ZM7.213 0H5a5 5 0 0 0-5 5v2.213Z"/></svg>',
      x: 300,
      y: 50,
      w: 200,
      h: 200,
      color: 'secondary',
      filter: {
        opacity: '0.8',
        'drop-shadow': '0px 10px 20px rgba(0,0,0,0.5)',
      },
    },
    // Capa de texto principal
    {
      id: 'title_text',
      type: 'text',
      text: '¡Hola {{name}}!',
      x: 400,
      y: 290,
      fontSize: 48,
      fontFamily: 'Arial',
      color: 'primary',
      textAlign: 'center',
      baseline: 'middle',
    },
    // Capa de subtítulo
    {
      id: 'subtitle_text',
      type: 'text',
      text: 'Implementación rápida con Brush en Node.js',
      x: 400,
      y: 340,
      fontSize: 20,
      fontFamily: 'Text', // usa la fuente personalizada cargada
      color: '{{pallete_LightMuted}}',
      textAlign: 'center',
      baseline: 'middle',
      filter: {
        opacity: '0.8',
        'drop-shadow': '0px 2px 10px {{pallete_Muted}}',
      }
    },
  ],
};

const fonts = [
  {
    name: 'Text',
    url: 'https://fonts.gstatic.com/s/loversquarrel/v25/Yq6N-LSKXTL-5bCy8ksBzpQ_-wArabs.woff2'
  }
]

async function main() {
  try {
    console.log('Renderizando plantilla...');
    // Carga las fuentes a utilizar
    await setFonts(fonts)
    // Generar el canvas a partir de la plantilla y variables dinámicas
    const canvas = await brush({
      template,
      filterText: {
        name: 'Desarrollador',
      },
    });

    // Convertir el canvas a buffer PNG y guardarlo en un archivo
    const buffer = await canvas.encode('png');
    await writeFile(new URL('./output.png', import.meta.url), buffer);

    console.log('¡Imagen generada exitosamente en "output.png"!');
  } catch (error) {
    console.error('Error al renderizar el canvas:', error);
    process.exit(1);
  }
}

main();
