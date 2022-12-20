/**
 * Advanced RenderingContext that takes into account a specific pixel ratio.
 */
export class RenderingContextEx {
  context: CanvasRenderingContext2D = null;

  pixelRatio = 1;

  constructor(context, pixelRatio) {
    this.context = context;
    this.pixelRatio = pixelRatio;
  }

  set lineWidth(value) {
    this.context.lineWidth = value;
  }

  set lineDashOffset(value) {
    this.context.lineDashOffset = value;
  }

  set strokeStyle(value) {
    this.context.strokeStyle = value;
  }

  set lineCap(value) {
    this.context.lineCap = value;
  }

  setLineDash(value) {
    this.context.setLineDash(value);
  }

  beginPath() {
    this.context.beginPath();
  }

  closePath() {
    this.context.closePath();
  }

  arc(x, y, radius, startAngle, endAngle, anticlockwise) {
    this.context.arc(x * this.pixelRatio, y * this.pixelRatio, radius * this.pixelRatio, startAngle, endAngle, anticlockwise);
  }

  lineTo(x, y) {
    this.context.lineTo(x * this.pixelRatio, y * this.pixelRatio);
  }

  arrowTo(fromX, fromY, toX, toY, headlen = 50) {
    const { lineCap } = this.context;
    this.lineCap = 'round';
    const dx = toX - fromX;
    const dy = toY - fromY;
    const angle = Math.atan2(dy, dx);
    this.lineTo(toX, toY);
    this.moveTo(toX, toY);
    this.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
    this.moveTo(toX, toY);
    this.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
    this.moveTo(toX, toY);
    this.lineCap = lineCap;
  }

  stroke() {
    this.context.stroke();
  }

  moveTo(x, y) {
    this.context.moveTo(x * this.pixelRatio, y * this.pixelRatio);
  }
}
