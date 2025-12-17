import React, { useEffect, useRef } from 'react';

function App() {
  const canvasRef = useRef(null);

  const template = {
    version: '1',
    title: 'Ejemplo React',
    w: 400,
    h: 300,
    bg_color: '#e0e0e0',
    layers: [
      {
        id: 'texto1',
        type: 'text',
        dx: 50,
        dy: 50,
        text: 'Hola desde React',
        size: 24,
        color: '#000000'
      },
      {
        id: 'forma1',
        type: 'shape',
        dx: 200,
        dy: 200,
        dw: 100,
        dh: 100,
        color: '#0000ff'
      }
    ]
  };

  useEffect(() => {
    async function renderCanvas() {
      try {
        const mod = await import('https://unpkg.com/@frova_happy/brush@latest/dist/web/index.js');
        const { brush } = mod;
        const canvas = await brush({ template, images: {}, filterText: {}, castColor: undefined, fonts: [] });
        if (canvasRef.current) {
          canvasRef.current.innerHTML = '';
          canvasRef.current.appendChild(canvas);
        }
        console.log('Canvas renderizado en React');
      } catch (error) {
        console.error('Error:', error);
      }
    }

    renderCanvas();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Ejemplo de Brush en React</h1>
      <p>Canvas renderizado con la librería Brush:</p>
      <div ref={canvasRef} style={{ border: '1px solid #ccc', display: 'inline-block' }}></div>
    </div>
  );
}

export default App;