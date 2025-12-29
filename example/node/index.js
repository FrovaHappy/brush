import { brush } from '@frova_happy/brush';
import { writeFileSync } from 'fs';

/**
 * @type {import('@frova_happy/brush').Templete} Templete
 * 
 */
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
      family: 'Science-Gothic',
      dx: 50,
      dy: 50,
      text: 'Hola desde Node.js',
      size: 24,
      color: '#000000'
    },
    {
      id: 'forma1',
      type: 'shape',
      dx: 50,
      dy: 100,
      dw: 100,
      dh: 100,
      color: '#ff0000'
    }
    ,
    {
      id: 'img1_layer',
      type: 'shape',
      image: 'https://images.vexels.com/media/users/3/294998/isolated/lists/facd4f4518a6db770e07aebc5bb7a216-formas-de-patrones-geometricos-coloridos.png',
      dx: 200,
      dy: 100,
      dw: 140,
      dh: 100,
      fit: 'cover'
    },
    {
      id: 'img2_layer',
      type: 'shape',
      image: '{{image_url}}',
      dx: 50,
      dy: 200,
      dw: 140,
      dh: 100,
      fit: 'cover'
    }
  ]
};

async function main() {
  try {
    const canvas = await brush({
      template,
      filterText: { image_url: 'https://images.vexels.com/media/users/3/295000/isolated/lists/8e6c03200ed4a95aaa7fc860afbc96f8-patron-de-colores-de-formas-geometricas.png' },
      castColor: undefined,
      fonts: [
        {
          name: 'Science-Gothic',
          url: 'https://fonts.gstatic.com/s/sciencegothic/v5/CHydV-7EH1X7aiQh5jPNDTJnVUAvhrL0sQdjzDQhk11iTp6mX-ANuf1d_83dPfZJ7Lvcvg8EGYzcW7TqdtQ.woff2'
        }
      ]
    });
    // En Node.js, canvas es un objeto Canvas de @napi-rs/canvas
    const buffer = canvas.toBuffer('image/png');
    writeFileSync('output.png', buffer);
    console.log('Imagen guardada como output.png');
  } catch (error) {
    console.error('Error:', error);
  }
}

main();

// Render a single image that shows a 3x3 grid of different alignments with guide lines.
export async function testAlignmentsGrid() {
  const alignments = ['top', 'bottom', 'left', 'right', 'center', 'top-left', 'top-right', 'bottom-left', 'bottom-right'];
  const cols = 3;
  const rows = 3;
  const leftMargin = 25;
  const topMargin = 100; // keep images below the text
  const padding = 10;

  const totalAvailW = template.w - leftMargin - padding * (cols + 1);
  const totalAvailH = template.h - topMargin - padding * (rows + 1);
  const cellW = Math.floor(totalAvailW / cols);
  const cellH = Math.floor(totalAvailH / rows);

  // build template: keep the text at top and add 9 image layers positioned in grid
  const tpl = {
    version: template.version,
    title: template.title + ' - alignment grid',
    w: template.w,
    h: template.h,
    bg_color: template.bg_color,
    layers: [template.layers.find(l => l.type === 'text')].filter(Boolean)
  };

  for (let i = 0; i < alignments.length; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const dx = leftMargin + padding + col * (cellW + padding);
    const dy = topMargin + padding + row * (cellH + padding);
    tpl.layers.push({
      id: `grid_img_${i}`,
      type: 'shape',
      image: i === 0 ? template.layers.find(l => l.id === 'img1_layer').image : template.layers.find(l => l.id === 'img2_layer').image,
      dx,
      dy,
      dw: cellW,
      dh: cellH,
      // use clip with same size so alignment options take effect
      clip: { svg: `<svg width="${cellW}" height="${cellH}"><rect x="0" y="0" width="${cellW}" height="${cellH}" /></svg>`, align: alignments[i] }
    });
  }

  // render
  try {
    const canvas = await brush({
      template: tpl,
      filterText: { image_url: 'https://images.vexels.com/media/users/3/295000/isolated/lists/8e6c03200ed4a95aaa7fc860afbc96f8-patron-de-colores-de-formas-geometricas.png' },
      castColor: undefined,
      fonts: [
        {
          name: 'Science-Gothic',
          url: 'https://fonts.gstatic.com/s/sciencegothic/v5/CHydV-7EH1X7aiQh5jPNDTJnVUAvhrL0sQdjzDQhk11iTp6mX-ANuf1d_83dPfZJ7Lvcvg8EGYzcW7TqdtQ.woff2'
        }
      ]
    });

    const ctx = canvas.getContext('2d');
    // draw guide lines for each cell
    ctx.save();
    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.lineWidth = 1;
    for (let i = 0; i < alignments.length; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = leftMargin + padding + col * (cellW + padding);
      const y = topMargin + padding + row * (cellH + padding);
      // lateral delimiters
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + cellH);
      ctx.moveTo(x + cellW, y);
      ctx.lineTo(x + cellW, y + cellH);
      ctx.stroke();
      // center lines
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255,0,0,0.2)';
      ctx.moveTo(x + Math.round(cellW / 2), y);
      ctx.lineTo(x + Math.round(cellW / 2), y + cellH);
      ctx.moveTo(x, y + Math.round(cellH / 2));
      ctx.lineTo(x + cellW, y + Math.round(cellH / 2));
      ctx.stroke();
      ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    }
    ctx.restore();

    const fname = 'output_grid.png';
    writeFileSync(fname, canvas.toBuffer('image/png'));
    console.log('Wrote', fname);
  } catch (err) {
    console.error('Failed to render grid', err);
  }
}

testAlignmentsGrid();