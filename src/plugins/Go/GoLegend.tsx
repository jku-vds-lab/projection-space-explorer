/* eslint-disable react-hooks/rules-of-hooks */
import * as React from 'react';
import { DefaultLegend } from '../../components/legends/DefaultLegend';

/**
 * Go Legend, implemented using a canvas element and React effect hooks
 */

// Piece size in pixels
const P = 13;

// Width in pixels
const W = 20 * P;

// Height in pixels
const H = 20 * P;

export function GoLegend({ selection, aggregate }) {
  if (selection.length <= 0) {
    return <DefaultLegend></DefaultLegend>;
  }
  if (aggregate) {
    return <div>Not applicable</div>;
  }

  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    // Redraw go field whenever selection changes
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, W, H);

    ctx.fillStyle = '#C19A6B';
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = '#000000';
    ctx.beginPath();
    for (let x = 0; x < 19; x++) {
      const cx = P + 0.5 + x * P;
      const cy = P + 0.5 + x * P;

      ctx.moveTo(cx, P + 0.5);
      ctx.lineTo(cx, P * 19 + 0.5);

      ctx.moveTo(P + 0.5, cy);
      ctx.lineTo(P * 19 + 0.5, cy);
    }
    ctx.stroke();

    // Draw go pieces
    if (selection.length === 1) {
      const vector = selection[0];

      for (let x = 0; x < 19; x++) {
        for (let y = 0; y < 19; y++) {
          const cx = P + 0.5 + x * P;
          const cy = P + 0.5 + y * P;

          const key = String.fromCharCode('a'.charCodeAt(0) + x) + String.fromCharCode('a'.charCodeAt(0) + y);

          if (vector[key] === 'b' || vector[key] === 'w') {
            if (vector[key] === 'b') {
              ctx.fillStyle = '#000000';
            }
            if (vector[key] === 'w') {
              ctx.fillStyle = '#ffffff';
            }
            ctx.beginPath();
            ctx.arc(cx, cy, P / 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }
  }, [selection]);

  return <canvas ref={canvasRef} width={W} height={H} />;
}
