import { SchemeColor } from '../components/Utility/Colors/SchemeColor';

const palettes = {
  // categorical
  dark2: [
    new SchemeColor('#1b9e77'),
    new SchemeColor('#d95f02'),
    new SchemeColor('#e7298a'),
    new SchemeColor('#7570b3'),
    new SchemeColor('#66a61e'),
    new SchemeColor('#e6ab02'),
    new SchemeColor('#a6761d'),
    new SchemeColor('#666666'),
  ],
  accent: [
    new SchemeColor('#7fc97f'),
    new SchemeColor('#beaed4'),
    new SchemeColor('#fdc086'),
    new SchemeColor('#ffff99'),
    new SchemeColor('#386cb0'),
    new SchemeColor('#f0027f'),
    new SchemeColor('#bf5b17'),
    new SchemeColor('#666666'),
  ],
  paired: [
    new SchemeColor('#a6cee3'),
    new SchemeColor('#1f78b4'),
    new SchemeColor('#b2df8a'),
    new SchemeColor('#33a02c'),
    new SchemeColor('#fb9a99'),
    new SchemeColor('#e31a1c'),
    new SchemeColor('#fdbf6f'),
    new SchemeColor('#ff7f00'),
    new SchemeColor('#cab2d6'),
    new SchemeColor('#6a3d9a'),
    new SchemeColor('#ffff99'),
    new SchemeColor('#b15928'),
  ],
  set3: [
    new SchemeColor('#8dd3c7'),
    new SchemeColor('#ffffb3'),
    new SchemeColor('#bebada'),
    new SchemeColor('#fb8072'),
    new SchemeColor('#80b1d3'),
    new SchemeColor('#fdb462'),
    new SchemeColor('#b3de69'),
    new SchemeColor('#fccde5'),
    new SchemeColor('#d9d9d9'),
    new SchemeColor('#bc80bd'),
    new SchemeColor('#ccebc5'),
    new SchemeColor('#ffed6f'),
  ],

  // sequential
  Greys: [new SchemeColor('#ffffff'), new SchemeColor('#000000')],
  YlOrRd: [new SchemeColor('#ffffcc'), new SchemeColor('#fd8d3c'), new SchemeColor('#800026')],
  Viridis: [
    new SchemeColor('#440154'),
    new SchemeColor('#482475'),
    new SchemeColor('#414487'),
    new SchemeColor('#355f8d'),
    new SchemeColor('#2a788e'),
    new SchemeColor('#21908d'),
    new SchemeColor('#22a884'),
    new SchemeColor('#42be71'),
    new SchemeColor('#7ad151'),
    new SchemeColor('#bddf26'),
    new SchemeColor('#bddf26'),
  ],

  // diverging
  BrBG: [new SchemeColor('#543005'), new SchemeColor('#f5f5f5'), new SchemeColor('#003c30')],
  PRGn: [new SchemeColor('#40004b'), new SchemeColor('#f7f7f7'), new SchemeColor('#00441b')],
  SHAP: [new SchemeColor('#1e88e5'), new SchemeColor('#ffffff'), new SchemeColor('#ff0d57')],
};

export const APalette = {
  getByName: (palette: string) => {
    return palettes[palette] as SchemeColor[];
  },
};
