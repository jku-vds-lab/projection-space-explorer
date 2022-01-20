import * as React from 'react'
import { arraysEqual } from '../../WebGLView/UtilityFunctions'


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

export const CHESS_TILE_BLACK = "#edeeef"
export const CHESS_TILE_WHITE = "#ffffff"

export const requiredChessColumns = [];

['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].forEach(c => {
    [1, 2, 3, 4, 5, 6, 7, 8].forEach(n => {
        requiredChessColumns.push(`${c}${n}`)
    })
})

Object.keys(symbols).filter(key => key != '').forEach(key => {
    var path = symbols[key]
    var img = new Image(45, 45)
    img.src = path
    symbols[key] = img
})



type ChessFingerprintProps = {
    vectors: Array<any>
    width?: number
    height?: number
}

export class ChessFingerprint extends React.Component<ChessFingerprintProps> {
    canvasRef = React.createRef<HTMLCanvasElement>()
    canvasContext: CanvasRenderingContext2D = null

    constructor(props: ChessFingerprintProps) {
        super(props)
    }

    renderToContext() {
        var vectors = this.props.vectors

        // Get layout size, on retina display, canvas width is actually larger
        var cssWidth = this.props.width ? this.props.width : this.canvasRef.current.getBoundingClientRect().width
        var cssHeight = this.props.height ? this.props.height : this.canvasRef.current.getBoundingClientRect().height

        // Set values to multiples of 9 so pixels arent smudged
        var width = cssWidth * window.devicePixelRatio
        var height = cssHeight * window.devicePixelRatio
        width = Math.floor(width / 8) * 8
        height = Math.floor(height / 8) * 8

        var size = (width * 10) / 82
        var borderOffset = width / 82

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

        var aggregation = {}

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

        // horizontal chess keys
        keys = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

        // variable determining the current field color
        var col = CHESS_TILE_WHITE

        // draw border around chess board
        this.canvasContext.globalAlpha = 1.0
        this.canvasContext.fillStyle = CHESS_TILE_BLACK
        try {
            this.canvasContext.save()
            this.canvasContext.globalAlpha = 1.0
            this.canvasContext.fillRect(0, 0, width, height)
            this.canvasContext.restore()
        } catch (e) {
        }

        for (var i = 0; i < 64; i++) {
            var x = i % 8
            var y = Math.floor(i / 8)
            if (i % 8 != 0) {
                if (col == CHESS_TILE_WHITE) {
                    col = CHESS_TILE_BLACK
                } else {
                    col = CHESS_TILE_WHITE
                }
            }

            var key = "" + keys[i % 8] + (8 - ((i / 8) >> 0))
            var content = ""
            var opacity = 1.0

            if (vectors.length == 0) {
                content = ""
            }
            else if (aggregation[key].length == 1) {
                content = symbols[aggregation[key][0].key]
                content = aggregation[key][0].key
            } else {
                var max = 0.0
                var total = 0
                for (var k in aggregation[key]) {
                    var v = aggregation[key][k]
                    total += v.count

                    if (v.count > max && symbols[aggregation[key][k].key] !== "" && symbols[aggregation[key][k].key] !== undefined) {
                        max = v.count
                        content = symbols[aggregation[key][k].key]
                        content = aggregation[key][k].key
                    }
                }

                opacity = Math.max((max / total), 0.0)
            }
            this.canvasContext.globalAlpha = 1.0

            this.canvasContext.fillStyle = col
            
            this.canvasContext.fillRect(
                x * size + borderOffset,
                y * size + borderOffset,
                size,
                size)

            try {
                this.canvasContext.save()
                this.canvasContext.globalAlpha = opacity
                this.canvasContext.drawImage(symbols[content], x * size + borderOffset, y * size + borderOffset, size, size)
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
        if (!arraysEqual(prevProps.vectors, this.props.vectors)) {
            this.renderToContext()
        }
    }


    render() {
        return <canvas className="ChessFingerprintCanvas" ref={this.canvasRef} style={{
            width: this.props.width ? this.props.width : 72,
            height: this.props.height ? this.props.height : 96
        }}></canvas>
    }
}

export class ChessCapturesFingerprint extends React.Component<ChessFingerprintProps> {
    canvasRef = React.createRef<HTMLCanvasElement>()
    canvasContext: CanvasRenderingContext2D = null

    constructor(props: ChessFingerprintProps) {
        super(props)
    }

    renderToContext() {
        var vectors = this.props.vectors

        // Get layout size, on retina display, canvas width is actually larger
        var cssWidth = this.props.width ? this.props.width : this.canvasRef.current.getBoundingClientRect().width
        var cssHeight = this.props.height ? this.props.height : this.canvasRef.current.getBoundingClientRect().height

        // Set values to multiples of 9 so pixels arent smudged
        var width = cssWidth * window.devicePixelRatio
        var height = cssHeight * window.devicePixelRatio
        width = Math.floor(width / 8) * 8
        height = Math.floor(height / 10) * 10

        var size = (width * 10) / 82
        var borderOffset = width / 82

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
        keys = [...keys, ...['bb','bk','bn','bp','bq','br','wb','wk','wn','wp','wq','wr'].map(i => 'captured_' + i)]

        var aggregation = {}

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

        // horizontal chess keys
        keys = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

        // variable determining the current field color
        var col = CHESS_TILE_WHITE

        // draw border around chess board
        this.canvasContext.globalAlpha = 1.0
        this.canvasContext.fillStyle = CHESS_TILE_BLACK
        try {
            this.canvasContext.save()
            this.canvasContext.globalAlpha = 1.0
            this.canvasContext.fillRect(0, 0, width, size*8+2*borderOffset)
            this.canvasContext.restore()
        } catch (e) {
        }

        for (var i = 0; i < 64; i++) {
            var x = i % 8
            var y = Math.floor(i / 8)
            if (i % 8 != 0) {
                if (col == CHESS_TILE_WHITE) {
                    col = CHESS_TILE_BLACK
                } else {
                    col = CHESS_TILE_WHITE
                }
            }

            var key = "" + keys[i % 8] + (8 - ((i / 8) >> 0))
            var content = ""
            var opacity = 1.0

            if (vectors.length == 0) {
                content = ""
            }
            else if (aggregation[key].length == 1) {
                content = symbols[aggregation[key][0].key]
                content = aggregation[key][0].key
            } else {
                var max = 0.0
                var total = 0
                for (var k in aggregation[key]) {
                    var v = aggregation[key][k]
                    total += v.count

                    if (v.count > max && symbols[aggregation[key][k].key] !== "" && symbols[aggregation[key][k].key] !== undefined) {
                        max = v.count
                        content = symbols[aggregation[key][k].key]
                        content = aggregation[key][k].key
                    }
                }

                opacity = Math.max((max / total), 0.0)
            }
            this.canvasContext.globalAlpha = 1.0

            this.canvasContext.fillStyle = col
            
            this.canvasContext.fillRect(
                x * size + borderOffset,
                (y) * size + borderOffset,
                size,
                size)

            try {
                this.canvasContext.save()
                this.canvasContext.globalAlpha = opacity
                this.canvasContext.drawImage(symbols[content], x * size + borderOffset, (y) * size + borderOffset, size, size)
                this.canvasContext.restore()
            } catch (e) {
            }
        }

        try {
            this.canvasContext.save()
            this.canvasContext.globalAlpha = 1.0
            this.canvasContext.fillStyle = '#000000'
            const fontSize = Math.floor(size*0.4)
            this.canvasContext.font = fontSize+'px roboto'
            this.canvasContext.textAlign = "center";
            this.canvasContext.fillText('Captured Pieces:', 4*size, 8.5 * size + fontSize)
            this.canvasContext.restore()
        } catch (e) {
        }

        const blackPieces = ['bp', 'br', 'bn', 'bb', 'bq']
        blackPieces.forEach((key, i) => {
            const sum = aggregation['captured_'+key].reduce((val, cur) => val + cur.count, 0)
            const avg = aggregation['captured_'+key].reduce((val, cur) => val + (cur.key * cur.count / sum), 0)

            try {
                this.canvasContext.save()
                this.canvasContext.globalAlpha = 1.0
                this.canvasContext.drawImage(symbols[key], 2 * i * (size*8/10) + borderOffset, size*9 + size * 2/10, size*8/10, size*8/10)
                this.canvasContext.restore()
            } catch (e) {
            }

            try {
                this.canvasContext.save()
                this.canvasContext.globalAlpha = 1.0
                this.canvasContext.fillStyle = '#000000'
                const fontSize = Math.floor(size/3)
                this.canvasContext.font = fontSize+'px roboto'
                this.canvasContext.fillText(avg.toFixed(2), (size*8/10) + 2 * i * (size*8/10) + borderOffset, 9.5 * size + fontSize)
                this.canvasContext.restore()
            } catch (e) {
            }
            
        });

        const whitePieces = ['wp', 'wr', 'wn', 'wb', 'wq']
        whitePieces.forEach((key, i) => {
            const sum = aggregation['captured_'+key].reduce((val, cur) => val + cur.count, 0)
            const avg = aggregation['captured_'+key].reduce((val, cur) => val + (cur.key * cur.count / sum), 0)

            try {
                this.canvasContext.save()
                this.canvasContext.globalAlpha = 1.0
                this.canvasContext.drawImage(symbols[key], 2 * i * (size*8/10) + borderOffset, size*10 + size * 2/10, size*8/10, size*8/10)
                this.canvasContext.restore()
            } catch (e) {
            }

            try {
                this.canvasContext.save()
                this.canvasContext.globalAlpha = 1.0
                this.canvasContext.fillStyle = '#000000'
                const fontSize = Math.floor(size/3)
                this.canvasContext.font = fontSize+'px roboto'
                this.canvasContext.fillText(avg.toFixed(2), (size*8/10) + 2 * i * (size*8/10) + borderOffset, 10.5 * size + fontSize)
                this.canvasContext.restore()
            } catch (e) {
            }
            
        });
    }
    

    componentDidMount() {
        this.canvasContext = this.canvasRef.current.getContext('2d')

        this.renderToContext()
    }

    componentDidUpdate(prevProps) {
        if (!arraysEqual(prevProps.vectors, this.props.vectors)) {
            this.renderToContext()
        }
    }


    render() {
        return <canvas className="ChessFingerprintCanvas" ref={this.canvasRef} style={{
            width: this.props.width ? this.props.width : 72,
            height: this.props.height ? this.props.height : 96
        }}></canvas>
    }
}
