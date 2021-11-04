"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const UtilityFunctions_1 = require("../../../components/WebGLView/UtilityFunctions");
const ChessFingerprint_1 = require("../ChessFingerprint/ChessFingerprint");
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
const CHESS_TILE_CHANGES = '#007dad';
Object.keys(symbols).filter(key => key != '').forEach(key => {
    var path = symbols[key];
    var img = new Image(45, 45);
    img.src = path;
    symbols[key] = img;
});
function getOccurences(vectors) {
    var aggregation = {};
    var keys = [];
    var nums = [1, 2, 3, 4, 5, 6, 7, 8];
    var chars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    nums.forEach((index) => {
        chars.forEach((char) => {
            keys.push("" + char + index);
        });
    });
    vectors.forEach((vector, index) => {
        keys.forEach((key, keyIndex) => {
            if (aggregation[key] == undefined) {
                aggregation[key] = [];
                aggregation[key].push({ key: 'total', count: 0, relative: 1.0 });
            }
            if (!aggregation[key].some((e) => e.key == vector[key])) {
                aggregation[key].push({ key: vector[key], count: 1, relative: 0 });
                aggregation[key].filter(e => e.key == 'total')[0].count += 1;
            }
            else {
                aggregation[key].filter(e => e.key == vector[key])[0].count += 1;
                aggregation[key].filter(e => e.key == 'total')[0].count += 1;
            }
        });
    });
    // calculate relative counts
    vectors.forEach((vector, index) => {
        keys.forEach((key, keyIndex) => {
            let x = aggregation[key].filter(e => e.key == vector[key])[0];
            let total = aggregation[key].filter(e => e.key == 'total')[0].count;
            x.relative = x.count / total;
        });
    });
    return aggregation;
}
function getProminent(aggregation, key) {
    var max = 0.0;
    var total = 0;
    let content = "";
    let opacity = 1;
    for (var k in aggregation[key]) {
        if (aggregation[key][k].key === 'total') {
            continue;
        }
        var v = aggregation[key][k];
        total += v.count;
        if (v.count > max && symbols[aggregation[key][k].key] !== "" && symbols[aggregation[key][k].key] !== undefined) {
            max = v.count;
            content = aggregation[key][k].key;
        }
    }
    if (content == null) {
        content = "";
    }
    opacity = (max / total);
    return [content, opacity];
}
class ChessChanges extends React.Component {
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
        this.canvasContext = null;
    }
    renderToContext() {
        let vectorsA = this.props.vectorsA;
        let vectorsB = this.props.vectorsB;
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
        let countA = getOccurences(vectorsA);
        let countB = getOccurences(vectorsB);
        // horizontal chess keys
        keys = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        // variable determining the current field color
        var col = ChessFingerprint_1.CHESS_TILE_WHITE;
        // draw border around chess board
        this.canvasContext.globalAlpha = 1.0;
        this.canvasContext.fillStyle = ChessFingerprint_1.CHESS_TILE_BLACK;
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
                if (col == ChessFingerprint_1.CHESS_TILE_WHITE) {
                    col = ChessFingerprint_1.CHESS_TILE_BLACK;
                }
                else {
                    col = ChessFingerprint_1.CHESS_TILE_WHITE;
                }
            }
            var key = "" + keys[i % 8] + (8 - ((i / 8) >> 0));
            let content = "";
            let opacity = 1;
            let deleted = false;
            let [contentA, opacityA] = getProminent(countA, key);
            let [contentB, opacityB] = getProminent(countB, key);
            // calculate opacity for colour difference visualization for this field
            // collect fieldKeys that exist in both selections
            let keysA = [];
            let numsA = Object.keys(countA[key]);
            for (var num in numsA) {
                keysA.push(countA[key][num].key);
            }
            let keysB = [];
            let numsB = Object.keys(countB[key]);
            for (var num in numsB) {
                keysB.push(countB[key][num].key);
            }
            let allKeys = keysA.concat(keysB);
            allKeys = allKeys.filter((item, pos) => allKeys.indexOf(item) === pos);
            let diffSum = 0;
            // iterate over all keys
            for (var n in allKeys) {
                var fieldKey = allKeys[n];
                let entryA = countA[key].filter(e => e.key == fieldKey);
                let entryB = countB[key].filter(e => e.key == fieldKey);
                if (entryA[0] && entryB[0]) {
                    diffSum += Math.abs(entryA[0].relative - entryB[0].relative);
                }
                else if (entryA[0]) {
                    diffSum += Math.abs(entryA[0].relative);
                }
                else if (entryB[0]) {
                    diffSum += Math.abs(entryB[0].relative);
                }
            }
            // opacity
            let difColourOpacity = diffSum / 2;
            if (contentA != contentB) {
                content = contentB;
            }
            if (contentA != "" && contentB == "") {
                deleted = true;
            }
            this.canvasContext.globalAlpha = 1.0;
            this.canvasContext.fillStyle = col;
            this.canvasContext.fillRect(x * size + borderOffset, y * size + borderOffset, size, size);
            try {
                this.canvasContext.save();
                // diff colour
                this.canvasContext.globalAlpha = difColourOpacity;
                this.canvasContext.fillStyle = CHESS_TILE_CHANGES;
                this.canvasContext.fillRect(x * size + borderOffset, y * size + borderOffset, size, size);
                // chess pieces
                this.canvasContext.globalAlpha = Math.max(opacityB, 0.0);
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
        if (!UtilityFunctions_1.arraysEqual(prevProps.vectorsA, this.props.vectorsA) || !UtilityFunctions_1.arraysEqual(prevProps.vectorsB, this.props.vectorsB)) {
            this.renderToContext();
        }
    }
    render() {
        return React.createElement("canvas", { ref: this.canvasRef, style: {
                width: this.props.width ? this.props.width : 120,
                height: this.props.height ? this.props.height : 120
            } });
    }
}
exports.ChessChanges = ChessChanges;
