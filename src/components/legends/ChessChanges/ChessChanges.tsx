import * as React from 'react'
import { arraysEqual } from '../../WebGLView/UtilityFunctions'
import { Vect } from "../../Utility/Data/Vect"


// Lookup table for chess UNICODE symbols
var symbols = {
    'wr': 'textures/chess/Chess_rlt45.svg',
    'wn': 'textures/chess/Chess_nlt45.svg',
    'wb': 'textures/chess/Chess_blt45.svg',
    'wk': 'textures/chess/Chess_klt45.svg',
    'wq': 'textures/chess/Chess_qlt45.svg',
    'wp': 'textures/chess/Chess_plt45.svg',
    'br': 'textures/chess/Chess_rdt45.svg',
    'bn': 'textures/chess/Chess_ndt45.svg',
    'bb': 'textures/chess/Chess_bdt45.svg',
    'bk': 'textures/chess/Chess_kdt45.svg',
    'bq': 'textures/chess/Chess_qdt45.svg',
    'bp': 'textures/chess/Chess_pdt45.svg',
    '': ''
}

Object.keys(symbols).filter(key => key != '').forEach(key => {
    var path = symbols[key]
    var img = new Image(45, 45)
    img.src = path
    symbols[key] = img
})



type ChessChangesProps = {
    vectorsA: Array<Vect>
    vectorsB: Array<Vect>
    width?: number
    height?: number
}

function getOccurences(vectors: Array<Vect>) {
    var aggregation = {}
    var keys = []

    var nums = [1, 2, 3, 4, 5, 6, 7, 8]
    var chars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

    nums.forEach((index) => {
        chars.forEach((char) => {
            keys.push("" + char + index)
        })
    })

    vectors.forEach((vector, index) => {
        keys.forEach((key, keyIndex) => {
            if (aggregation[key] == undefined) {
                aggregation[key] = []
            }

            if (!aggregation[key].some((e) => e.key == vector[key])) {
                aggregation[key].push({ key: vector[key], count: 1 })
            } else {
                aggregation[key].filter(e => e.key == vector[key])[0].count += 1
            }
        })
    })

    return aggregation
}


function getProminent(aggregation, key) {
    var max = 0.0
    var total = 0
    let content = ""
    let opacity = 1
    for (var k in aggregation[key]) {
        var v = aggregation[key][k]
        total += v.count

        if (v.count > max) {
            max = v.count
            content = aggregation[key][k].key
        }
    }

    opacity = (max / total)

    return [content, opacity]
}

export class ChessChanges extends React.Component<ChessChangesProps> {
    canvasRef = React.createRef<HTMLCanvasElement>()
    canvasContext: CanvasRenderingContext2D = null

    constructor(props: ChessChangesProps) {
        super(props)
    }

    renderToContext() {
        let vectorsA = this.props.vectorsA
        let vectorsB = this.props.vectorsB

        // Get layout size, on retina display, canvas width is actually larger
        var cssWidth = this.props.width ? this.props.width : this.canvasRef.current.getBoundingClientRect().width
        var cssHeight = this.props.height ? this.props.height : this.canvasRef.current.getBoundingClientRect().height

        // Set values to multiples of 9 so pixels arent smudged
        var width = cssWidth * window.devicePixelRatio
        var height = cssHeight * window.devicePixelRatio
        width = Math.floor(width / 8) * 8
        height = Math.floor(height / 8) * 8

        var size = width / 8

        this.canvasRef.current.setAttribute('width', width.toString())
        this.canvasRef.current.setAttribute('height', height.toString())

        // Generate chess keys
        var keys = []

        var nums = [1, 2, 3, 4, 5, 6, 7, 8]
        var chars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

        nums.forEach((index) => {
            chars.forEach((char) => {
                keys.push("" + char + index)
            })
        })

        let countA = getOccurences(vectorsA)
        let countB = getOccurences(vectorsB)

        // horizontal chess keys
        keys = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

        // variable determining the current field color
        var col = "white"


        for (var i = 0; i < 64; i++) {
            var x = i % 8
            var y = Math.floor(i / 8)
            if (i % 8 != 0) {
                if (col == "white") {
                    col = "black"
                } else {
                    col = "white"
                }
            }

            var key = "" + keys[i % 8] + (8 - ((i / 8) >> 0))

            let content = ""
            let opacity = 1
            let deleted = false

            let [contentA, opacityA] = getProminent(countA, key) as [string, number]
            let [contentB, opacityB] = getProminent(countB, key) as [string, number]

            if (contentA != contentB) {
                content = contentB
            }
            if (contentA != "" && contentB == "") {
                deleted = true
            }

            this.canvasContext.fillStyle = col

            this.canvasContext.fillRect(
                x * size,
                y * size,
                size,
                size)

            try {
                this.canvasContext.save()
                this.canvasContext.globalAlpha = opacity
                if (!deleted) {
                    this.canvasContext.drawImage(symbols[content], x * size, y * size, size, size)
                } else {
                    this.canvasContext.fillStyle = 'red'
                    this.canvasContext.fillRect(x * size, y * size, size, size)
                }
                
                this.canvasContext.restore()
            } catch (e) {
            }
        }
    }

    componentDidMount() {
        this.canvasContext = this.canvasRef.current.getContext('2d')

        this.renderToContext()
    }

    componentDidUpdate(prevProps) {
        if (!arraysEqual(prevProps.vectorsA, this.props.vectorsA) || !arraysEqual(prevProps.vectorsB, this.props.vectorsB)) {
            this.renderToContext()
        }
    }


    render() {
        return <canvas ref={this.canvasRef} style={{
            width: this.props.width ? this.props.width : 120,
            height: this.props.height ? this.props.height : 120
        }}></canvas>
    }
}