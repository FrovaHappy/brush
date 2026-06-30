import React, { useEffect, useRef } from 'react';
import { brush, setFonts } from '@frova_happy/brush/browser';

function App() {
  const containerRef = useRef(null);

  const template = {
    version: '1',
    w: 800,
    h: 400,
    colors: {
      background: '{{pallete_LightVibrant}}',
    },
    layerColor: 'image',
    layers: [
      {
        id: 'image',
        type: 'shape',
        image: 'https://media.tenor.com/d_pL1WslyB8AAAAM/anime-pout.gif',
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
      {
        id: 'title_text',
        type: 'text',
        text: '¡Hola {{name}}!',
        x: 400,
        y: 290,
        fontSize: 48,
        fontFamily: 'Arial',
        color: 'primary',
        align: 'center',
        baseline: 'middle',
      },
      {
        id: 'subtitle_text',
        type: 'text',
        text: 'Implementación rápida con Brush en React.js',
        x: 400,
        y: 340,
        fontSize: 32,
        fontFamily: 'Text',
        color: '{{pallete_LightMuted}}',
        align: 'center',
        baseline: 'middle',
        filter: {
          'drop-shadow': '0px 2px 2px {{pallete_Muted}}',
        }
      },
    ],
  };

  const fonts = [
    {
      name: 'Text',
      url: 'https://fonts.gstatic.com/s/loversquarrel/v25/Yq6N-LSKXTL-5bCy8ksBzpQ_-wArabs.woff2'
    }
  ];

  useEffect(() => {
    let active = true;

    async function renderCanvas() {
      try {
        await setFonts(fonts);
        const canvas = await brush({
          template,
          filterText: {
            name: 'Desarrollador',
          },
        });
        if (active && containerRef.current) {
          containerRef.current.innerHTML = '';
          containerRef.current.appendChild(canvas);
        }
      } catch (error) {
        console.error('Error rendering canvas in React:', error);
      }
    }

    renderCanvas();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div ref={containerRef}></div>
  );
}

export default App;