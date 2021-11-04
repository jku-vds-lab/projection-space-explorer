"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StoryDetail_1 = require("../../plugins/Story/StoryDetail/StoryDetail");
const React = require("react");
const RubikFingerprint_1 = require("../../plugins/Rubik/RubikFingerprint/RubikFingerprint");
const ChessFingerprint_1 = require("../../plugins/Chess/ChessFingerprint/ChessFingerprint");
const PluginScript_1 = require("../Store/PluginScript");
const DatasetType_1 = require("../../model/DatasetType");
const GoLegend_1 = require("../../plugins/Go/GoLegend");
//shows single and aggregated view
exports.GenericLegend = ({ type, vectors, aggregate, scale = 2 }) => {
    const plugin = PluginScript_1.PluginRegistry.getInstance().getPlugin(type);
    if (plugin) {
        // use plugin before defaults
        return plugin.createFingerprint(vectors, scale, aggregate);
    }
    else {
        // defaults... in case no plugin is specific
        switch (type) {
            case DatasetType_1.DatasetType.Story:
                return React.createElement(StoryDetail_1.StoryLegend, { selection: vectors });
            case DatasetType_1.DatasetType.Rubik:
                return React.createElement(RubikFingerprint_1.RubikFingerprint, { vectors: vectors, width: 81 * scale, height: 108 * scale });
            case DatasetType_1.DatasetType.Chess:
                return React.createElement(ChessFingerprint_1.ChessFingerprint, { width: 144 * scale, height: 144 * scale, vectors: vectors });
            case DatasetType_1.DatasetType.Go:
                return React.createElement(GoLegend_1.GoLegend, { selection: vectors, aggregate: aggregate });
        }
    }
};
