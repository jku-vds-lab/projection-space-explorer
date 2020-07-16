/**
 * Advanced RenderingContext that takes into account a specific pixel ratio.
 */
export class RenderingContextEx {
    context: CanvasRenderingContext2D = null
    pixelRatio: number = 1

    constructor(context, pixelRatio) {
        this.context = context
        this.pixelRatio = pixelRatio
    }

    set lineWidth(value) {
        this.context.lineWidth = value
    }

    set lineDashOffset(value) {
        this.context.lineDashOffset = value
    }

    setLineDash(value) {
        this.context.setLineDash(value)
    }

    beginPath() {
        this.context.beginPath()
    }

    closePath() {
        this.context.closePath()
    }

    arc(x, y, radius, startAngle, endAngle, anticlockwise) {
        this.context.arc(x * this.pixelRatio, y * this.pixelRatio, radius * this.pixelRatio, startAngle, endAngle, anticlockwise)
    }

    lineTo(x, y) {
        this.context.lineTo(x * this.pixelRatio, y * this.pixelRatio)
    }

    arrowTo(x, y) {
        this.lineTo(x, y)
    }

    stroke() {
        this.context.stroke()
    }

    moveTo(x, y) {
        this.context.moveTo(x * this.pixelRatio, y * this.pixelRatio)
    }
}