"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DatasetType_1 = require("../../model/DatasetType");
const react_redux_1 = require("react-redux");
const RubikChanges_1 = require("../../plugins/Rubik/RubikChanges/RubikChanges");
const React = require("react");
const ChessChanges_1 = require("../../plugins/Chess/ChessChanges/ChessChanges");
const mapStateToProps = state => ({
    dataset: state.dataset
});
const mapDispatchToProps = dispatch => ({});
exports.GenericChanges = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(({ vectorsA, vectorsB, dataset, scale }) => {
    switch (dataset.type) {
        case DatasetType_1.DatasetType.Rubik:
            return React.createElement(RubikChanges_1.RubikChanges, { width: 81 * scale, height: 108 * scale, vectorsA: vectorsA, vectorsB: vectorsB });
        case DatasetType_1.DatasetType.Chess:
            return React.createElement(ChessChanges_1.ChessChanges, { width: 144 * scale, height: 144 * scale, vectorsA: vectorsA, vectorsB: vectorsB });
    }
});
