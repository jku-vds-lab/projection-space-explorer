"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const DatasetType_1 = require("../../model/DatasetType");
const RubikFingerprint_1 = require("./RubikFingerprint/RubikFingerprint");
const PluginScript_1 = require("../../components/Store/PluginScript");
class RubikPlugin extends PluginScript_1.PSEPlugin {
    constructor() {
        super(...arguments);
        this.type = DatasetType_1.DatasetType.Rubik;
    }
    hasFileLayout(header) {
        const requiredRubikColumns = [
            "up00", "up01", "up02", "up10", "up11", "up12", "up20", "up21", "up22",
            "front00", "front01", "front02", "front10", "front11", "front12", "front20", "front21", "front22",
            "right00", "right01", "right02", "right10", "right11", "right12", "right20", "right21", "right22",
            "left00", "left01", "left02", "left10", "left11", "left12", "left20", "left21", "left22",
            "down00", "down01", "down02", "down10", "down11", "down12", "down20", "down21", "down22",
            "back00", "back01", "back02", "back10", "back11", "back12", "back20", "back21", "back22"
        ];
        return this.hasLayout(header, requiredRubikColumns);
    }
    createFingerprint(vectors, scale = 1, aggregate) {
        return React.createElement(RubikFingerprint_1.RubikFingerprint, { vectors: vectors, width: 81 * scale, height: 108 * scale });
    }
}
exports.RubikPlugin = RubikPlugin;
