import React = require('react');
import { IVector } from '../../../model/Vector';
import { arraysEqual } from '../../../components/WebGLView/UtilityFunctions';

type RubikChangesProps = {
  vectorsA: Array<IVector>;
  vectorsB: Array<IVector>;
  width?: number;
  height?: number;
};

function cubieToColour(str, opacity) {
  switch (str) {
    case 'O':
      return `rgb(255,137,33,${opacity})`;
    case 'Y':
      return `rgb(255,204,0,${opacity})`;
    case 'G':
      return `rgb(48,174,32,${opacity})`;
    case 'B':
      return `rgb(21,130,174,${opacity})`;
    case 'R':
      return `rgb(197,11,11,${opacity})`;
    case 'W':
      return `rgb(191,191,191,${opacity})`;
    default:
      return 'black';
  }
}

export class RubikChanges extends React.Component<RubikChangesProps> {
  canvasRef = React.createRef<HTMLCanvasElement>();

  canvasContext: CanvasRenderingContext2D = null;

  constructor(props: RubikChangesProps) {
    super(props);
  }

  componentDidMount() {
    this.canvasContext = this.canvasRef.current.getContext('2d');

    this.renderToContext();
  }

  renderToContext() {
    const { vectorsA } = this.props;
    const { vectorsB } = this.props;
    const countA = getOccurences(vectorsA);
    const countB = getOccurences(vectorsB);

    // Get layout size, on retina display, canvas width is actually larger
    const cssWidth = this.props.width ? this.props.width : this.canvasRef.current.getBoundingClientRect().width;
    const cssHeight = this.props.height ? this.props.height : this.canvasRef.current.getBoundingClientRect().height;

    // Set values to multiples of 9 so pixels arent smudged
    let width = cssWidth * window.devicePixelRatio;
    let height = cssHeight * window.devicePixelRatio;
    width = Math.floor(width / 9) * 9;
    height = Math.floor(height / 12) * 12;

    const size = width / 9;

    this.canvasRef.current.setAttribute('width', width.toString());
    this.canvasRef.current.setAttribute('height', height.toString());

    const distance = 1;

    const offsetMap = {
      upXOffset: distance,
      upYOffset: distance,
      frontXOffset: distance,
      frontYOffset: 2 * distance,
      leftXOffset: 0,
      leftYOffset: distance,
      rightXOffset: 2 * distance,
      rightYOffset: distance,
      downXOffset: distance,
      downYOffset: 3 * distance,
      backXOffset: distance,
      backYOffset: 0 * distance,
    };
    const sides = ['front', 'up', 'left', 'right', 'down', 'back'];

    const aggregation = {};

    for (let side = 0; side < sides.length; side++) {
      for (let i1 = 0; i1 < 3; i1++) {
        for (let j = 0; j < 3; j++) {
          const key = sides[side] + i1 + j;
          let col = 'white' as string;
          let opacity = 1;
          const curKey = 0;

          if (vectorsB.length == 0) {
            col = '#F0F0F0';
          }

          const [opacityA, colA] = getProminent(countA, key) as [number, string];
          const [opacityB, colB] = getProminent(countB, key) as [number, string];

          if (colA != colB) {
            col = colB;
            opacity = opacityB;
          }

          this.canvasContext.fillStyle = '#F0F0F0';
          this.canvasContext.fillRect((offsetMap[`${sides[side]}XOffset`] * 3 + j) * size, (offsetMap[`${sides[side]}YOffset`] * 3 + i1) * size, size, size);

          const w = Math.floor(size * opacity);
          const h = Math.floor(size * opacity);
          const ox = Math.floor((size - w) / 2);
          const oy = Math.floor((size - h) / 2);

          this.canvasContext.fillStyle = col;
          this.canvasContext.fillRect(
            1 + ox + (offsetMap[`${sides[side]}XOffset`] * 3 + j) * size,
            1 + oy + (offsetMap[`${sides[side]}YOffset`] * 3 + i1) * size,
            w - 2,
            h - 2,
          );
        }
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (!arraysEqual(prevProps.vectorsA, this.props.vectorsA) || !arraysEqual(prevProps.vectorsB, this.props.vectorsB)) {
      this.renderToContext();
    }
  }

  render() {
    return (
      <canvas
        className="RubikFingerprintCanvas"
        ref={this.canvasRef}
        style={{
          width: this.props.width ? this.props.width : 13 * 9,
          height: this.props.height ? this.props.height : 13 * 12,
        }}
      />
    );
  }
}

function getProminent(aggregation, key) {
  let col = 'white';
  let opacity = 1;
  let max = 0.0;
  let total = 0;
  let curKey = 0;
  for (const k in aggregation[key]) {
    const v = aggregation[key][k];
    total += v.count;

    if (v.count > max) {
      max = v.count;

      curKey = aggregation[key][k].key;
    }
  }

  opacity = max / total;
  col = cubieToColour(curKey, 1);

  return [opacity, col];
}

function getOccurences(vectors: Array<IVector>) {
  const aggregation = {};
  const keys = [
    'up00',
    'up01',
    'up02',
    'up10',
    'up11',
    'up12',
    'up20',
    'up21',
    'up22',
    'front00',
    'front01',
    'front02',
    'front10',
    'front11',
    'front12',
    'front20',
    'front21',
    'front22',
    'right00',
    'right01',
    'right02',
    'right10',
    'right11',
    'right12',
    'right20',
    'right21',
    'right22',
    'left00',
    'left01',
    'left02',
    'left10',
    'left11',
    'left12',
    'left20',
    'left21',
    'left22',
    'down00',
    'down01',
    'down02',
    'down10',
    'down11',
    'down12',
    'down20',
    'down21',
    'down22',
    'back00',
    'back01',
    'back02',
    'back10',
    'back11',
    'back12',
    'back20',
    'back21',
    'back22',
  ];

  vectors.forEach((vector, index) => {
    keys.forEach((key, keyIndex) => {
      if (aggregation[key] == undefined) {
        aggregation[key] = [];
      }

      if (!aggregation[key].some((e) => e.key == vector[key])) {
        aggregation[key].push({ key: vector[key], count: 1 });
      } else {
        aggregation[key].filter((e) => e.key == vector[key])[0].count += 1;
      }
    });
  });

  return aggregation;
}
