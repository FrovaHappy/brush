import type { Font } from "../types";

const FONTS_FROM_CDN: Font[] = [
  {
    name: 'Roboto',
    url: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxP.ttf',
  },
  {
    name: 'Open Sans',
    url: 'https://fonts.gstatic.com/s/opensans/v29/mem8YaGs126MiZpBA-U1UpcaXcl0Aw.ttf',
  },
  {
    name: 'Ole',
    url: 'https://fonts.gstatic.com/s/ole/v6/dFazZf6Z-rdM8vY7.woff2',
  },
  {
    name: 'Playwrite England Joined',
    url: 'https://fonts.gstatic.com/l/font?kit=k3kLo8wSPe9dzQ1UGbvobAPhY7KP0QrM4ozNenTi2OoAAJ29kwI6hE4&skey=5be5ec70f90e1d67&v=v11',
  }]
const FONTS_FROM_LOCAL: Font[] = [
  {
    name: 'Roboto',
    url: './tests/fonts/Roboto.ttf',
  },
  {
    name: 'Open Sans',
    url: './tests/fonts/OpenSans.ttf',
  },
  {
    name: 'Ole',
    url: './tests/fonts/Ole.woff2',
  },
  {
    name: 'Playwrite England Joined',
    url: './tests/fonts/PlaywriteEnglandJoined.woff2',
  }
]

const filterText = {
  name: 'John Doe',
  age: 30,
  city: 'New York',
  imageUrl: 'https://via.placeholder.com/150',
  avatarUrl: 'https://via.placeholder.com/100',
}

export default { FONTS_FROM_CDN, FONTS_FROM_LOCAL, filterText }