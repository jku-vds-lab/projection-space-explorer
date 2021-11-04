"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const UtilityFunctions_1 = require("../../../components/WebGLView/UtilityFunctions");
// @ts-ignore
const Chess_rlt45_png_1 = require("../../../../textures/chess/Chess_rlt45.png");
// @ts-ignore
const Chess_nlt45_png_1 = require("../../../../textures/chess/Chess_nlt45.png");
// @ts-ignore
const Chess_blt45_png_1 = require("../../../../textures/chess/Chess_blt45.png");
// @ts-ignore
const Chess_klt45_png_1 = require("../../../../textures/chess/Chess_klt45.png");
// @ts-ignore
const Chess_qlt45_png_1 = require("../../../../textures/chess/Chess_qlt45.png");
// @ts-ignore
const Chess_plt45_png_1 = require("../../../../textures/chess/Chess_plt45.png");
// @ts-ignore
const Chess_rdt45_png_1 = require("../../../../textures/chess/Chess_rdt45.png");
// @ts-ignore
const Chess_ndt45_png_1 = require("../../../../textures/chess/Chess_ndt45.png");
// @ts-ignore
const Chess_bdt45_png_1 = require("../../../../textures/chess/Chess_bdt45.png");
// @ts-ignore
const Chess_kdt45_png_1 = require("../../../../textures/chess/Chess_kdt45.png");
// @ts-ignore
const Chess_qdt45_png_1 = require("../../../../textures/chess/Chess_qdt45.png");
// @ts-ignore
const Chess_pdt45_png_1 = require("../../../../textures/chess/Chess_pdt45.png");
// @ts-ignore
// Lookup table for chess UNICODE symbols
var symbols = {
    'wr': Chess_rlt45_png_1.default,
    'wn': Chess_nlt45_png_1.default,
    'wb': Chess_blt45_png_1.default,
    'wk': Chess_klt45_png_1.default,
    'wq': Chess_qlt45_png_1.default,
    'wp': Chess_plt45_png_1.default,
    'br': Chess_rdt45_png_1.default,
    'bn': Chess_ndt45_png_1.default,
    'bb': Chess_bdt45_png_1.default,
    'bk': Chess_kdt45_png_1.default,
    'bq': Chess_qdt45_png_1.default,
    'bp': Chess_pdt45_png_1.default,
    '': ''
};
exports.CHESS_TILE_BLACK = "#edeeef";
exports.CHESS_TILE_WHITE = "#ffffff";
exports.requiredChessColumns = [];
['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].forEach(c => {
    [1, 2, 3, 4, 5, 6, 7, 8].forEach(n => {
        exports.requiredChessColumns.push(`${c}${n}`);
    });
});
Object.keys(symbols).filter(key => key != '').forEach(key => {
    var path = symbols[key];
    var img = new Image(45, 45);
    img.src = path;
    symbols[key] = img;
});
class ChessFingerprint extends React.Component {
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
        this.canvasContext = null;
    }
    renderToContext() {
        var vectors = this.props.vectors;
        // Get layout size, on retina display, canvas width is actually larger
        var cssWidth = this.props.width ? this.props.width : this.canvasRef.current.getBoundingClientRect().width;
        var cssHeight = this.props.height ? this.props.height : this.canvasRef.current.getBoundingClientRect().height;
        // Set values to multiples of 9 so pixels arent smudged
        var width = cssWidth * window.devicePixelRatio;
        var height = cssHeight * window.devicePixelRatio;
        width = Math.floor(width / 8) * 8;
        height = Math.floor(height / 8) * 8;
        var size = (width * 10) / 82;
        var borderOffset = width / 82;
        this.canvasRef.current.setAttribute('width', width.toString());
        this.canvasRef.current.setAttribute('height', height.toString());
        // Generate chess keys
        var keys = [];
        var nums = [1, 2, 3, 4, 5, 6, 7, 8];
        var chars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        nums.forEach((index) => {
            chars.forEach((char) => {
                keys.push("" + char + index);
            });
        });
        var aggregation = {};
        vectors.forEach((vector, index) => {
            keys.forEach((key, keyIndex) => {
                if (aggregation[key] == undefined) {
                    aggregation[key] = [];
                }
                if (!aggregation[key].some((e) => e.key == vector[key])) {
                    aggregation[key].push({ key: vector[key], count: 1 });
                }
                else {
                    aggregation[key].filter(e => e.key == vector[key])[0].count += 1;
                }
            });
        });
        // horizontal chess keys
        keys = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        // variable determining the current field color
        var col = exports.CHESS_TILE_WHITE;
        // draw border around chess board
        this.canvasContext.globalAlpha = 1.0;
        this.canvasContext.fillStyle = exports.CHESS_TILE_BLACK;
        try {
            this.canvasContext.save();
            this.canvasContext.globalAlpha = 1.0;
            this.canvasContext.fillRect(0, 0, width, height);
            this.canvasContext.restore();
        }
        catch (e) {
        }
        for (var i = 0; i < 64; i++) {
            var x = i % 8;
            var y = Math.floor(i / 8);
            if (i % 8 != 0) {
                if (col == exports.CHESS_TILE_WHITE) {
                    col = exports.CHESS_TILE_BLACK;
                }
                else {
                    col = exports.CHESS_TILE_WHITE;
                }
            }
            var key = "" + keys[i % 8] + (8 - ((i / 8) >> 0));
            var content = "";
            var opacity = 1.0;
            if (vectors.length == 0) {
                content = "";
            }
            else if (aggregation[key].length == 1) {
                content = symbols[aggregation[key][0].key];
                content = aggregation[key][0].key;
            }
            else {
                var max = 0.0;
                var total = 0;
                for (var k in aggregation[key]) {
                    var v = aggregation[key][k];
                    total += v.count;
                    if (v.count > max && symbols[aggregation[key][k].key] !== "" && symbols[aggregation[key][k].key] !== undefined) {
                        max = v.count;
                        content = symbols[aggregation[key][k].key];
                        content = aggregation[key][k].key;
                    }
                }
                opacity = Math.max((max / total), 0.0);
            }
            this.canvasContext.globalAlpha = 1.0;
            this.canvasContext.fillStyle = col;
            this.canvasContext.fillRect(x * size + borderOffset, y * size + borderOffset, size, size);
            try {
                this.canvasContext.save();
                this.canvasContext.globalAlpha = opacity;
                this.canvasContext.drawImage(symbols[content], x * size + borderOffset, y * size + borderOffset, size, size);
                this.canvasContext.restore();
            }
            catch (e) {
            }
        }
    }
    componentDidMount() {
        this.canvasContext = this.canvasRef.current.getContext('2d');
        this.renderToContext();
    }
    componentDidUpdate(prevProps) {
        if (!UtilityFunctions_1.arraysEqual(prevProps.vectors, this.props.vectors)) {
            this.renderToContext();
        }
    }
    render() {
        return React.createElement("canvas", { className: "ChessFingerprintCanvas", ref: this.canvasRef, style: {
                width: this.props.width ? this.props.width : 72,
                height: this.props.height ? this.props.height : 96
            } });
    }
}
exports.ChessFingerprint = ChessFingerprint;
