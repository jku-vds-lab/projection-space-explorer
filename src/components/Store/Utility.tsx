import { createLinearRangeScaler } from '../Utility/ScalingAndAxes';
import { SchemeColor } from '../Utility/Colors/SchemeColor';
import { IBaseProjection } from '../../model/ProjectionInterfaces';

function calcBounds(workspace: IBaseProjection) {
  // Get rectangle that fits around data set
  let minX = 1000;
  let maxX = -1000;
  let minY = 1000;
  let maxY = -1000;
  workspace.forEach((sample) => {
    minX = Math.min(minX, sample.x);
    maxX = Math.max(maxX, sample.x);
    minY = Math.min(minY, sample.y);
    maxY = Math.max(maxY, sample.y);
  });

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
    left: minX,
    top: minY,
    right: maxX,
    bottom: maxY,
  };
}

function solve(data, k) {
  if (k == null) k = 1;

  const size = data.length;
  const last = size - 4;

  let path = `M${[data[0], data[1]]}`;

  for (let i = 0; i < size - 2; i += 2) {
    const x0 = i ? data[i - 2] : data[0];
    const y0 = i ? data[i - 1] : data[1];

    const x1 = data[i + 0];
    const y1 = data[i + 1];

    const x2 = data[i + 2];
    const y2 = data[i + 3];

    const x3 = i !== last ? data[i + 4] : x2;
    const y3 = i !== last ? data[i + 5] : y2;

    const cp1x = x1 + ((x2 - x0) / 6) * k;
    const cp1y = y1 + ((y2 - y0) / 6) * k;

    const cp2x = x2 - ((x3 - x1) / 6) * k;
    const cp2y = y2 - ((y3 - y1) / 6) * k;

    path += `C${[cp1x, cp1y, cp2x, cp2y, x2, y2]}`;
  }

  return path;
}

const blobToBase64 = (blob) => {
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  return new Promise<string>((resolve) => {
    reader.onloadend = () => {
      let b64 = reader.result as string;

      b64 = b64.replace(/^data:.+;base64,/, '');

      resolve(b64);
    };
  });
};

/**
 * Creates a partial dump which excludes a list of columns.
 */
export class UtilityActions {
  static partialDump(state: any, excluded: string[]): any {
    const set = new Set(excluded);

    const partial = {};

    // Copy all included keys to partial object
    Object.keys(state)
      .filter((key) => !set.has(key))
      .forEach((key) => {
        partial[key] = state[key];
      });

    return partial;
  }

  static generateImage(
    state: any,
    width: number,
    height: number,
    padding: number,
    options: any,
    ctx?: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  ) {
    try {
      const provided = ctx !== null && ctx !== undefined;

      let canvas = null;
      if (!ctx) {
        canvas = new OffscreenCanvas(width, height);
        ctx = canvas.getContext('2d');
      }

      // This line is actually not even needed...
      ctx.beginPath();
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = options?.backgroundColor ?? '#fff';
      ctx.rect(0, 0, width, height);
      ctx.fill();
      ctx.closePath();
      ctx.beginPath();

      const mapping = state.pointColorMapping;

      const bounds = calcBounds(state.projections.workspace);

      const offsetX = -bounds.left;
      const offsetY = -bounds.top;

      const innerAR = bounds.width / bounds.height;
      const outerAR = width / height;

      let xPad = 0;
      let yPad = 0;

      if (innerAR > outerAR) {
        // more broad than bounds allow... pad horizontal
        yPad = ((1 - outerAR / innerAR) * height) / 2;
      } else if (innerAR < outerAR) {
        // more narrow than bounds allow, pad vertical
        xPad = ((1 - innerAR / outerAR) * width) / 2;
      }

      const sx = (x: number) => {
        return padding + xPad + (offsetX + x) * ((width - 2 * (padding + xPad)) / bounds.width);
      };

      const sy = (y: number) => {
        return height - (padding + yPad + (offsetY + y) * ((height - 2 * (padding + yPad)) / bounds.height));
      };

      if (state.dataset.isSequential) {
        ctx.globalAlpha = 0.5;
        ctx.lineWidth = options?.lineWidth ?? 2;
        ctx.filter = options?.lineFilter ?? '';

        state.dataset.segments.forEach((segment) => {
          const points = segment.vectors.map((vector) => [sx(vector.x), sy(vector.y)]).flat();

          const path = new Path2D(solve(points, 1));

          ctx.strokeStyle = segment.__meta__.intrinsicColor.hex;
          ctx.stroke(path);
        });
      }

      ctx.lineWidth = 1;
      ctx.globalAlpha = 1;
      ctx.filter = options?.pointFilter ?? '';

      let pointSizeScaler = null;

      if (state.channelSize) {
        pointSizeScaler = createLinearRangeScaler(
          state.globalPointSize as any,
          state.dataset.columns[state.channelSize.key].range.min,
          state.dataset.columns[state.channelSize.key].range.max,
        );
      }

      let isSelected: (index: number) => boolean = () => true;

      if (state.currentAggregation.aggregation.length > 0) {
        const aggSet = new Set(state.currentAggregation.aggregation);
        isSelected = (index: number) => {
          return aggSet.has(index);
        };
      }

      state.projections.workspace.forEach((value, index) => {
        const { x, y } = value;

        const color = isSelected(index) ? (mapping.map(state.dataset.vectors[index][state.channelColor.key]) as SchemeColor) : new SchemeColor('#c0c0c0');

        ctx.beginPath();

        ctx.fillStyle = color.hex;
        ctx.strokeStyle = color.hex;

        ctx.globalAlpha = options?.pointBrightness ?? 0.5;
        ctx.moveTo(sx(x), sy(y));
        ctx.arc(
          sx(x),
          sy(y),
          (options?.pointSize ?? 4) * (state.channelSize ? pointSizeScaler(state.dataset.vectors[index][state.channelSize.key]) : 1),
          0,
          2 * Math.PI,
        );
        ctx.fill();
        ctx.stroke();
      });

      ctx.filter = '';
      ctx.globalAlpha = 1;

      return new Promise<string>((resolve) => {
        if (!provided) {
          canvas
            .convertToBlob({
              type: 'image/jpeg',
              quality: 1,
            })
            .then((result) => {
              blobToBase64(result).then((result) => {
                resolve(result);
              });
            });
        } else {
          resolve('');
        }
      });
    } catch (e) {
      return new Promise<string>((resolve) => {
        resolve('');
      });
    }
  }
}
