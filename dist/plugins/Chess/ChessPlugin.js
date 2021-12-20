"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const DatasetType_1 = require("../../model/DatasetType");
const PluginScript_1 = require("../../components/Store/PluginScript");
const ChessFingerprint_1 = require("./ChessFingerprint/ChessFingerprint");
class ChessPlugin extends PluginScript_1.PSEPlugin {
    constructor() {
        super(...arguments);
        this.type = DatasetType_1.DatasetType.Chess;
    }
    hasFileLayout(header) {
        const requiredChessColumns = [];
        ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].forEach(c => {
            [1, 2, 3, 4, 5, 6, 7, 8].forEach(n => {
                requiredChessColumns.push(`${c}${n}`);
            });
        });
        return this.hasLayout(header, requiredChessColumns);
    }
    createFingerprint(vectors, scale, aggregate) {
        return React.createElement(ChessFingerprint_1.ChessFingerprint, { vectors: vectors, width: 144 * scale, height: 144 * scale });
    }
}
exports.ChessPlugin = ChessPlugin;
