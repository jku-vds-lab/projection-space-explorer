import * as React from 'react'

/**
 * Go Legend, implemented using a canvas element and React effect hooks
 */

// Piece size in pixels
const P = 13

// Width in pixels
const W = 20 * P

// Height in pixels
const H = 20 * P


export var GoLegend = ({ selection, aggregate }) => {
    if (aggregate) {
        return <div>Not applicable</div>
    }

    const canvasRef = React.useRef(null)

    React.useEffect(() => {
        // Redraw go field whenever selection changes
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')

        ctx.clearRect(0, 0, W, H)

        ctx.fillStyle = '#C19A6B'
        ctx.fillRect(0, 0, W, H);

        ctx.strokeStyle = '#000000'
        ctx.beginPath()
        for (var x = 0; x < 19; x++) {
            var cx = P + 0.5 + x * P
            var cy = P + 0.5 + x * P

            ctx.moveTo(cx, P + 0.5)
            ctx.lineTo(cx, P * 19 + 0.5)

            ctx.moveTo(P + 0.5, cy)
            ctx.lineTo(P * 19 + 0.5, cy)
        }
        ctx.stroke()

        // Draw go pieces
        if (selection.length == 1) {
            var vector = selection[0]

            for (var x = 0; x < 19; x++) {
                for (var y = 0; y < 19; y++) {
                    var cx = P + 0.5 + x * P
                    var cy = P + 0.5 + y * P

                    var key = String.fromCharCode('a'.charCodeAt(0) + x) + String.fromCharCode('a'.charCodeAt(0) + y)


                    if (vector[key] == 'b' || vector[key] == 'w') {
                        if (vector[key] == 'b') {
                            ctx.fillStyle = '#000000'
                        }
                        if (vector[key] == 'w') {
                            ctx.fillStyle = '#ffffff'
                        }
                        ctx.beginPath()
                        ctx.arc(cx, cy, P / 2, 0, Math.PI * 2)
                        ctx.fill()
                    }
                }
            }

        }

    }, [selection])


    return <canvas
        ref={canvasRef}
        width={W}
        height={H}
    />


}