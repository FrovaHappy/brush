const { brush, getImages } = require('@frova/brush/node');
const fs = require('fs');

async function main() {
  const imageUrl = 'https://media.licdn.com/dms/image/v2/C4E12AQH_Gk6cLYiB7w/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1520127843268?e=2147483647&v=beta&t=j1lgxfsEPIMGhUaX141iQuSbuAkuRGXr2miiGKvT76M';
  const img = await getImages(imageUrl);

  const template = {
    version: '1',
    title: 'Test Canvas with Clip',
    h: 800,
    w: 1200,
    bg_color: '#ffffff',
    layers: [
      {
        id: 'shape1',
        type: 'shape',
        dx: 100,
        dy: 50,
        dw: 600,
        dh: 338,
        image: imageUrl,
        clip: {
          svg: `<svg width="480" height="270" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="50" height="50" fill="none" stroke="black" stroke-width="2"/>
            <rect x="430" y="0" width="50" height="50" fill="none" stroke="black" stroke-width="2"/>
            <rect x="0" y="220" width="50" height="50" fill="none" stroke="black" stroke-width="2"/>
            <rect x="430" y="220" width="50" height="50" fill="none" stroke="black" stroke-width="2"/>
            <circle cx="240" cy="67" r="36" fill="none" stroke="blue" stroke-width="2"/>
            <ellipse cx="120" cy="135" rx="60" ry="27" fill="none" stroke="green" stroke-width="2"/>
            <polygon points="360,108 410,135 360,162 310,135" fill="none" stroke="red" stroke-width="2"/>
            <path d="M 60 180 Q 120 153 180 180 T 300 180" fill="none" stroke="purple" stroke-width="2"/>
          </svg>`,
          align: 'center'
        }
      },
      {
        id: 'text1',
        type: 'text',
        dx: 50,
        dy: 100,
        text: 'Hello, Brush Library!',
        size: 24,
        color: '#000000'
      }
    ]
  };

  const canvas = await brush(template, { shape1: img }, {}, undefined);
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync('output.png', buffer);
  console.log('Canvas saved as output.png');
}

main().catch(console.error);