import type { Font } from "../types";
const FONTS_FROM_LOCAL: Font[] = [
  {
    name: 'Updock',
    url: 'https://fonts.gstatic.com/l/font?kit=nuF4D_3dVZ70UI9Siaqow2K0R17gSlqa5g1bhXMLVcvgkA-gPKWUiSPT&skey=f9e84b7c5790fca&v=v7',
  },
  {
    name: 'Roboto',
    url: './assets/fonts/Roboto.ttf',
  },
  {
    name: 'Open Sans',
    url: './assets/fonts/OpenSans.ttf',
  },
  {
    name: 'Ole',
    url: './assets/fonts/Ole.woff2',
  },
  {
    name: 'Playwrite England Joined',
    url: './assets/fonts/PlaywriteEnglandJoined.woff2',
  },
  {
    name: 'Bitcount Grid Double Regular',
    url: './assets/fonts/BitcountGridDouble.ttf'
  }
]

const FILTER_TEXT: Record<string, string | undefined> = {
  username: 'john doe',
  server: 'potato',
  banner: 'https://i.pinimg.com/control1/1200x/9e/3c/60/9e3c60e644b3e276a54cde02c5ea60e0.jpg',
  avatar: 'https://i.pinimg.com/control1/736x/53/53/72/5353724391e7f7c56e82e1e583adee18.jpg',
}

const GEOMETRIC_SHAPES = {
  square: '<svg viewBox="0 0 100 100"><rect x="10" y="10" width="80" height="80" fill="currentColor" /></svg>',

  circle: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="currentColor" /></svg>',

  triangle: '<svg viewBox="0 0 100 100"><polygon points="50,15 90,85 10,85" fill="currentColor" /></svg>',

  rectangle: '<svg viewBox="0 0 120 80"><rect x="10" y="10" width="100" height="60" fill="currentColor" /></svg>',

  pentagon: '<svg viewBox="0 0 100 100"><polygon points="50,10 95,43 78,95 22,95 5,43" fill="currentColor" /></svg>',

  hexagon: '<svg viewBox="0 0 100 100"><polygon points="50,5 90,28 90,73 50,95 10,73 10,28" fill="currentColor" /></svg>',

  star: '<svg viewBox="0 0 100 100"><polygon points="50,5 64,36 98,36 70,57 81,91 50,70 19,91 30,57 2,36 36,36" fill="currentColor" /></svg>',
  blob: '<svg viewBox="0 0 100 100"><path d="M25,30 C35,10 70,15 80,35 C90,55 75,85 50,80 C25,75 10,50 25,30 Z" fill="currentColor" /></svg>',
  // Un rayo o destello angular asimétrico
  lightning: '<svg viewBox="0 0 100 100"><polygon points="60,5 20,55 50,55 35,95 80,40 50,40" fill="currentColor" /></svg>',

  // Una cruz abstracta con los bordes curvos hacia adentro
  curvedStar: '<svg viewBox="0 0 100 100"><path d="M50,5 Q50,50 5,50 Q50,50 50,95 Q50,50 95,50 Q50,50 50,5" fill="currentColor" /></svg>',

  // Forma de hélice de tres aspas o "Triskelion" geométrico
  pinwheel: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50,50 Q30,20 50,5 Q70,20 50,50 Q80,30 95,50 Q80,70 50,50 Q70,80 50,95 Q30,80 50,50 Z" fill="currentColor" /></svg>',

  // Una figura matemática puntiaguda (Astroide)
  astroid: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50,10 Q50,50 90,50 Q50,50 50,90 Q50,50 10,50 Q50,50 50,10 Z" fill="currentColor" /></svg>',

  // Una figura en zigzag abstracto tipo escalera distorsionada
  abstractZigzag: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon points="20,10 80,10 50,40 90,40 40,90 60,90 10,50 40,50" fill="currentColor" /></svg>'
};

export default { FONTS_FROM_LOCAL, FILTER_TEXT, GEOMETRIC_SHAPES }